import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Tips from './pages/Tips.jsx';
import GuideDetail from './pages/GuideDetail';
import Sites from './pages/Sites';
import Offers from './pages/Offers';
import OfferDetail from './pages/OfferDetail';
import RedirectPage from './pages/Redirect';

const routeMeta = {
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
  "/Offers": {
    title: "GPT Sites | Offers",
    description: "Explore available offers and use filters for country, category, and offerwall to quickly find relevant opportunities.",
  },
};

function RouteMeta() {
  const { pathname } = useLocation();

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

  useEffect(() => {
    let title = "GPT Sites";
    let description = "Find top GPT sites, guides, and offers to earn smarter.";

    if (matchPath("/Guides/:slug", pathname)) {
      title = "GPT Sites | Guide";
      description = "Detailed guide page with setup steps, offerwall notes, and execution tips to complete offers more efficiently.";
    } else if (matchPath("/Offers/:offerSlug", pathname)) {
      title = "GPT Sites | Offer Details";
      description = "Offer details including payout, requirements, and where to complete it across supported GPT sites and offerwalls.";
    } else if (routeMeta[pathname]) {
      title = routeMeta[pathname].title;
      description = routeMeta[pathname].description;
    } else {
      title = "GPT Sites | Page Not Found";
      description = "The page you requested could not be found. Return to GPT Sites to continue browsing guides, sites, and offers.";
    }

    document.title = title;

    const pageUrl = `${window.location.origin}${pathname}`;
    const previewImage = `${window.location.origin}/src/cherry.png`;

    upsertMetaTag('meta[name="description"]', { name: "description" }, description);
    upsertMetaTag('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMetaTag('meta[property="og:type"]', { property: "og:type" }, "website");
    upsertMetaTag('meta[property="og:url"]', { property: "og:url" }, pageUrl);
    upsertMetaTag('meta[property="og:image"]', { property: "og:image" }, previewImage);

    upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, previewImage);
  }, [pathname]);

  return null;
}

function RedirectOrNotFound() {
  const { pathname } = useLocation();

  if (pathname === "/redirect" || pathname.startsWith("/redirect=")) {
    return <RedirectPage />;
  }

  return <PageNotFound />;
}

function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <RouteMeta />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Guides" element={<Guides />} />
          <Route path="/Tips" element={<Tips />} />
          <Route path="/Guides/:slug" element={<GuideDetail />} />
          <Route path="/Sites" element={<Sites />} />
          <Route path="/Offers" element={<Offers />} />
          <Route path="/Offers/:offerSlug" element={<OfferDetail />} />
          <Route path="/redirect=:slug" element={<RedirectPage />} />
          <Route path="/redirect" element={<RedirectPage />} />
          <Route path="*" element={<RedirectOrNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App