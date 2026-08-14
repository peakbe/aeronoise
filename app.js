// CONFIG
const AVWX_API_KEY = "ersegQzkf2Dfal-o26B4b5uzMrXBeHK2jOpOaY7nffc";
const AIRLABS_KEY = "04cb1c09-8abb-468a-95fa-ee90c3c2b651";

function buildMetarUrl(icao) {
  return `https://avwx.rest/api/metar/${icao}?token=${AVWX_API_KEY}&format=json`;
}

function buildAirlabsFlightsUrl(icao) {
  return `https://airlabs.co/api/v9/flights?api_key=${AIRLABS_KEY}&dep_icao=${icao}`;
}

function buildAirlabsArrivalsUrl(icao) {
  return `https://airlabs.co/api/v9/flights?api_key=${AIRLABS_KEY}&arr_icao=${icao}`;
}

function buildAirlabsSchedulesUrl(icao) {
  return `https://airlabs.co/api/v9/schedules?api_key=${AIRLABS_KEY}&dep_icao=${icao}`;
}

async function fetchFlightsAirlabs(icao) {
  const [liveDep, liveArr, schedDep] = await Promise.all([
    fetch(buildAirlabsFlightsUrl(icao)).then(r => r.json()).catch(() => null),
    fetch(buildAirlabsArrivalsUrl(icao)).then(r => r.json()).catch(() => null),
    fetch(buildAirlabsSchedulesUrl(icao)).then(r => r.json()).catch(() => null)
  ]);

  return {
    liveDep: liveDep?.response ?? [],
    liveArr: liveArr?.response ?? [],
    schedDep: schedDep?.response ?? []
  };
}

// DONNEES
const airports = {
  EBCI: {
    icao: "EBCI",
    name: "Charleroi",
    lat: 50.4592,
    lon: 4.4538,
    runways: [
      { name: "06", heading: 60 },
      { name: "24", heading: 240 }
    ]
  },
  EBLG: {
    icao: "EBLG",
    name: "Liège",
    lat: 50.6374,
    lon: 5.4432,
    runways: [
      { name: "04", heading: 40 },
      { name: "22", heading: 220 }
    ]
  }
};

const sonometersEBCI = [
  { id: "F101", address: "Rue Bruhaute 46, Jumet", latDMS: "50 26 52.37 N", lonDMS: "4 24 57.02 E" },
  { id: "F102", address: "Rue du Vigneron 5, Jumet", latDMS: "50 26 45.73 N", lonDMS: "4 25 22.56 E" },
  { id: "F103", address: "Rue Docteur Pircard 61, Jumet", latDMS: "50 27 8.59 N", lonDMS: "4 24 56.68 E" },
  { id: "F104", address: "Rue du Chiffon Rouge 12, Roux", latDMS: "50 26 32.42 N", lonDMS: "4 23 33.2 E" },
  { id: "F105", address: "Rue Sous le Bois 59, Roux", latDMS: "50 26 49.22 N", lonDMS: "4 24 1.86 E" },
  { id: "F106", address: "Rue Beaurin et Jonet 17, Wangenies", latDMS: "50 28 47.51 N", lonDMS: "4 31 10.46 E" },
  { id: "F107", address: "Rue Maximilien Wattelar 155, Jumet", latDMS: "50 26 38.66 N", lonDMS: "4 24 40.18 E" },
  { id: "F108", address: "Avenue Brunard 83, Fleurus", latDMS: "50 29 11.97 N", lonDMS: "4 32 46.61 E" },
  { id: "F109", address: "Chaussée de Charleroi 265, Sombreffe", latDMS: "50 29 25.27 N", lonDMS: "4 33 44.6 E" },
  { id: "F110", address: "Rue Émile Vandervelde 396, Forchies", latDMS: "50 25 24.85 N", lonDMS: "4 19 38.57 E" },
  { id: "F111", address: "Rue de la Baille 42, Courcelles", latDMS: "50 26 18.68 N", lonDMS: "4 21 7.47 E" },
  { id: "F112", address: "Rue des Liserons 44, Goutroux", latDMS: "50 25 28.75 N", lonDMS: "4 21 27.75 E" },
  { id: "F114", address: "Rue de la source, Anderlues", latDMS: "50 24 35.39 N", lonDMS: "4 16 37.8 E" },
  { id: "F116", address: "Rue de l'Enseignement 144, Fontaine-l'Evêque", latDMS: "50 24 38.28 N", lonDMS: "4 18 54.19 E" },
  { id: "F117", address: "Rue du Terril 1, Forchies", latDMS: "50 25 53.4 N", lonDMS: "4 18 53.71 E" },
  { id: "F118", address: "Rue Piconette1 , Sombreffe", latDMS: "50 30 18.96 N", lonDMS: "4 36 40.25 E" },
  { id: "F119", address: "Rue René Delhaize 39, Ransart", latDMS: "50 27 47.57 N", lonDMS: "4 28 44.73 E" }
];

const sonometersEBLG = [
  { id: "F001", address: "Rue Franquet 15, Houtain", latDMS: "50 44 16.96 N", lonDMS: "5 36 31.8 E" },
  { id: "F002", address: "Rue Noiset 23, St Georges", latDMS: "50 35 18.29 N", lonDMS: "5 22 13.88 E" },
  { id: "F003", address: "Rue Fond Méan 7, St Georges", latDMS: "50 36 4.2 N", lonDMS: "5 22 53.04 E" },
  { id: "F004", address: "Vinâve des Stréats 32, Verlaine", latDMS: "50 36 19.49 N", lonDMS: "5 19 17.06 E" },
  { id: "F005", address: "Rue Caquin 4, Haneffe", latDMS: "50 38 21.59 N", lonDMS: "5 19 24.67 E" },
  { id: "F006", address: "Rue Bolly Chapon 11, Seraing", latDMS: "50 36 34.54 N", lonDMS: "5 16 17.05 E" },
  { id: "F007", address: "Rue Yernawe 13, St Georges", latDMS: "50 35 26.72 N", lonDMS: "5 20 42.81 E" },
  { id: "F008", address: "Rue Warfusée 5, St Georges", latDMS: "50 35 41.56 N", lonDMS: "5 21 32.22 E" },
  { id: "F009", address: "Bibliothèque Communale, Place Verte, 4470 Stockay", latDMS: "50 34 50.99 N", lonDMS: "5 21 19.5 E" },
  { id: "F010", address: "Rue Haute Voie 23, Verlaine", latDMS: "50 35 57.81 N", lonDMS: "5 18 48.57 E" },
  { id: "F011", address: "Rue Albert 1er 18, St Georges", latDMS: "50 36 4.11 N", lonDMS: "5 21 21.62 E" },
  { id: "F012", address: "Rue Barbe d'Or 13, 4317 Aineffe", latDMS: "50 37 18.9 N", lonDMS: "5 15 17.09 E" },
  { id: "F013", address: "Rue Bois Léon 31, Verlaine", latDMS: "50 35 12.89 N", lonDMS: "5 18 31.24 E" },
  { id: "F014", address: "Rue Léon Labaye 12, Juprelle", latDMS: "50 43 8.02 N", lonDMS: "5 34 23.39 E" },
  { id: "F015", address: "Rue du Brouck 5, Juprelle", latDMS: "50 41 19.82 N", lonDMS: "5 31 34.38 E" },
  { id: "F016", address: "Rue de Chapon-Seraing 14, Verlaine", latDMS: "50 37 10.62 N", lonDMS: "5 17 43.24 E" },
  { id: "F017", address: "Rue de la Pommeraie 1, 4690 Wonck", latDMS: "50 45 53.58 N", lonDMS: "5 37 50.18 E" }
];

