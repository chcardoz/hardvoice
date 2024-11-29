import React from "react";
import { motion } from "motion/react";

const predefinedAuraStyles = [
  { width: "300px", height: "300px", left: "10%", top: "20%" },
  { width: "250px", height: "250px", left: "40%", top: "60%" },
  { width: "400px", height: "400px", left: "70%", top: "30%" },
  { width: "350px", height: "350px", left: "20%", top: "80%" },
  { width: "275px", height: "275px", left: "50%", top: "50%" },
];

const auraVariants = {
  float: {
    y: [0, 50, 0],
    x: [0, 100, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function BackgroundAuras() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {predefinedAuraStyles.map((style, i) => (
        <motion.div
          key={i}
          variants={auraVariants}
          animate="float"
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle at center, #2563eb, transparent)",
            ...style,
          }}
        />
      ))}
    </div>
  );
}
