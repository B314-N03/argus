import { useState } from "react";

import { Settings } from "lucide-react";

import type { GlobeSettings } from "@/lib/settings";

import { GlobeSettingsPanel } from "./globe-settings-panel";
import styles from "./globe-settings-trigger.module.scss";

interface GlobeSettingsTriggerProps {
  settings: GlobeSettings;
  onChange: (settings: GlobeSettings) => void;
}

export const GlobeSettingsTrigger = ({
  settings,
  onChange,
}: GlobeSettingsTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        title="Globe settings"
        aria-label="Globe settings"
      >
        <Settings size={16} />
      </button>
      {open && (
        <GlobeSettingsPanel
          settings={settings}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
