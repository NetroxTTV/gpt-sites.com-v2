import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do GPT (Get Paid To) sites work?",
    a: "GPT sites reward users for completing simple tasks such as surveys, offers, and watching videos. Users earn coins or points by completing these tasks, which can then be exchanged for gift cards, PayPal cash, or cryptocurrency."
  },
  {
    q: "Which GPT website is best for me?",
    a: "The best GPT website depends on your preferences and the types of tasks you enjoy. Our featured sites like EarnLab, CashInStyle, and GemsLoot are top-rated choices. Browse our full list to find the one that suits your needs."
  },
  {
    q: "Why is a site marked as 'Featured'?",
    a: "Sites marked as \"Featured\" are highlighted for their popularity, strong reputation, high payout rates, or partnerships. These placements help users discover platforms that are widely recognized or offer unique opportunities."
  },
  {
    q: "What is the earning potential with GPT websites?",
    a: "Earnings vary based on the tasks you complete and the time you invest. While casual users may earn a few dollars per month, consistent users can make hundreds or even thousands of dollars monthly."
  },
  {
    q: "Are the GPT websites listed on your site trustworthy?",
    a: "We feature only reputable and well-established GPT websites with a track record of reliable payments and rewards. However, we encourage users to conduct their own research before signing up."
  },
  {
    q: "How do I maximize my earnings?",
    a: "Check out our Guides and Tips pages for detailed strategies. Generally, using multiple GPT sites, taking advantage of bonuses, and completing high-value offers will maximize your earnings."
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about GPT sites
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border/40 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:text-primary hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}