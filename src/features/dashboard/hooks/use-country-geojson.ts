import { useState, useEffect, useRef } from "react";

import { feature } from "topojson-client";

import type { Topology, GeometryCollection } from "topojson-specification";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJSONFeature = any;

const WORLD_ATLAS_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function useCountryGeoJSON() {
  const [countries, setCountries] = useState<GeoJSONFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch(WORLD_ATLAS_URL)
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geojson = feature(
          topology,
          topology.objects.countries as GeometryCollection,
        );

        setCountries(geojson.features);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { countries, isLoading };
}
