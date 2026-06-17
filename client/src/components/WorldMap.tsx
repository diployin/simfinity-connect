import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryData {
  country: string;
  iso2: string;
  count: number;
}

interface WorldMapProps {
  data: CountryData[];
  timeFilter?: "7days" | "30days" | "lifetime";
  onTimeFilterChange?: (filter: "7days" | "30days" | "lifetime") => void;
}

// Complete ISO 3166-1 alpha-2 to alpha-3 country code mapping
const iso2ToIso3: Record<string, string> = {
  AF: "AFG", AX: "ALA", AL: "ALB", DZ: "DZA", AS: "ASM", AD: "AND", AO: "AGO", AI: "AIA", AQ: "ATA", AG: "ATG",
  AR: "ARG", AM: "ARM", AW: "ABW", AU: "AUS", AT: "AUT", AZ: "AZE", BS: "BHS", BH: "BHR", BD: "BGD", BB: "BRB",
  BY: "BLR", BE: "BEL", BZ: "BLZ", BJ: "BEN", BM: "BMU", BT: "BTN", BO: "BOL", BQ: "BES", BA: "BIH", BW: "BWA",
  BV: "BVT", BR: "BRA", IO: "IOT", BN: "BRN", BG: "BGR", BF: "BFA", BI: "BDI", CV: "CPV", KH: "KHM", CM: "CMR",
  CA: "CAN", KY: "CYM", CF: "CAF", TD: "TCD", CL: "CHL", CN: "CHN", CX: "CXR", CC: "CCK", CO: "COL", KM: "COM",
  CG: "COG", CD: "COD", CK: "COK", CR: "CRI", CI: "CIV", HR: "HRV", CU: "CUB", CW: "CUW", CY: "CYP", CZ: "CZE",
  DK: "DNK", DJ: "DJI", DM: "DMA", DO: "DOM", EC: "ECU", EG: "EGY", SV: "SLV", GQ: "GNQ", ER: "ERI", EE: "EST",
  SZ: "SWZ", ET: "ETH", FK: "FLK", FO: "FRO", FJ: "FJI", FI: "FIN", FR: "FRA", GF: "GUF", PF: "PYF", TF: "ATF",
  GA: "GAB", GM: "GMB", GE: "GEO", DE: "DEU", GH: "GHA", GI: "GIB", GR: "GRC", GL: "GRL", GD: "GRD", GP: "GLP",
  GU: "GUM", GT: "GTM", GG: "GGY", GN: "GIN", GW: "GNB", GY: "GUY", HT: "HTI", HM: "HMD", VA: "VAT", HN: "HND",
  HK: "HKG", HU: "HUN", IS: "ISL", IN: "IND", ID: "IDN", IR: "IRN", IQ: "IRQ", IE: "IRL", IM: "IMN", IL: "ISR",
  IT: "ITA", JM: "JAM", JP: "JPN", JE: "JEY", JO: "JOR", KZ: "KAZ", KE: "KEN", KI: "KIR", KP: "PRK", KR: "KOR",
  KW: "KWT", KG: "KGZ", LA: "LAO", LV: "LVA", LB: "LBN", LS: "LSO", LR: "LBR", LY: "LBY", LI: "LIE", LT: "LTU",
  LU: "LUX", MO: "MAC", MG: "MDG", MW: "MWI", MY: "MYS", MV: "MDV", ML: "MLI", MT: "MLT", MH: "MHL", MQ: "MTQ",
  MR: "MRT", MU: "MUS", YT: "MYT", MX: "MEX", FM: "FSM", MD: "MDA", MC: "MCO", MN: "MNG", ME: "MNE", MS: "MSR",
  MA: "MAR", MZ: "MOZ", MM: "MMR", NA: "NAM", NR: "NRU", NP: "NPL", NL: "NLD", NC: "NCL", NZ: "NZL", NI: "NIC",
  NE: "NER", NG: "NGA", NU: "NIU", NF: "NFK", MK: "MKD", MP: "MNP", NO: "NOR", OM: "OMN", PK: "PAK", PW: "PLW",
  PS: "PSE", PA: "PAN", PG: "PNG", PY: "PRY", PE: "PER", PH: "PHL", PN: "PCN", PL: "POL", PT: "PRT", PR: "PRI",
  QA: "QAT", RE: "REU", RO: "ROU", RU: "RUS", RW: "RWA", BL: "BLM", SH: "SHN", KN: "KNA", LC: "LCA", MF: "MAF",
  PM: "SPM", VC: "VCT", WS: "WSM", SM: "SMR", ST: "STP", SA: "SAU", SN: "SEN", RS: "SRB", SC: "SYC", SL: "SLE",
  SG: "SGP", SX: "SXM", SK: "SVK", SI: "SVN", SB: "SLB", SO: "SOM", ZA: "ZAF", GS: "SGS", SS: "SSD", ES: "ESP",
  LK: "LKA", SD: "SDN", SR: "SUR", SJ: "SJM", SE: "SWE", CH: "CHE", SY: "SYR", TW: "TWN", TJ: "TJK", TZ: "TZA",
  TH: "THA", TL: "TLS", TG: "TGO", TK: "TKL", TO: "TON", TT: "TTO", TN: "TUN", TR: "TUR", TM: "TKM", TC: "TCA",
  TV: "TUV", UG: "UGA", UA: "UKR", AE: "ARE", GB: "GBR", US: "USA", UM: "UMI", UY: "URY", UZ: "UZB", VU: "VUT",
  VE: "VEN", VN: "VNM", VG: "VGB", VI: "VIR", WF: "WLF", EH: "ESH", YE: "YEM", ZM: "ZMB", ZW: "ZWE"
};

