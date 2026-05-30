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
    q: "Why didn't my offer credit?",
    a: "Most missing credits are caused by ad blockers, VPNs, or clearing cookies mid-offer. Always disable ad blockers before starting, never use a VPN, and don't clear your browser history while an offer is in progress. If it still doesn't credit after 24–48 hours, screenshot your proof of completion and open a support ticket on the site where you completed the offer.",
  },
  {
    q: "Which site pays the most for mobile game offers?",
    a: "It varies by offerwall. Earnlab and CashinStyle consistently offer 80–95% rates on PrimeEarn and Torox game offers. For specific games like Sea of Conquest or RAID, check the Guides page — each guide lists the best site to complete that specific offer on.",
  },
  {
    q: "What's a 'rate' and why does it matter?",
    a: "When an offerwall like Torox or PrimeEarn pays out $10 for an offer, different GPT sites pass on different percentages of that to you. A site with a 90% rate gives you $9, while an 80% rate site gives you $8 for the exact same offer. Over time, always using the highest-rate site can double your effective earnings.",
  },
  {
    q: "What's the difference between offerwalls like Torox, PrimeEarn, and RevU?",
    a: "Each offerwall has different offers, payout speeds, and crediting reliability. Torox and PrimeEarn are the most popular for game offers and tend to credit quickly. RevU specializes in app installs and finance offers. BitLabs is strong for surveys. Most top sites support multiple offerwalls — filter by offerwall on the Sites page to find which site gives you the best rates for each one.",
  },
  {
    q: "Can I do multiple offers at the same time?",
    a: "You can run offers from different offerwalls simultaneously, but avoid running two offers from the same offerwall at once — it can confuse tracking and lead to both not crediting. Complete one offer per offerwall at a time, and always screenshot milestones as you go.",
  },
  {
    q: "How much can I realistically earn per month?",
    a: "Casual users completing a few surveys and app installs typically earn $10–$50/month. Users focusing on high-paying game offers ($50–$500+ per offer) with good strategy can consistently earn $500–$2,000+/month. Earnings depend heavily on your region, time invested, and whether you use guides to avoid failed attempts.",
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
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Questions that actually matter
          </h2>
          <p className="text-muted-foreground">
            Real answers to the things people run into when earning with GPT sites.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <AccordionItem
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
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
