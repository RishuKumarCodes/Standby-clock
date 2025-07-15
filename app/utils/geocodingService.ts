// utils/geocodingService.ts
export interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  type?: string; // city, town, village, etc.
  importance?: number; // relevance score
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  type?: string;
  importance?: number;
}

interface PositionStackResult {
  latitude: number;
  longitude: number;
  label: string;
  name: string;
  type: string;
  region?: string;
  region_code?: string;
  country?: string;
  country_code?: string;
  postal_code?: string;
  confidence?: number;
}

// Configuration
const GEOCODING_CONFIG = {
  // Nominatim (OpenStreetMap) - Free, no API key required
  nominatim: {
    baseUrl: "https://nominatim.openstreetmap.org",
    searchEndpoint: "/search",
    reverseEndpoint: "/reverse",
    userAgent: "WeatherWidget/1.0", // Required by Nominatim
    rateLimit: 1000, // 1 second between requests
  },

  // PositionStack - Backup service (requires API key)
  // You can get a free API key from https://positionstack.com/
  positionstack: {
    baseUrl: "https://api.positionstack.com/v1",
    apiKey: "", // Add your API key here if you have one
    searchEndpoint: "/forward",
    reverseEndpoint: "/reverse",
  },

  // Request settings
  timeout: 10000, // 10 seconds
  maxResults: 10,
  minQueryLength: 2,
};

// Rate limiting for Nominatim
let lastNominatimRequest = 0;

// Sleep utility for rate limiting
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Validate and clean search query
function validateAndCleanQuery(query: string): string {
  const cleaned = query.trim().replace(/\s+/g, " ");

  if (cleaned.length < GEOCODING_CONFIG.minQueryLength) {
    throw new Error(
      `Search query must be at least ${GEOCODING_CONFIG.minQueryLength} characters long`
    );
  }

  if (cleaned.length > 200) {
    throw new Error("Search query is too long");
  }

  return cleaned;
}

// Rate limiting for Nominatim requests
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastNominatimRequest;

  if (timeSinceLastRequest < GEOCODING_CONFIG.nominatim.rateLimit) {
    const waitTime =
      GEOCODING_CONFIG.nominatim.rateLimit - timeSinceLastRequest;
    await sleep(waitTime);
  }

  lastNominatimRequest = Date.now();
}

// Search using Nominatim (OpenStreetMap)
async function searchWithNominatim(query: string): Promise<GeocodingResult[]> {
  await enforceRateLimit();

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: GEOCODING_CONFIG.maxResults.toString(),
    countrycodes: "", // Leave empty to search worldwide
    "accept-language": "en", // Prefer English results
  });

  const url = `${GEOCODING_CONFIG.nominatim.baseUrl}${GEOCODING_CONFIG.nominatim.searchEndpoint}?${params}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    GEOCODING_CONFIG.timeout
  );

  try {
    // console.log("Searching with Nominatim:", query);

    const response = await fetch(url, {
      headers: {
        "User-Agent": GEOCODING_CONFIG.nominatim.userAgent,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Nominatim API error: ${response.status} ${response.statusText}`
      );
    }

    const data: NominatimResult[] = await response.json();

    return data.map((result) => ({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name,
      city:
        result.address?.city || result.address?.town || result.address?.village,
      state: result.address?.state,
      country: result.address?.country,
      postcode: result.address?.postcode,
      type: result.type,
      importance: result.importance,
    }));
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Search request timed out");
    }

    throw error;
  }
}

// Search using PositionStack (backup service)
async function searchWithPositionStack(
  query: string
): Promise<GeocodingResult[]> {
  if (!GEOCODING_CONFIG.positionstack.apiKey) {
    throw new Error("PositionStack API key not configured");
  }

  const params = new URLSearchParams({
    access_key: GEOCODING_CONFIG.positionstack.apiKey,
    query: query,
    limit: GEOCODING_CONFIG.maxResults.toString(),
    output: "json",
  });

  const url = `${GEOCODING_CONFIG.positionstack.baseUrl}${GEOCODING_CONFIG.positionstack.searchEndpoint}?${params}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    GEOCODING_CONFIG.timeout
  );

  try {
    // console.log("Searching with PositionStack:", query);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `PositionStack API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`PositionStack error: ${data.error.message}`);
    }

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((result: PositionStackResult) => ({
      lat: result.latitude,
      lon: result.longitude,
      displayName: result.label,
      city: result.name,
      state: result.region,
      country: result.country,
      postcode: result.postal_code,
      type: result.type,
      importance: result.confidence ? result.confidence / 100 : undefined,
    }));
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Search request timed out");
    }

    throw error;
  }
}

// Reverse geocoding using Nominatim
async function reverseGeocodeWithNominatim(
  lat: number,
  lon: number
): Promise<GeocodingResult[]> {
  await enforceRateLimit();

  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: "json",
    addressdetails: "1",
    "accept-language": "en",
  });

  const url = `${GEOCODING_CONFIG.nominatim.baseUrl}${GEOCODING_CONFIG.nominatim.reverseEndpoint}?${params}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    GEOCODING_CONFIG.timeout
  );

  try {
    // console.log("Reverse geocoding with Nominatim:", lat, lon);

    const response = await fetch(url, {
      headers: {
        "User-Agent": GEOCODING_CONFIG.nominatim.userAgent,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Nominatim reverse API error: ${response.status} ${response.statusText}`
      );
    }

    const result: NominatimResult = await response.json();

    if (!result || !result.lat || !result.lon) {
      return [];
    }

    return [
      {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        city:
          result.address?.city ||
          result.address?.town ||
          result.address?.village,
        state: result.address?.state,
        country: result.address?.country,
        postcode: result.address?.postcode,
        type: result.type,
        importance: result.importance,
      },
    ];
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Reverse geocoding request timed out");
    }

    throw error;
  }
}

