import { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { allSites, featuredSites } from "@/lib/sitesData";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const compact = (value) => slugify(value).replace(/-/g, "");

const buildRedirectMap = () => {
  const map = new Map();
  const add = (key, url) => {
    if (!key || !url || map.has(key)) return;
    map.set(key, url);
  };

  const sites = [...featuredSites, ...allSites];
  for (const site of sites) {
    const name = site?.name || "";
    const url = site?.visit_url || "";
    add(slugify(name), url);
    add(compact(name), url);
  }

  return map;
};

const RedirectPage = () => {
  const { slug } = useParams();
  const location = useLocation();

  const redirectMap = useMemo(buildRedirectMap, []);
  const searchParams = new URLSearchParams(location.search);
  const querySlug = searchParams.get("redirect") || searchParams.get("site") || searchParams.get("s");

  const rawSlug = slug || querySlug || "";
  const normalizedSlug = slugify(rawSlug);
  const normalizedCompact = compact(rawSlug);

  useEffect(() => {
    const target = redirectMap.get(normalizedSlug) || redirectMap.get(normalizedCompact);
    if (target) {
      window.location.replace(target);
    }
  }, [normalizedCompact, normalizedSlug, redirectMap]);

  const target = redirectMap.get(normalizedSlug) || redirectMap.get(normalizedCompact);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <h1 className="text-2xl font-semibold text-foreground">Redirecting...</h1>
        {target ? (
          <p className="mt-3 text-muted-foreground">Sending you to your referral link.</p>
        ) : (
          <p className="mt-3 text-muted-foreground">
            We could not find that site. Try a different slug like <span className="font-semibold text-foreground">earnopolis</span>.
          </p>
        )}
      </div>
    </main>
  );
};

export default RedirectPage;
