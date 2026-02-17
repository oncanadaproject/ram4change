const { useState, useEffect } = React;

const SECTOR_COLORS = {
  "Corrections": { bg: "rgba(220,166,148,0.2)", text: "#dca694" },
  "Healthcare": { bg: "rgba(120,180,170,0.2)", text: "#78b4aa" },
  "Education": { bg: "rgba(200,185,120,0.2)", text: "#c8b978" },
  "Justice/MAG": { bg: "rgba(150,150,200,0.2)", text: "#9696c8" },
  "OPS": { bg: "rgba(120,152,200,0.2)", text: "#7898c8" },
  "Dev. Services": { bg: "rgba(130,180,130,0.2)", text: "#82b482" },
  "Mental Health": { bg: "rgba(180,130,170,0.2)", text: "#b482aa" },
  "Children/Youth": { bg: "rgba(200,168,128,0.2)", text: "#c8a880" },
  "Long-Term Care": { bg: "rgba(128,168,176,0.2)", text: "#80a8b0" },
  "Community Services": { bg: "rgba(128,176,152,0.2)", text: "#80b098" },
  "Municipalities": { bg: "rgba(176,160,128,0.2)", text: "#b0a080" },
  "Property Assessment": { bg: "rgba(144,144,168,0.2)", text: "#9090a8" },
  "Natural Resources": { bg: "rgba(128,176,120,0.2)", text: "#80b078" },
  "LCBO/LTB": { bg: "rgba(192,152,112,0.2)", text: "#c09870" },
  "Retiree": { bg: "rgba(160,160,160,0.2)", text: "#a0a0a0" },
  "Union Leadership": { bg: "rgba(192,128,160,0.2)", text: "#c080a0" },
  "Other BPS": { bg: "rgba(144,144,176,0.2)", text: "#9090b0" },
};

const LEGACY_REGION_DATA = {
  1: {
    subtitle: "London · Windsor",
    locals: [
      { num: "106", sector: "Healthcare", role: "Hospital Professional" },
      { num: "123", sector: "Justice/MAG", role: "Court Services" },
      { num: "154", sector: "OPS", role: "OPS Unified" },
      { num: "162", sector: "Education", role: "LBED" },
    ],
    sectors: ["Justice/MAG", "Healthcare", "OPS", "Education"],
  },
  2: {
    subtitle: "Hamilton · Guelph · Niagara",
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
    subtitle: "Oshawa · Orillia · Peterborough",
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
    subtitle: "Ottawa · Kingston · Brockville",
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
    subtitle: "Toronto (GTA)",
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
    subtitle: "North Bay · Sudbury · Timmins",
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
    subtitle: "Thunder Bay · Kenora · Dryden",
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

const DATA_CSV_PATH = "./data.csv";

const REGION_SUBTITLES = {
  1: "London · Windsor",
  2: "Hamilton · Guelph · Niagara",
  3: "Oshawa · Orillia · Peterborough",
  4: "Ottawa · Kingston · Brockville",
  5: "Toronto (GTA)",
  6: "North Bay · Sudbury · Timmins",
  7: "Thunder Bay · Kenora · Dryden",
};

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

function buildRegionDataFromCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return LEGACY_REGION_DATA;

  const headers = parseCsvLine(lines[0]);
  const regions = {};
  for (let r = 1; r <= 7; r += 1) {
    regions[r] = { subtitle: REGION_SUBTITLES[r], locals: [], sectors: [] };
  }

  const localDedup = new Set();
  const sectorSets = {};
  for (let r = 1; r <= 7; r += 1) sectorSets[r] = new Set();

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = cols[i] || ""; });

    const region = Number.parseInt((row.Region || "").trim(), 10);
    if (!Number.isInteger(region) || region < 1 || region > 7) continue;

    const local = (row.Local || "").trim();
    if (!local || local === "." || local.toLowerCase() === "n/a") continue;

    const role = (row.Sector || "Unspecified").trim();
    const sector = (row.Industry || "Other BPS").trim();
    const dedupeKey = `${region}|${local}|${role}|${sector}`;
    if (localDedup.has(dedupeKey)) continue;
    localDedup.add(dedupeKey);

    regions[region].locals.push({ num: local, sector, role });
    sectorSets[region].add(sector);
  }

  for (let r = 1; r <= 7; r += 1) {
    regions[r].sectors = Array.from(sectorSets[r]).sort((a, b) => a.localeCompare(b));
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
  1: "#f3dcc2",
  2: "#b6ddf4",
  3: "#d6d4c6",
  4: "#ddd3df",
  5: "#cfcbbd",
  6: "#c6cfcf",
  7: "#bfd5e4",
};

const REGION_HOVER_COLORS = {
  1: "#eecaa9",
  2: "#9dceeb",
  3: "#cac7b5",
  4: "#cfc2d2",
  5: "#b9b39f",
  6: "#b7c0c1",
  7: "#acc8db",
};

const REGION_SELECTED_COLORS = {
  1: "#e7bb91",
  2: "#7bb9df",
  3: "#b8b39d",
  4: "#baa8c0",
  5: "#a39a82",
  6: "#9fa8aa",
  7: "#95b8cf",
};

const MAP_DEFS = [
  {
    id: "north",
    image: "./map-north.png",
    viewBox: "0 0 938 938",
    width: 938,
    height: 938,
    regions: [7, 6],
  },
  {
    id: "south",
    image: "./map-south.png",
    viewBox: "0 0 938 938",
    width: 938,
    height: 938,
    regions: [4, 3, 2, 1, 5],
  },
];

// Region shapes extracted in each split map's native 875 x 875 coordinate space.
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
    5: "434,411 335,419 335,427 335,435 335,443 335,451 335,459 335,467 335,475 335,483 335,491 335,499 338,507 346,515 354,523 362,531 370,539 378,547 386,555 390,563 390,571 390,579 390,587 390,595 390,603 390,611 390,619 390,627 390,635 390,643 390,651 390,659 390,662 391,662 396,659 409,651 433,643 456,635 483,627 503,619 498,611 492,603 487,595 484,587 479,579 459,571 444,563 431,555 419,547 412,539 415,531 422,523 428,515 433,507 441,499 448,491 455,483 463,475 472,467 469,459 466,451 503,443 520,435 537,427 550,419 561,411",
  },
};

function SectorTag({ sector }) {
  const c = SECTOR_COLORS[sector] || SECTOR_COLORS["Other BPS"];
  return (
    <span style={{
      display: "inline-block", background: c.bg, color: c.text,
      padding: "3px 8px", borderRadius: "3px", fontSize: "10px",
      fontFamily: "Open Sans, sans-serif", fontWeight: 600,
      letterSpacing: "0.3px", whiteSpace: "nowrap",
      border: `1px solid ${c.text}22`,
    }}>{sector}</span>
  );
}

function OntarioReachMap({ children = null }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [expandedLocal, setExpandedLocal] = useState(null);
  const [mapLoadErrors, setMapLoadErrors] = useState({});
  const [regionData, setRegionData] = useState(LEGACY_REGION_DATA);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readyTimer = setTimeout(() => setReady(true), 80);

    fetch(DATA_CSV_PATH)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);
        return response.text();
      })
      .then((text) => setRegionData(buildRegionDataFromCsv(text)))
      .catch(() => {
        setRegionData(LEGACY_REGION_DATA);
      });

    return () => clearTimeout(readyTimer);
  }, []);

  const active = selectedRegion || hoveredRegion;

  return (
    <div style={{
      background: "#efefef",
      fontFamily: "'Oswald', sans-serif", color: "#243246",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "32px 32px 0", position: "relative", zIndex: 2,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(-12px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "11px", fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase", color: "#59677b", marginBottom: "10px",
          display: "flex", flexWrap: "wrap", gap: "8px",
        }}>
          <a
            href="https://ram4change.ca/blog"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#3f5f8f",
              textDecoration: "none",
              border: "1px solid #a2b1c3",
              borderRadius: "999px",
              padding: "5px 12px",
              background: "#f2f5f9",
            }}
          >
            RAM4CHANGE.CA
          </a>
          <a
            href="https://luma.com/ram4change"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#3f5f8f",
              textDecoration: "none",
              border: "1px solid #a2b1c3",
              borderRadius: "999px",
              padding: "5px 12px",
              background: "#f2f5f9",
            }}
          >
            RSVP TO A FUTURE TOWNHALL
          </a>
        </div>

        <h1 className="heroTitle" style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: "clamp(22px, 2.35vw, 28px)",
          color: "#1d3f6f",
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
          color: "#5d6b7d", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Three months ago, Ram designed and launched a virtual townhall series. His focus wasn't around traditional campaigning, but rather, to listen and hear directly from members across all regions - regardless of who they might support in this election.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "#5d6b7d", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Members from all 7 regions showed up. Corrections, healthcare, colleges, courts, child protection, developmental services, long-term care, universities, LCBO, and more - representing nearly every sector and division in the union.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "#5d6b7d", margin: "0 0 10px", lineHeight: 1.7, maxWidth: "980px",
        }}>
          Ram isn't arriving at Convention with a platform he wrote alone. He's building a member-driven mandate alongside OPSEU members - in real time.
        </p>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "13px",
          color: "#3f5f8f", margin: 0, lineHeight: 1.7, maxWidth: "980px", fontWeight: 600,
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
              background: "#efefef",
              border: "1px solid #d8e0e8",
              borderRadius: "12px",
              padding: "10px",
            }}>
              <svg viewBox={mapDef.viewBox} style={{
                width: "100%",
                maxHeight: "430px",
                borderRadius: "8px",
                display: "block",
              }}>
                <image
                  href={mapDef.image}
                  x="0"
                  y="0"
                  width={mapDef.width}
                  height={mapDef.height}
                  preserveAspectRatio="xMidYMid meet"
                  onError={() => {
                    setMapLoadErrors((prev) => ({ ...prev, [mapDef.id]: true }));
                  }}
                />

                {mapDef.regions.map((r) => {
                  const points = REGION_SHAPES_BY_MAP[mapDef.id][r];
                  const isActive = active === r;
                  const isSelected = selectedRegion === r;
                  const dimmed = active && !isActive;
                  const fillBase = isSelected
                    ? REGION_SELECTED_COLORS[r]
                    : isActive
                    ? REGION_HOVER_COLORS[r]
                    : REGION_BASE_COLORS[r];

                  return (
                    <polygon
                      key={`${mapDef.id}-${r}`}
                      points={points}
                      onMouseEnter={() => setHoveredRegion(r)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => {
                        setSelectedRegion(selectedRegion === r ? null : r);
                        setExpandedLocal(null);
                      }}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                      fill={
                        isSelected
                          ? hexToRgba(fillBase, 0.42)
                          : isActive
                          ? hexToRgba(fillBase, 0.24)
                          : active
                          ? "rgba(122, 145, 170, 0.08)"
                          : "rgba(0,0,0,0.001)"
                      }
                      stroke={
                        isSelected
                          ? "#ffffff"
                          : isActive
                          ? "#eef5ff"
                          : "transparent"
                      }
                      strokeWidth={isSelected ? 2.6 : isActive ? 1.6 : 0}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      opacity={dimmed ? 0.28 : 1}
                    />
                  );
                })}
              </svg>

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
          <div className="detailPanel" style={{
            background: "#ffffff", borderRadius: "12px",
            border: "1px solid #dbe1e8", padding: "24px",
            animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "auto", maxHeight: "540px",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <h2 style={{
                  fontFamily: "Oswald, sans-serif", fontSize: "22px", fontWeight: 700,
                  color: "#123757", margin: 0, lineHeight: 1,
                }}>Region {selectedRegion}</h2>
                <p style={{
                  fontFamily: "Open Sans, sans-serif", fontSize: "12px",
                  color: "#667a8d", margin: "4px 0 0",
                }}>{regionData[selectedRegion].subtitle}</p>
              </div>
              <button onClick={() => { setSelectedRegion(null); setExpandedLocal(null); }}
                style={{
                  background: "#f3f6fa", border: "1px solid #d6dde6",
                  color: "#586b7d", borderRadius: "4px", padding: "4px 10px",
                  fontFamily: "Open Sans", fontSize: "10px", cursor: "pointer",
                  fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                }}>Close</button>
            </div>

            {/* Sector diversity — the visual "heat" */}
            <div style={{
              fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: "#6f7f91", margin: "0 0 8px",
            }}>{regionData[selectedRegion].sectors.length} Sectors Represented</div>

            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
              {regionData[selectedRegion].sectors.map((s, i) => (
                <SectorTag key={i} sector={s} />
              ))}
            </div>

            <div style={{ height: "1px", background: "#e1e7ef", margin: "0 0 16px" }} />

            {/* Locals */}
            <div style={{
              fontFamily: "Oswald, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: "#6f7f91", margin: "0 0 10px",
            }}>{regionData[selectedRegion].locals.length} Locals in the Room</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {regionData[selectedRegion].locals.map((local, i) => {
                const sc = SECTOR_COLORS[local.sector] || SECTOR_COLORS["Other BPS"];
                const isExpanded = expandedLocal === i;
                return (
                  <div key={i}
                    onClick={(e) => { e.stopPropagation(); setExpandedLocal(isExpanded ? null : i); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "6px 10px", borderRadius: "5px",
                      background: isExpanded ? "#f5f8fc" : "transparent",
                      border: isExpanded ? "1px solid #dde5ee" : "1px solid transparent",
                      cursor: "pointer", transition: "all 0.2s ease",
                    }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: sc.text, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "Oswald, sans-serif", fontSize: "14px", fontWeight: 600,
                      color: "#3f5268", minWidth: "50px",
                    }}>L-{local.num}</span>
                    <span style={{
                      fontFamily: "Open Sans, sans-serif", fontSize: "11px",
                      color: "#6f7f91", flex: 1,
                    }}>{local.role}</span>
                    <span style={{
                      fontFamily: "Open Sans, sans-serif", fontSize: "9px",
                      color: sc.text, fontWeight: 600,
                    }}>{local.sector}</span>
                  </div>
                );
              })}
            </div>

            {/* Contextual insight */}
            <div style={{
              marginTop: "16px", padding: "12px",
              background: "#f5f9ff", borderRadius: "6px",
              border: "1px solid #dbe8f6",
            }}>
              <p style={{
                fontFamily: "Open Sans, sans-serif", fontSize: "11px",
                color: "#607286", margin: 0, lineHeight: 1.5,
              }}>
                {selectedRegion === 5
                  ? `Ram's home region — but the story is breadth, not base. ${regionData[5].sectors.length} different sectors from court clerks to corrections officers, college staff to water operations. This isn't a single-sector candidacy.`
                  : selectedRegion === 7
                  ? `From Thunder Bay to Kenora — the most geographically remote region in OPSEU. ${regionData[7].sectors.length} sectors represented, including corrections, MAG, natural resources, and healthcare. Distance didn't stop them.`
                  : selectedRegion === 6
                  ? `Northeastern Ontario — corrections, OPS, and child protection workers from Sudbury to Timmins are in these conversations. Northern members often feel furthest from leadership; they showed up anyway.`
                  : selectedRegion === 3
                  ? `Central Ontario's ${regionData[3].sectors.length} sectors include a heavy healthcare presence — hospital workers, lab techs, OTA/PTAs — alongside education and property assessment. These are the frontline workers carrying impossible caseloads.`
                  : selectedRegion === 4
                  ? `Eastern Ontario brought ${regionData[4].sectors.length} sectors to the table — including mental health workers and corrections officers who rarely get heard in the same room. Ottawa to Brockville, all present.`
                  : selectedRegion === 2
                  ? `The most sector-diverse region outside Toronto. ${regionData[2].sectors.length} sectors spanning PSWs, educators, social workers, CAS, and municipal workers. Hamilton to Niagara to Owen Sound — the broad middle of OPSEU, showing up.`
                  : `${regionData[selectedRegion].locals.length} locals spanning ${regionData[selectedRegion].sectors.length} sectors — different workplaces, different realities, same table.`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0 32px 24px", position: "relative", zIndex: 2 }}>
        <p style={{
          fontFamily: "Open Sans, sans-serif", fontSize: "10px",
          color: "#8a98a8", maxWidth: "420px", lineHeight: 1.5,
        }}>
          Pre-registration data, State of Our Union townhalls, Dec 2025 – Feb 2026. ram4change.ca
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

        @media (max-width: 980px) {
          .mainLayout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 780px) {
          .heroTitle {
            white-space: normal !important;
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
root.render(
  <OntarioReachMap>
    <div style={{
      background: "#ffffff",
      border: "1px solid #dbe1e8",
      borderRadius: "12px",
      padding: "16px",
      fontFamily: "Open Sans, sans-serif",
      color: "#5d6b7d",
      fontSize: "13px",
      lineHeight: 1.7,
    }}>
      Add your additional page copy here.
    </div>
  </OntarioReachMap>
);
