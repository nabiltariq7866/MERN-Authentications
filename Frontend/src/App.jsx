import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Link,
} from "react-router-dom";
import { motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Shell from "./pages/Shell";
const router = createBrowserRouter([
  {
    path: "/",
    element: (

      <Shell />
    ),
    children: [
      {
        index: true,
        element: (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center"
          >
            <div className="mx-auto max-w-2xl space-y-6 rounded-2xl bg-gradient-to-b from-white to-neutral-50 p-8 shadow-xl dark:from-neutral-900 dark:to-neutral-950">
              <h1 className="text-3xl font-semibold">Modern MERN Auth UI</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                This demo includes Register, Login, Forgot/Reset, OTP modal,
                Auth Context, Toasts, and a smooth cursor trail.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
                  to="/register"
                >
                  Get Started
                </Link>
                <Link
                  className="rounded-xl border px-4 py-2 dark:border-neutral-700"
                  to="/login"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </motion.div>
        ),
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return <AuthProvider>
    <RouterProvider router={router} />;
  </AuthProvider>
}
