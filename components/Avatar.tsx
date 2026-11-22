import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-600 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-600 to-orange-600",
  "from-rose-600 to-red-600",
  "from-cyan-600 to-blue-600",
  "from-violet-600 to-purple-600",
];

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  // Deterministic color based on name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradient = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

  // Extract initials (up to 2 characters)
  const initials = name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base font-semibold",
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white font-medium shadow-sm flex-shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {initials || "AI"}
    </div>
  );
}
