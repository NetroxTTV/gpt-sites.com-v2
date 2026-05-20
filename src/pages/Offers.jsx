import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Offers() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              <span className="bg-gradient-to-r from-primary via-rose-500 to-accent bg-clip-text text-transparent">Offers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Exclusive offers are now on our Discord server via the Netrox2 bot.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-[0_12px_28px_rgba(232,108,155,0.10)]"
          >
            <div className="space-y-4">
              <p className="text-foreground text-lg font-semibold">How to access all offers</p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                <li>Join the Discord server.</li>
                <li>Use the Netrox2 bot.</li>
                <li>Run the command: /panel</li>
              </ol>
              <p className="text-muted-foreground">
                Use /panel to access all the offers and start earning easy money.
              </p>
              <a
                href="https://discord.gg/gptfr"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
