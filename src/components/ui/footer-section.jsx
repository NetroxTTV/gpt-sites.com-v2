import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { YoutubeIcon, MessageCircleIcon, BookOpenIcon, ExternalLinkIcon } from 'lucide-react';

const footerLinks = [
    {
        label: 'Navigate',
        links: [
            { title: 'Home', href: '/' },
            { title: 'Sites', href: '/Sites' },
            { title: 'Guides', href: '/Guides' },
            { title: 'Events', href: '/Events' },
            { title: 'Tips', href: '/Tips' },
        ],
    },
    {
        label: 'Resources',
        links: [
            { title: 'FAQ', href: '/#faq' , icon: ExternalLinkIcon},
            { title: 'Offerwalls', href: '/Offerwalls', icon: ExternalLinkIcon },
            { title: 'Guides', href: '/Guides', icon: BookOpenIcon },
            { title: 'Contact', href: 'mailto:admin@gpt-sites.com', icon: ExternalLinkIcon },
        ],
    },
    {
        label: 'Community',
        links: [
            { title: 'Discord', href: 'https://discord.gg/gptfr', icon: MessageCircleIcon },
            { title: 'YouTube', href: '#', icon: YoutubeIcon },
        ],
    },
];

export function FooterSection() {
    return (
        <footer className="relative w-full border-t px-4 py-8 sm:px-6 sm:py-10 lg:pt-24 lg:pb-16">
            <div className="max-w-5xl mx-auto xl:translate-x-10">
                {/* Top glow line */}
                <div className="bg-foreground/10 absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 rounded-full blur-sm" />

                <div className="grid w-full gap-6 text-center justify-items-center sm:gap-10 sm:grid-cols-2 sm:text-left sm:justify-items-start xl:grid-cols-4 xl:gap-24">
                    {/* Brand column */}
                    <AnimatedContainer className="space-y-4">
                        <div className="flex items-center justify-center gap-2 sm:justify-start">
                            <span className="text-xl font-bold text-foreground">
                                GPT<span className="text-primary">Sites</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
                            Your #1 resource for finding the best Get Paid To sites, guides, and tips to maximize your earnings.
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            © {new Date().getFullYear()} GPT Sites. All rights reserved.
                        </p>
                        <p className="hidden sm:block text-xs text-muted-foreground/50 max-w-sm mx-auto sm:mx-0">
                            Some links are affiliate links. Registering via these links supports the project at no extra cost to you.
                        </p>
                    </AnimatedContainer>

                    {/* Link columns — links flow several per line to stay compact */}
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
                                    {section.label}
                                </h3>
                                <ul className="text-muted-foreground flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm sm:justify-start">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="hover:text-foreground hover:border-foreground/30 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1 transition-colors duration-200"
                                            >
                                                {link.icon && <link.icon className="size-3.5 shrink-0" />}
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
}

function AnimatedContainer({ className, delay = 0.1, children }) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
