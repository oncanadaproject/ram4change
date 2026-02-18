const { useState, useEffect, useRef } = React;

const SECTOR_COLORS = {
  "Corrections": { bg: "rgba(220,166,148,0.20)", text: "#dca694" },
  "Healthcare": { bg: "rgba(62,81,132,0.16)", text: "#3e5184" },
  "Education": { bg: "rgba(15,34,78,0.14)", text: "#0f224e" },
  "Justice/MAG": { bg: "rgba(87,75,79,0.16)", text: "#574b4f" },
  "OPS": { bg: "rgba(62,81,132,0.16)", text: "#3e5184" },
  "Dev. Services": { bg: "rgba(62,81,132,0.14)", text: "#3e5184" },
  "Mental Health": { bg: "rgba(220,166,148,0.18)", text: "#dca694" },
  "Children/Youth": { bg: "rgba(87,75,79,0.14)", text: "#574b4f" },
  "Long-Term Care": { bg: "rgba(62,81,132,0.14)", text: "#3e5184" },
  "Community Services": { bg: "rgba(87,75,79,0.14)", text: "#574b4f" },
  "Municipalities": { bg: "rgba(87,75,79,0.18)", text: "#574b4f" },
  "Property Assessment": { bg: "rgba(62,81,132,0.16)", text: "#3e5184" },
  "Natural Resources": { bg: "rgba(62,81,132,0.14)", text: "#3e5184" },
  "LCBO/LTB": { bg: "rgba(220,166,148,0.18)", text: "#dca694" },
  "Retiree": { bg: "rgba(87,75,79,0.16)", text: "#574b4f" },
  "Union Leadership": { bg: "rgba(15,34,78,0.14)", text: "#0f224e" },
  "Other BPS": { bg: "rgba(62,81,132,0.14)", text: "#3e5184" },
};

const LEGACY_REGION_DATA = {
  1: {
    subtitle: "Southwestern Ontario · Windsor · London · Sarnia · Chatham",
    locals: [
      { num: "106", sector: "Healthcare", role: "Hospital Professional" },
      { num: "123", sector: "Justice/MAG", role: "Court Services" },
      { num: "154", sector: "OPS", role: "OPS Unified" },
      { num: "162", sector: "Education", role: "LBED" },
    ],
    sectors: ["Justice/MAG", "Healthcare", "OPS", "Education"],
  },
  2: {
    subtitle: "South-Central / Niagara Corridor · Guelph · Hamilton · Niagara · Owen Sound",
    locals: [
      { num: "2100", sector: "Education", role: "Educator" },
      { num: "2103", sector: "Education", role: "Board of Ed" },
      { num: "217", sector: "Municipalities", role: "Electrician" },
      { num: "221", sector: "Justice/MAG", role: "Legal Admin" },
      { num: "223", sector: "OPS", role: "Ministry of Ed" },
      { num: "224", sector: "OPS", role: "SAIU Caseworker" },
      { num: "241", sector: "Education", role: "College Co-op" },
      { num: "258", sector: "Children/Youth", role: "CAS" },
      { num: "261", sector: "Long-Term Care", role: "PSW" },
      { num: "269", sector: "Community Services", role: "Social Worker" },
      { num: "281", sector: "Long-Term Care", role: "Sector 8" },
      { num: "284", sector: "Education", role: "LBED" },
    ],
    sectors: ["Education", "Long-Term Care", "Children/Youth", "Justice/MAG", "OPS", "Municipalities", "Community Services"],
  },
  3: {
    subtitle: "Central Ontario & Kawarthas · Oshawa · Orillia · Peterborough · Midland",
    locals: [
      { num: "312", sector: "Property Assessment", role: "Sector 16" },
      { num: "340", sector: "OPS", role: "OPS Unified" },
      { num: "348", sector: "Healthcare", role: "Hospital / MLT" },
      { num: "365", sector: "Education", role: "University" },
      { num: "367", sector: "Healthcare", role: "Lab / HPD" },
      { num: "377", sector: "Education", role: "LBED" },
      { num: "383", sector: "Healthcare", role: "Hospital OTA/PTA" },
      { num: "386", sector: "Dev. Services", role: "Dev. Services" },
    ],
    sectors: ["Healthcare", "Education", "OPS", "Property Assessment", "Dev. Services"],
  },
  4: {
    subtitle: "Eastern Ontario & National Capital Region · Ottawa · Kingston · Brockville",
    locals: [
      { num: "410", sector: "OPS", role: "OPS" },
      { num: "424", sector: "Corrections", role: "Corrections" },
      { num: "434", sector: "Dev. Services", role: "DSW" },
      { num: "439", sector: "Mental Health", role: "Mental Health" },
      { num: "455", sector: "OPS", role: "OPS Unified" },
      { num: "460", sector: "Children/Youth", role: "Children's MH" },
      { num: "494", sector: "Municipalities", role: "Case Manager" },
    ],
    sectors: ["OPS", "Mental Health", "Corrections", "Dev. Services", "Children/Youth", "Municipalities"],
  },
  5: {
    subtitle: "Greater Toronto Area & Provincial HQ · Toronto · Mississauga · Brampton",
    locals: [
      { num: "526", sector: "Justice/MAG", role: "Court Clerk / MAG" },
      { num: "542", sector: "OPS", role: "MTO / OPS" },
      { num: "546", sector: "OPS", role: "Elevator Safety" },
      { num: "548", sector: "Mental Health", role: "Mental Health" },
      { num: "550", sector: "Dev. Services", role: "Dev. Services" },
      { num: "559", sector: "Education", role: "CAAT Support" },
      { num: "563", sector: "Education", role: "Financial Aid" },
      { num: "575", sector: "Healthcare", role: "HPD" },
      { num: "579", sector: "OPS", role: "Sol Gen" },
      { num: "582", sector: "Corrections", role: "Corrections" },
      { num: "584", sector: "OPS", role: "OCWA / Water" },
      { num: "585", sector: "OPS", role: "OHS Inspector" },
      { num: "587", sector: "Healthcare", role: "Healthcare BPS" },
      { num: "594", sector: "Community Services", role: "Non-Profit" },
    ],
    sectors: ["OPS", "Justice/MAG", "Education", "Healthcare", "Corrections", "Dev. Services", "Mental Health", "Community Services"],
  },
  6: {
    subtitle: "Northeastern Ontario & Algoma · Sudbury · North Bay · Timmins · Sault Ste. Marie",
    locals: [
      { num: "617", sector: "Corrections", role: "Corrections" },
      { num: "632", sector: "OPS", role: "MMAH" },
      { num: "642", sector: "Corrections", role: "Duty Officer" },
      { num: "649", sector: "OPS", role: "OPS" },
      { num: "652", sector: "OPS", role: "OPS" },
      { num: "665", sector: "Children/Youth", role: "Child Protection" },
    ],
    sectors: ["OPS", "Corrections", "Children/Youth"],
  },
  7: {
    subtitle: "Northwestern Ontario · Thunder Bay · Kenora · Dryden · Fort Frances",
    locals: [
      { num: "708", sector: "Corrections", role: "Corrections" },
      { num: "710", sector: "Justice/MAG", role: "MAG" },
      { num: "713", sector: "Natural Resources", role: "MNR / AFFES" },
      { num: "715", sector: "Healthcare", role: "HPD" },
      { num: "736", sector: "OPS", role: "OPS" },
      { num: "740", sector: "Dev. Services", role: "DS Support" },
    ],
    sectors: ["Corrections", "Justice/MAG", "Healthcare", "Natural Resources", "OPS", "Dev. Services"],
  },
};

const ATTENDANCE_CSV_PATHS = [
  "./Final%20r4c%20Attendance%20in%20Townhalls%20Region%20and%20Sector%20and%20Potential%20Employer%20and%20local%20number%20.csv",
  "./Local%20Regions%20Data%20Sheet%20R4C%20-%20Sheet7.csv",
  "./Pre-Registration%20R4C%20Events%20-%20OPSEU_Local_Sector_Lookup.csv",
  "./data.csv",
];

const REGION_COPY_CSV_PATHS = [
  "./Final%20Geographic%20Description%20and%20Blurb%20and%20Hyperlinked%20Question%20per%20OPSEU%20Region%20r4c.csv",
  "./Local%20Regions%20Data%20Sheet%20R4C%20-%20Copy%20of%20Provincial%20Regional%20OPSEU%20Descriptors.csv",
];

const BRAND = {
  navy: "#0f224e",
  indigo: "#3e5184",
  page: "#e8ecf0",
  peach: "#dca694",
  night: "#0a0e18",
  taupe: "#574b4f",
  line: "#cdd5df",
};

const REGION_SUBTITLES = {
  1: "Southwestern Ontario · Windsor · London · Sarnia · Chatham",
  2: "South-Central / Niagara Corridor · Guelph · Hamilton · Niagara · Owen Sound",
  3: "Central Ontario & Kawarthas · Oshawa · Orillia · Peterborough · Midland",
  4: "Eastern Ontario & National Capital Region · Ottawa · Kingston · Brockville",
  5: "Greater Toronto Area & Provincial HQ · Toronto · Mississauga · Brampton",
  6: "Northeastern Ontario & Algoma · Sudbury · North Bay · Timmins · Sault Ste. Marie",
  7: "Northwestern Ontario · Thunder Bay · Kenora · Dryden · Fort Frances",
};

const LOCAL_EMPLOYER_HINTS = {
  "241": ["Mohawk College"],
  "348": ["Lakeridge Health"],
  "365": ["Trent University"],
  "383": ["Orillia Soldiers' Memorial Hospital"],
  "500": ["Centre for Addiction and Mental Health (CAMH)"],
  "558": ["Centennial College"],
  "559": ["Centennial College"],
  "563": ["Humber College"],
  "613": ["Sault College"],
};

function cleanEmployerValue(value) {
  return (value || "").replace(/\s+/g, " ").replace(/[.]+$/g, "").trim();
}

function splitPotentialEmployers(rawText) {
  if (!rawText) return [];
  return rawText
    .replace(/\band\/or\b/gi, ",")
    .split(/[;,|]+/g)
    .map((entry) => cleanEmployerValue(entry))
    .filter((entry) => entry && entry !== "." && entry.toLowerCase() !== "n/a");
}

function inferPotentialEmployers({ local, role, sector, division }) {
  const inferred = new Set();
  const text = `${role || ""} ${sector || ""} ${division || ""}`.toLowerCase();

  if (LOCAL_EMPLOYER_HINTS[local]) {
    LOCAL_EMPLOYER_HINTS[local].forEach((name) => inferred.add(name));
  }
  if (text.includes("court") || text.includes("mag") || text.includes("justice")) {
    inferred.add("Ministry of the Attorney General");
  }
  if (text.includes("correction")) {
    inferred.add("Ministry of the Solicitor General");
  }
  if (text.includes("ops") || text.includes("ontario public service")) {
    inferred.add("Ontario Public Service ministries and agencies");
  }
  if (text.includes("mto") || text.includes("transportation")) {
    inferred.add("Ministry of Transportation of Ontario");
  }
  if (text.includes("mccss")) {
    inferred.add("Ministry of Children, Community and Social Services");
  }
  if (text.includes("mmah")) {
    inferred.add("Ministry of Municipal Affairs and Housing");
  }
  if (text.includes("mnr") || text.includes("affes") || text.includes("natural resources")) {
    inferred.add("Ministry of Natural Resources / AFFES");
  }
  if (text.includes("hospital") || text.includes("hpd") || text.includes("healthcare")) {
    inferred.add("Public hospitals and healthcare employers");
  }
  if (text.includes("mental health")) {
    inferred.add("Mental health organizations and hospitals");
  }
  if (text.includes("children's aid") || text.includes("child welfare") || text.includes("child protection")) {
    inferred.add("Children's Aid Societies");
  }
  if (text.includes("long term care")) {
    inferred.add("Long-term care homes");
  }
  if (text.includes("municipal")) {
    inferred.add("Municipal governments");
  }
  if (text.includes("community agencies") || text.includes("social services") || text.includes("non-profit")) {
    inferred.add("Community and non-profit service agencies");
  }
  if (text.includes("developmental")) {
    inferred.add("Developmental services agencies");
  }
  if (text.includes("lcbo") || text.includes("liquor retail") || text.includes("lbed")) {
    inferred.add("LCBO");
  }
  if (text.includes("college") || text.includes("caat")) {
    inferred.add("Ontario public colleges");
  }
  if (text.includes("university")) {
    inferred.add("Ontario universities");
  }
  if (text.includes("mpac") || text.includes("property assessment")) {
    inferred.add("Municipal Property Assessment Corporation (MPAC)");
  }
  if (text.includes("ocwa")) {
    inferred.add("Ontario Clean Water Agency (OCWA)");
  }
  if (text.includes("tssa")) {
    inferred.add("Technical Standards and Safety Authority (TSSA)");
  }
  if (text.includes("executive board member") || text.includes("opseu ebm")) {
    inferred.add("OPSEU/SEFPO");
  }

  return Array.from(inferred);
}

function buildLocalEmployerList({ local, role, sector, division, explicitEmployers }) {
  const employerSet = new Set();

  explicitEmployers.forEach((value) => {
    const cleaned = cleanEmployerValue(value);
    if (cleaned) employerSet.add(cleaned);
  });

  inferPotentialEmployers({ local, role, sector, division }).forEach((value) => {
    const cleaned = cleanEmployerValue(value);
    if (cleaned) employerSet.add(cleaned);
  });

  return Array.from(employerSet);
}

function collectRegionEmployers(region) {
  const employerSet = new Set(Array.isArray(region.employers) ? region.employers : []);
  (region.locals || []).forEach((local) => {
    const localEmployers = Array.isArray(local.employers) && local.employers.length > 0
      ? local.employers
      : inferPotentialEmployers({
        local: local.num,
        role: local.role,
        sector: local.sector,
        division: "",
      });
    localEmployers.forEach((value) => {
      const cleaned = cleanEmployerValue(value);
      if (cleaned) employerSet.add(cleaned);
    });
  });
  return Array.from(employerSet).sort((a, b) => a.localeCompare(b));
}

function withEmployersForFallback(data) {
  const next = {};
  Object.entries(data).forEach(([regionKey, regionValue]) => {
    const locals = (regionValue.locals || []).map((local) => {
      const employers = buildLocalEmployerList({
        local: local.num,
        role: local.role,
        sector: local.sector,
        division: "",
        explicitEmployers: local.employers || [],
      });
      return { ...local, employers };
    });
    const region = {
      ...regionValue,
      locals,
      employers: collectRegionEmployers({ ...regionValue, locals }),
    };
    next[regionKey] = region;
  });
  return next;
}

function joinWithCommasAnd(items) {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function buildEmployerSummary(employers) {
  if (!Array.isArray(employers) || employers.length === 0) {
    return {
      types: ["Potential employer details will populate here once the updated employer list is finalized."],
      examples: [],
    };
  }

  const text = employers.map((e) => e.toLowerCase());
  const has = (keywords) => text.some((entry) => keywords.some((k) => entry.includes(k)));

  const types = [];
  if (has(["ministry", "ops", "ontario public service", "agencies"])) {
    types.push("OPS ministries and agencies");
  }
  if (has(["hospital", "health", "camh"])) {
    types.push("hospitals and healthcare employers");
  }
  if (has(["college", "university", "caat"])) {
    types.push("colleges and universities");
  }
  if (has(["municipal"])) {
    types.push("municipal workplaces");
  }
  if (has(["community", "non-profit", "developmental", "children", "aid"])) {
    types.push("community and social service agencies");
  }
  if (has(["attorney general", "court", "justice", "correction", "solicitor general"])) {
    types.push("justice and corrections workplaces");
  }
  if (has(["lcbo", "liquor"])) {
    types.push("liquor retail employers");
  }

  const filteredExamples = employers.filter((employer) => {
    const lower = employer.toLowerCase();
    return !(
      lower.includes("employers") ||
      lower.includes("workplaces") ||
      lower.includes("agencies and") ||
      lower.includes("organizations")
    );
  });

  return {
    types: types.length > 0 ? types : ["public and broader public service employers"],
    examples: filteredExamples.slice(0, 3),
  };
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      const next = line[i + 1];
      if (inQuotes && next === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

function parseRegionNumber(rawValue) {
  const text = String(rawValue || "").trim();
  const match = text.match(/\d+/);
  if (!match) return null;
  const region = Number.parseInt(match[0], 10);
  if (!Number.isInteger(region) || region < 1 || region > 7) return null;
  return region;
}

function buildRegionSubtitle(region, rawCities) {
  const base = (REGION_SUBTITLES[region] || "").split(" · ")[0] || `Region ${region}`;
  const cities = String(rawCities || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" · ");
  return cities ? `${base} · ${cities}` : (REGION_SUBTITLES[region] || `Region ${region}`);
}

function buildRegionCopyFromCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const copy = {};
  for (let r = 1; r <= 7; r += 1) copy[r] = {};
  if (lines.length < 2) return copy;

  const headers = parseCsvLine(lines[0]);
  const lowerHeaders = headers.map((header) => header.toLowerCase().trim());
  const findHeader = (predicate) => {
    const idx = lowerHeaders.findIndex(predicate);
    return idx === -1 ? null : headers[idx];
  };

  const regionHeader = findHeader((h) => h.includes("region"));
  const citiesHeader = findHeader((h) => h.includes("example") || h.includes("cities") || h.includes("areas"));
  const blurbHeader = findHeader((h) => h.includes("description") && !h.includes("continued") && !h.includes("hyperlink"));
  const questionHeader = findHeader((h) => h.includes("hyperlink") || h.includes("continued") || h.includes("question"));

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => { row[header] = cols[index] || ""; });

    const region = parseRegionNumber(regionHeader ? row[regionHeader] : "");
    if (!region) continue;

    const subtitle = buildRegionSubtitle(region, citiesHeader ? row[citiesHeader] : "");
    const blurb = String(blurbHeader ? row[blurbHeader] : "").trim();
    const question = String(questionHeader ? row[questionHeader] : "").trim();

    copy[region] = {
      subtitle,
      blurb,
      question,
    };
  }

  return copy;
}

async function fetchFirstAvailableCsv(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;
      return await response.text();
    } catch (_) {
      // Try next path.
    }
  }
  return null;
}

function buildRegionDataFromCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return withEmployersForFallback(LEGACY_REGION_DATA);

  const headers = parseCsvLine(lines[0]);
  const employerHeaders = headers.filter((h) => h.toLowerCase().includes("employer"));
  const regions = {};
  for (let r = 1; r <= 7; r += 1) {
    regions[r] = { subtitle: REGION_SUBTITLES[r], locals: [], sectors: [], employers: [] };
  }

  const localDedup = new Set();
  const sectorSets = {};
  const employerSets = {};
  for (let r = 1; r <= 7; r += 1) sectorSets[r] = new Set();
  for (let r = 1; r <= 7; r += 1) employerSets[r] = new Set();

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = cols[i] || ""; });

    const region = Number.parseInt((row.Region || row.region || "").trim(), 10);
    if (!Number.isInteger(region) || region < 1 || region > 7) continue;

    const local = (row.Local || row.local || "").trim();
    if (!local || local === "." || local.toLowerCase() === "n/a") continue;

    const role = (row.Role || row.Sector || row.Industry || "Unspecified").trim();
    const sector = (row.Industry || row.Sector || "Other BPS").trim();
    const division = (row.Division || row.division || "").trim();
    const explicitEmployers = employerHeaders.flatMap((header) => splitPotentialEmployers((row[header] || "").trim()));
    const potentialEmployers = buildLocalEmployerList({
      local,
      role,
      sector,
      division,
      explicitEmployers,
    });

    const dedupeKey = `${region}|${local}|${role}|${sector}`;
    if (localDedup.has(dedupeKey)) continue;
    localDedup.add(dedupeKey);

    regions[region].locals.push({ num: local, sector, role, employers: potentialEmployers });
    sectorSets[region].add(sector);
    potentialEmployers.forEach((employer) => employerSets[region].add(employer));
  }

  for (let r = 1; r <= 7; r += 1) {
    regions[r].sectors = Array.from(sectorSets[r]).sort((a, b) => a.localeCompare(b));
    regions[r].employers = Array.from(employerSets[r]).sort((a, b) => a.localeCompare(b));
    regions[r].locals.sort((a, b) => Number(a.num) - Number(b.num));
  }

  return regions;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const REGION_BASE_COLORS = {
  1: "#dca694",
  2: "#c6d0e2",
  3: "#bcc8dc",
  4: "#b2bfd6",
  5: "#a8b6d0",
  6: "#8b9ec0",
  7: "#6f84ad",
};

const REGION_HOVER_COLORS = {
  1: "#cf947d",
  2: "#b6c4db",
  3: "#aab9d2",
  4: "#9eafcb",
  5: "#93a5c6",
  6: "#768cb2",
  7: "#5f75a8",
};

const REGION_SELECTED_COLORS = {
  1: "#c68167",
  2: "#9daec9",
  3: "#8d9fbc",
  4: "#7f93b4",
  5: "#7187ad",
  6: "#5d74a2",
  7: "#4a6297",
};

const MAP_DEFS = [
  {
    id: "north",
    image: "./Region%206%20and%207%20Combined.png",
    viewBox: "0 0 1250 1250",
    width: 1250,
    height: 1250,
    regions: [7, 6],
  },
  {
    id: "south",
    image: "./Combined%20Regions%201%202%203%204%205.png",
    viewBox: "0 0 1250 1250",
    width: 1250,
    height: 1250,
    regions: [4, 3, 2, 1, 5],
  },
];

const REGION_MASK_IMAGES = {
  1: "./Region%201.png",
  2: "./Region%202.png",
  3: "./Region%203.png",
  4: "./Region%204.png",
  5: "./Region%205.png",
  6: "./Region%206.png",
  7: "./Region%207.png",
};

const REGION_HIT_ORDER_BY_MAP = {
  south: [5, 4, 3, 2, 1],
  north: [6, 7],
};

const MASK_ALPHA_THRESHOLD = 96;

// Hand-tuned hit polygons for each split map panel.
const REGION_SHAPES_BY_MAP = {
  north: {
    6: "688,388 670,396 662,404 654,412 646,420 638,428 630,436 622,444 614,452 606,460 598,468 590,476 582,484 574,492 566,500 558,508 550,516 542,524 534,532 526,540 518,548 510,556 502,564 494,572 486,580 478,588 470,596 462,604 454,612 446,620 438,628 430,636 443,644 453,652 457,660 459,668 460,676 462,684 466,692 471,700 478,708 525,716 523,724 520,732 521,740 527,748 534,756 537,764 533,772 530,780 534,788 547,796 543,804 542,812 541,820 563,828 565,836 589,844 658,852 701,860 741,868 751,876 795,884 834,892 859,897 864,897 877,892 893,884 909,876 927,868 932,860 927,852 915,844 880,836 846,828 837,820 833,812 826,804 822,796 816,788 810,780 808,772 808,764 804,756 801,748 803,740 804,732 803,724 803,716 803,708 802,700 802,692 801,684 801,676 801,668 800,660 800,652 800,644 799,636 799,628 799,620 798,612 798,604 798,596 797,588 797,580 796,572 796,564 796,556 795,548 795,540 795,532 794,524 794,516 794,508 793,500 793,492 791,484 784,476 779,468 767,460 744,452 745,444 742,436 738,428 732,420 726,412 718,404 703,396 696,388",
    7: "386,25 375,33 366,41 357,49 348,57 338,65 329,73 320,81 311,89 302,97 293,105 284,113 274,121 265,129 256,137 247,145 238,153 229,161 220,169 210,177 201,185 192,193 183,201 174,209 165,217 155,225 145,233 133,241 121,249 109,257 97,265 85,273 77,281 74,289 73,297 71,305 70,313 68,321 66,329 65,337 63,345 62,353 60,361 59,369 57,377 55,385 54,393 52,401 51,409 49,417 47,425 46,433 44,441 42,449 41,457 39,465 37,473 36,481 34,489 32,497 30,505 29,513 27,521 26,529 25,537 36,545 37,553 37,561 36,569 37,577 37,585 42,593 56,601 73,609 80,617 136,625 140,633 143,641 166,649 171,657 181,665 237,673 265,681 280,686 285,686 295,681 300,673 303,665 306,657 336,649 424,641 432,633 440,625 448,617 456,609 464,601 472,593 480,585 488,577 496,569 504,561 512,553 520,545 528,537 536,529 544,521 552,513 560,505 568,497 576,489 584,481 592,473 600,465 608,457 616,449 624,441 632,433 640,425 648,417 656,409 664,401 672,393 678,385 693,377 692,369 683,361 677,353 673,345 664,337 659,329 660,321 662,313 667,305 665,297 662,289 661,281 664,273 665,265 662,257 659,249 654,241 651,233 652,225 655,217 658,209 661,201 663,193 662,185 662,177 650,169 611,161 535,153 532,145 522,137 512,129 497,121 482,113 467,105 448,97 436,89 434,81 429,73 424,65 419,57 409,49 402,41 395,33 386,25",
  },
  south: {
    1: "146,575 148,579 150,583 151,587 151,591 152,595 152,599 153,603 154,607 155,611 156,615 156,619 156,623 156,627 155,631 153,635 152,639 149,643 147,647 144,651 141,655 138,659 133,663 129,667 126,671 124,675 121,679 118,683 116,687 114,691 110,695 105,699 99,703 94,707 92,711 90,715 89,719 88,723 88,727 88,731 87,735 87,739 87,743 87,747 87,751 87,755 87,759 87,763 87,767 87,771 87,775 87,779 87,783 88,787 90,791 96,795 101,799 102,803 103,807 103,811 102,815 101,819 99,823 96,827 92,831 85,835 37,839 31,843 28,847 26,851 26,855 26,859 27,863 28,867 29,871 31,875 33,879 40,883 47,886 52,886 61,883 70,879 83,875 95,871 98,867 101,863 104,859 107,855 111,851 115,847 119,843 123,839 127,835 132,831 137,827 143,823 149,819 154,815 157,811 160,807 163,803 167,799 170,795 172,791 175,787 178,783 181,779 184,775 187,771 190,767 193,763 195,759 198,755 201,751 204,747 209,743 213,739 219,735 224,731 236,727 269,723 321,719 328,715 331,711 333,707 337,703 340,699 342,695 344,691 346,687 288,683 284,679 280,675 276,671 272,667 268,663 264,659 260,655 256,651 252,647 248,643 244,639 240,635 236,631 232,627 228,623 224,619 220,615 216,611 212,607 208,603 204,599 200,595 196,591 192,587 188,583 184,579 180,575",
    2: "113,312 110,316 112,320 116,324 120,328 124,332 128,336 134,340 140,344 143,348 146,352 148,356 150,360 152,364 155,368 158,372 160,376 161,380 161,384 162,388 163,392 164,396 166,400 167,404 167,408 168,412 167,416 164,420 162,424 160,428 159,432 158,436 157,440 156,444 152,448 148,452 145,456 143,460 142,464 141,468 141,472 141,476 141,480 140,484 140,488 140,492 138,496 137,500 136,504 135,508 135,512 136,516 136,520 136,524 137,528 137,532 138,536 138,540 139,544 140,548 141,552 141,556 142,560 143,564 144,568 145,572 182,576 186,580 190,584 194,588 198,592 202,596 206,600 210,604 214,608 218,612 222,616 226,620 230,624 234,628 238,632 242,636 246,640 250,644 254,648 258,652 262,656 266,660 270,664 274,668 278,672 282,676 286,680 290,684 347,684 349,680 354,676 365,672 376,668 386,664 389,660 389,656 389,652 389,648 389,644 389,640 389,636 389,632 389,628 389,624 389,620 389,616 389,612 389,608 389,604 389,600 389,596 389,592 389,588 389,584 389,580 389,576 389,572 389,568 389,564 389,560 386,556 382,552 378,548 374,544 370,540 366,536 362,532 358,528 354,524 350,520 346,516 342,512 338,508 334,504 334,500 334,496 334,492 334,488 334,484 334,480 334,476 334,472 334,468 334,464 334,460 334,456 334,452 334,448 334,444 334,440 334,436 334,432 334,428 334,424 334,420 334,416 333,412 329,408 325,404 321,400 260,396 240,392 237,388 234,384 232,380 195,376 193,372 168,368 170,364 172,360 171,356 161,352 153,348 149,344 144,340 141,336 139,332 136,328 133,324 129,320 125,316 120,312",
    3: "530,119 521,127 511,135 501,143 492,151 481,159 471,167 463,175 455,183 198,191 201,199 212,207 237,215 240,223 242,231 247,239 285,247 287,255 290,263 295,271 301,279 304,287 310,295 316,303 324,311 331,319 343,327 347,335 314,343 315,351 319,359 322,367 323,375 321,383 319,391 316,399 329,407 335,413 431,413 563,407 597,399 600,391 600,383 600,375 600,367 600,359 600,351 600,343 600,335 600,327 600,319 592,311 584,303 576,295 568,287 560,279 552,271 544,263 536,255 531,247 531,239 531,231 531,223 531,215 531,207 531,199 531,191 531,183 531,175 531,167 531,159 531,151 531,143 531,135 531,127 531,119",
    4: "901,30 869,38 852,46 842,54 831,62 820,70 624,78 576,86 563,94 552,102 542,110 533,118 532,126 532,134 532,142 532,150 532,158 532,166 532,174 532,182 532,190 532,198 532,206 532,214 532,222 532,230 532,238 532,246 536,254 544,262 552,270 560,278 568,286 576,294 584,302 592,310 600,318 601,326 601,334 601,342 601,350 601,358 601,366 601,374 601,382 601,390 601,396 685,390 687,382 678,374 643,366 643,358 650,350 670,342 693,334 715,326 728,318 742,310 754,302 764,294 774,286 784,278 793,270 799,262 805,254 809,246 814,238 818,230 822,222 826,214 831,206 835,198 840,190 844,182 849,174 854,166 860,158 866,150 873,142 879,134 888,126 904,118 920,110 920,102 920,94 920,86 920,78 920,70 920,62 920,54 920,46 920,38 919,30",
    5: "426,427 488,452 456,520 394,490",
  },
};

function buildMaskDataForRegion(img, width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const rgba = ctx.getImageData(0, 0, width, height).data;
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = rgba[(i * 4) + 3];
  }

  const edges = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width) + x;
      if (alpha[idx] <= MASK_ALPHA_THRESHOLD) continue;
      const isEdge =
        x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
        alpha[idx - 1] <= MASK_ALPHA_THRESHOLD ||
        alpha[idx + 1] <= MASK_ALPHA_THRESHOLD ||
        alpha[idx - width] <= MASK_ALPHA_THRESHOLD ||
        alpha[idx + width] <= MASK_ALPHA_THRESHOLD;
      if (isEdge) edges.push(idx);
    }
  }

  return { image: img, alpha, edges };
}

