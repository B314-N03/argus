import type { ReactNode, ButtonHTMLAttributes } from "react";

import styles from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const variantClass = styles[variant];
  const sizeClass = styles[size];

  return (
    <button
      type="button"
      className={`${styles.button} ${variantClass} ${sizeClass} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