/********** FIXES AIP – À REMPLACER PAR LES VRAIES COORDONNÉES **********/
const AIP_FIXES = {
  BUB: { lat: 50.900000, lon: 4.533000 },
  CIV: { lat: 50.575000, lon: 4.350000 },
  SPI: { lat: 50.483000, lon: 5.000000 },
  LNO: { lat: 50.750000, lon: 5.333000 },
  LGE: { lat: 50.650000, lon: 5.467000 }
};

const PROCEDURES_AIP = {
  EBCI: [
    { name: "SID 24 BUB", runway: "24", mode: "DEP", fixes: ["CIV", "BUB"] },
    { name: "SID 24 SPI", runway: "24", mode: "DEP", fixes: ["CIV", "SPI"] },
    { name: "STAR 06 LNO", runway: "06", mode: "ARR", fixes: ["LNO", "CIV"] }
  ],
  EBLG: [
    { name: "SID 22 LNO", runway: "22", mode: "DEP", fixes: ["LGE", "LNO"] },
    { name: "STAR 04 SPI", runway: "04", mode: "ARR", fixes: ["SPI", "LGE"] }
  ]
};

const PROCEDURES = { EBCI: [], EBLG: [] };

/********** PROFILS COULOIR – AVANCÉS **********/
const CORRIDOR_PROFILES = {
  pax: { wStartKm: 1.0, wEndKm: 3.0 },
  cargo: { wStartKm: 1.5, wEndKm: 4.5 },
  heavy: { wStartKm: 2.0, wEndKm: 5.0 },
  quiet: { wStartKm: 0.8, wEndKm: 2.2 },
  noisy: { wStartKm: 1.8, wEndKm: 4.8 },
  default: { wStartKm: 1.0, wEndKm: 3.0 }
};

const MTOW_BY_TYPE = {
  B738: 79015,
  B737: 70000,
  A320: 77000,
  A321: 93000,
  B744: 396000,
  B748: 447700,
  B763: 186880,
  B763F: 186880,
  B772: 297550,
  B773: 351500,
  A332: 233000,
  A333: 242000,
  A359: 280000,
  A388: 575000
};

const NOISE_CHAPTER_BY_TYPE = {
  B732: "3",
  B733: "3",
  B734: "3",
  B735: "3",
  B738: "4",
  A320: "4",
  A321: "4",
  B744: "4",
  B748: "14",
  A359: "14",
  A388: "14"
};

const AIRLINE_PROFILE = {
  ASL: "cargo",
  TNT: "cargo",
  FX: "cargo",
  "5X": "cargo",
  LH: "pax",
  SN: "pax",
  FR: "pax",
  RYR: "pax"
};

function classifyAircraftBasic(icaoType) {
  if (!icaoType) return "default";
  const t = icaoType.toUpperCase();
  if (t.endsWith("F")) return "cargo";
  if (["B744", "B748", "B773", "B772", "A332", "A333", "A359", "A388"].includes(t))
    return "heavy";
  return "pax";
}

function getMtow(icaoType) {
  if (!icaoType) return null;
  return MTOW_BY_TYPE[icaoType.toUpperCase()] ?? null;
}

function getNoiseChapter(icaoType) {
  if (!icaoType) return null;
  return NOISE_CHAPTER_BY_TYPE[icaoType.toUpperCase()] ?? null;
}

function getAirlineProfile(flight) {
  const iata = (flight.airline_iata || "").toUpperCase();
  const icao = (flight.airline_icao || "").toUpperCase();
  const name = (flight.airline_name || "").toUpperCase();

  const keys = [iata, icao, name.split(" ")[0] || ""].filter(Boolean);

  for (const k of keys) {
    if (AIRLINE_PROFILE[k]) return AIRLINE_PROFILE[k];
  }
  return null;
}

function getCorridorProfileForFlight(flight) {
  const acType = (flight.aircraft_icao || flight.aircraft_iata || "").toUpperCase();

  const airlineProfile = getAirlineProfile(flight);
  if (airlineProfile === "cargo") {
    return CORRIDOR_PROFILES.cargo;
  }

  const chapter = getNoiseChapter(acType);
  if (chapter === "14") return CORRIDOR_PROFILES.quiet;
  if (chapter === "3") return CORRIDOR_PROFILES.noisy;

  const mtow = getMtow(acType);
  if (mtow != null) {
    if (mtow >= 250000) return CORRIDOR_PROFILES.heavy;
    if (mtow >= 120000) return CORRIDOR_PROFILES.cargo;
  }

  const basic = classifyAircraftBasic(acType);
  return CORRIDOR_PROFILES[basic] || CORRIDOR_PROFILES.default;
}

const windCache = {
  EBCI: { dir: null, speed: null },
  EBLG: { dir: null, speed: null }
};

function getCrosswindSide(runwayHeading, windDir) {
  if (windDir == null || isNaN(windDir)) return 0;
  const diff = ((windDir - runwayHeading + 540) % 360) - 180;
  if (Math.abs(diff) < 20) return 0;
  return diff > 0 ? +1 : -1;
}

// OUTILS
function dmsToDecimal(dmsStr) {
  const parts = dmsStr.trim().split(/\s+/);
  const deg = parseFloat(parts[0]);
  const min = parseFloat(parts[1]);
  const sec = parseFloat(parts[2]);
  const hemi = parts[3].toUpperCase();
  let dec = deg + min / 60 + sec / 3600;
  if (hemi === "S" || hemi === "W") dec = -dec;
  return dec;
}

function angleDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// vent de travers
function calculateWindComponents(runwayHeading, windDirection, windSpeed) {
  if (windDirection == null || windSpeed == null) {
    return null;
  }

  const angle = (windDirection - runwayHeading) * Math.PI / 180;

  const headwind = Math.round(Math.cos(angle) * windSpeed);
  const crosswind = Math.round(Math.abs(Math.sin(angle) * windSpeed));

  return {
    headwind,
    crosswind
  };
}

