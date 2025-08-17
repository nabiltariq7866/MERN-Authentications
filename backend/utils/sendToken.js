export const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateAuthToken();
  const { password, ...userData } = user._doc ? user._doc : user;
  res.status(statusCode)
    .cookie("token", String(token), {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: "localhost",
    })
    .json({
      success: true,
      message,
      token,
      user: userData
    });
};
