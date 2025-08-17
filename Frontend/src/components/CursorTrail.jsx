import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

function CursorFollower() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Smooth motion using springs
  const springX = useSpring(0, { stiffness: 120, damping: 20 });
  const springY = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [springX, springY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] h-4 w-4 rounded-full bg-black/60 dark:bg-white/60"
      style={{
        x: springX,
        y: springY,
        marginLeft: -8, // dot center align
        marginTop: -8,
        filter: "blur(0.5px)",
      }}
    />
  );
}

export default CursorFollower;
