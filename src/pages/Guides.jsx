import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guidesData";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, DollarSign, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Guides() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              Offer Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Guides</h1>
            <p className="text-muted-foreground max-w-xl">
              Step-by-step guides for the most profitable GPT offers. Follow these to maximize your earnings.
            </p>
          </motion.div>

          <div className="space-y-4">
            {guides.map((guide, i) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/Guides/${guide.slug}`} className="group block">
                  <div className="flex flex-col sm:flex-row gap-0 rounded-2xl bg-card border border-border/40 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    {/* Banner */}
                    <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden bg-secondary/30">
                      <img src={guide.banner} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">{guide.category}</span>
                          <span className="text-xs text-muted-foreground">{guide.offerwall}</span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">{guide.title}</h2>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{guide.timeInvestment}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{guide.totalReward}</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{guide.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                        Read Guide <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}