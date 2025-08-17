import { Link } from "react-router-dom";

function NavItem({ to, current, children }) {
  return (
    <Link to={to} className={`rounded-xl px-3 py-1.5 transition ${current ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
      {children}
    </Link>
  );
}
export default NavItem;