import Link from "next/link";
import { ReactNode } from "react";

interface ContactButtonProps {
  children?: ReactNode;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ContactButton({ 
  children = "Me contacter", 
  href = "/contact",
  className = "",
  size = "md"
}: ContactButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <Link
      href={href}
      className={`
        group relative inline-flex items-center justify-center
        rounded-lg font-medium text-white
        bg-gradient-to-r from-[#6F8F72] to-[#5A726D]
        shadow-md hover:shadow-lg
        transition-all duration-300
        hover:from-[#5A726D] hover:to-[#4a5d4e]
        overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Effet de brillance au survol */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      
      {/* Contenu du bouton */}
      <span className="relative flex items-center gap-2">
        <svg 
          className="h-5 w-5 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        {children}
      </span>
    </Link>
  );
}
