import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guidesData";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function RenderContent({ item }) {
  switch (item.type) {
    case "text":
      return <p className="text-muted-foreground leading-relaxed">{item.text}</p>;
    case "subtitle":
      return <h4 className="text-sm font-bold text-foreground mt-4 mb-2">{item.text}</h4>;
    case "list":
      return (
        <ul className="space-y-1.5 my-2">
          {item.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary flex-shrink-0">•</span>
              {it}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="my-3 space-y-3">
          {item.items.map((it, i) => {
            const isLast = i === item.items.length - 1;
            return (
              <li key={i} className="relative pl-12">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[0.9rem] top-8 bottom-[-0.9rem] w-px bg-gradient-to-b from-primary/50 to-border/60"
                  />
                )}
                <span className="absolute left-0 top-1 w-8 h-8 rounded-full border border-primary/30 bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card px-4 py-3 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-primary/80 font-semibold mb-1">Step {i + 1}</p>
                  <p className="text-sm leading-relaxed text-foreground">{it}</p>
                </div>
              </li>
            );
          })}
        </ol>
      );
    case "callout":
      return (
        <div className="flex gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 my-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{item.text}</p>
        </div>
      );
    case "warning":
      return (
        <div className="flex gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 my-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{item.text}</p>
        </div>
      );
    case "tip":
      return (
        <div className="flex gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20 my-3">
          <span className="text-accent text-sm font-semibold flex-shrink-0">Pro Tip:</span>
          <p className="text-sm text-muted-foreground">{item.text}</p>
        </div>
      );
    case "image":
      return (
        <div className="my-4 rounded-xl overflow-hidden border border-border/30">
          <img src={item.src} alt={item.alt} className="w-full h-auto max-h-72 object-contain bg-secondary/20" />
        </div>
      );
    case "link":
      return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 text-sm text-primary font-medium transition-colors my-2">
          {item.text}
          <ExternalLink className="w-3.5 h-3.5 ml-auto" />
        </a>
      );
    default:
      return null;
  }
}

export default function GuideDetail() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { slug } = useParams();
  const guide = guides.find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 px-4 text-center">
          <p className="text-muted-foreground">Guide not found.</p>
          <Link to="/Guides"><Button variant="ghost" className="mt-4">Back to Guides</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src={guide.banner} alt={guide.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 -mt-8 relative">
        <Link to="/Guides">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Button>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="px-2 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 inline-block">{guide.category}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">{guide.title}</h1>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Platform", value: guide.platform },
              { label: "Offerwall", value: guide.offerwall },
              { label: "Difficulty", value: guide.difficulty },
              { label: "Time", value: guide.timeInvestment },
              { label: "Reward", value: guide.totalReward },
              { label: "Genre", value: guide.genre },
            ].map(m => (
              <div key={m.label} className="bg-card border border-border/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {guide.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border/40 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-border/30">{section.title}</h3>
              <div className="space-y-2">
                {section.content.map((item, j) => (
                  <RenderContent key={j} item={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Where to find */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 bg-card border border-primary/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-2">Where to Find This Offer</h3>
          <p className="text-sm text-muted-foreground mb-4">Available on <span className="text-primary font-semibold">{guide.offerwall}</span> offerwall on the following GPT sites:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.sites.map(site => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-primary/10 border border-border/30 hover:border-primary/30 transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{site.name}</p>
                  <p className="text-xs text-muted-foreground">{site.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-4">Check multiple sites to compare reward amounts — higher rate sites typically offer better payouts!</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}