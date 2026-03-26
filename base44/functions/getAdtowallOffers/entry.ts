import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const page = body.page || 1;
    const page_size = body.page_size || 100;

    const response = await fetch(
      `https://api.eflow.team/v1/affiliates/offersrunnable?page=${page}&page_size=${page_size}`,
      {
        headers: {
          'X-Eflow-API-Key': 'ZGCBWVMR7aVzBv2E58UJw',
          'content-type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `API error ${response.status}: ${errText}` }, { status: 500 });
    }

    const data = await response.json();

    // Normalize offers
    const offers = (data.offers || []).map((offer) => {
      const payout = offer.relationship?.payouts?.entries?.[0]?.payout_amount || 0;
      const category = offer.relationship?.category?.name || 'Unknown';
      const countries = offer.relationship?.ruleset?.countries || [];
      const platforms = offer.relationship?.ruleset?.platforms || [];
      const deviceTypes = offer.relationship?.ruleset?.device_types || [];

      return {
        id: offer.network_offer_id,
        name: offer.name,
        thumbnail_url: offer.thumbnail_url || '',
        category,
        payout,
        status: offer.offer_status,
        tracking_url: offer.tracking_url,
        countries,
        platforms,
        device_types: deviceTypes,
        time_created: offer.time_created,
        description: offer.html_description || '',
        preview_url: offer.preview_url || '',
      };
    });

    return Response.json({
      offers,
      paging: data.paging,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});