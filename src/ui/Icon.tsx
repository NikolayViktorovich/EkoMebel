import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Короткие внутренние имена -> классы Bootstrap Icons 5 (без префикса bi-).
const MAP: Record<string, string> = {
  search: "search",
  cart: "cart3",
  user: "person",
  heart: "heart",
  star: "star-fill",
  recycle: "recycle",
  truck: "truck",
  shield: "shield-check",
  sprout: "flower1",
  leaf: "tree",
  plus: "plus-lg",
  minus: "dash-lg",
  trash: "trash3",
  edit: "pencil-square",
  chevd: "chevron-down",
  chevr: "chevron-right",
  chevl: "chevron-left",
  check: "check-lg",
  x: "x-lg",
  menu: "list",
  box: "box-seam",
  list: "list-ul",
  users: "people",
  chart: "graph-up",
  cog: "gear",
  grid: "grid-1x2",
  card: "credit-card",
  out: "box-arrow-right",
  ext: "box-arrow-up-right",
  phone: "telephone",
  mail: "envelope",
  pin: "geo-alt",
  clock: "clock",
  party: "stars",
  pkg: "box-seam",
  filter: "funnel",
  arrl: "arrow-left",
  info: "info-circle",
};

// Залитые варианты (solid).
const SOLID: Record<string, string> = {
  heart: "heart-fill",
  user: "person-fill",
  star: "star-fill",
  shield: "shield-fill-check",
};

type Props = Omit<HTMLAttributes<HTMLElement>, "name"> & {
  name: string;
  size?: number;
  solid?: boolean;
};

export default function Icon({ name, size = 20, solid = false, className, style, ...rest }: Props) {
  const bi = (solid && SOLID[name]) || MAP[name] || name;
  return (
    <i
      className={cn(`bi bi-${bi}`, "inline-flex leading-none", className)}
      style={{ fontSize: size, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