function computeTurnPoint(lat, lon, headingDeg, distanceKm) {
  const R = 6371;
  const d = distanceKm / R;
  const brng = (headingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lon * Math.PI) / 180;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(d) +
    Math.cos(φ1) * Math.sin(d) * Math.cos(brng)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(φ1),
      Math.cos(d) - Math.sin(φ1) * Math.sin(φ2)
    );

  return {
    lat: (φ2 * 180) / Math.PI,
    lon: (λ2 * 180) / Math.PI
  };
}

function projectLocal(lat0, lon0, lat, lon) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const x = R * toRad(lon - lon0) * Math.cos(toRad(lat0));
  const y = R * toRad(lat - lat0);
  return { x, y };
}

function unprojectLocal(lat0, lon0, x, y) {
  const R = 6371000;
  const toDeg = r => (r * 180) / Math.PI;
  const lat = lat0 + toDeg(y / R);
  const lon = lon0 + toDeg(x / (R * Math.cos((lat0 * Math.PI) / 180)));
  return { lat, lon };
}

function distancePointToSegmentMetersLocal(P, A, B) {
  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const APx = P.x - A.x;
  const APy = P.y - A.y;
  const ab2 = ABx * ABx + ABy * ABy;
  let t = 0;
  if (ab2 > 0) {
    t = (APx * ABx + APy * ABy) / ab2;
    t = Math.max(0, Math.min(1, t));
  }
  const Cx = A.x + t * ABx;
  const Cy = A.y + t * ABy;
  const dx = P.x - Cx;
  const dy = P.y - Cy;
  return { dist: Math.sqrt(dx * dx + dy * dy), t };
}

// CARTE
const map = L.map("map").setView([50.55, 5.0], 9);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const airportMarkers = {};
const sonometerMarkers = { EBCI: [], EBLG: [] };
const corridorLayers = { EBCI: null, EBLG: null };
const zoneLayers = { EBLG_04: null, EBLG_22: null };
const sidStarLayers = { EBCI: [], EBLG: [] };

const airportStyle = { radius: 7, color: "#065f46", fillColor: "#10b981", fillOpacity: 0.9 };
const sonometerNormalStyle = { radius: 5, color: "#1d4ed8", fillColor: "#2563eb", fillOpacity: 0.9 };
const sonometerImpactedStyle = { radius: 6, color: "#7f1d1d", fillColor: "#b91c1c", fillOpacity: 0.95 };
const sonometerGreenStyle = { radius: 6, color: "#166534", fillColor: "#22c55e", fillOpacity: 0.95 };

Object.values(airports).forEach(ap => {
  const m = L.circleMarker([ap.lat, ap.lon], airportStyle)
    .addTo(map)
    .bindPopup(`<strong>${ap.icao} – ${ap.name}</strong>`);
  airportMarkers[ap.icao] = m;
});

function addSonometers(list, airportKey) {
  list.forEach(s => {
    const lat = dmsToDecimal(s.latDMS);
    const lon = dmsToDecimal(s.lonDMS);
    const marker = L.circleMarker([lat, lon], sonometerNormalStyle)
      .addTo(map)
      .bindPopup(`<strong>${s.id}</strong><br>${s.address}<br><span class="small">${airportKey}</span>`);
    sonometerMarkers[airportKey].push({ ...s, lat, lon, marker });
  });
}

addSonometers(sonometersEBCI, "EBCI");
addSonometers(sonometersEBLG, "EBLG");

function resetMapView() {
  const group = [];

  Object.values(airportMarkers).forEach(marker => {
    group.push(marker.getLatLng());
  });

  ["EBCI", "EBLG"].forEach(key => {
    sonometerMarkers[key].forEach(s => {
      group.push([s.lat, s.lon]);
    });
  });

  map.fitBounds(group, {
    padding: [30, 30]
  });
}

const DISPLAY_RULES = {
  EBLG: {
    "22": {
      green: [
        "F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008",
        "F009", "F010", "F011", "F012", "F013", "F014", "F015", "F016", "F017"
      ],
      red: []
    },
    "04": {
      green: [
        "F001", "F002", "F003", "F007", "F008",
        "F009", "F011", "F013", "F014", "F015"
      ],
      red: [
        "F004", "F005", "F006",
        "F010", "F012", "F016", "F017"
      ]
    }
  },
  EBCI: {
    "24": {
      green: [
        "F101", "F102", "F103", "F104", "F105", "F106", "F107",
        "F108", "F109", "F110", "F111", "F112",
        "F114", "F116", "F117", "F118", "F119"
      ],
      red: []
    },
    "06": {
      green: [
        "F101", "F102", "F103", "F104", "F105", "F106", "F107",
        "F108", "F109", "F110", "F111", "F112", "F119"
      ],
      red: [
        "F114", "F116", "F117", "F118"
      ]
    }
  }
};

function applyDisplayRules(airportKey, runwayName) {
  const rules = DISPLAY_RULES?.[airportKey]?.[runwayName];
  if (!rules) return;
  sonometerMarkers[airportKey].forEach(s => {
    if (rules.green.includes(s.id)) {
      s.marker.setStyle(sonometerGreenStyle);
    } else if (rules.red.includes(s.id)) {
      s.marker.setStyle(sonometerImpactedStyle);
    } else {
      s.marker.setStyle(sonometerNormalStyle);
    }
  });
}

function buildEBLGZones() {
  const ap = airports.EBLG;

  const zone04 = [
    [ap.lat, ap.lon],
    [ap.lat + 0.12, ap.lon + 0.25],
    [ap.lat + 0.05, ap.lon + 0.35],
    [ap.lat - 0.02, ap.lon + 0.25]
  ];

  const zone22 = [
    [ap.lat, ap.lon],
    [ap.lat - 0.12, ap.lon - 0.25],
    [ap.lat - 0.05, ap.lon - 0.35],
    [ap.lat + 0.02, ap.lon - 0.25]
  ];

  if (zoneLayers.EBLG_04) map.removeLayer(zoneLayers.EBLG_04);
  if (zoneLayers.EBLG_22) map.removeLayer(zoneLayers.EBLG_22);

  zoneLayers.EBLG_04 = L.polygon(zone04, {
    color: "#22c55e",
    weight: 1,
    fillColor: "#22c55e",
    fillOpacity: 0.08
  }).addTo(map).bindPopup("Zone piste 04 (EBLG)");

  zoneLayers.EBLG_22 = L.polygon(zone22, {
    color: "#f97316",
    weight: 1,
    fillColor: "#f97316",
    fillOpacity: 0.08
  }).addTo(map).bindPopup("Zone piste 22 (EBLG)");
}

buildEBLGZones();

