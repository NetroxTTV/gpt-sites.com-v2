import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MoveRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WavesBackground } from "@/components/ui/waves-background";
import { HeroLogoDrift } from "@/components/HeroLogoDrift";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["smarter", "faster", "easier", "better", "consistently"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section id="home" className="relative min-h-[78vh] md:min-h-[88vh] flex items-start md:items-center justify-center overflow-hidden pt-16 md:pt-14">
      {/* Mouse-reactive glowing waves */}
      <WavesBackground className="opacity-70 dark:opacity-90" />

      {/* Small site logos fading in/out */}
      <HeroLogoDrift />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/16 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[15%] right-[10%] w-[340px] h-[340px] bg-sky-200/40 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-5 sm:gap-7 pt-4 sm:pt-7 pb-6 sm:pb-10 items-center justify-center flex-col text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 shadow-sm shadow-primary/10">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Your #1 GPT Resource</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-3 flex-col"
            >
              <h1 className="text-[3.375rem] md:text-[5.4rem] max-w-4xl tracking-tighter text-center font-extrabold leading-tight">
                <span className="text-foreground">Earn more,</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-5 md:pt-2">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent font-extrabold"
                      initial={{ opacity: 0, y: -100 }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? { y: 0, opacity: 1 }
                          : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="text-lg md:text-[1.35rem] leading-relaxed tracking-tight text-muted-foreground max-w-3xl text-center mx-auto">
                Discover the best GPT Sites, tips and guides to maximize your earnings.
                Complete surveys, watch videos, and do tasks to earn real cash, crypto and gift cards.
              </p>

              <p className="text-sm text-muted-foreground/70">
                Check out our{" "}
                <Link to="/Guides" className="text-primary hover:underline font-medium">
                  Guides
                </Link>{" "}
                page for best offers, or visit our{" "}
                <Link to="/Tips" className="text-primary hover:underline font-medium">
                  Tips
                </Link>{" "}
                &amp; FAQ pages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex w-full max-w-md sm:max-w-none mx-auto flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 sm:flex-wrap"
            >
              <Link to="/Sites" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl px-9 py-5 sm:py-6 text-base font-semibold shadow-lg shadow-primary/20"
                >
                  Browse Sites <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
              <button
                type="button"
                className="w-full sm:w-auto"
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 rounded-xl px-9 py-5 sm:py-6 text-base font-semibold border-border/60 bg-card/60 hover:bg-secondary hover:border-primary/40 hover:text-foreground"
                >
                  How It Works <ArrowDown className="w-4 h-4" />
                </Button>
              </button>
              <a href="https://discord.gg/gptfr" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 rounded-xl px-9 py-5 sm:py-6 text-base font-semibold border-border/60 bg-card/60 hover:bg-secondary hover:border-primary/40 hover:text-foreground"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                  </svg>
                  Join Discord
                </Button>
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
