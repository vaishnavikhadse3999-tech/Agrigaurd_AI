import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MarketMapping {
  marketId: string;
  marketName: string;
  agmarknetMarket: string;
  agmarknetState: string;
  district: string;
}

const MARKET_MAPPINGS: MarketMapping[] = [
  { marketId: "shegaon", marketName: "Shegaon APMC", agmarknetMarket: "Shegaon", agmarknetState: "Maharashtra", district: "Buldhana" },
  { marketId: "khamgaon", marketName: "Khamgaon APMC", agmarknetMarket: "Khamgaon", agmarknetState: "Maharashtra", district: "Buldhana" },
  { marketId: "akola", marketName: "Akola APMC", agmarknetMarket: "Akola", agmarknetState: "Maharashtra", district: "Akola" },
  { marketId: "amravati", marketName: "Amravati APMC", agmarknetMarket: "Amravati", agmarknetState: "Maharashtra", district: "Amravati" },
];

const CROP_MAPPINGS: Record<string, string[]> = {
  "Soybean": ["Soybean", "Soya"],
  "Cotton": ["Cotton", "Kapas"],
  "Tur": ["Tur", "Arhar", "Tur Dal"],
  "Chana": ["Chana", "Gram", "Chickpea"],
  "Wheat": ["Wheat", "Gehun"],
  "Maize": ["Maize", "Makka", "Corn"],
  "Jowar": ["Jowar", "Sorghum"],
  "Vegetables": ["Tomato", "Onion", "Brinjal", "Cauliflower", "Cabbage"],
};

interface PriceEntry {
  marketId: string;
  marketName: string;
  commodity: string;
  variety: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  unit: string;
  arrival: string | null;
  reportDate: string;
  available: boolean;
}

function parsePrice(val: string | undefined | null): number | null {
  if (!val) return null;
  const n = parseInt(val.replace(/[^\d]/g, ""), 10);
  return isNaN(n) ? null : n;
}

async function fetchAgmarknetPrices(market: MarketMapping, cropNames: string[]): Promise<PriceEntry[]> {
  const results: PriceEntry[] = [];
  for (const cropName of cropNames) {
    const url = `https://agmarknet.gov.in/SearchCmp?ddCommodity=${encodeURIComponent(cropName)}&ddState=${encodeURIComponent(market.agmarknetState)}&ddDistrict=${encodeURIComponent(market.district)}&ddMarket=${encodeURIComponent(market.agmarknetMarket)}&txtDate=&txtYear=&rk=on&txtPrice=&btnSearch=Search`;

    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      });

      if (!resp.ok) continue;

      const html = await resp.text();
      const rows = extractTableRows(html);

      for (const row of rows) {
        if (row.commodity && row.marketName?.toLowerCase().includes(market.agmarknetMarket.toLowerCase())) {
          results.push({
            marketId: market.marketId,
            marketName: market.marketName,
            commodity: row.commodity,
            variety: row.variety || "Local",
            minPrice: parsePrice(row.minPrice),
            maxPrice: parsePrice(row.maxPrice),
            modalPrice: parsePrice(row.modalPrice),
            unit: row.unit || "₹/quintal",
            arrival: row.arrival || null,
            reportDate: row.reportDate || "",
            available: row.modalPrice != null,
          });
        }
      }
    } catch {
      // Network or parse error for this crop — continue to next
    }
  }

  if (results.length === 0) {
    results.push({
      marketId: market.marketId,
      marketName: market.marketName,
      commodity: cropNames[0],
      variety: "—",
      minPrice: null,
      maxPrice: null,
      modalPrice: null,
      unit: "₹/quintal",
      arrival: null,
      reportDate: "",
      available: false,
    });
  }

  return results;
}

function extractTableRows(html: string): Array<{
  commodity: string;
  variety: string;
  minPrice: string | null;
  maxPrice: string | null;
  modalPrice: string | null;
  unit: string | null;
  arrival: string | null;
  reportDate: string | null;
  marketName: string | null;
}> {
  const rows: Array<Record<string, string | null>> = [];
  // AGMARKNET returns HTML tables; extract table rows with regex
  const tableMatch = html.match(/<table[^>]*class=["']?table[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [];

  const tableHtml = tableMatch[1];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let trMatch;
  let isFirstRow = true;
  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    if (isFirstRow) {
      isFirstRow = false;
      continue;
    }

    const trHtml = trMatch[1];
    const cells: string[] = [];
    let tdMatch;
    while ((tdMatch = tdRegex.exec(trHtml)) !== null) {
      const cellText = tdMatch[1]
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim();
      cells.push(cellText);
    }

    if (cells.length >= 7) {
      rows.push({
        marketName: cells[0] || null,
        commodity: cells[1] || null,
        variety: cells[2] || null,
        minPrice: cells[3] || null,
        maxPrice: cells[4] || null,
        modalPrice: cells[5] || null,
        unit: cells[6] || null,
        arrival: cells.length > 7 ? cells[7] : null,
        reportDate: cells.length > 8 ? cells[8] : null,
      });
    }
  }

  return rows;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { marketId, crop } = await req.json();

    if (!marketId || !crop) {
      return new Response(
        JSON.stringify({ error: "marketId and crop are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const market = MARKET_MAPPINGS.find((m) => m.marketId === marketId);
    if (!market) {
      return new Response(
        JSON.stringify({ error: "Unknown market" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cropNames = CROP_MAPPINGS[crop];
    if (!cropNames) {
      return new Response(
        JSON.stringify({ error: "Unknown crop" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prices = await fetchAgmarknetPrices(market, cropNames);

    return new Response(
      JSON.stringify({ prices, dataSource: "AGMARKNET", marketId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
