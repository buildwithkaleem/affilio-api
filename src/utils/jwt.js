import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId,role) => {
  return jwt.sign({
    id: userId, role
  },
    process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });
};

export const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
};

export const generateRefreshToken = (userId, role) => {
  return jwt.sign({
    id: userId, role
  },
    process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
};


export const resetPasswordToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "reset" },
    process.env.RESET_PASSWORD_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
};

export const verifyResetPasswordToken = (token) => {
  const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);

  if (decoded.type !== "reset") {
    throw new Error("Invalid token");
  }

  return decoded;
};


// console.log("ACCESS:", process.env.ACCESS_TOKEN_SECRET);
// console.log("REFRESH:", process.env.REFRESH_TOKEN_SECRET);