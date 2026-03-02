// Static database of notable military aircraft assets
import type { AircraftAsset } from "@/domain/models";

export const aircraftAssetsDatabase: AircraftAsset[] = [
  {
    id: "asset_rc135",
    designation: "RC-135V/W",
    name: "Rivet Joint",
    role: "SIGINT/ELINT Reconnaissance",
    operator: "US Air Force",
    country: "United States",
    manufacturer: "Boeing",
    specs: {
      maxSpeed: "933 km/h",
      range: "5,500 km",
      ceiling: "15,200 m",
      crew: "27-32",
      length: "41.53 m",
      wingspan: "39.88 m",
    },
    description:
      "Primary signals intelligence platform of the USAF. Collects, identifies, and geolocates signals throughout the electromagnetic spectrum. Regularly deployed along contested borders.",
    inService: true,
    knownRegistrations: [
      "62-4131",
      "62-4132",
      "62-4134",
      "62-4135",
      "62-4138",
      "62-4139",
    ],
  },
  {
    id: "asset_e3",
    designation: "E-3",
    name: "Sentry (AWACS)",
    natoName: "Sentry",
    role: "Airborne Early Warning & Control",
    operator: "US Air Force / NATO",
    country: "United States",
    manufacturer: "Boeing",
    specs: {
      maxSpeed: "855 km/h",
      range: "7,400 km",
      ceiling: "12,500 m",
      crew: "19-23",
      length: "46.61 m",
      wingspan: "44.42 m",
    },
    description:
      "Airborne early warning and control aircraft providing all-weather surveillance, command, control, and communications. The rotating radar dome can detect targets at over 375 km.",
    inService: true,
    knownRegistrations: ["75-0556", "75-0557", "77-0351", "77-0352"],
  },
  {
    id: "asset_p8a",
    designation: "P-8A",
    name: "Poseidon",
    role: "Maritime Patrol & ASW",
    operator: "US Navy",
    country: "United States",
    manufacturer: "Boeing",
    specs: {
      maxSpeed: "907 km/h",
      range: "7,500 km",
      ceiling: "12,500 m",
      crew: "9",
      length: "39.47 m",
      wingspan: "37.64 m",
    },
    description:
      "Maritime patrol aircraft designed for anti-submarine warfare, anti-surface warfare, and intelligence gathering. Successor to the P-3C Orion.",
    inService: true,
    knownRegistrations: ["168433", "168434", "168756", "168757"],
  },
  {
    id: "asset_rq4",
    designation: "RQ-4",
    name: "Global Hawk",
    role: "High-Altitude ISR UAV",
    operator: "US Air Force",
    country: "United States",
    manufacturer: "Northrop Grumman",
    specs: {
      maxSpeed: "629 km/h",
      range: "22,780 km",
      ceiling: "18,300 m",
      crew: "0 (Remote)",
      length: "14.5 m",
      wingspan: "39.9 m",
    },
    description:
      "Unmanned high-altitude, long-endurance surveillance aircraft. Can survey up to 100,000 km² per day. Provides persistent ISR capability with 30+ hour flight endurance.",
    inService: true,
    knownRegistrations: ["04-2015", "04-2017", "05-2019", "08-2035"],
  },
  {
    id: "asset_tu142",
    designation: "Tu-142",
    name: "Bear-F",
    natoName: "Bear-F",
    role: "Maritime Patrol & ASW",
    operator: "Russian Navy",
    country: "Russia",
    manufacturer: "Tupolev",
    specs: {
      maxSpeed: "855 km/h",
      range: "12,000 km",
      ceiling: "13,500 m",
      crew: "11-13",
      length: "53.07 m",
      wingspan: "50.04 m",
    },
    description:
      "Long-range maritime reconnaissance and anti-submarine warfare aircraft derived from the Tu-95 strategic bomber. Distinctive contra-rotating propellers make it one of the fastest turboprop aircraft.",
    inService: true,
    knownRegistrations: ["RF-34079", "RF-34098"],
  },
  {
    id: "asset_il20m",
    designation: "Il-20M",
    name: "Coot-A",
    natoName: "Coot-A",
    role: "ELINT Reconnaissance",
    operator: "Russian Air Force",
    country: "Russia",
    manufacturer: "Ilyushin",
    specs: {
      maxSpeed: "675 km/h",
      range: "6,500 km",
      ceiling: "10,000 m",
      crew: "13",
      length: "37.4 m",
      wingspan: "37.42 m",
    },
    description:
      "Electronic intelligence aircraft based on the Il-18 airliner. Equipped with SLAR radar and various ELINT sensors. Frequently observed near NATO borders.",
    inService: true,
    knownRegistrations: ["RF-93610", "RF-75937"],
  },
  {
    id: "asset_e7a",
    designation: "E-7A",
    name: "Wedgetail",
    role: "Airborne Early Warning & Control",
    operator: "Royal Australian Air Force / RAF",
    country: "Australia",
    manufacturer: "Boeing",
    specs: {
      maxSpeed: "955 km/h",
      range: "7,040 km",
      ceiling: "12,200 m",
      crew: "10-12",
      length: "33.63 m",
      wingspan: "34.32 m",
    },
    description:
      "Next-generation AEW&C platform based on the 737-700. Features the Multi-role Electronically Scanned Array (MESA) dorsal antenna. Being adopted by the RAF as E-3 replacement.",
    inService: true,
    knownRegistrations: ["A30-001", "A30-002", "A30-003", "A30-004"],
  },
  {
    id: "asset_mq9",
    designation: "MQ-9",
    name: "Reaper",
    role: "Armed ISR UAV",
    operator: "US Air Force",
    country: "United States",
    manufacturer: "General Atomics",
    specs: {
      maxSpeed: "482 km/h",
      range: "1,852 km",
      ceiling: "15,240 m",
      crew: "0 (Remote)",
      length: "11.0 m",
      wingspan: "20.1 m",
    },
    description:
      "Medium-altitude, long-endurance UAV capable of both ISR and strike missions. Can carry up to 1,746 kg of ordnance. Endurance exceeds 27 hours.",
    inService: true,
    knownRegistrations: ["05-5032", "06-4112", "07-4023"],
  },
  {
    id: "asset_ep3e",
    designation: "EP-3E",
    name: "Aries II",
    role: "SIGINT Reconnaissance",
    operator: "US Navy",
    country: "United States",
    manufacturer: "Lockheed",
    specs: {
      maxSpeed: "761 km/h",
      range: "4,440 km",
      ceiling: "8,600 m",
      crew: "24",
      length: "35.61 m",
      wingspan: "30.37 m",
    },
    description:
      "Signals intelligence aircraft operated by Fleet Air Reconnaissance Squadrons. Equipped with sensors for detecting and locating electronic emissions. Being replaced by the P-8A.",
    inService: true,
    knownRegistrations: ["156511", "157318", "157320"],
  },
  {
    id: "asset_a50",
    designation: "A-50",
    name: "Mainstay",
    natoName: "Mainstay",
    role: "Airborne Early Warning & Control",
    operator: "Russian Air Force",
    country: "Russia",
    manufacturer: "Beriev / Vega",
    specs: {
      maxSpeed: "800 km/h",
      range: "5,000 km",
      ceiling: "12,000 m",
      crew: "15",
      length: "46.59 m",
      wingspan: "50.5 m",
    },
    description:
      "Russian airborne early warning and control aircraft based on the Il-76 transport. The Shmel radar system can track up to 150 targets and direct 12 fighters simultaneously.",
    inService: true,
    knownRegistrations: ["RF-50602", "RF-92957"],
  },
];

export function getAircraftAssets(search?: string): AircraftAsset[] {
  if (!search) return aircraftAssetsDatabase;

  const query = search.toLowerCase();

  return aircraftAssetsDatabase.filter(
    (a) =>
      a.designation.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query) ||
      a.operator.toLowerCase().includes(query) ||
      a.country.toLowerCase().includes(query) ||
      (a.natoName && a.natoName.toLowerCase().includes(query)),
  );
}
