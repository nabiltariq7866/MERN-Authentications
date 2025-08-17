import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CursorAnimation = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const dots = [0]; // multiple trailing dots

  return (
    <>
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-3 h-3 rounded-full bg-gray-500 pointer-events-none z-50"
          animate={{
            x: cursorPos.x - 6,
            y: cursorPos.y - 6,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: i * 0.05, // delay for trailing effect
          }}
        />
      ))}
    </>
  );
};

export default CursorAnimation;
