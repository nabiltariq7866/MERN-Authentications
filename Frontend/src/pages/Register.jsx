import { toast } from "react-toastify";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import OTPModal from "../components/OTPModal";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";
import { calcPasswordStrength, emailRegex } from "../utils/validators";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { registerUser, verifyOTP, registerState, verifyOtpState, otpModalOpen,
    setOtpModalOpen, status,
    setStatus } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    verificationMethod: "email",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone) e.phone = "Phone number is required";
    else if (!/^\+?[0-9]{10,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.password) e.password = "Password is required";
    else if (calcPasswordStrength(form.password) < 3)
      e.password =
        "Use 8+ chars, upper/lowercase, number";
    if (!form.confirm) e.confirm = "Confirm your password";
    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    if (!form.verificationMethod)
      e.verificationMethod = "Select verification method";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      verificationMethod: form.verificationMethod,
    });

  };
  useEffect(() => {
    if (status?.status === 200 && status?.data === "otp verified") {
      setStatus(null); // Reset status after successful registration
      navigate("/login"); // Redirect to login
      setForm({ name: "", email: "", phone: "", password: "", confirm: "" }); // Clear form
    }
  }, [status])
  const handleVerify = async ({ otp }) => {
    if (!otp || otp.length < 5)
      return toast.error("Please enter the 5-digit OTP");
    const payload = {
      email: form.email.trim(),
      phone: form.phone.trim(),
      verificationCode: otp.replace(/\D/g, "").slice(0, 5), // Ensure OTP is 6 digits
    };
    verifyOTP(payload);

  };

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-80px)] w-full place-items-center p-4">
      <AuthCard
        title="Create your account"
        subtitle="Join and get started in seconds"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            error={errors.name}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            error={errors.phone}
            placeholder="+923001234567"
          />
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            error={errors.password}
            placeholder="••••••••"
          />
          <PasswordInput
            label="Confirm Password"
            value={form.confirm}
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
            error={errors.confirm}
            placeholder="••••••••"
          />
          <SubmitButton loading={registerState?.loading}>Create account</SubmitButton>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            className="font-medium text-black underline-offset-4 hover:underline dark:text-white"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </AuthCard>

      <OTPModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleVerify}
        loading={verifyOtpState?.loading}
      />
    </div>
  );
}
export default RegisterPage;