function buildProceduresFromAIP() {
  ["EBCI", "EBLG"].forEach(icao => {
    PROCEDURES[icao] = (PROCEDURES_AIP[icao] || []).map(p => {
      const points = [];
      if (p.mode === "DEP") {
        points.push({ lat: airports[icao].lat, lon: airports[icao].lon });
      }
      p.fixes.forEach(code => {
        const fx = AIP_FIXES[code];
        if (fx) points.push({ lat: fx.lat, lon: fx.lon });
      });
      if (p.mode === "ARR") {
        points.push({ lat: airports[icao].lat, lon: airports[icao].lon });
      }
      return { ...p, points };
    });
  });
}

setTimeout(() => {
  resetMapView();
}, 500);

function buildSidStar() {
  buildProceduresFromAIP();

  sidStarLayers.EBCI.forEach(l => map.removeLayer(l.layer || l));
  sidStarLayers.EBLG.forEach(l => map.removeLayer(l.layer || l));
  sidStarLayers.EBCI = [];
  sidStarLayers.EBLG = [];

  ["EBCI", "EBLG"].forEach(icao => {
    (PROCEDURES[icao] || []).forEach(proc => {
      const latlngs = proc.points.map(p => [p.lat, p.lon]);
      const layer = L.polyline(latlngs, {
        color: "#6366f1",
        weight: 2,
        dashArray: "4,4",
        opacity: 0.0
      }).addTo(map).bindPopup(`${icao} – ${proc.name}`);
      sidStarLayers[icao].push({ proc, layer });
    });
  });
}

buildSidStar();

function activateSidStar(airportKey, runwayName, mode) {
  sidStarLayers[airportKey].forEach(obj => {
    obj.layer.setStyle({ opacity: 0.0, weight: 2 });
  });

  sidStarLayers[airportKey].forEach(obj => {
    if (obj.proc.runway === runwayName && obj.proc.mode === mode) {
      obj.layer.setStyle({ opacity: 1.0, weight: 3 });
    }
  });
}

// API
async function fetchMetar(icao) {
  const url = buildMetarUrl(icao);
  const res = await fetch(url);
  if (!res.ok) throw new Error("METAR error " + icao);
  return res.json();
}

function updateWindRose(airportKey, windDir, windSpeed) {
  const arrow = document.getElementById(
    airportKey === "EBCI" ? "wind-arrow-ebci" : "wind-arrow-eblg"
  );

  const info = document.getElementById(
    airportKey === "EBCI" ? "wind-info-ebci" : "wind-info-eblg"
  );

  if (!arrow || !info) {
    return;
  }

  arrow.style.transform =
    `translate(-50%, -50%) rotate(${windDir || 0}deg)`;

  info.textContent =
    `Vent : ${windDir ?? "--"}° / ${windSpeed ?? "--"} kt`;
}

function updateWeatherDetails(airportKey, metar) {
  const el = document.getElementById(
    airportKey === "EBCI"
      ? "meteo-details-ebci"
      : "meteo-details-eblg"
  );

  if (!el) return;

  const temp = metar?.temperature?.value ?? metar?.temperature?.celsius;
  const dew = metar?.dewpoint?.value ?? metar?.dewpoint?.celsius;
  const qnh = metar?.altimeter?.value ?? metar?.qnh?.hpa;
  const trend = metar?.remarks ?? "Aucune";

  const windDir = metar?.wind_direction?.value ?? metar?.wind?.direction?.degrees;
  const windSpeed = metar?.wind_speed?.value ?? metar?.wind?.speed_kt;
  const windSpeedMs = windSpeed != null ? (windSpeed * 0.514444).toFixed(1) : null;

  const airport = airports[airportKey];
  const runway = estimateRunwayFromWind(airport, windDir);

  let runwayInfo = "";

  if (runway) {
    const comp = calculateWindComponents(runway.heading, windDir, windSpeed);
    if (comp) {
      runwayInfo = `
        <br>🛬 Piste estimée : RWY ${runway.name}
        <br>💨 Vent : ${windSpeed ?? "--"} kt (${windSpeedMs ?? "--"} m/s)
        ${windGust != null ? `<br>🌬 Rafales : ${windGust} kt (${windGustMs} m/s)` : ""}
        <br>↕ Vent de face (rafales) : ${comp.headwind + (windGust - windSpeed)} kt
        <br>↔ Vent de travers : ${comp.crosswind} kt
        <br>↕ Vent de face : ${comp.headwind} kt
      `;
    }
  }

  el.innerHTML = `
    <strong>Conditions actuelles</strong>
    <br>🌡 Température : ${temp ?? "--"} °C
    <br>💧 Point de rosée : ${dew ?? "--"} °C
    <br>📈 QNH : ${qnh ?? "--"} hPa
    ${runwayInfo}
    <br>📝 Tendance : ${trend}
  `;
}

function updateMetarUI(airportKey, metar) {
  const idSummary = airportKey === "EBCI" ? "meteo-ebci-summary" : "meteo-eblg-summary";
  const idRaw = airportKey === "EBCI" ? "meteo-ebci-raw" : "meteo-eblg-raw";
  const elSummary = document.getElementById(idSummary);
  const elRaw = document.getElementById(idRaw);

  if (!elSummary || !elRaw) {
    return;
  }

  const windDir = metar?.wind_direction?.value ?? metar?.wind?.direction?.degrees ?? null;
  const windSpeed = metar?.wind_speed?.value ?? metar?.wind?.speed_kt ?? null;
  const windSpeedMs =
    windSpeed != null
      ? (windSpeed * 0.514444).toFixed(1)
      : null;

  const windGust =
  metar?.wind_gust?.value ??
  metar?.wind?.gust_kt ??
  null;

const windGustMs =
  windGust != null
    ? (windGust * 0.514444).toFixed(1)
    : null;

  const temp = metar?.temperature?.value ?? metar?.temperature?.celsius ?? null;
  const qnh = metar?.altimeter?.value ?? metar?.qnh?.hpa ?? null;

    elSummary.textContent =
  `Vent: ${windDir != null ? windDir + "°" : "n/a"} | ` +
  `${windSpeedMs != null ? windSpeedMs + " m/s" : "n/a"} | ` +
  `Rafales: ${windGust != null ? windGust + " kt (" + windGustMs + " m/s)" : "n/a"} | ` +
  `T: ${temp != null ? temp + "°C" : "n/a"} | ` +
  `QNH: ${qnh != null ? qnh + " hPa" : "n/a"}`;


  elRaw.textContent = metar?.raw ?? metar?.raw_text ?? "(METAR brut non disponible)";

  if (airportKey === "EBCI") {
    windCache.EBCI.dir = windDir;
    windCache.EBCI.speed = windSpeed;
    updateWindRose(airportKey, windDir, windSpeed);
    updateWeatherDetails(airportKey, metar);
    
  } else {
    windCache.EBLG.dir = windDir;
    windCache.EBLG.speed = windSpeed;
    updateWindRose(airportKey, windDir, windSpeed);
    updateWeatherDetails(airportKey, metar);
  }
}

