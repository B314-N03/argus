import { useState, useRef, useEffect } from "react";

import clsx from "clsx";

import type { AircraftCategoryFilters } from "@/lib/settings";

import styles from "./aircraft-category-filter.module.scss";

interface AircraftCategoryFilterProps {
  filters: AircraftCategoryFilters;
  onChange: (filters: AircraftCategoryFilters) => void;
}

const categories: Array<{
  key: keyof AircraftCategoryFilters;
  label: string;
  color: string;
}> = [
  { key: "military", label: "Military", color: "#1d9bf0" },
  { key: "government", label: "Government", color: "#8947c5" },
  { key: "commercial", label: "Commercial", color: "#71767b" },
  { key: "cargo", label: "Cargo", color: "#f4900c" },
  { key: "private", label: "Private", color: "#71767b" },
];

export const AircraftCategoryFilter = ({
  filters,
  onChange,
}: AircraftCategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (key: keyof AircraftCategoryFilters) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const activeCount = categories.filter((c) => filters[c.key]).length;

  return (
    <div ref={dropdownRef} className={styles.container}>
      <button
        type="button"
        className={clsx(styles.trigger, isOpen && styles.open)}
        onClick={() => setIsOpen(!isOpen)}
        title="Filter aircraft categories"
      >
        <span className={styles.triggerIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
        </span>
        <span className={styles.triggerLabel}>Aircraft</span>
        <span className={styles.badge}>{activeCount}</span>
        <span className={styles.chevron}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>Filter by Category</div>
          <div className={styles.categoryList}>
            {categories.map((cat) => (
              <label key={cat.key} className={styles.categoryItem}>
                <input
                  type="checkbox"
                  checked={filters[cat.key]}
                  onChange={() => toggleCategory(cat.key)}
                  className={styles.checkbox}
                />
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: cat.color }}
                />
                <span className={styles.categoryLabel}>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
