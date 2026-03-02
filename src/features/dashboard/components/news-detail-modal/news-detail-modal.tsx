import {
  Twitter,
  Newspaper,
  MessageCircle,
  Globe,
  ExternalLink,
} from "lucide-react";

import { Dialog } from "@/components/ui/dialog/dialog";
import type { NewsItem, NewsSourceType } from "@/domain/models";

import styles from "./news-detail-modal.module.scss";

interface NewsDetailModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

const sourceIcons: Record<NewsSourceType, typeof Twitter> = {
  twitter: Twitter,
  news: Newspaper,
  telegram: MessageCircle,
  forum: Globe,
};

function formatTimestamp(iso: string): { absolute: string; relative: string } {
  const date = new Date(iso);
  const absolute = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  let relative: string;

  if (minutes < 1) relative = "Just now";
  else if (minutes < 60) relative = `${minutes}m ago`;
  else {
    const hours = Math.floor(minutes / 60);

    if (hours < 24) relative = `${hours}h ago`;
    else relative = `${Math.floor(hours / 24)}d ago`;
  }

  return { absolute, relative };
}

export const NewsDetailModal = ({ item, onClose }: NewsDetailModalProps) => {
  if (!item) return null;

  const Icon = sourceIcons[item.sourceType];
  const { absolute, relative } = formatTimestamp(item.timestamp);

  return (
    <Dialog open={!!item} onClose={onClose} title="OSINT Report" size="md">
      <div className={styles.content}>
        <div className={styles.sourceLine}>
          <Icon size={18} className={styles.sourceIcon} />
          <div className={styles.sourceInfo}>
            <span className={styles.sourceName}>{item.source}</span>
            {item.author && (
              <span className={styles.sourceAuthor}>{item.author}</span>
            )}
          </div>
        </div>

        <p className={styles.body}>{item.content}</p>

        <div className={styles.meta}>
          <span className={styles.timestamp}>
            {absolute} ({relative})
          </span>
          {item.region && (
            <span className={styles.regionBadge}>
              {item.region.replace(/_/g, " ")}
            </span>
          )}
        </div>

        {item.tags.length > 0 && (
          <div className={styles.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            <ExternalLink size={14} />
            View Original Source
          </a>
        )}
      </div>
    </Dialog>
  );
};
