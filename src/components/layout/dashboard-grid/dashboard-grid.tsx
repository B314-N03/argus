import type { ReactNode } from "react";

import styles from "./dashboard-grid.module.scss";

interface DashboardGridProps {
  children: ReactNode;
  variant?: "default" | "grid2" | "grid3";
  className?: string;
}

interface GridItemProps {
  children: ReactNode;
  fullWidth?: boolean;
  span?: 2 | 3;
  className?: string;
}

export const DashboardGrid = ({
  children,
  variant = "default",
  className = "",
}: DashboardGridProps) => {
  const gridClass =
    variant === "grid2"
      ? styles.grid2
      : variant === "grid3"
        ? styles.grid3
        : styles.grid;

  return <div className={`${gridClass} ${className}`}>{children}</div>;
};

export const GridItem = ({
  children,
  fullWidth = false,
  span,
  className = "",
}: GridItemProps) => {
  let spanClass = "";

  if (fullWidth) spanClass = styles.fullWidth;
  else if (span === 2) spanClass = styles.span2;
  else if (span === 3) spanClass = styles.span3;

  return <div className={`${spanClass} ${className}`}>{children}</div>;
};
