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
        label: 'Legal',
        links: [
            { title: 'Affiliate Disclosure', href: '#' },
            { title: 'Privacy Policy', href: '#' },
            { title: 'Terms of Service', href: '#' },
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
        <footer className="relative w-full border-t px-6 py-12 lg:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Top glow line */}
                <div className="bg-foreground/10 absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 rounded-full blur-sm" />

                <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">
                    {/* Brand column */}
                    <AnimatedContainer className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">
                                GPT<span className="text-primary">Sites</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Your #1 resource for finding the best Get Paid To sites, guides, and tips to maximize your earnings.
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            © {new Date().getFullYear()} GPT Sites. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground/50 max-w-xs">
                            Some links are affiliate links. Registering via these links supports the project at no extra cost to you.
                        </p>
                    </AnimatedContainer>

                    {/* Link columns */}
                    <div className="mt-4 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
                        {footerLinks.map((section, index) => (
                            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                                <div className="mb-6 md:mb-0">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                                        {section.label}
                                    </h3>
                                    <ul className="text-muted-foreground space-y-2.5 text-sm">
                                        {section.links.map((link) => (
                                            <li key={link.title}>
                                                <a
                                                    href={link.href}
                                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                    className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors duration-200"
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
