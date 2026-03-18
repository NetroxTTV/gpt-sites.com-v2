import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Guides() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <a href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </a>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">Guides</h1>
        <p className="text-muted-foreground leading-relaxed">
          Coming soon — detailed guides on how to maximize earnings from GPT sites.
          Check back later or join our <a href="https://discord.gg/gptfr" className="text-primary hover:underline">Discord</a> for updates.
        </p>
      </div>
      <Footer />
    </div>
  );
}