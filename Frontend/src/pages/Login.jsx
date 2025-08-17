import { useEffect, useState } from "react";
import { emailRegex } from "../utils/validators";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { loginUser, loginState, status, setStatus } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await loginUser({ email: form.email.trim(), password: form.password });
  };
  useEffect(() => {
    if (status === 200) {
      navigate("/dashboard");
      setStatus(null);
    }
  }, [status]);
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-80px)] w-full place-items-center p-4">
      <AuthCard title="Welcome back" subtitle="Login to continue">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email" name="email" value={form.email} onChange={onChange} error={errors.email} placeholder="you@example.com" />
          <PasswordInput label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} placeholder="••••••••" />
          <SubmitButton loading={loginState?.loading}>Sign in</SubmitButton>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link className="text-neutral-500 hover:underline" to="/register">Create account</Link>
          <Link className="text-neutral-500 hover:underline" to="/forgot">Forgot password?</Link>
        </div>
      </AuthCard>
    </div>
  );
}
export default LoginPage;