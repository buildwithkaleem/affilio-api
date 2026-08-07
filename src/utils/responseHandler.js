export const responseHandler = (
  res ,
  status = 200,
  data = {},
  message = "Success",
  success = true,
  cookies = []
) => {
  // Set cookies if provided
  if (cookies.length > 0) {
    cookies.forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, cookie.options || {});
    });
  }

  return res.status(status).json({
    success,
    message,
    data,
  });
};