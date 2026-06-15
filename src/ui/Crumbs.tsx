import { Link } from "react-router-dom";
import { Fragment } from "react";

type Crumb = { label: string; to?: string };

export default function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ink-900/50">
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-ink-900/30">/</span>}
          {c.to ? (
            <Link to={c.to} className="transition-colors hover:text-brand-600">
              {c.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-900/70">{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
