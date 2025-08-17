import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import NavItem from "../components/Navitem";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CursorTrail from "../components/CursorTrail";
import { useAuth } from "../context/AuthContext";
import CursorAnimation from "../components/CursorAnimation";
import { useEffect } from "react";


function Shell() {
  const { user, logoutUser, status, setStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (status?.status === 200 && status?.data === "logged out") {
      navigate("/");
      setStatus(null);
    }
  }, [status]);
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <CursorAnimation />
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black dark:bg-white" />
            <span className="font-semibold">MERN Auth</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {!user && (
              <>
                <NavItem to="/register" current={location.pathname === "/register"}>Register</NavItem>
                <NavItem to="/login" current={location.pathname === "/login"}>Login</NavItem>
                <NavItem to="/forgot" current={location.pathname === "/forgot"}>Forgot</NavItem>
              </>)}
            {user ? (
              <button onClick={logoutUser} className="rounded-xl cursor-pointer border px-3 py-1.5 text-xs dark:border-neutral-700">
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-2">
        <AnimatePresence mode="wait"><Outlet /></AnimatePresence>
      </main>
      <ToastContainer position="top-right" closeOnClick newestOnTop />
    </div>
  );
}
export default Shell;