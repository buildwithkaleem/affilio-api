// import { verifyAccessToken } from "../utils/jwt.js";
// import { responseHandler } from "../utils/responseHandler.js";

// export const auth = (req, res, next) => {
//   try {
//     const token = req.cookies?.Token;

//     //  console.log(token)

//     if (!token) {
//       return responseHandler(res, 401, {}, "No AccessToken", false);
//     }
//     const decoded = verifyAccessToken(token);

//     req.user = decoded;


//     next();
//   } catch (error) {
//     req.user = null
//     return responseHandler(res, 401, {}, "Invalid token", false);
//   }
// };




import { verifyAccessToken } from "../utils/jwt.js";
import { responseHandler } from "../utils/responseHandler.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null
      return responseHandler(
        res,
        401,
        {},
        "Access token required",
        false
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    console.log(decoded)

    next();
  } catch (error) {
    req.user = null
    return responseHandler(
      res,
      401,
      error.message,
      "Invalid or expired access token",
      false
    );
  }
};