import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allSites } from "@/lib/sitesData";
import { apiUrl } from "@/lib/api";

const normalizeWall = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function parseJsonResponse(response) {
  const rawBody = await response.text();
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    const preview = rawBody.slice(0, 80).replace(/\s+/g, " ");
    throw new Error(`API returned non-JSON response: ${preview}`);
  }

  if (!response.ok) {
    const backendError = payload?.error || payload?.message || `HTTP ${response.status}`;
    throw new Error(String(backendError));
  }

  return payload;
}

async function fetchOffersPage(wall, page, pageSize) {
  const endpoint = apiUrl(`/api/offers/${wall}?page=${page}&page_size=${pageSize}`);
  const response = await fetch(endpoint);
  return await parseJsonResponse(response);
}

export default function OfferDetail() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialOffer = location.state?.offer || null;

  const [offer, setOffer] = useState(initialOffer);
  const [loading, setLoading] = useState(!initialOffer);
  const [error, setError] = useState(null);

  const offerId = searchParams.get("offerId");
  const wall = (searchParams.get("wall") || "adtowall").toLowerCase();
  const normalizedWall = normalizeWall(wall);

  const matchingSites = allSites
    .filter((site) =>
      Array.isArray(site.offerwalls) && site.offerwalls.some((siteWall) => normalizeWall(siteWall) === normalizedWall)
    )
    .sort((a, b) => (Number(b.rates) || 0) - (Number(a.rates) || 0));

  useEffect(() => {
    if (initialOffer || !offerId) return;

    let isMounted = true;

    async function loadOfferById() {
      setLoading(true);
      setError(null);
      try {
        const pageSize = 200;
        let page = 1;
        let total = Infinity;
        let found = null;

        while ((page - 1) * pageSize < total) {
          const payload = await fetchOffersPage(wall, page, pageSize);
          const list = payload?.data?.offers || [];
          const paging = payload?.data?.paging || {};
          total = Number(paging.total_count || list.length);

          found = list.find((item) => String(item.id) === String(offerId));
          if (found) break;

          page += 1;
          if (page > 25) break;
        }

        if (!found) {
          throw new Error("Offer not found");
        }

        if (isMounted) setOffer(found);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load offer");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOfferById();
    return () => {
      isMounted = false;
    };
  }, [initialOffer, offerId, wall]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/Offers">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Offers
            </Button>
          </Link>

          {loading ? (
            <div className="text-muted-foreground">Loading offer...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : !offer ? (
            <div className="text-muted-foreground">Offer not found.</div>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-card/70 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{offer.name}</h1>
              <p className="text-sm text-muted-foreground mb-6">
                {offer.category || "Other"} • Payout: ${Number(offer.payout || 0).toFixed(2)}
              </p>

              {offer.thumbnail_url && (
                <img src={offer.thumbnail_url} alt={offer.name} className="w-20 h-20 rounded-xl object-cover mb-6 border border-border/40" />
              )}

              <div className="prose prose-sm max-w-none text-foreground/90">
                {offer.description ? (
                  <div dangerouslySetInnerHTML={{ __html: offer.description }} />
                ) : (
                  <p className="text-muted-foreground">No description available for this offer.</p>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground mb-3">
                  Sites with {wall.toUpperCase()} and rates
                </h2>
                {matchingSites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No site found with this offerwall yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {matchingSites.map((site) => (
                      <a
                        key={site.name}
                        href={site.visit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-3 hover:border-primary/35 hover:bg-primary/10 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{site.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{site.description}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 text-right">
                          {site.rates ? (
                            <div>
                              <p className="text-sm font-extrabold text-primary">
                                ${((Number(offer.payout || 0) * Number(site.rates)) / 100).toFixed(2)}
                              </p>
                              <p className="text-[11px] text-muted-foreground">{site.rates}% rate</p>
                            </div>
                          ) : (
                            <span className="text-sm font-extrabold text-primary">N/A</span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
