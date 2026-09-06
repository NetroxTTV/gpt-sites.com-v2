import React from "react";
import { AlertTriangle, ExternalLink, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const youtubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

/** Stable key for static content items: position + a slice of the text. */
const itemKey = (text, i) => `${i}-${String(text).slice(0, 24)}`;

const CALLOUT_TONES = {
  tip: { icon: Lightbulb, className: "border-mint/30 bg-mint-soft text-foreground [&_svg]:text-mint" },
  callout: { icon: Info, className: "border-brand/30 bg-brand-soft text-foreground [&_svg]:text-brand-ink" },
  warning: { icon: AlertTriangle, className: "border-amber/40 bg-amber-soft text-foreground [&_svg]:text-amber" },
};

const Callout = ({ tone, children }) => {
  const { icon: Icon, className } = CALLOUT_TONES[tone];
  return (
    <div className={cn("flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
};

const Img = ({ src, alt, className }) => {
  if (!src) return null;
  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-surface2", className)}>
      <img src={src} alt={alt || ""} loading="lazy" className="h-auto w-full object-contain" />
      {alt && <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{alt}</figcaption>}
    </figure>
  );
};

const Video = ({ block }) => {
  const src = youtubeEmbed(block.src);
  if (!src) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <div className="aspect-video">
        <iframe src={src} title={block.title || "Video"} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
      </div>
      {block.title && <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{block.title}</p>}
    </div>
  );
};

function renderBlocks(list) {
  return (list || []).map((b, i) => <Block key={`${b.type}-${i}`} block={b} />);
}

/* One small renderer per block type keeps each branch trivial. */
const RENDERERS = {
  subtitle: (b) => <h4 className="mt-2 font-display text-base font-bold tracking-tight text-foreground">{b.text}</h4>,
  text: (b) => <p className="text-[15px] leading-relaxed text-foreground/85">{b.text}</p>,
  list: (b) => (
    <ul className="space-y-2">
      {b.items.map((it, i) => (
        <li key={itemKey(it, i)} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{it}</li>
      ))}
    </ul>
  ),
  steps: (b) => (
    <ol className="space-y-2.5">
      {b.items.map((it, i) => (
        <li key={itemKey(it, i)} className="flex gap-3.5 rounded-xl border border-border bg-background/60 p-3.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand font-mono text-xs font-bold text-brand-fg">{String(i + 1).padStart(2, "0")}</span>
          <span className="pt-0.5 text-[15px] leading-relaxed">{it}</span>
        </li>
      ))}
    </ol>
  ),
  tip: (b) => <Callout tone="tip">{b.text}</Callout>,
  callout: (b) => <Callout tone="callout">{b.text}</Callout>,
  warning: (b) => <Callout tone="warning">{b.text}</Callout>,
  image: (b) => <Img src={b.src} alt={b.alt} className="max-w-2xl" />,
  imageRow: (b) => (
    <div className={cn("grid gap-3", b.items.length > 1 ? "sm:grid-cols-2" : "max-w-md")}>
      {b.items.map((it, i) => <Img key={itemKey(it.src || it.alt, i)} src={it.src} alt={it.alt} />)}
    </div>
  ),
  imageText: (b) => (
    <div className="grid gap-5 lg:grid-cols-5">
      <Img src={b.src} alt={b.alt} className="lg:col-span-2" />
      <div className="space-y-3 lg:col-span-3">{renderBlocks(b.content)}</div>
    </div>
  ),
  link: (b) => (
    <a href={b.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand/50">
      {b.text} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  ),
  video: (b) => <Video block={b} />,
};

export function Block({ block }) {
  const render = RENDERERS[block.type];
  if (!render) {
    console.warn(`[guides] unknown block type "${block.type}"`);
    return null;
  }
  return render(block);
}

export const sectionId = (title, i) => `s-${i}-${(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const GuideContent = ({ sections }) => (
  <div className="space-y-10" data-testid="guide-sections">
    {(sections || []).map((s, i) => (
      <section key={sectionId(s.title, i)} id={sectionId(s.title, i)} className="scroll-mt-28">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
          <h2 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">{s.title}</h2>
        </div>
        <div className="mt-4 space-y-4">{renderBlocks(s.content)}</div>
      </section>
    ))}
  </div>
);

export default GuideContent;
