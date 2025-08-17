import { useEffect, useState } from "react";
import { useSearchParams, Link, useParams, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthContext";
import { calcPasswordStrength } from "../utils/validators";

function ResetPasswordPage() {
  const { resetPassword, loading, status,
    setStatus } = useAuth();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const { token } = useParams(); // /reset-password/:token
  const navigate = useNavigate()
  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (calcPasswordStrength(form.password) < 3) e.password = "Use 8+ chars, upper/lowercase, number";

    if (!form.confirm) e.confirm = "Confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;


    if (!token) {
      setErrors({ token: "Reset token is missing" });
      return;
    }

    resetPassword(token, {
      newPassword: form.password,
      confirmNewPassword: form.confirm,
    });

  };
  useEffect(() => {
    if (status?.status === 200 && status.data === "password reset") {
      setStatus(null); // Reset status after successful reset
      navigate("/login"); // Redirect to login after reset
      setForm({ password: "", confirm: "" }); // Clear form
    }
  }, [status])
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-80px)] w-full place-items-center p-4">
      <AuthCard title="Reset password" subtitle="Choose a new password">
        <form onSubmit={onSubmit} className="space-y-4">
          <PasswordInput
            label="New Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="••••••••"
          />
          <PasswordInput
            label="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            error={errors.confirm}
            placeholder="••••••••"
          />
          <SubmitButton loading={loading}>Reset password</SubmitButton>
        </form>
        {errors.token && <p className="mt-2 text-red-500 text-sm">{errors.token}</p>}
        <p className="mt-4 text-center text-sm text-neutral-500">
          Back to{" "}
          <Link
            className="font-medium text-black underline-offset-4 hover:underline dark:text-white"
            to="/login"
          >
            Login
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default ResetPasswordPage;