function paintRegionTint(ctx, regionMask, width, height, color) {
  const tintCanvas = document.createElement("canvas");
  tintCanvas.width = width;
  tintCanvas.height = height;
  const tintCtx = tintCanvas.getContext("2d");
  if (!tintCtx) return;

  // Build tint only from the active region alpha, then stamp it onto the map.
  tintCtx.drawImage(regionMask.image, 0, 0, width, height);
  tintCtx.globalCompositeOperation = "source-in";
  tintCtx.fillStyle = color;
  tintCtx.fillRect(0, 0, width, height);

  ctx.drawImage(tintCanvas, 0, 0, width, height);
}

function InteractiveExactMap({
  mapDef,
  activeRegion,
  selectedRegion,
  onHoverRegion,
  onSelectRegion,
  onMapError,
  onMapReady,
}) {
  const overlayRef = useRef(null);
  const [mapImage, setMapImage] = useState(null);
  const [masksByRegion, setMasksByRegion] = useState(null);
  const localActiveRegion = mapDef.regions.includes(activeRegion) ? activeRegion : null;

  useEffect(() => {
    let cancelled = false;

    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    Promise.all([
      loadImage(mapDef.image),
      Promise.all(
        mapDef.regions.map(async (region) => {
          const img = await loadImage(REGION_MASK_IMAGES[region]);
          return [region, buildMaskDataForRegion(img, mapDef.width, mapDef.height)];
        }),
      ),
    ])
      .then(([baseImg, pairs]) => {
        if (cancelled) return;
        const next = {};
        pairs.forEach(([region, data]) => {
          if (data) next[region] = data;
        });
        setMapImage(baseImg);
        setMasksByRegion(next);
        onMapReady();
      })
      .catch(() => {
        if (cancelled) return;
        setMapImage(null);
        setMasksByRegion(null);
        onMapError();
      });

    return () => {
      cancelled = true;
    };
  }, [mapDef.id]);

  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !masksByRegion || !mapImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = mapDef.width;
    const height = mapDef.height;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(mapImage, 0, 0, width, height);
    if (!localActiveRegion) return;

    const activeData = masksByRegion[localActiveRegion];
    if (!activeData) return;
    const isSelected = selectedRegion === localActiveRegion;
    const fillBase = isSelected
      ? REGION_SELECTED_COLORS[localActiveRegion]
      : REGION_HOVER_COLORS[localActiveRegion];

    paintRegionTint(
      ctx,
      activeData,
      width,
      height,
      isSelected ? hexToRgba(fillBase, 0.16) : hexToRgba(fillBase, 0.08),
    );

    const edgeColor = isSelected ? BRAND.indigo : "#7a8fb4";
    const edgeThickness = 1;
    ctx.fillStyle = edgeColor;
    activeData.edges.forEach((idx) => {
      const x = idx % width;
      const y = (idx - x) / width;
      ctx.fillRect(x, y, 1, 1);
      if (edgeThickness > 1) {
        ctx.fillRect(x + 1, y, 1, 1);
        ctx.fillRect(x - 1, y, 1, 1);
        ctx.fillRect(x, y + 1, 1, 1);
        ctx.fillRect(x, y - 1, 1, 1);
      }
    });
  }, [masksByRegion, mapImage, localActiveRegion, selectedRegion, mapDef.id]);

  const pickRegionAtPointer = (evt) => {
    const canvas = overlayRef.current;
    if (!canvas || !masksByRegion) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const px = Math.max(0, Math.min(mapDef.width - 1, Math.round(((evt.clientX - rect.left) / rect.width) * mapDef.width)));
    const py = Math.max(0, Math.min(mapDef.height - 1, Math.round(((evt.clientY - rect.top) / rect.height) * mapDef.height)));
    const idx = (py * mapDef.width) + px;
    const order = REGION_HIT_ORDER_BY_MAP[mapDef.id] || mapDef.regions;

    for (const region of order) {
      const data = masksByRegion[region];
      if (!data) continue;
      if (data.alpha[idx] > MASK_ALPHA_THRESHOLD) return region;
    }
    return null;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "min(100%, 430px)",
        maxWidth: "430px",
        aspectRatio: `${mapDef.width} / ${mapDef.height}`,
        margin: "0 auto",
      }}
      onMouseLeave={() => onHoverRegion(null)}
    >
      <canvas
        ref={overlayRef}
        onMouseMove={(evt) => {
          onHoverRegion(pickRegionAtPointer(evt));
        }}
        onClick={(evt) => {
          const region = pickRegionAtPointer(evt);
          if (region) onSelectRegion(region);
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      />
    </div>
  );
}

function SectorTag({ sector }) {
  return (
    <span style={{
      display: "inline-block", background: "#e9eef6", color: BRAND.indigo,
      padding: "3px 8px", borderRadius: "3px", fontSize: "10px",
      fontFamily: "Open Sans, sans-serif", fontWeight: 600,
      letterSpacing: "0.3px", whiteSpace: "nowrap",
      border: "1px solid #c8d3e4",
    }}>{sector}</span>
  );
}

