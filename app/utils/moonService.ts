import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "MOON_PHASE";

interface Cached {
  date: string;
  phase: number;
  phaseName: string;
  illumination: number;
}

/**
 * Calculate moon phase using astronomical calculations
 * Based on the synodic lunar month cycle
 * @param date - Date to calculate moon phase for (defaults to current date)
 * @returns Moon phase as decimal (0 = new moon, 0.5 = full moon)
 */
function calculateMoonPhase(date = new Date()): number {
  // Known new moon reference: January 6, 2000, 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00.000Z');
  
  // Average synodic month (lunar cycle) in days
  const lunarCycle = 29.53058867;
  
  // Calculate days since known new moon
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Calculate current phase (0-1 range)
  let phase = (diffDays % lunarCycle) / lunarCycle;
  
  // Ensure positive value
  if (phase < 0) {
    phase += 1;
  }
  
  return Math.round(phase * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Get moon phase name from numerical phase
 * @param phase - Moon phase as decimal (0-1)
 * @returns Human-readable phase name
 */
function getMoonPhaseName(phase: number): string {
  if (phase < 0.0625 || phase >= 0.9375) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Last Quarter";
  return "Waning Crescent";
}

/**
 * Calculate moon illumination percentage
 * @param phase - Moon phase as decimal (0-1)
 * @returns Illumination percentage (0-100)
 */
function getMoonIllumination(phase: number): number {
  // Illumination is highest at full moon (0.5) and lowest at new moon (0 or 1)
  return Math.round((1 - Math.abs(phase - 0.5) * 2) * 100);
}

/**
 * Get complete moon phase information with caching
 * This is completely free and works offline!
 * @returns Promise resolving to moon phase data
 */
export async function getMoonPhase(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  // 1. Try cache first (saves computation)
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached: Cached = JSON.parse(raw);
      if (cached.date === today && typeof cached.phase === "number") {
        // console.log(`Using cached moon phase: ${cached.phase} (${cached.phaseName})`);
        return cached.phase;
      }
    }
  } catch (error) {
    console.warn("Unable to read moon phase cache:", error);
  }

  // 2. Calculate current moon phase
  const phase = calculateMoonPhase();
  const phaseName = getMoonPhaseName(phase);
  const illumination = getMoonIllumination(phase);

  // console.log(`Calculated moon phase: ${phase} (${phaseName}, ${illumination}% illuminated)`);

  // 3. Cache the result for today
  try {
    const toCache: Cached = {
      date: today,
      phase,
      phaseName,
      illumination
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(toCache));
  } catch (error) {
    console.warn("Failed to cache moon phase:", error);
  }

  return phase;
}

/**
 * Get detailed moon phase information
 * @param date - Optional date (defaults to current date)
 * @returns Complete moon phase data
 */
export function getDetailedMoonPhase(date = new Date()): {
  phase: number;
  phaseName: string;
  illumination: number;
  isWaxing: boolean;
  nextPhase: string;
  daysToNextPhase: number;
} {
  const phase = calculateMoonPhase(date);
  const phaseName = getMoonPhaseName(phase);
  const illumination = getMoonIllumination(phase);
  const isWaxing = phase < 0.5;

  // Calculate next major phase
  let nextPhase: string;
  let daysToNextPhase: number;
  
  if (phase < 0.25) {
    nextPhase = "First Quarter";
    daysToNextPhase = Math.round((0.25 - phase) * 29.53);
  } else if (phase < 0.5) {
    nextPhase = "Full Moon";
    daysToNextPhase = Math.round((0.5 - phase) * 29.53);
  } else if (phase < 0.75) {
    nextPhase = "Last Quarter";
    daysToNextPhase = Math.round((0.75 - phase) * 29.53);
  } else {
    nextPhase = "New Moon";
    daysToNextPhase = Math.round((1 - phase) * 29.53);
  }

  return {
    phase,
    phaseName,
    illumination,
    isWaxing,
    nextPhase,
    daysToNextPhase
  };
}

/**
 * Get moon phases for multiple dates (useful for calendars)
 * @param startDate - Start date
 * @param days - Number of days to calculate
 * @returns Array of moon phase data
 */
export function getMoonPhaseCalendar(startDate = new Date(), days = 30): Array<{
  date: string;
  phase: number;
  phaseName: string;
  illumination: number;
}> {
  const phases = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const phase = calculateMoonPhase(date);
    const phaseName = getMoonPhaseName(phase);
    const illumination = getMoonIllumination(phase);
    
    phases.push({
      date: date.toISOString().slice(0, 10),
      phase,
      phaseName,
      illumination
    });
  }
  
  return phases;
}

/**
 * Clear moon phase cache
 */
export async function clearMoonCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    // console.log("Moon phase cache cleared");
  } catch (error) {
    console.warn("Failed to clear moon phase cache:", error);
  }
}

/**
 * Get moon emoji based on phase
 * @param phase - Moon phase as decimal (0-1)
 * @returns Moon emoji
 */
export function getMoonEmoji(phase: number): string {
  if (phase < 0.0625 || phase >= 0.9375) return "🌑"; // New Moon
  if (phase < 0.1875) return "🌒"; // Waxing Crescent
  if (phase < 0.3125) return "🌓"; // First Quarter
  if (phase < 0.4375) return "🌔"; // Waxing Gibbous
  if (phase < 0.5625) return "🌕"; // Full Moon
  if (phase < 0.6875) return "🌖"; // Waning Gibbous
  if (phase < 0.8125) return "🌗"; // Last Quarter
  return "🌘"; // Waning Crescent
}