function estimateRunwayFromWind(airport, windDirDeg) {
  if (windDirDeg == null || isNaN(windDirDeg)) return null;
  let best = null, bestDiff = 999;
  airport.runways.forEach(rw => {
    const diff = angleDiff(windDirDeg, rw.heading);
    if (diff < bestDiff) { bestDiff = diff; best = rw; }
  });
  return best;
}

// FILTRES
function filterFlightsAirlabsForNoise(airportKey, flights) {
  return [
    ...flights.liveDep.map(f => ({ ...f, _kind: "liveDep" })),
    ...flights.liveArr.map(f => ({ ...f, _kind: "liveArr" })),
    ...flights.schedDep.map(f => ({ ...f, _kind: "schedDep" }))
  ].filter(Boolean);
}

function extractRunwayFromAirlabs(airportKey, flights) {
  const ap = airports[airportKey];
  const filtered = filterFlightsAirlabsForNoise(airportKey, flights);

  const withRunway = filtered.find(f => f.runway);
  if (withRunway) {
    const runwayName = String(withRunway.runway).trim();
    const rw = ap.runways.find(r => runwayName.includes(r.name));
    if (rw) return { runway: rw, flightsFiltered: filtered };
  }

  const withDir = filtered.find(f => f.dir);
  if (withDir) {
    const heading = parseInt(withDir.dir, 10);
    if (!isNaN(heading)) {
      let best = null, bestDiff = 999;
      ap.runways.forEach(rw => {
        const diff = angleDiff(heading, rw.heading);
        if (diff < bestDiff) { bestDiff = diff; best = rw; }
      });
      if (best) return { runway: best, flightsFiltered: filtered };
    }
  }

  return { runway: null, flightsFiltered: filtered };
}

function formatTime(t) {
  if (!t) return "";
  const d = new Date(t);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().substring(11, 16);
}

const flightIndex = { EBCI: {}, EBLG: {} };

function updateFlightsUI(airportKey, flights) {
  const id = airportKey === "EBCI" ? "flights-ebci" : "flights-eblg";
  const el = document.getElementById(id);
  if (!el) return;

  const filtered = filterFlightsAirlabsForNoise(airportKey, flights);
  if (!filtered.length) {
    el.textContent = "Aucun vol disponible.";
    return;
  }

  const lines = filtered.slice(0, 10).map(f => {
    const num = f.flight_iata || f.flight_icao || f.flight_number || "?";
    const ac = f.aircraft_icao || f.aircraft_iata || "?";
    const kind = f._kind === "liveArr" ? "ARR" : "DEP";
    const rw = f.runway ? `RWY ${f.runway}` : "";
    const schedDep = formatTime(f.dep_time || f.dep_time_utc);
    const actDep = formatTime(f.dep_actual);
    const estDep = formatTime(f.dep_estimated);
    const schedArr = formatTime(f.arr_time || f.arr_time_utc);
    const actArr = formatTime(f.arr_actual);
    const estArr = formatTime(f.arr_estimated);

    let timeStr = "";
    if (kind === "DEP") {
      timeStr =
        `STD ${schedDep || "?"} / ` +
        `ETD ${estDep || "-"} / ` +
        `ATD ${actDep || "-"}`;
    } else {
      timeStr =
        `STA ${schedArr || "?"} / ` +
        `ETA ${estArr || "-"} / ` +
        `ATA ${actArr || "-"}`;
    }

    const key = (f.flight_iata || f.flight_icao || f.flight_number || "?") + "-" + airportKey;

    return `<div class="flight-row"
              data-airport="${airportKey}"
              data-key="${key}"
              data-kind="${kind}">
              ${kind} ${num} (${ac}) ${rw} – ${timeStr}
            </div>`;
  });

  el.innerHTML = lines.join("") +
    (filtered.length > 10 ? `<br>… (+${filtered.length - 10} vols)` : "");
}

const FIXED_RULES_EBLG = {
  "DEP-22": [
    "F002", "F003", "F004", "F005", "F006", "F007", "F008", "F009",
    "F010", "F011", "F012", "F013", "F016"
  ],
  "ARR-04": [
    "F002", "F003", "F007", "F008", "F009", "F011", "F013"
  ],
  "DEP-04": ["F001", "F014", "F015a", "F015b"],
  "ARR-22": ["F001", "F014", "F015a", "F015b", "F017"]
};

function getFixedRuleImpactsEBLG(runwayName, mode) {
  const key = `${mode}-${runwayName}`;
  return FIXED_RULES_EBLG[key] || null;
}

const FIXED_RULES_EBCI = {
  "DEP-24": [
    "F101", "F102", "F103", "F104", "F105", "F107",
    "F110", "F111", "F112", "F114", "F116", "F117"
  ],
  "ARR-06": [
    "F101", "F102", "F103", "F104", "F105", "F107",
    "F110", "F111", "F112"
  ],
  "DEP-06": [
    "F106", "F108", "F109", "F119"
  ],
  "ARR-24": [
    "F106", "F108", "F109", "F118", "F119"
  ]
};

function getFixedRuleImpactsEBCI(runwayName, mode) {
  const key = `${mode}-${runwayName}`;
  return FIXED_RULES_EBCI[key] || null;
}

function buildNoiseCorridorPolygon(airportKey, runwayHeading) {
  const ap = airports[airportKey];
  const lengthKm = 20;
  const profile = CORRIDOR_PROFILES.default;
  const wStartKm = profile.wStartKm;
  const wEndKm = profile.wEndKm;

  const start = { lat: ap.lat, lon: ap.lon };
  const end = computeTurnPoint(ap.lat, ap.lon, runwayHeading, lengthKm);

  const lat0 = (start.lat + end.lat) / 2;
  const lon0 = (start.lon + end.lon) / 2;

  const A = projectLocal(lat0, lon0, start.lat, start.lon);
  const B = projectLocal(lat0, lon0, end.lat, end.lon);

  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const len = Math.sqrt(ABx * ABx + ABy * ABy);
  if (len === 0) return null;

  const ux = ABx / len;
  const uy = ABy / len;
  const vx = -uy;
  const vy = ux;

  const wStart = (wStartKm * 1000) / 2;
  const wEnd = (wEndKm * 1000) / 2;

  const leftStart = { x: A.x + vx * wStart, y: A.y + vy * wStart };
  const rightStart = { x: A.x - vx * wStart, y: A.y - vy * wStart };
  const leftEnd = { x: B.x + vx * wEnd, y: B.y + vy * wEnd };
  const rightEnd = { x: B.x - vx * wEnd, y: B.y - vy * wEnd };

  const p1 = unprojectLocal(lat0, lon0, leftStart.x, leftStart.y);
  const p2 = unprojectLocal(lat0, lon0, leftEnd.x, leftEnd.y);
  const p3 = unprojectLocal(lat0, lon0, rightEnd.x, rightEnd.y);
  const p4 = unprojectLocal(lat0, lon0, rightStart.x, rightStart.y);

  return {
    polygonLatLngs: [
      [p1.lat, p1.lon],
      [p2.lat, p2.lon],
      [p3.lat, p3.lon],
      [p4.lat, p4.lon]
    ],
    local: { A, B, lat0, lon0, wStart, wEnd }
  };
}

