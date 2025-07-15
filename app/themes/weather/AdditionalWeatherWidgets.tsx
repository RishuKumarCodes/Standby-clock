import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Defs, Stop, Polygon, Line, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const ThermometerIcon = ({ size = 24, color = "#FF6B6B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0zM12 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill={color} />
  </Svg>
);

const CompassIcon = ({ size = 24, color = "#4A90E2" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={color} />
  </Svg>
);

const EyeIcon = ({ size = 24, color = "#87CEEB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

const BarometerIcon = ({ size = 24, color = "#9370DB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="12" y1="6" x2="12" y2="10" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="14" x2="12" y2="18" stroke={color} strokeWidth="2" />
    <Line x1="6" y1="12" x2="10" y2="12" stroke={color} strokeWidth="2" />
    <Line x1="14" y1="12" x2="18" y2="12" stroke={color} strokeWidth="2" />
  </Svg>
);

const ActivityIcon = ({ size = 24, color = "#FF6B6B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ size = 24, color = "#4A90E2" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
  </Svg>
);

// Real Feel Temperature Widget
const RealFeelWidget = ({ data }) => (
  <LinearGradient
    colors={['#FF9A9E', '#FECFEF']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Real Feel</Text>
    <View style={styles.realFeelContainer}>
      <ThermometerIcon size={50} color="#FFFFFF" />
      <View style={styles.realFeelValues}>
        <Text style={styles.realFeelMain}>{data?.current?.feelsLike || 34}°</Text>
        <Text style={styles.realFeelLabel}>Feels Like</Text>
        <View style={styles.realFeelComparison}>
          <Text style={styles.realFeelActual}>Actual: {data?.current?.temperature || 28}°</Text>
          <Text style={styles.realFeelDiff}>+{(data?.current?.feelsLike || 34) - (data?.current?.temperature || 28)}°</Text>
        </View>
      </View>
    </View>
    <View style={styles.realFeelFactors}>
      <View style={styles.factor}>
        <Text style={styles.factorLabel}>Humidity</Text>
        <Text style={styles.factorValue}>{data?.current?.humidity || 85}%</Text>
      </View>
      <View style={styles.factor}>
        <Text style={styles.factorLabel}>Wind</Text>
        <Text style={styles.factorValue}>{data?.current?.windSpeed || 5} km/h</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
      <Text style={styles.statusText}>Significantly Warmer</Text>
    </View>
  </LinearGradient>
);

// Wind Direction Widget
const WindDirectionWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Wind Direction</Text>
    <View style={styles.windDirectionContainer}>
      <View style={styles.compassRose}>
        <CompassIcon size={80} color="#FFFFFF" />
        <View style={styles.windDirectionArrow} />
        <Text style={styles.windDirectionDegree}>{data?.current?.windDirection || 90}°</Text>
      </View>
      <View style={styles.windDirectionDetails}>
        <Text style={styles.windDirectionCardinal}>East</Text>
        <Text style={styles.windDirectionSpeed}>{data?.current?.windSpeed || 12} km/h</Text>
        <Text style={styles.windDirectionGust}>Gusts: {data?.current?.windGusts || 18} km/h</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#4A90E2' }]} />
      <Text style={styles.statusText}>Steady from East</Text>
    </View>
    <Text style={styles.widgetSubtext}>Consistent easterly winds with occasional gusts expected through the afternoon.</Text>
  </LinearGradient>
);

// Air Quality Index Detailed Widget
const AQIDetailedWidget = ({ data }) => (
  <LinearGradient
    colors={['#FC466B', '#3F5EFB']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Air Quality</Text>
    <View style={styles.aqiDetailedContainer}>
      <View style={styles.aqiMainValue}>
        <Text style={styles.aqiNumber}>{data?.airQuality?.aqi || 156}</Text>
        <Text style={styles.aqiCategory}>{data?.airQuality?.aqiLevel || "Unhealthy"}</Text>
      </View>
      <View style={styles.aqiScale}>
        <View style={[styles.aqiScaleBar, { backgroundColor: '#00E400', width: '16.67%' }]} />
        <View style={[styles.aqiScaleBar, { backgroundColor: '#FFFF00', width: '16.67%' }]} />
        <View style={[styles.aqiScaleBar, { backgroundColor: '#FF7E00', width: '16.67%' }]} />
        <View style={[styles.aqiScaleBar, { backgroundColor: '#FF0000', width: '16.67%' }]} />
        <View style={[styles.aqiScaleBar, { backgroundColor: '#8F3F97', width: '16.67%' }]} />
        <View style={[styles.aqiScaleBar, { backgroundColor: '#7E0023', width: '16.66%' }]} />
        <View style={styles.aqiIndicatorMark} />
      </View>
    </View>
    <View style={styles.pollutantsList}>
      <View style={styles.pollutant}>
        <Text style={styles.pollutantName}>PM2.5</Text>
        <Text style={styles.pollutantValue}>{data?.airQuality?.pm25 || 65} μg/m³</Text>
      </View>
      <View style={styles.pollutant}>
        <Text style={styles.pollutantName}>PM10</Text>
        <Text style={styles.pollutantValue}>{data?.airQuality?.pm10 || 89} μg/m³</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF0000' }]} />
      <Text style={styles.statusText}>Health Alert</Text>
    </View>
  </LinearGradient>
);

// Hourly Temperature Trend Widget
const HourlyTrendWidget = ({ data }) => (
  <LinearGradient
    colors={['#ffecd2', '#fcb69f']}
    style={[styles.widget, { width: (width - 80) / 2 }]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>24h Temperature Trend</Text>
    <View style={styles.hourlyTrendContainer}>
      <View style={styles.temperatureChart}>
        {[28, 29, 31, 33, 35, 34, 32, 30].map((temp, index) => (
          <View key={index} style={styles.hourlyBar}>
            <Text style={styles.hourlyTemp}>{temp}°</Text>
            <View style={[styles.tempBar, { height: (temp - 25) * 3 }]} />
            <Text style={styles.hourlyTime}>{9 + index * 3}:00</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={styles.trendSummary}>
      <Text style={styles.trendText}>Peak at 15:00 (35°)</Text>
      <Text style={styles.trendSubtext}>Gradual cooling expected</Text>
    </View>
  </LinearGradient>
);

// Sunrise/Sunset Widget
const SunTimesWidget = ({ data }) => (
  <LinearGradient
    colors={['#FDBB2D', '#22C1C3']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Sun Times</Text>
    <View style={styles.sunTimesContainer}>
      <View style={styles.sunPath}>
        <View style={styles.sunriseIcon}>🌅</View>
        <View style={styles.sunArc} />
        <View style={styles.sunsetIcon}>🌇</View>
        <View style={styles.currentSunPosition} />
      </View>
      <View style={styles.sunTimes}>
        <View style={styles.sunTime}>
          <Text style={styles.sunTimeLabel}>Sunrise</Text>
          <Text style={styles.sunTimeValue}>{data?.sun?.sunrise?.split('T')[1]?.substring(0, 5) || "6:24"}</Text>
        </View>
        <View style={styles.dayLength}>
          <Text style={styles.dayLengthLabel}>Daylight</Text>
          <Text style={styles.dayLengthValue}>12h 45m</Text>
        </View>
        <View style={styles.sunTime}>
          <Text style={styles.sunTimeLabel}>Sunset</Text>
          <Text style={styles.sunTimeValue}>{data?.sun?.sunset?.split('T')[1]?.substring(0, 5) || "19:09"}</Text>
        </View>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
      <Text style={styles.statusText}>Golden Hour: 18:30</Text>
    </View>
  </LinearGradient>
);

// Weather Radar Widget
const WeatherRadarWidget = ({ data }) => (
  <LinearGradient
    colors={['#141E30', '#243B55']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Weather Radar</Text>
    <View style={styles.radarContainer}>
      <View style={styles.radarScreen}>
        <View style={styles.radarGrid}>
          <View style={styles.radarLine} />
          <View style={[styles.radarLine, { transform: [{ rotate: '90deg' }] }]} />
        </View>
        <View style={styles.radarSweep} />
        <View style={styles.weatherBlob1} />
        <View style={styles.weatherBlob2} />
        <View style={styles.radarCenter} />
      </View>
      <Text style={styles.radarRange}>50km range</Text>
    </View>
    <View style={styles.radarLegend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#00FF00' }]} />
        <Text style={styles.legendText}>Light</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#FFFF00' }]} />
        <Text style={styles.legendText}>Moderate</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: '#FF0000' }]} />
        <Text style={styles.legendText}>Heavy</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#00FF00' }]} />
      <Text style={styles.statusText}>Clear nearby</Text>
    </View>
  </LinearGradient>
);

// Weekly Forecast Widget
const WeeklyForecastWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={[styles.widget, { width: (width - 80) / 2 }]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>7-Day Forecast</Text>
    <View style={styles.weeklyContainer}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
        <View key={index} style={styles.dailyForecast}>
          <Text style={styles.dayLabel}>{day}</Text>
          <Text style={styles.weatherEmoji}>{index === 0 ? '☀️' : index < 3 ? '⛅' : '🌧️'}</Text>
          <Text style={styles.highTemp}>{32 - index}°</Text>
          <View style={styles.tempRange}>
            <View style={[styles.tempRangeBar, { width: `${80 - index * 5}%` }]} />
          </View>
          <Text style={styles.lowTemp}>{24 - index}°</Text>
        </View>
      ))}
    </View>
  </LinearGradient>
);

// Atmospheric Pressure Trend Widget
const PressureTrendWidget = ({ data }) => (
  <LinearGradient
    colors={['#a8edea', '#fed6e3']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Pressure Trend</Text>
    <View style={styles.pressureTrendContainer}>
      <BarometerIcon size={60} color="#FFFFFF" />
      <View style={styles.pressureChart}>
        <View style={styles.pressureLine}>
          {[1015, 1013, 1011, 1009, 1008, 1010, 1012].map((pressure, index) => (
            <View key={index} style={[styles.pressurePoint, { bottom: (pressure - 1005) * 2 }]} />
          ))}
        </View>
      </View>
    </View>
    <View style={styles.pressureValues}>
      <Text style={styles.currentPressure}>{data?.current?.pressure || 1008} mb</Text>
      <Text style={styles.pressureChange}>↓ 7 mb (24h)</Text>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
      <Text style={styles.statusText}>Falling</Text>
    </View>
    <Text style={styles.widgetSubtext}>Pressure dropping indicates potential weather change.</Text>
  </LinearGradient>
);

// Main Additional Widgets Dashboard
const AdditionalWeatherWidgets = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData = {
      current: {
        temperature: 28,
        feelsLike: 34,
        humidity: 85,
        windSpeed: 12,
        windDirection: 90,
        windGusts: 18,
        pressure: 1008,
      },
      airQuality: {
        aqi: 156,
        aqiLevel: "Unhealthy",
        pm25: 65,
        pm10: 89,
      },
      sun: {
        sunrise: "2025-06-28T06:24:00",
        sunset: "2025-06-28T19:09:00",
      },
    };
    setWeatherData(mockData);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            <RealFeelWidget data={weatherData} />
            <WindDirectionWidget data={weatherData} />
            <AQIDetailedWidget data={weatherData} />
            <SunTimesWidget data={weatherData} />
          </View>
          <View style={styles.row}>
            <HourlyTrendWidget data={weatherData} />
            <WeatherRadarWidget data={weatherData} />
            <PressureTrendWidget data={weatherData} />
            <WeeklyForecastWidget data={weatherData} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  dashboard: {
    padding: 20,
    minWidth: width,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  widget: {
    width: (width - 100) / 4,
    height: 220,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  widgetTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
    opacity: 0.9,
  },
  widgetSubtext: {
    color: 'white',
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
    marginTop: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFA500',
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Real Feel Widget Styles
  realFeelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  realFeelValues: {
    marginLeft: 15,
    flex: 1,
  },
  realFeelMain: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  realFeelLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  realFeelComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  realFeelActual: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  realFeelDiff: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  realFeelFactors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  factor: {
    alignItems: 'center',
  },
  factorLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  factorValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Wind Direction Widget Styles
  windDirectionContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  compassRose: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
  },
  windDirectionArrow: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: '#FF6B6B',
    top: 15,
    transform: [{ rotate: '90deg' }],
  },
  windDirectionDegree: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  windDirectionDetails: {
    alignItems: 'center',
  },
  windDirectionCardinal: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  windDirectionSpeed: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  windDirectionGust: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
  },

  // AQI Detailed Widget Styles
  aqiDetailedContainer: {
    marginBottom: 15,
  },
  aqiMainValue: {
    alignItems: 'center',
    marginBottom: 15,
  },
  aqiNumber: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  aqiCategory: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  aqiScale: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 15,
  },
  aqiScaleBar: {
    height: '100%',
  },
  aqiIndicatorMark: {
    position: 'absolute',
    top: -2,
    left: '65%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  pollutantsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pollutant: {
    alignItems: 'center',
  },
  pollutantName: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  pollutantValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Hourly Trend Widget Styles
  hourlyTrendContainer: {
    flex: 1,
  },
  temperatureChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 15,
  },
  hourlyBar: {
    alignItems: 'center',
    flex: 1,
  },
  hourlyTemp: {
    color: 'white',
    fontSize: 10,
    marginBottom: 5,
  },
  tempBar: {
    width: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginBottom: 5,
  },
  hourlyTime: {
    color: 'white',
    fontSize: 9,
    opacity: 0.7,
  },
  trendSummary: {
    alignItems: 'center',
  },
  trendText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trendSubtext: {
    color: 'white',
    fontSize: 10,
    opacity: 0.7,
  },

  // Sun Times Widget Styles
  sunTimesContainer: {
    marginBottom: 15,
  },
  sunPath: {
    height: 60,
    position: 'relative',
    marginBottom: 15,
  },
  sunriseIcon: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontSize: 20,
  },
  sunsetIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontSize: 20,
  },
  sunArc: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 40,
    borderTopWidth: 2,
    borderTopColor: '#FFD700',
    borderRadius: 50,
  },
  currentSunPosition: {
    position: 'absolute',
    top: 20,
    left: '60%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sunTime: {
    alignItems: 'center',
  },
  sunTimeLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  sunTimeValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayLength: {
    alignItems: 'center',
  },
  dayLengthLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  dayLengthValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Weather Radar Widget Styles
  radarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  radarScreen: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,255,0,0.1)',
    position: 'relative',
    marginBottom: 10,
  },
  radarGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radarLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,255,0,0.3)',
  },
  radarSweep: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,0,0.3) 30deg, transparent 60deg)',
  },
  weatherBlob1: {
    position: 'absolute',
    top: 20,
    right: 25,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFFF00',
    opacity: 0.7,
  },

  // Continuing from weatherBlob2 and completing the styles...

  weatherBlob2: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    opacity: 0.6,
  },
  radarCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FF00',
    marginTop: -2,
    marginLeft: -2,
  },
  radarRange: {
    color: 'white',
    fontSize: 11,
    opacity: 0.7,
  },
  radarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },

  // Weekly Forecast Widget Styles
  weeklyContainer: {
    flex: 1,
  },
  dailyForecast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
    width: 25,
  },
  weatherEmoji: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  highTemp: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    width: 25,
    textAlign: 'right',
  },
  tempRange: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  tempRangeBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  lowTemp: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
    width: 25,
    textAlign: 'right',
  },

  // Pressure Trend Widget Styles
  pressureTrendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pressureChart: {
    flex: 1,
    height: 40,
    marginLeft: 15,
    position: 'relative',
  },
  pressureLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  pressurePoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A90E2',
    position: 'absolute',
  },
  pressureValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPressure: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pressureChange: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdditionalWeatherWidgets;