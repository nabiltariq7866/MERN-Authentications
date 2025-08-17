import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  phone: String,
  accountVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpire: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
}, { timestamps: true });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(10000 + Math.random() * 90000);
  this.verificationCode = code.toString();
  this.verificationCodeExpire = new Date(Date.now() + 5 * 60 * 1000);
  return this.verificationCode;
};
userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}
userSchema.methods.generateResetPasswordToken = function () {
  const reset = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(reset).digest("hex");
  this.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return reset;
}

export const User = mongoose.model("User", userSchema);
