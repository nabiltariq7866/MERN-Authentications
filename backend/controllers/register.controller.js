import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
// 1. Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load environment variables from specific path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, verificationMethod } = req.body;

    // ✅ Required fields check
    if (!name || !email || !password || !phone || !verificationMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Phone format check
    function verificationPhone(phone) {
      const phoneRegex = /^\+923\d{9}$/;
      return phoneRegex.test(phone);
    }

    // ✅ Email format check
    function verificationEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!verificationPhone(phone)) {
      return res.status(400).json({ message: "Invalid Phone Number" });
    }

    if (!verificationEmail(email)) {
      return res.status(400).json({ message: "Invalid Email Format" });
    }

    // ✅ Existing verified user check
    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Phone already used" });
    }

    // ✅ Limit register attempts for unverified accounts
    const registerAttemptsByUser = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false }
      ]
    });
    if (registerAttemptsByUser?.length >= 3) {
      return res.status(400).json({
        message:
          "You have exceeded the maximum number of attempts (3). Please try again after an hour."
      });
    }

    // ✅ Create user instance
    const user = new User({ name, email, password, phone });
    const verificationCode = user.generateVerificationCode();

    // ✅ Save user first
    await user.save();

    try {
      // ✅ Send verification code only after successful save
      await sendVerificationCode(verificationMethod, verificationCode, email, phone);

      return res.status(201).json({
        message: "User registered. Verification code sent."
      });

    } catch (err) {
      // ❌ If sending failed → rollback user
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message: "Failed to send verification. Please try again.",
        error: err.message
      });
    }

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

async function sendVerificationCode(verificationMethod, verificationCode, email, phone) {
  if (verificationMethod === "email") {
    const message = generateEmailTemplate(verificationCode);
    try {
      await sendEmail(email, "Your Verification Code", message);
    } catch (err) {
      throw new Error("Failed to send verification email");
    }

  } else if (verificationMethod === "phone") {
    try {
      await twilioClient.messages.create({
        body: `Your verification code is ${verificationCode}`,
        from: process.env.TWILIO_PHONE, // Twilio number (SMS enabled)
        to: phone, // Your verified number
      });
    } catch (err) {
      console.error("Twilio SMS Error:", err);
      throw new Error("Failed to send verification code via SMS");
    }

  } else {
    throw new Error("Invalid verification method. Use 'email' or 'phone'.");
  }
}

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email/phone. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, verificationCode } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or Phone is required" });
    }
    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // ✅ Find all unverified users with same email or phone (latest first)
    const users = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false }
      ]
    }).sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get the latest entry
    let lastEntry = users[0];

    // ✅ Remove duplicates (if multiple unverified exist)
    if (users.length > 1) {
      await User.deleteMany({
        _id: { $ne: lastEntry._id },
        $or: [
          { email, accountVerified: false },
          { phone, accountVerified: false }
        ]
      });
    }
    // ✅ Check verification code
    if (lastEntry.verificationCode !== verificationCode.toString()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // ✅ Check expiry
    const currentTime = new Date();
    const codeExpireTime = new Date(lastEntry.verificationCodeExpire).getTime();

    if (currentTime > codeExpireTime) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // ✅ Mark account verified
    lastEntry.accountVerified = true;
    lastEntry.verificationCode = null;
    lastEntry.verificationCodeExpire = null;

    await lastEntry.save({ validateModifiedOnly: true });
    res.status(200).json({
      message: "Account verified successfully",
    }
    );

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // find verified user  
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // send token (password removed in sendToken)
    sendToken(user, 200, "Login successful", res);

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    const token = req.token; // from authMiddleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate reset token
    const resetPasswordToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    const message = `
      <div>
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `;
    try {
      await sendEmail(email, "Password Reset Request", message);
      res.status(200).json({ message: "Reset link sent to your email" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "Failed to send reset link", error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "New password and confirm password are required" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    sendToken(user, 200, "Password reset successful", res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });

  }
}