// themes/weather/WeatherDashboard.tsx
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { DetailedWeatherData } from "../../types/WeatherTypes";
import { 
  getDetailedWeather, 
  getUserLocation 
} from "../../utils/weatherService";

interface WeatherDashboardProps {
  previewMode?: boolean;
  color?: string;
  lat?: number;
  lon?: number;
}

type TimeFilter = 'today' | 'next7days';
type ViewFilter = 'forecast' | 'aqi';

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ 
  previewMode = false, 
  color = "#fff",
  lat,
  lon 
}) => {
  const [weather, setWeather] = useState<DetailedWeatherData | null>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('forecast');

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getDetailedWeather(lat, lon);
      setWeather(data);
      
      // Get location name using reverse geocoding or from weather data
      if (data.location) {
        setLocation(data.location);
      } else {
        // Fallback to coordinates if location name not available
        setLocation(`${lat?.toFixed(2)}°, ${lon?.toFixed(2)}°`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const formatDay = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const today = new Date();

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
    } catch {
      return dateString;
    }
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff7e00";
    if (aqi <= 200) return "#ff0000";
    if (aqi <= 300) return "#8f3f97";
    return "#7e0023";
  };

  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTodayData = () => {
    if (!weather) return null;
    
    const mainCard = {
      time: getCurrentTime(),
      temperature: weather.current.temperature,
      feelsLike: weather.current.feelsLike,
      description: weather.current.description,
      emoji: weather.current.emoji,
      sunrise: formatTime(weather.sun.sunrise),
      sunset: formatTime(weather.sun.sunset),
      isMain: true
    };

    const hourlyCards = weather.hourly
      .slice(1, 7)
      .map(hour => ({
        time: formatTime(hour.time),
        temperature: hour.temperature,
        feelsLike: hour.feelsLike,
        description: hour.description,
        emoji: hour.emoji,
        aqi: weather.airQuality.aqi,
        precipitation: hour.precipitation,
        isMain: false
      }));

    return { mainCard, hourlyCards };
  };

  const getNext7DaysData = () => {
    if (!weather) return null;
    
    const mainCard = {
      time: getCurrentTime(),
      temperature: weather.current.temperature,
      feelsLike: weather.current.feelsLike,
      description: weather.current.description,
      emoji: weather.current.emoji,
      sunrise: formatTime(weather.sun.sunrise),
      sunset: formatTime(weather.sun.sunset),
      isMain: true
    };

    const dailyCards = weather.daily.slice(1, 6).map(day => ({
      time: formatDay(day.date),
      temperature: day.temperatureMax,
      temperatureMin: day.temperatureMin,
      feelsLike: day.feelsLikeMax,
      description: day.description,
      emoji: day.emoji,
      aqi: weather.airQuality.aqi,
      precipitation: day.precipitationSum,
      isMain: false
    }));

    return { mainCard, hourlyCards: dailyCards };
  };

  const renderAQIMainCard = () => {
    if (!weather) return null;

    const aqi = weather.airQuality.aqi;
    const aqiColor = getAQIColor(aqi);
    const aqiLevel = getAQILevel(aqi);
    
    // Calculate arc progress (0 to 1) based on AQI value
    const maxAQI = 300; // Maximum AQI for full circle
    const progress = Math.min(aqi / maxAQI, 1);
    const angle = progress * 270; // 270 degrees for 3/4 circle
    
    // Calculate position of the progress indicator dot
    const radius = 40;
    const centerX = 50;
    const centerY = 50;
    const angleRad = ((angle - 135) * Math.PI) / 180; // Start from bottom-left
    const dotX = centerX + radius * Math.cos(angleRad);
    const dotY = centerY + radius * Math.sin(angleRad);

    return (
      <View style={[styles.aqiMainCard, { backgroundColor: 'rgba(45, 55, 70, 0.9)' }]}>
        <View style={styles.aqiHeader}>
          <Text style={[styles.aqiTitle, { color }]}>AQI</Text>
          <Text style={[styles.locationText, { color: color, opacity: 0.7 }]}>{location}</Text>
        </View>
        
        <View style={styles.aqiContent}>
          <View style={styles.aqiCircleContainer}>
            {/* Background arc */}
            <View style={[styles.aqiArcBackground]} />
            
            {/* Progress arc */}
            <View 
              style={[
                styles.aqiArcProgress, 
                { 
                  borderColor: aqiColor,
                  transform: [{ rotate: `${angle - 135}deg` }]
                }
              ]} 
            />
            
            {/* Progress dot */}
            <View 
              style={[
                styles.aqiProgressDot, 
                { 
                  backgroundColor: aqiColor,
                  left: dotX - 4,
                  top: dotY - 4,
                }
              ]} 
            />
            
            <View style={styles.aqiValueContainer}>
              <Text style={[styles.aqiValue, { color }]}>{aqi}</Text>
            </View>
          </View>
          
          <View style={styles.aqiInfo}>
            <Text style={[styles.aqiLevel, { color }]}>{aqiLevel}</Text>
            <Text style={[styles.aqiDescription, { color: color, opacity: 0.7 }]}>
              Deteriorating air quality with primary pollutant {'\n'}PM10 90 μg/m³
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMainCard = (cardData: any) => {
    return (
      <View style={[styles.mainCard, { backgroundColor: 'rgba(135, 206, 250, 0.3)' }]}>
        <View style={styles.mainCardHeader}>
          <Text style={[styles.mainCardDay, { color }]}>
            {timeFilter === 'today' ? 'Today' : 'This Week'}
          </Text>
          <Text style={[styles.locationText, { color: color, opacity: 0.7 }]}>{location}</Text>
        </View>
        <View style={styles.mainCardContent}>
          <Text style={[styles.mainCardTemp, { color }]}>{cardData.temperature}°</Text>
          <View style={styles.weatherIcon}>
            <Text style={styles.weatherEmoji}>{cardData.emoji}</Text>
          </View>
        </View>
        <Text style={[styles.mainCardFeels, { color: color, opacity: 0.8 }]}>
          Real feel: {cardData.feelsLike}°
        </Text>
        <Text style={[styles.mainCardDesc, { color: color, opacity: 0.9 }]}>
          {cardData.description}
        </Text>
        <View style={styles.sunTimes}>
          <Text style={[styles.sunTime, { color: color, opacity: 0.7 }]}>
            Sunrise: {cardData.sunrise}
          </Text>
          <Text style={[styles.sunTime, { color: color, opacity: 0.7 }]}>
            Sunset: {cardData.sunset}
          </Text>
        </View>
      </View>
    );
  };

  const renderSmallCard = (cardData: any, index: number) => {
    if (viewFilter === 'aqi' && weather) {
      const pollutants = [
        { label: 'PM2.5', value: Math.round(weather.airQuality.pm25), unit: 'μg/m³', color: '#FF6B6B' },
        { label: 'PM10', value: Math.round(weather.airQuality.pm10), unit: 'μg/m³', color: '#4ECDC4' },
        { label: 'NO₂', value: Math.round(weather.airQuality.no2), unit: 'μg/m³', color: '#45B7D1' },
        { label: 'O₃', value: Math.round(weather.airQuality.o3), unit: 'μg/m³', color: '#96CEB4' },
        { label: 'CO', value: Math.round(weather.airQuality.co * 100) / 100, unit: 'mg/m³', color: '#FFEAA7' },
      ];

      if (index >= pollutants.length) return null;
      const pollutant = pollutants[index];

      return (
        <View key={index} style={[styles.aqiSmallCard, { backgroundColor: 'rgba(45, 55, 70, 0.8)' }]}>
          <View style={[styles.pollutantIndicator, { backgroundColor: pollutant.color }]} />
          <Text style={[styles.pollutantLabel, { color }]}>{pollutant.label}</Text>
          <Text style={[styles.pollutantValue, { color }]}>{pollutant.value}</Text>
          <Text style={[styles.pollutantUnit, { color: color, opacity: 0.7 }]}>{pollutant.unit}</Text>
        </View>
      );
    }

    return (
      <View key={index} style={[styles.smallCard, { backgroundColor: 'rgba(100, 100, 100, 0.3)' }]}>
        <Text style={[styles.smallCardDay, { color: color, opacity: 0.8 }]}>{cardData.time}</Text>
        <View style={styles.smallCardWeather}>
          <Text style={styles.smallCardEmoji}>{cardData.emoji}</Text>
        </View>
        <Text style={[styles.smallCardTemp, { color }]}>
          {cardData.temperatureMin ? `${cardData.temperature}°/${cardData.temperatureMin}°` : `${cardData.temperature}°`}
        </Text>
        {cardData.precipitation > 0 && (
          <Text style={[styles.smallCardDesc, { color: color, opacity: 0.7 }]}>
            💧 {cardData.precipitation}mm
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={color} />
        <Text style={[styles.loadingText, { color }]}>Loading weather...</Text>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.errorText, { color }]}>Weather unavailable</Text>
        <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
          <Text style={[styles.retryText, { color }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let displayData;
  if (viewFilter === 'forecast') {
    displayData = timeFilter === 'today' ? getTodayData() : getNext7DaysData();
  }

  if (viewFilter !== 'aqi' && !displayData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.errorText, { color }]}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with filters */}
      <View style={styles.header}>
        {viewFilter === 'forecast' && (
          <View style={styles.timeFilters}>
            <TouchableOpacity 
              style={[styles.filterButton, timeFilter === 'today' && styles.activeFilter]}
              onPress={() => setTimeFilter('today')}
            >
              <Text style={[styles.filterText, { color: timeFilter === 'today' ? '#000' : color }]}>
                Today
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, timeFilter === 'next7days' && styles.activeFilter]}
              onPress={() => setTimeFilter('next7days')}
            >
              <Text style={[styles.filterText, { color: timeFilter === 'next7days' ? '#000' : color }]}>
                Next 7 days
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.viewFilters}>
          <TouchableOpacity 
            style={[styles.filterButton, viewFilter === 'forecast' && styles.activeFilter]}
            onPress={() => setViewFilter('forecast')}
          >
            <Text style={[styles.filterText, { color: viewFilter === 'forecast' ? '#000' : color }]}>
              Forecast
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, viewFilter === 'aqi' && styles.activeFilter]}
            onPress={() => setViewFilter('aqi')}
          >
            <Text style={[styles.filterText, { color: viewFilter === 'aqi' ? '#000' : color }]}>
              Air Quality
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather cards */}
      <View style={styles.cardsContainer}>
        {viewFilter === 'aqi' ? (
          <View style={styles.aqiContainer}>
            {renderAQIMainCard()}
            <View style={styles.aqiCardsRow}>
              {Array.from({ length: 5 }, (_, index) => renderSmallCard(null, index))}
            </View>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayData && renderMainCard(displayData.mainCard)}
            {displayData && displayData.hourlyCards.map((cardData, index) => renderSmallCard(cardData, index))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    maxWidth: 1920,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timeFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  viewFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  activeFilter: {
    backgroundColor: '#87CEEB',
    borderColor: '#87CEEB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '400',
  },
  mainCard: {
    width: 200,
    height: 280,
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainCardHeader: {
    gap: 4,
  },
  mainCardDay: {
    fontSize: 18,
    fontWeight: '700',
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  mainCardTemp: {
    fontSize: 52,
    fontWeight: 'bold',
    lineHeight: 52,
  },
  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherEmoji: {
    fontSize: 64,
  },
  mainCardFeels: {
    fontSize: 14,
    marginBottom: 4,
  },
  mainCardDesc: {
    fontSize: 14,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  sunTimes: {
    gap: 4,
  },
  sunTime: {
    fontSize: 12,
  },
  smallCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    padding: 12,
    marginRight: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  smallCardDay: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallCardWeather: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  smallCardEmoji: {
    fontSize: 32,
  },
  smallCardTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallCardDesc: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  // AQI Specific Styles
  aqiContainer: {
    flex: 1,
  },
  aqiMainCard: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aqiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  aqiTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  aqiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  aqiCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 100,
    height: 100,
  },
  aqiArcBackground: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.1)',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '135deg' }],
  },
  aqiArcProgress: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'transparent',
    borderLeftColor: '#00e400', // This will be overridden
    borderTopColor: '#00e400', // This will be overridden
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  aqiProgressDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aqiValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  aqiValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  aqiInfo: {
    flex: 1,
  },
  aqiLevel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  aqiDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  aqiCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  aqiSmallCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pollutantIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginBottom: 8,
  },
  pollutantLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  pollutantValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pollutantUnit: {
    fontSize: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  retryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WeatherDashboard;