import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();
  // Separate states for each operation
  const [registerState, setRegisterState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [verifyOtpState, setVerifyOtpState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [loginState, setLoginState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [forgotPasswordState, setForgotPasswordState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [resetPasswordState, setResetPasswordState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [logoutState, setLogoutState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const [profileState, setProfileState] = useState({
    loading: false,
    data: null,
    error: null
  });
  const [status, setStatus] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getProfile(); // try to restore user from cookie
      } catch (err) {
        console.error("Auth init failed", err);
      } finally {
        setLoadingAuth(false); // auth check is done
      }
    };
    initAuth();
  }, []);


  // Axios instance
  const api = axios.create({
    baseURL: "http://localhost:4200/api/v1/user",
    withCredentials: true,
  });
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  // ✅ Register
  const registerUser = async (formData) => {
    setRegisterState({ loading: true, data: null, error: null });
    try {
      const { data } = await api.post("/register", formData);
      setRegisterState({ loading: false, data, error: null });
      setUser(data.user);
      setOtpModalOpen(true);
      toast.success(data.message || "Registered successfully! Send Verify OTP.");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      setRegisterState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async (formData) => {
    setVerifyOtpState({ loading: true, data: null, error: null });
    try {
      const { data, status } = await api.post("/verify-otp", formData);
      setVerifyOtpState({ loading: false, data, error: null });
      setUser(data.user);
      setStatus({ status, data: "otp verified" });
      setOtpModalOpen(false);
      toast.success(data.message || "OTP verified successfully!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "OTP verification failed";
      setVerifyOtpState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Login
  const loginUser = async (formData) => {
    setLoginState({ loading: true, data: null, error: null });
    try {
      const { data, status } = await api.post("/login", formData);
      setLoginState({ loading: false, data, error: null });
      setStatus(status);
      setToken(data.token);
      setUser(data.user);
      toast.success("Login successful!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed";
      setLoginState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Forgot Password
  const forgotPassword = async (formData) => {
    setForgotPasswordState({ loading: true, data: null, error: null });
    try {
      const { data } = await api.post("/forgotPassword", formData);
      setForgotPasswordState({ loading: false, data, error: null });
      toast.success(data.message || "Check your email for reset link");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to send reset link";
      setForgotPasswordState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Reset Password
  const resetPassword = async (token, formData) => {
    setResetPasswordState({ loading: true, data: null, error: null });
    try {
      const { data } = await api.put(`/resetPassword/${token}`, formData);
      setResetPasswordState({ loading: false, data, error: null });
      setUser(data.user);
      setStatus({ status: 200, data: "password reset" });
      toast.success("Password reset successfully!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Reset failed";
      setResetPasswordState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Logout
  const logoutUser = async () => {
    setLogoutState({ loading: true, data: null, error: null });
    try {
      const { data, status } = await api.get("/logout");
      setLogoutState({ loading: false, data, error: null });
      setUser(null);
      setStatus({ status, data: "logged out" });
      toast.success(data.message || "Logged out successfully!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Logout failed";
      setLogoutState({ loading: false, data: null, error: errMsg });
      toast.error(errMsg);
      throw error;
    }
  };

  // ✅ Get User Profile
  const getProfile = async () => {
    setProfileState({ loading: true, data: null, error: null });
    try {
      const { data } = await api.get("/user");
      setProfileState({ loading: false, data, error: null });
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Profile fetch failed";
      setProfileState({ loading: false, data: null, error: errMsg });
      console.error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registerState,
        verifyOtpState,
        loginState,
        forgotPasswordState,
        resetPasswordState,
        logoutState,
        profileState,
        registerUser,
        verifyOTP,
        loginUser,
        forgotPassword,
        resetPassword,
        logoutUser,
        getProfile,
        otpModalOpen,
        setOtpModalOpen,
        status,
        setStatus,
        token,
        setToken,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);