function OntarioReachMap({ children = null }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mapLoadErrors, setMapLoadErrors] = useState({});
  const [regionData, setRegionData] = useState(withEmployersForFallback(LEGACY_REGION_DATA));
  const [regionCopy, setRegionCopy] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readyTimer = setTimeout(() => setReady(true), 80);
    let cancelled = false;

    (async () => {
      const [attendanceCsvText, regionCopyCsvText] = await Promise.all([
        fetchFirstAvailableCsv(ATTENDANCE_CSV_PATHS),
        fetchFirstAvailableCsv(REGION_COPY_CSV_PATHS),
      ]);

      if (cancelled) return;

      if (attendanceCsvText) {
        setRegionData(buildRegionDataFromCsv(attendanceCsvText));
      } else {
        setRegionData(withEmployersForFallback(LEGACY_REGION_DATA));
      }

      if (regionCopyCsvText) {
        setRegionCopy(buildRegionCopyFromCsv(regionCopyCsvText));
      } else {
        setRegionCopy({});
      }
    })().catch(() => {
      if (!cancelled) {
        setRegionData(withEmployersForFallback(LEGACY_REGION_DATA));
        setRegionCopy({});
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(readyTimer);
    };
  }, []);

  const active = hoveredRegion || selectedRegion;
  const selectedRegionEmployers = selectedRegion
    ? collectRegionEmployers(regionData[selectedRegion] || { locals: [], employers: [] })
    : [];
  const selectedRegionEmployerSummary = selectedRegion
    ? buildEmployerSummary(selectedRegionEmployers)
    : { types: [], examples: [] };
  const fallbackSelectedRegionInsight = selectedRegion === 5
    ? `${regionData[5].sectors.length} sectors and ${regionData[5].locals.length} locals in one room - courts, corrections, colleges, OPS, community agencies, and healthcare. The signal is not "base"; it is cross-sector reality meeting in the same conversation. This is how we build an agenda that does not leave any group fighting alone. Region 5 is also a strategic launch point for the broader campaign, so turnout is naturally deepest here right now.`
    : selectedRegion === 7
    ? `Northwestern members are often the first to feel what it means when leadership is far away - especially on servicing and sector-specific support. They showed up anyway. That is exactly why these town halls are built as ongoing infrastructure, not a one-off event.`
    : selectedRegion === 6
    ? `Corrections, OPS, child protection, and college workers in the same room. Different systems, same pattern: when servicing breaks down, members carry the cost in stress, delays, and risk. This is the work: making that reality visible, then building a plan that can actually execute.`
    : selectedRegion === 3
    ? `${regionData[3].sectors.length} sectors represented, including healthcare and education alongside OPS and property assessment. Cross-sector rooms surface the same issue again and again: members want consistency where work actually happens.`
    : selectedRegion === 4
    ? `${regionData[4].sectors.length} sectors in the room, including mental health, hospitals, OPS, and corrections. This mix matters because the union cannot build real leverage if sectors stay siloed and only meet at convention.`
    : selectedRegion === 2
    ? `${regionData[2].sectors.length} sectors across education, justice, social services, OPS, and municipal work. When this many roles show up together, the common denominator gets clear fast: members want a union that delivers on servicing, bargaining power, and value for dues.`
    : selectedRegion === 1
    ? `${regionData[1].locals.length} locals, ${regionData[1].sectors.length} sectors - hospital, courts, OPS, and retail. Small room, clear signal: different workplaces, same expectation - deliver for members first.`
    : selectedRegion
    ? `${regionData[selectedRegion].locals.length} locals spanning ${regionData[selectedRegion].sectors.length} sectors - different workplaces, different realities, same table.`
    : "";
  const fallbackSelectedRegionReflectionPrompt = selectedRegion === 5
    ? "What should Ram prioritize first as Region 5 momentum scales province-wide?"
    : selectedRegion === 7
    ? "What support gap is most urgent for members across Northwestern Ontario right now?"
    : selectedRegion === 6
    ? "Where are Region 6 members carrying the biggest servicing burden today?"
    : selectedRegion === 3
    ? "What would it look like if OPSEU consistently had members' backs where work actually happens?"
    : selectedRegion === 4
    ? "What leverage should OPSEU build first in this mixed Region 4 sector base?"
    : selectedRegion === 2
    ? "What would a delivery-first union look like for Region 2 workplaces this year?"
    : selectedRegion === 1
    ? "What should members in Region 1 be able to count on from day one?"
    : selectedRegion
    ? "What should this region's members make non-negotiable in the next mandate?"
    : "";
  const selectedRegionSubtitle = selectedRegion
    ? ((regionCopy[selectedRegion] && regionCopy[selectedRegion].subtitle) || regionData[selectedRegion].subtitle)
    : "";
  const selectedRegionInsight = selectedRegion
    ? ((regionCopy[selectedRegion] && regionCopy[selectedRegion].blurb) || fallbackSelectedRegionInsight)
    : "";
  const selectedRegionReflectionPrompt = selectedRegion
    ? ((regionCopy[selectedRegion] && regionCopy[selectedRegion].question) || fallbackSelectedRegionReflectionPrompt)
    : "";

  return (
    <div style={{
      background: BRAND.page,
      fontFamily: "'Oswald', sans-serif", color: BRAND.night,
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Caveat:wght@500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "32px 32px 0", position: "relative", zIndex: 2,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(-12px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "11px", fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase", color: BRAND.indigo, marginBottom: "10px",
          display: "flex", flexWrap: "wrap", gap: "8px",
        }}>
          <a
            href="https://ram4change.ca/blog"
            target="_blank"
            rel="noreferrer"
            style={{
              color: BRAND.navy,
              textDecoration: "none",
              border: `1px solid ${BRAND.indigo}`,
              borderRadius: "999px",
              padding: "5px 12px",
              background: "#f5f7fa",
            }}
          >
            RAM4CHANGE.CA
          </a>
          <a
            href="https://luma.com/ram4change"
            target="_blank"
            rel="noreferrer"
            style={{
              color: BRAND.navy,
              textDecoration: "none",
              border: `1px solid ${BRAND.indigo}`,
              borderRadius: "999px",
              padding: "5px 12px",
              background: "#f5f7fa",
            }}
          >
            RSVP TO A FUTURE TOWNHALL
          </a>
        </div>

        <h1 className="heroTitle" style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: "clamp(22px, 2.35vw, 28px)",
          color: BRAND.navy,
          fontWeight: 700,
          lineHeight: 1.12,
          margin: "0 0 12px",
          maxWidth: "none",
          whiteSpace: "nowrap",
        }}>
          Ram Selvarajah is Already Building a Member-Driven Mandate
        </h1>

        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "rgba(10, 14, 24, 0.78)", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Three months ago, Ram designed and launched a virtual townhall series. His focus wasn't around traditional campaigning, but rather, to listen and hear directly from members across all regions - regardless of who they might support in this election.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "rgba(10, 14, 24, 0.78)", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Members from all 7 regions showed up. Corrections, healthcare, colleges, courts, child protection, developmental services, long-term care, universities, LCBO, and more - representing nearly every sector and division in the union.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "rgba(10, 14, 24, 0.78)", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Ram isn't arriving at Convention with a platform he wrote alone. He's building a member-driven mandate alongside OPSEU members - in real time.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: BRAND.indigo, margin: 0, lineHeight: 1.7, maxWidth: "980px", fontWeight: 700,
        }}>
          Click a region below to see who's been in the room, or scroll to hear what members are saying.
        </p>
      </div>

      {/* Main layout */}
      <div className="mainLayout" style={{
        display: "grid",
        gridTemplateColumns: selectedRegion ? "minmax(0, 1fr) 340px" : "1fr",
        gap: "20px", padding: "20px 32px 32px",
        position: "relative", zIndex: 2,
        opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.2s",
      }}>

        {/* MAPS */}
        <div className="mapPanelsGrid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          alignItems: "start",
        }}>
          {MAP_DEFS.map((mapDef) => (
            <div key={mapDef.id} style={{
              background: BRAND.page,
              border: `1px solid ${BRAND.line}`,
              borderRadius: "12px",
              padding: "10px",
            }}>
              <InteractiveExactMap
                mapDef={mapDef}
                activeRegion={active}
                selectedRegion={selectedRegion}
                onHoverRegion={(region) => setHoveredRegion(region)}
                onSelectRegion={(region) => {
                  setSelectedRegion(selectedRegion === region ? null : region);
                }}
                onMapError={() => {
                  setMapLoadErrors((prev) => ({ ...prev, [mapDef.id]: true }));
                }}
                onMapReady={() => {
                  setMapLoadErrors((prev) => ({ ...prev, [mapDef.id]: false }));
                }}
              />

              {mapLoadErrors[mapDef.id] && (
                <div style={{
                  marginTop: "8px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #f0d3d3",
                  background: "#fff4f4",
                  color: "#9d5252",
                  fontFamily: "Open Sans, sans-serif",
                  fontSize: "11px",
                }}>
                  Map image failed to load for this panel.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DETAIL PANEL */}
        {selectedRegion && (
          <div className="detailPanel detailPanelWrap" style={{
            background: "#ffffff", borderRadius: "12px",
            border: `1px solid ${BRAND.line}`, padding: "24px",
            animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "auto", maxHeight: "540px",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <h2 style={{
                  fontFamily: "Oswald, sans-serif", fontSize: "22px", fontWeight: 700,
                  color: BRAND.navy, margin: 0, lineHeight: 1,
                }}>Region {selectedRegion}</h2>
                <p style={{
                  fontFamily: "Open Sans, sans-serif", fontSize: "12px",
                  color: BRAND.taupe, margin: "4px 0 0",
                }}>{selectedRegionSubtitle}</p>
                <div style={{
                  marginTop: "10px",
                  maxWidth: "250px",
                  background: "#f4f6fa",
                  border: `1px solid ${BRAND.line}`,
                  borderRadius: "10px",
                  padding: "10px 11px",
                }}>
                  <p style={{
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "11px",
                    color: BRAND.taupe,
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {selectedRegionInsight}
                  </p>
                  {selectedRegionReflectionPrompt && (
                    <p style={{ margin: "8px 0 0" }}>
                      <a
                        className="gpiLink"
                        href="https://www.ram4change.ca/support#share-your-voice"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontWeight: 600,
                          fontFamily: "Open Sans, sans-serif",
                          fontSize: "11px",
                          lineHeight: 1.45,
                        }}
                      >
                        {selectedRegionReflectionPrompt}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => { setSelectedRegion(null); }}
                style={{
                  background: "#f5f7fa", border: `1px solid ${BRAND.line}`,
                  color: BRAND.indigo, borderRadius: "4px", padding: "4px 10px",
                  fontFamily: "Open Sans", fontSize: "10px", cursor: "pointer",
                  fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                }}>Close</button>
            </div>

            {/* Locals */}
            <div style={{
              fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: BRAND.indigo, margin: "0 0 10px",
            }}>{regionData[selectedRegion].locals.length} Locals in the Room</div>

            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "4px" }}>
              {regionData[selectedRegion].locals.map((local, i) => (
                <span
                  key={i}
                  title={`${local.role} · ${local.sector}`}
                  style={{
                    display: "inline-block",
                    background: "#e9eef6",
                    color: BRAND.indigo,
                    padding: "3px 8px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontFamily: "Oswald, sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    border: "1px solid #c8d3e4",
                  }}
                >
                  L-{local.num}
                </span>
              ))}
            </div>

            <div style={{ height: "1px", background: "#e1e7ef", margin: "14px 0 14px" }} />

            <div style={{
              fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: BRAND.indigo, margin: "0 0 8px",
            }}>
              Representing {regionData[selectedRegion].sectors.length} Different Sectors
            </div>

            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "4px" }}>
              {regionData[selectedRegion].sectors.map((s, i) => (
                <SectorTag key={i} sector={s} />
              ))}
            </div>

            <div style={{
              fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: BRAND.indigo, margin: "14px 0 8px",
            }}>
              Potential Employers Included
            </div>

            <ul style={{
              margin: "0 0 6px 16px",
              padding: 0,
              color: BRAND.taupe,
              fontFamily: "Open Sans, sans-serif",
              fontSize: "11px",
              lineHeight: 1.45,
            }}>
              {selectedRegionEmployerSummary.types.map((type, i) => (
                <li key={i} style={{ marginBottom: "3px" }}>
                  {type}
                </li>
              ))}
            </ul>
            {selectedRegionEmployerSummary.examples.length > 0 && (
              <p style={{
                fontFamily: "Open Sans, sans-serif",
                fontSize: "11px",
                color: BRAND.taupe,
                margin: "0 0 4px",
                lineHeight: 1.45,
              }}>
                Examples: {joinWithCommasAnd(selectedRegionEmployerSummary.examples)}.
              </p>
            )}

          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0 32px 24px", position: "relative", zIndex: 2 }}>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "10px",
          color: BRAND.taupe, maxWidth: "620px", lineHeight: 1.5,
        }}>
          Pre-Registration Data, Ram4Change State of Our Union Townhalls, Dec 2025 – Feb 2026. By{" "}
          <a
            className="gpiLink"
            href="https://groupproject.ca"
            target="_blank"
            rel="noreferrer"
          >
            Group Project Initiatives
          </a>
        </p>
      </div>

      {children && (
        <div style={{ padding: "0 32px 32px", position: "relative", zIndex: 2 }}>
          {children}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .gpiLink {
          color: #3e5184;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.16s ease, border-color 0.16s ease;
        }

        .gpiLink:hover {
          color: #dca694;
          border-color: #dca694;
        }

        @media (max-width: 980px) {
          .mainLayout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 780px) {
          .heroTitle {
            white-space: normal !important;
          }
          .detailPanelWrap {
            order: -1;
            margin-bottom: 8px;
          }
          .mapPanelsGrid {
            grid-template-columns: 1fr !important;
          }
          .detailPanel {
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<OntarioReachMap />);
