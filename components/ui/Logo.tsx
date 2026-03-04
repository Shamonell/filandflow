"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  width = 60,
  height = 60,
  className = "",
  priority = false,
}: LogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span className="text-2xl font-light tracking-wide text-[#5C3A21]">
        Fil & Flow
      </span>
    );
  }

  return (
    <Image
      src="/nouveau logo.png"
      alt="Fil & Flow"
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}