export default function WorldMap({ data, timeFilter = "lifetime", onTimeFilterChange }: WorldMapProps) {
  const { t } = useTranslation();
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; count: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Convert data to ISO3 for matching
  const dataByIso3 = data.reduce((acc, item) => {
    const iso3 = iso2ToIso3[item.iso2?.toUpperCase()];
    if (iso3) {
      acc[iso3] = item.count;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getCountryColor = (count: number) => {
    if (count === 0) return "currentColor"; // Will use text color or specified fill
    const intensity = count / maxCount;
    
    if (intensity < 0.2) return "#ccfbf1"; 
    if (intensity < 0.4) return "#5cb86c"; 
    if (intensity < 0.6) return "var(--primary-light)"; 
    if (intensity < 0.8) return "var(--primary)"; 
    return "var(--primary-second)"; 
  };

  const handleMouseEnter = (geo: any, event: any) => {
    const count = dataByIso3[geo.id] || 0;
    if (count > 0) {
      setHoveredCountry({ name: geo.properties.name, count });
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <Card className="border-0 shadow-lg dark:bg-slate-900/50 dark:border-slate-800 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('admin.dashboard.worldMapTitle', 'Top Destination')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t('admin.dashboard.worldMapDesc', 'eSIM Distribution by Region and Country')}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={timeFilter === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeFilterChange?.("7days")}
              className="text-xs md:text-sm dark:border-slate-700"
            >
              {t('admin.dashboard.filter7Days', 'Last 7 Days')}
            </Button>
            <Button
              variant={timeFilter === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeFilterChange?.("30days")}
              className="text-xs md:text-sm dark:border-slate-700"
            >
              {t('admin.dashboard.filterThisMonth', 'This Month')}
            </Button>
            <Button
              variant={timeFilter === "lifetime" ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeFilterChange?.("lifetime")}
              className="text-xs md:text-sm dark:border-slate-700"
            >
              {t('admin.dashboard.filterLifetime', 'Lifetime')}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 relative dark:bg-slate-900/20" data-testid="world-map-container">
        <div className="w-full overflow-hidden">
          <ComposableMap
            projectionConfig={{
              scale: 147,
            }}
            width={800}
            height={400}
            className="w-full h-auto"
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }: any) =>
                  geographies.map((geo: any) => {
                    const count = dataByIso3[geo.id] || 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getCountryColor(count)}
                        stroke="var(--map-stroke, #ffffff)"
                        strokeWidth={0.5}
                        onMouseEnter={(event: any) => handleMouseEnter(geo, event)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="text-slate-200 dark:text-slate-800"
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: count > 0 ? "var(--primary-dark)" : "#cbd5e1", 
                            outline: "none",
                            cursor: count > 0 ? "pointer" : "default",
                          },
                          pressed: { outline: "none" },
                        }}
                        data-testid={`country-${geo.id}`}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Tooltip */}
        {hoveredCountry && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y - 10,
            }}
            data-testid="map-tooltip"
          >
            <div className="bg-slate-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700">
              <p className="font-semibold text-sm">{hoveredCountry.name}</p>
              <p className="text-xs text-slate-300">
                {hoveredCountry.count} {hoveredCountry.count === 1 ? t('admin.dashboard.order', 'Order') : t('admin.dashboard.orders', 'Orders')}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">{t('admin.dashboard.orderVolume', 'Order Volume')}:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400">{t('admin.dashboard.noOrders', 'No Orders')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-[#ccfbf1]"></div>
            <span className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400">{t('admin.dashboard.low', 'Low')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-primary-light"></div>
            <span className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400">{t('admin.dashboard.medium', 'Medium')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-primary-second"></div>
            <span className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400">{t('admin.dashboard.high', 'High')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
