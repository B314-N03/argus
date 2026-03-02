import { useState, useEffect, useRef } from "react";

import { Link } from "@tanstack/react-router";
import {
  Menu,
  Eye,
  Bell,
  Search,
  Home,
  Radar,
  Waves,
  Radio,
  Activity,
  Headphones,
  X,
} from "lucide-react";

import styles from "./header.module.scss";

const mainNavItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/air", icon: Radar, label: "Air" },
  { to: "/naval", icon: Waves, label: "Naval" },
  { to: "/signals", icon: Radio, label: "Signals" },
  { to: "/indicators", icon: Activity, label: "Indicators" },
  { to: "/radios", icon: Headphones, label: "Radios" },
] as const;

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Eye size={20} color="white" />
            </div>
            <h1 className={styles.logoText}>
              ARGUS
              <span className={styles.logoSubtext}>OSINT Dashboard</span>
            </h1>
          </Link>
        </div>

        <nav className={styles.nav}>
          {mainNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={styles.navLink}
              activeProps={{
                className: `${styles.navLink} ${styles.navLinkActive}`,
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            Live
          </div>
          <button
            type="button"
            className={styles.actionButton}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div ref={menuRef} className={styles.mobileMenu}>
          {mainNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={styles.mobileNavLink}
              activeProps={{
                className: `${styles.mobileNavLink} ${styles.navLinkActive}`,
              }}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setMenuOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {menuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};