// Main geocoding function with fallback
export async function geocodeAddress(
  query: string
): Promise<GeocodingResult[]> {
  try {
    const cleanedQuery = validateAndCleanQuery(query);

    // Try Nominatim first (free service)
    try {
      const nominatimResults = await searchWithNominatim(cleanedQuery);

      if (nominatimResults.length > 0) {
        // console.log(`Found ${nominatimResults.length} results from Nominatim`);
        return sortResultsByRelevance(nominatimResults);
      }
    } catch (nominatimError) {
      console.warn("Nominatim search failed:", nominatimError);
    }

    // Try PositionStack as backup (if configured)
    if (GEOCODING_CONFIG.positionstack.apiKey) {
      try {
        const positionStackResults = await searchWithPositionStack(
          cleanedQuery
        );

        if (positionStackResults.length > 0) {
          // console.log(
          //   `Found ${positionStackResults.length} results from PositionStack`
          // );
          return sortResultsByRelevance(positionStackResults);
        }
      } catch (positionStackError) {
        console.warn("PositionStack search failed:", positionStackError);
      }
    }

    // If all services fail, return empty array
    console.warn("All geocoding services failed or returned no results");
    return [];
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

// Reverse geocoding function
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeocodingResult[]> {
  try {
    // Validate coordinates
    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      throw new Error("Invalid coordinates provided");
    }

    // Try Nominatim for reverse geocoding
    const results = await reverseGeocodeWithNominatim(lat, lon);

    if (results.length > 0) {
      // console.log("Reverse geocoding successful");
      return results;
    }

    console.warn("Reverse geocoding returned no results");
    return [];
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
}

// Sort results by relevance
function sortResultsByRelevance(results: GeocodingResult[]): GeocodingResult[] {
  return results.sort((a, b) => {
    // Sort by importance if available
    if (a.importance !== undefined && b.importance !== undefined) {
      return b.importance - a.importance;
    }

    // Prefer results with city information
    if (a.city && !b.city) return -1;
    if (!a.city && b.city) return 1;

    // Prefer results with country information
    if (a.country && !b.country) return -1;
    if (!a.country && b.country) return 1;

    // Prefer shorter, more specific names
    return a.displayName.length - b.displayName.length;
  });
}

// Enhanced search with suggestions
export async function searchWithSuggestions(query: string): Promise<{
  results: GeocodingResult[];
  suggestions: string[];
}> {
  const results = await geocodeAddress(query);

  // Generate search suggestions based on results
  const suggestions: string[] = [];

  results.forEach((result) => {
    if (result.city && !suggestions.includes(result.city)) {
      suggestions.push(result.city);
    }

    if (result.state && !suggestions.includes(result.state)) {
      suggestions.push(result.state);
    }

    if (result.country && !suggestions.includes(result.country)) {
      suggestions.push(result.country);
    }
  });

  return {
    results,
    suggestions: suggestions.slice(0, 5), // Limit to 5 suggestions
  };
}

// Get popular cities for different regions
export function getPopularCities(): { [region: string]: string[] } {
  return {
    Asia: [
      "Tokyo, Japan",
      "Delhi, India",
      "Shanghai, China",
      "Mumbai, India",
      "Beijing, China",
      "Dhaka, Bangladesh",
      "Seoul, South Korea",
      "Jakarta, Indonesia",
      "Manila, Philippines",
      "Bangkok, Thailand",
    ],
    Europe: [
      "London, United Kingdom",
      "Paris, France",
      "Berlin, Germany",
      "Madrid, Spain",
      "Rome, Italy",
      "Amsterdam, Netherlands",
      "Vienna, Austria",
      "Stockholm, Sweden",
      "Copenhagen, Denmark",
      "Zurich, Switzerland",
    ],
    "North America": [
      "New York, United States",
      "Los Angeles, United States",
      "Chicago, United States",
      "Toronto, Canada",
      "Mexico City, Mexico",
      "Vancouver, Canada",
      "Miami, United States",
      "San Francisco, United States",
      "Montreal, Canada",
      "Boston, United States",
    ],
    "South America": [
      "São Paulo, Brazil",
      "Rio de Janeiro, Brazil",
      "Buenos Aires, Argentina",
      "Lima, Peru",
      "Bogotá, Colombia",
      "Santiago, Chile",
      "Caracas, Venezuela",
      "Quito, Ecuador",
      "La Paz, Bolivia",
      "Montevideo, Uruguay",
    ],
    Africa: [
      "Cairo, Egypt",
      "Lagos, Nigeria",
      "Cape Town, South Africa",
      "Johannesburg, South Africa",
      "Casablanca, Morocco",
      "Nairobi, Kenya",
      "Addis Ababa, Ethiopia",
      "Accra, Ghana",
      "Tunis, Tunisia",
      "Algiers, Algeria",
    ],
    Oceania: [
      "Sydney, Australia",
      "Melbourne, Australia",
      "Auckland, New Zealand",
      "Brisbane, Australia",
      "Perth, Australia",
      "Wellington, New Zealand",
      "Adelaide, Australia",
      "Canberra, Australia",
      "Christchurch, New Zealand",
      "Gold Coast, Australia",
    ],
  };
}

// Utility function to format coordinates for display
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(
    4
  )}°${lonDir}`;
}

// Utility function to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

// Configuration helper
export function setPositionStackApiKey(apiKey: string): void {
  GEOCODING_CONFIG.positionstack.apiKey = apiKey;
}

// Export configuration for external usage
export { GEOCODING_CONFIG };