function computeImpactedSonometersCorridor(airportKey, runwayHeading) {
  const list = sonometerMarkers[airportKey];

  const corridor = buildNoiseCorridorPolygon(airportKey, runwayHeading);
  if (!corridor) return [];

  if (corridorLayers[airportKey]) {
    map.removeLayer(corridorLayers[airportKey]);
  }
  const poly = L.polygon(corridor.polygonLatLngs, {
    color: "#f97316",
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.15
  }).addTo(map);
  corridorLayers[airportKey] = poly;

  const { A, B, lat0, lon0, wStart, wEnd } = corridor.local;
  const impacted = [];

  list.forEach(s => {
    const P = projectLocal(lat0, lon0, s.lat, s.lon);
    const { dist, t } = distancePointToSegmentMetersLocal(P, A, B);
    const widthLocal = wStart + (wEnd - wStart) * t;
    const isImpacted = dist <= widthLocal;
    if (isImpacted) impacted.push({ ...s, distance_m: dist });
    s.marker.setStyle(isImpacted ? sonometerImpactedStyle : sonometerNormalStyle);
  });

  impacted.sort((a, b) => a.distance_m - b.distance_m);
  return impacted;
}

function updateRunwayUI(airportKey, runway, windDir, windSpeed, source, flightsCount) {
  const id = airportKey === "EBCI" ? "runway-ebci" : "runway-eblg";
  const el = document.getElementById(id);
  if (!el) return;

  if (!runway) {
    el.textContent =
      `Vent ${windDir != null ? windDir + "°" : "n/a"} – piste non déterminée (vols filtrés: ${flightsCount}).`;
    return;
  }
  el.textContent =
    `Vent ${windDir != null ? windDir + "°" : "n/a"} / ${windSpeed ?? "?"} kt – ` +
    `piste ${runway.name} (cap ~${runway.heading}°) [${source}, vols filtrés: ${flightsCount}].`;
}

function updateImpactedListUI(airportKey, impacted, runway, usedFixedRule = false) {
  const containerId = airportKey === "EBCI" ? "list-ebci" : "list-eblg";
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!runway) {
    container.textContent = "Piste non déterminée (vent calme / données manquantes).";
    return;
  }

  if (impacted.length === 0) {
    container.textContent = `Aucun sonomètre dans le couloir (piste ${runway.name}).`;
    return;
  }

  if (usedFixedRule) {
    container.innerHTML =
      `Piste : <strong>${runway.name}</strong> (règles fixes)<br>` +
      impacted
        .map(s =>
          `<span class="tag impacted">${s.id}</span> ` +
          `<span class="small">${s.address}</span>`
        )
        .join("<br>");
    return;
  }

  container.innerHTML =
    `Piste : <strong>${runway.name}</strong> (trapèze 20 km, largeur dynamique)<br>` +
    impacted
      .map(s =>
        `<span style="
          background:#b91c1c;
          color:white;
          padding:2px 6px;
          border-radius:12px;">
          ${s.id}
        </span>
        <span class="small">${s.address} – ${s.distance_m.toFixed(0)} m du couloir</span>`
      )
      .join("<br>");
}

// TIMELINE & FLIGHTS

let timelineFlights = [];
let timelineTimer = null;
let timelineCurrent = 0;

const flightMarkers = {};

function buildSegmentsFromPoints(points) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const d = L.latLng(a.lat, a.lon).distanceTo([b.lat, b.lon]);
    segs.push({ a, b, len: d });
    total += d;
  }
  return { segments: segs, totalLen: total };
}

function getProcedureForFlight(airportKey, runwayName, mode) {
  const list = PROCEDURES[airportKey] || [];
  return list.find(p => p.runway === runwayName && p.mode === mode) || null;
}

function ensureFlightMarker(fKey, proc, mode) {
  if (flightMarkers[fKey]) return flightMarkers[fKey];

  const { segments, totalLen } = buildSegmentsFromPoints(proc.points);
  const start = proc.points[0];

  const color = mode === "ARR" ? "#0ea5e9" : "#f97316";

  const marker = L.circleMarker([start.lat, start.lon], {
    radius: 6,
    color: "#111827",
    fillColor: color,
    fillOpacity: 0.95
  }).addTo(map);

  flightMarkers[fKey] = { marker, proc, segments, totalLen, mode };
  return flightMarkers[fKey];
}

function positionAlongProcedure(obj, ratio) {
  const { segments, totalLen } = obj;
  const targetDist = totalLen * ratio;
  let acc = 0;
  for (const s of segments) {
    if (acc + s.len >= targetDist) {
      const remain = targetDist - acc;
      const t = s.len > 0 ? remain / s.len : 0;
      const lat = s.a.lat + (s.b.lat - s.a.lat) * t;
      const lon = s.a.lon + (s.b.lon - s.a.lon) * t;
      return { lat, lon };
    }
    acc += s.len;
  }
  const last = segments[segments.length - 1].b;
  return { lat: last.lat, lon: last.lon };
}

function prepareTimelineFlights(airportKey, flights, runway, mode) {
  const filtered = filterFlightsAirlabsForNoise(airportKey, flights);

  const mapped = filtered.map(f => {
    const dep = f.dep_actual || f.dep_estimated || f.dep_time || f.dep_time_utc;
    const arr = f.arr_actual || f.arr_estimated || f.arr_time || f.arr_time_utc;

    function toMinutes(t) {
      if (!t) return null;
      const d = new Date(t);
      if (isNaN(d.getTime())) return null;
      return d.getUTCHours() * 60 + d.getUTCMinutes();
    }

    return {
      airportKey,
      flight: f,
      depMin: toMinutes(dep),
      arrMin: toMinutes(arr),
      runwayName: runway ? runway.name : (f.runway ? String(f.runway) : null),
      mode
    };
  });

  flightIndex[airportKey] = flightIndex[airportKey] || {};
  mapped.forEach(fm => {
    const f = fm.flight;
    const key =
      (f.flight_iata || f.flight_icao || f.flight_number || "?") +
      "-" + airportKey;
    flightIndex[airportKey][key] = fm;
  });

  timelineFlights = timelineFlights.concat(mapped);
}

function updateTimelineUI(minute) {
  const hh = String(Math.floor(minute / 60)).padStart(2, "0");
  const mm = String(minute % 60).padStart(2, "0");
  document.getElementById("timeline-label").textContent = `${hh}:${mm}`;
  highlightActiveFlights(minute);
}

function highlightActiveFlights(minute) {
  Object.values(flightMarkers).forEach(obj => {
    obj.marker.setStyle({ opacity: 0 });
  });

  const active = timelineFlights.filter(f => {
    if (f.depMin != null && f.arrMin != null && f.arrMin > f.depMin) {
      return minute >= f.depMin && minute <= f.arrMin;
    }
    if (f.depMin != null) return minute >= f.depMin && minute <= f.depMin + 20;
    return false;
  });

  active.forEach(f => {
    const key =
      (f.flight.flight_iata || f.flight.flight_icao || f.flight.flight_number || "?") +
      "-" + f.airportKey;

    const proc = (f.runwayName && f.mode)
      ? getProcedureForFlight(f.airportKey, f.runwayName, f.mode)
      : null;

    if (!proc) return;

    const fm = ensureFlightMarker(key, proc, f.mode);

    let ratio = 0.5;
    if (f.depMin != null && f.arrMin != null && f.arrMin > f.depMin) {
      ratio = (minute - f.depMin) / (f.arrMin - f.depMin);
      ratio = Math.max(0, Math.min(1, ratio));
    }

    const pos = positionAlongProcedure(fm, ratio);
    fm.marker.setLatLng([pos.lat, pos.lon]);
    fm.marker.setStyle({ opacity: 1 });
  });
}

// TIMELINE CONTROLS
function startTimeline() {
  if (timelineTimer) return;
  timelineTimer = setInterval(() => {
    timelineCurrent++;
    if (timelineCurrent > 1440) timelineCurrent = 0;
    const range = document.getElementById("timeline-range");
    if (range) range.value = timelineCurrent;
    updateTimelineUI(timelineCurrent);
  }, 200);
}

function stopTimeline() {
  clearInterval(timelineTimer);
  timelineTimer = null;
}

document.getElementById("timeline-play")?.addEventListener("click", () => {
  startTimeline();
});

document.getElementById("timeline-pause")?.addEventListener("click", () => {
  stopTimeline();
});

document.getElementById("timeline-range")?.addEventListener("input", (e) => {
  timelineCurrent = parseInt(e.target.value, 10);
  updateTimelineUI(timelineCurrent);
});

function computeImpactedForFlight(airportKey, proc, flight) {
  const list = sonometerMarkers[airportKey];
  if (!proc || !proc.points || proc.points.length < 2) return [];

  const profile = getCorridorProfileForFlight(flight);

  const start = proc.points[0];
  const end = proc.points[proc.points.length - 1];

  const lat0 = (start.lat + end.lat) / 2;
  const lon0 = (start.lon + end.lon) / 2;

  const A = projectLocal(lat0, lon0, start.lat, start.lon);
  const B = projectLocal(lat0, lon0, end.lat, end.lon);

  const wStartBase = profile.wStartKm * 1000 / 2;
  const wEndBase = profile.wEndKm * 1000 / 2;

  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const headingRad = Math.atan2(ABx, ABy);
  let runwayHeading = (headingRad * 180 / Math.PI);
  if (runwayHeading < 0) runwayHeading += 360;

  const windDir = windCache[airportKey].dir;
  const side = getCrosswindSide(runwayHeading, windDir);
  const asymFactor = 0.4;

  const impacted = [];

  list.forEach(s => {
    const P = projectLocal(lat0, lon0, s.lat, s.lon);
    const { dist, t } = distancePointToSegmentMetersLocal(P, A, B);

    const cross = ABx * (P.y - A.y) - ABy * (P.x - A.x);
    const sign = cross >= 0 ? +1 : -1;

    const wBase = wStartBase + (wEndBase - wStartBase) * t;

    let wLocal = wBase;
    if (side !== 0 && sign === side) {
      wLocal = wBase * (1 + asymFactor);
    }

    const isImpacted = dist <= wLocal;
    if (isImpacted) impacted.push({ ...s, distance_m: dist });
  });

  impacted.sort((a, b) => a.distance_m - b.distance_m);
  return impacted;
}

function onFlightSelected(airportKey, key, kind) {
  const infoEl = document.getElementById("selected-flight-info");
  const sonosEl = document.getElementById("selected-flight-sonos");

  const fm = flightIndex[airportKey]?.[key];
  if (!fm) {
    if (infoEl) infoEl.textContent = "Vol introuvable dans l’index.";
    if (sonosEl) sonosEl.textContent = "";
    return;
  }

  const f = fm.flight;
  const num = f.flight_iata || f.flight_icao || f.flight_number || "?";
  const ac = f.aircraft_icao || f.aircraft_iata || "?";
  const mode = fm.mode;
  const runwayName = fm.runwayName || (f.runway ? String(f.runway) : "?");

  if (infoEl) {
    infoEl.innerHTML =
      `<strong>${airportKey} – ${num}</strong><br>` +
      `Type: ${ac} – Mode: ${mode} – Piste: ${runwayName}<br>` +
      `DEP: ${formatTime(f.dep_time || f.dep_time_utc)} / ` +
      `ETD: ${formatTime(f.dep_estimated)} / ` +
      `ATD: ${formatTime(f.dep_actual)}<br>` +
      `ARR: ${formatTime(f.arr_time || f.arr_time_utc)} / ` +
      `ETA: ${formatTime(f.arr_estimated)} / ` +
      `ATA: ${formatTime(f.arr_actual)}`;

    const profile = getCorridorProfileForFlight(f);
    infoEl.innerHTML +=
      `<br>Profil couloir : <strong>${profile.wStartKm} → ${profile.wEndKm} km</strong>`;
  }

  const proc = (runwayName && mode)
    ? getProcedureForFlight(airportKey, runwayName, mode)
    : null;

  if (!proc) {
    if (sonosEl) sonosEl.textContent = "Aucune procédure SID/STAR associée à ce vol.";
    return;
  }

  const impacted = computeImpactedForFlight(airportKey, proc, f);
  if (!impacted.length) {
    if (sonosEl) sonosEl.textContent = "Aucun sonomètre dans le couloir de ce vol.";
    return;
  }

  if (sonosEl) {
    sonosEl.innerHTML =
      `Sonomètres impactés pour ce vol :<br>` +
      impacted
        .map(s =>
          `<span class="tag impacted">${s.id}</span> ` +
          `<span class="small">${s.address} – ${s.distance_m.toFixed(0)} m</span>`
        )
        .join("<br>");
  }
}

document.addEventListener("click", (e) => {
  const row = e.target.closest(".flight-row");
  if (!row) return;
  const airportKey = row.getAttribute("data-airport");
  const key = row.getAttribute("data-key");
  const kind = row.getAttribute("data-kind");
  onFlightSelected(airportKey, key, kind);
});

// TRAITEMENTS
let filters = {
  EBCI: true,
  EBLG: true
};

async function processAirport(airportKey) {
  const ap = airports[airportKey];

  const enabled = filters[airportKey];

  const runwayId = airportKey === "EBCI" ? "runway-ebci" : "runway-eblg";
  const listId = airportKey === "EBCI" ? "list-ebci" : "list-eblg";
  const flightsId = airportKey === "EBCI" ? "flights-ebci" : "flights-eblg";

  if (!enabled) {
    sonometerMarkers[airportKey].forEach(s => s.marker.setStyle(sonometerNormalStyle));
    if (corridorLayers[airportKey]) {
      map.removeLayer(corridorLayers[airportKey]);
      corridorLayers[airportKey] = null;
    }
    const runwayEl = document.getElementById(runwayId);
    const listEl = document.getElementById(listId);
    const flightsEl = document.getElementById(flightsId);
    if (runwayEl) runwayEl.textContent = "Aéroport non sélectionné dans les filtres.";
    if (listEl) listEl.textContent = "Aéroport non sélectionné dans les filtres.";
    if (flightsEl) flightsEl.textContent = "Aéroport non sélectionné dans les filtres.";
    return;
  }

  try {
    const [metar, flights] = await Promise.all([
      fetchMetar(ap.icao),
      fetchFlightsAirlabs(ap.icao)
    ]);

    updateMetarUI(airportKey, metar);
    updateFlightsUI(airportKey, flights);

    const windDir = metar?.wind_direction?.value ?? metar?.wind?.direction?.degrees ?? null;
    const windSpeed = metar?.wind_speed?.value ?? metar?.wind?.speed_kt ?? null;

    const { runway: runwayFromFlights, flightsFiltered } = extractRunwayFromAirlabs(airportKey, flights);
    let runway = runwayFromFlights;
    let source = "Airlabs (piste réelle / direction)";

    if (!runway) {
      runway = estimateRunwayFromWind(ap, windDir);
      source = "METAR (vent)";
    }

    updateRunwayUI(airportKey, runway, windDir, windSpeed, source, flightsFiltered.length);

    if (runway) {
      applyDisplayRules(airportKey, runway.name);

      let mode = "DEP";
      if (flightsFiltered.some(f => f._kind === "liveArr")) mode = "ARR";

      activateSidStar(airportKey, runway.name, mode);

      let usedFixedRule = false;
      let impacted = [];

      if (airportKey === "EBLG") {
        const fixed = getFixedRuleImpactsEBLG(runway.name, mode);
        if (fixed) {
          usedFixedRule = true;
          impacted = sonometerMarkers[airportKey]
            .filter(s => fixed.includes(s.id))
            .map(s => ({ ...s, distance_m: 0 }));

          sonometerMarkers[airportKey].forEach(s => {
            const isImp = fixed.includes(s.id);
            s.marker.setStyle(isImp ? sonometerImpactedStyle : sonometerNormalStyle);
          });

          if (corridorLayers[airportKey]) {
            map.removeLayer(corridorLayers[airportKey]);
            corridorLayers[airportKey] = null;
          }
        }
      }

      if (!usedFixedRule && airportKey === "EBCI") {
        const fixed = getFixedRuleImpactsEBCI(runway.name, mode);
        if (fixed) {
          usedFixedRule = true;
          impacted = sonometerMarkers[airportKey]
            .filter(s => fixed.includes(s.id))
            .map(s => ({ ...s, distance_m: 0 }));

          sonometerMarkers[airportKey].forEach(s => {
            const isImp = fixed.includes(s.id);
            s.marker.setStyle(isImp ? sonometerImpactedStyle : sonometerNormalStyle);
          });

          if (corridorLayers[airportKey]) {
            map.removeLayer(corridorLayers[airportKey]);
            corridorLayers[airportKey] = null;
          }
        }
      }

      if (!usedFixedRule) {
        impacted = [];
      }

      updateImpactedListUI(airportKey, impacted, runway, usedFixedRule);

      prepareTimelineFlights(airportKey, flights, runway, mode);
    } else {
      updateImpactedListUI(airportKey, [], null);
      sonometerMarkers[airportKey].forEach(s => s.marker.setStyle(sonometerNormalStyle));
      if (corridorLayers[airportKey]) {
        map.removeLayer(corridorLayers[airportKey]);
        corridorLayers[airportKey] = null;
      }
    }
  } catch (e) {
    console.error(e);

    const idSummary =
      airportKey === "EBCI"
        ? "meteo-ebci-summary"
        : "meteo-eblg-summary";

    const idRaw =
      airportKey === "EBCI"
        ? "meteo-ebci-raw"
        : "meteo-eblg-raw";

    const summaryEl = document.getElementById(idSummary);
    const rawEl = document.getElementById(idRaw);
    const runwayEl = document.getElementById(runwayId);
    const listEl = document.getElementById(listId);
    const flightsEl = document.getElementById(flightsId);

    if (summaryEl)
      summaryEl.textContent =
        "Erreur lors du chargement des données.";

    if (rawEl)
      rawEl.textContent = "";

    if (runwayEl)
      runwayEl.textContent =
        "Impossible de déterminer la piste.";

    if (listEl)
      listEl.textContent =
        "Données indisponibles.";

    if (flightsEl)
      flightsEl.textContent =
        "Données vols indisponibles.";

    sonometerMarkers[airportKey].forEach(s =>
      s.marker.setStyle(sonometerNormalStyle)
    );

    if (corridorLayers[airportKey]) {
      map.removeLayer(corridorLayers[airportKey]);
      corridorLayers[airportKey] = null;
    }
  }
}

async function refreshAll() {
  timelineFlights = [];
  Object.values(flightMarkers).forEach(obj => map.removeLayer(obj.marker));
  for (const k in flightMarkers) delete flightMarkers[k];
  flightIndex.EBCI = {};
  flightIndex.EBLG = {};

  await Promise.all([processAirport("EBCI"), processAirport("EBLG")]);
}

// EVENEMENTS

document
  .getElementById("btn-reset-zoom")
  ?.addEventListener("click", resetMapView);

document
  .getElementById("filter-ebci")
  ?.addEventListener("click", () => {
    filters.EBCI = !filters.EBCI;

    document
      .getElementById("filter-ebci")
      .classList.toggle("active", filters.EBCI);

    refreshAll();
  });

document
  .getElementById("filter-eblg")
  ?.addEventListener("click", () => {
    filters.EBLG = !filters.EBLG;

    document
      .getElementById("filter-eblg")
      .classList.toggle("active", filters.EBLG);

    refreshAll();
  });

// DEMARRAGE

refreshAll();

setTimeout(() => {
  resetMapView();
}, 500);
