import { useRef, useEffect, type ReactNode } from "react";

import clsx from "clsx";
import { X } from "lucide-react";

import styles from "./dialog.module.scss";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Dialog = ({
  open,
  onClose,
  title,
  children,
  size = "md",
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    function handleCancel(e: Event) {
      e.preventDefault();
      onClose();
    }

    function handleClick(e: MouseEvent) {
      if (e.target === dialog) {
        onClose();
      }
    }

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  return (
    <dialog ref={ref} className={clsx(styles.dialog, styles[size])}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </dialog>
  );
};
