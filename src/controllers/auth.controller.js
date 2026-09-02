import { userModel } from "../models/user.model.js";
import argon2 from "argon2";
import { generateAccessToken, generateRefreshToken, resetPasswordToken, verifyRefreshToken, verifyResetPasswordToken } from "../utils/jwt.js";
import { responseHandler } from "../utils/responseHandler.js";
import { resetPasswordTemplate } from "../utils/htmlTemlate.js";
import { sendEmail } from "../services/sendEmail.service.js";


const isProduction = process.env.NODE_ENV === "production"

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check username or email already exists
    const existingUser = await userModel.findOne({
      $or: [
        { userName: userName.trim() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    // const hashedPassword = await argon2.hash(password);

    const user = await userModel.create({
      userName: userName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });


    return responseHandler(res, 201, null, "Registration successful");

  } catch (error) {

    return responseHandler(res, 500, error.message, "internal server error User Register", false);
  }
};


export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or UserName and Password are required",
      });
    }

    const user = await userModel.findOne({
      $or: [
        { email: login.toLowerCase().trim() },
        { userName: login.trim() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    user.refreshToken = hashedRefreshToken;
    user.isActive = true
    await user.save();

    const options = {
      httpOnly: true,
      secure: isProduction, // dev me false & pro me true
      sameSite: isProduction ? "none" : "lax",  // best for dev $
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
    };


    return responseHandler(
      res,
      200,
      {
        accessToken,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      "Login successful",
      true,
      [
        {
          name: "refreshToken",
          value: refreshToken,
          options,
        },
      ]
    );

  } catch (error) {
    return responseHandler(res, 500, error.message, "internal server error login", false);
  }
};


export const generateTokens = async (req, res) => {
  try {
    const Token = req.cookies?.refreshToken;

    // console.log("========== REFRESH ==========");
    // console.log("Refresh cookie exists:", !!Token);
    // console.log("Refresh token:", Token);

    // console.log(req.cookies)
    if (!Token) {
      return res.status(404).json({
        message: "refreshToken is not found"
      })
    }

    const decoded = verifyRefreshToken(Token);

    // console.log("Decoded:", decoded);

    // console.log(decoded)

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await argon2.verify(
      user.refreshToken,
      Token
    );

    // console.log("Refresh token match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Refresh Token",
      });
    }

    const accessToken = generateAccessToken(user._id, user.role);

    // console.log("OLD REFRESH TOKEN:", Token);

    // const NewRefreshToken = generateRefreshToken(user._id, user.role);



    // const newRefreshTokenHash = await argon2.hash(NewRefreshToken);

    // console.log("NEW REFRESH TOKEN:", NewRefreshToken);

    // user.refreshToken = newRefreshTokenHash
    // await user.save()

    // console.log("REFRESH TOKEN HASH UPDATED");

    // const options = {
    //   httpOnly: true,
    //   secure: isProduction, // dev me false & pro me true
    //   sameSite: isProduction ? "none" : "lax",  // best for dev $
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
    // };

    // console.log("SETTING NEW COOKIE");

    return responseHandler(res, 200, {
      accessToken, user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      }
    }, 
    "Token refreshed successfully", true,
    //  [{ name: "refreshToken", value: NewRefreshToken, options }]
  );


  } catch (error) {
    return responseHandler(res, 500, error.message, "internal server error refresh Token", false);
  }
};


export const logout = async (req, res) => {
  try {
    const userId = req.user?.id

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    user.refreshToken = null;
    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return responseHandler(
      res,
      200,
      {},
      "Logout successful"
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      "Internal Server Error logout",
      false
    );
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return responseHandler(res, 404, {}, "User not found", false);
    }

    const token = resetPasswordToken(user._id);

    const resetLink = `${process.env.FRONENT_URL}/reset-password?token=${token}`;

    const html = resetPasswordTemplate(user.userName, resetLink)

    await sendEmail(email, "Reset Password", html);


    return responseHandler(res, 200, {}, "Reset link sent to email");
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = verifyResetPasswordToken(token);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return responseHandler(res, 404, {}, "User not found", false);
    }

    // const hashedPassword = await argon2.hash(newPassword);

    user.password = newPassword;
    await user.save();

    return responseHandler(res, 200, null, "Password reset successful");
  } catch (error) {
    return responseHandler(res, 400, error.message, "Invalid or expired token", false);
  }
};


// export const userUpdate = async (req, res) => {
//   try {
//     const { userName, oldPassword, newPassword, email } = req.body;

//     const userId = req.user?.id;

//     const user = await userModel.findById(userId);

//     if (!user) {
//       return responseHandler(res, 404, {}, "User Not Found", false);
//     }

//     const isMatch = await argon2.verify(user.password, oldPassword);

//     if (!isMatch) {
//       return responseHandler(res,401,null, "your OldPassword is inCorect",false)
//     };

//     const hashedPassword = await argon2.hash(newPassword);  

//     if (userName !== undefined) user.userName = userName;

//     if (newPassword !== undefined) user.password = newPassword;

//     if (email !== undefined) user.email = email;

//     const save = await user.save();

//     return responseHandler(
//       res,
//       200,
//       {user: {
//           userName: save.userName,
//           email: save.email}
//       },
//       "User updated successfully",
//     );

//   } catch (error) {
//     return responseHandler(
//       res,
//       500,
//       {},
//       `internal server error user edit: ${error.message}`,
//       false
//     );
//   }
// };

