import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollToTop, BackToTop } from '@/components/layout/ScrollToTop';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Tips from './pages/Tips.jsx';
import GuideDetail from './pages/GuideDetail';
import Sites from './pages/Sites';
import Events from './pages/Events';
import LiveFeed from './pages/LiveFeed';
import Faq from './pages/Faq';
import NotFound from './pages/NotFound';
import RedirectPage from './pages/Redirect';

const routeMeta = {
  "/": {
    title: "GPT Sites | Home",
    description: "Discover trusted GPT sites, compare rates, and find beginner-friendly ways to earn with offers, surveys, and rewards.",
  },
  "/Home": {
    title: "GPT Sites | Home",
    description: "Discover trusted GPT sites, compare rates, and find beginner-friendly ways to earn with offers, surveys, and rewards.",
  },
  "/Guides": {
    title: "GPT Sites | Guides",
    description: "Read practical GPT and offerwall guides with strategies, step-by-step tips, and payout-focused walkthroughs.",
  },
  "/Tips": {
    title: "GPT Sites | Tips",
    description: "Learn smart earning tips to maximize rewards, avoid common mistakes, and improve completion rates on GPT sites.",
  },
  "/Sites": {
    title: "GPT Sites | Sites",
    description: "Browse and filter GPT websites by offerwalls, popularity, and payout rates to find the best site for your goals.",
  },
  "/Events": {
    title: "GPT Sites | Events",
    description: "Track offerwall boosts, tournaments, and seasonal promos across top GPT sites so you can earn at peak rates.",
  },
  "/LiveFeed": {
    title: "GPT Sites | Live Feed",
    description: "Watch CashInStyle's live activity ticker for recent offer credits, survey completions, and withdrawals in real time.",
  },
  "/Faq": {
    title: "GPT Sites | FAQ",
    description: "Get answers about GPT sites, offerwall tracking, payout speeds, safety, and how to earn more from offers and surveys.",
  },
  "/Offers": {
    title: "GPT Sites | Offers",
    description: "Explore current offer opportunities and redirect to the latest events and boosts across top GPT sites.",
  },
};

function RouteMeta() {
  const { pathname, hash } = useLocation();

  const upsertMetaTag = (selector, attributes, content) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
      });
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  const upsertLinkTag = (rel, href) => {
    let tag = document.head.querySelector(`link[rel="${rel}"]`);
    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", rel);
      document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
  };

  useEffect(() => {
    let title = "GPT Sites";
    let description = "Find top GPT sites, guides, and events to earn smarter.";

    if (matchPath("/Guides/:slug", pathname)) {
      title = "GPT Sites | Guide";
      description = "Detailed guide page with setup steps, offerwall notes, and execution tips to complete offers more efficiently.";
    } else if (routeMeta[pathname]) {
      title = routeMeta[pathname].title;
      description = routeMeta[pathname].description;
    } else {
      title = "GPT Sites | Page Not Found";
      description = "The page you requested could not be found. Return to GPT Sites to continue browsing guides, sites, and events.";
    }

    document.title = title;

    const pageUrl = `${window.location.origin}${pathname}`;
    const imageUrl = `${window.location.origin}/icon.png`;

    upsertMetaTag('meta[name="description"]', { name: "description" }, description);
    upsertMetaTag('meta[property="og:site_name"]', { property: "og:site_name" }, "GPT Sites");
    upsertMetaTag('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMetaTag('meta[property="og:type"]', { property: "og:type" }, "website");
    upsertMetaTag('meta[property="og:url"]', { property: "og:url" }, pageUrl);
    upsertMetaTag('meta[property="og:image"]', { property: "og:image" }, imageUrl);

    upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);

    upsertLinkTag("canonical", pageUrl);
  }, [pathname]);

  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace(/^#/, "");
    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timeoutId = window.setTimeout(scrollToTarget, 60);
    return () => window.clearTimeout(timeoutId);
  }, [hash, pathname]);

  return null;
}

function RedirectOrNotFound() {
  const { pathname } = useLocation();

  if (pathname === "/redirect" || pathname.startsWith("/redirect=")) {
    return <RedirectPage />;
  }

  return <NotFound />;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/Home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/Guides" element={<PageWrapper><Guides /></PageWrapper>} />
        <Route path="/Tips" element={<PageWrapper><Tips /></PageWrapper>} />
        <Route path="/Guides/:slug" element={<PageWrapper><GuideDetail /></PageWrapper>} />
        <Route path="/Sites" element={<PageWrapper><Sites /></PageWrapper>} />
        <Route path="/Events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/LiveFeed" element={<PageWrapper><LiveFeed /></PageWrapper>} />
        <Route path="/Faq" element={<PageWrapper><Faq /></PageWrapper>} />
        <Route path="/Offers" element={<Navigate to="/Events" replace />} />
        <Route path="/redirect=:slug" element={<RedirectPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="*" element={<PageWrapper><RedirectOrNotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <RouteMeta />
            <ScrollToTop />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">
                <AnimatedRoutes />
              </div>
              <Footer />
              <BackToTop />
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App
