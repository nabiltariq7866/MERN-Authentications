import { useState } from "react";
import { emailRegex } from "../utils/validators";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ForgotPasswordPage() {
  const { forgotPassword, forgotPasswordState } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    if (!emailRegex.test(email)) return setError("Enter a valid email");
    setError(null);
    forgotPassword({ email: email.trim() });
  };

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-80px)] w-full place-items-center p-4">
      <AuthCard title="Forgot password" subtitle="We will send a reset code to your email or phone">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" />
          <SubmitButton loading={forgotPasswordState?.loading}>Send reset code</SubmitButton>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-500">
          Remembered it? <Link className="font-medium text-black underline-offset-4 hover:underline dark:text-white" to="/login">Go to login</Link>
        </p>
      </AuthCard>
    </div>
  );
}
export default ForgotPasswordPage;