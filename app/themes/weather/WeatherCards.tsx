import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Defs, Stop } from 'react-native-svg';
import { fetchDetailedWeatherData } from '@/app/api/weatherAPI';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const SunIcon = ({ size = 24, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="5" fill={color} />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CloudIcon = ({ size = 24, color = "#87CEEB" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill={color} />
  </Svg>
);

const DropletIcon = ({ size = 24, color = "#4A90E2" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill={color} />
  </Svg>
);

const WindIcon = ({ size = 24, color = "#B0C4DE" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M17.7 7.7a2.5 2.5 0 0 0-3.5-3.5L9.586 8.828a2 2 0 0 1-2.828 0L5.344 7.414a1 1 0 0 0-1.414 1.414l1.414 1.414a4 4 0 0 0 5.657 0L15.636 5.608a.5.5 0 0 1 .707.707L14.464 8.172a1 1 0 0 0 1.414 1.414L17.7 7.7z" fill={color} />
    <Path d="M2.5 16.5h7M2.5 20.5h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MoonIcon = ({ size = 24, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} />
  </Svg>
);

// Temperature Widget
const TemperatureWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Temperature</Text>
    <View style={styles.temperatureContainer}>
      <SunIcon size={40} />
      <Text style={styles.temperatureValue}>{data?.current?.temperature || 28}°</Text>
    </View>
    <View style={styles.temperatureBar}>
      <View style={[styles.temperatureProgress, { width: '65%' }]} />
    </View>
    <View style={styles.statusContainer}>
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>Steady</Text>
    </View>
    <Text style={styles.widgetSubtext}>Steady at current value of {data?.current?.temperature || 28}°.</Text>
  </LinearGradient>
);

// Feels Like Widget
const FeelsLikeWidget = ({ data }) => (
  <LinearGradient
    colors={['#f093fb', '#f5576c']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Feels like</Text>
    <View style={styles.feelsLikeContainer}>
      <View style={styles.feelsLikeBar}>
        <View style={[styles.feelsLikeProgress, { width: '70%' }]} />
        <View style={styles.feelsLikeIndicator} />
      </View>
      <Text style={styles.feelsLikeText}>Dominant factor: humidity</Text>
    </View>
    <View style={styles.feelsLikeValues}>
      <Text style={styles.feelsLikeMain}>Feels like: {data?.current?.feelsLike || 32}°</Text>
      <Text style={styles.feelsLikeActual}>Temperature: {data?.current?.temperature || 28}°</Text>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
      <Text style={styles.statusText}>Slightly Warm</Text>
    </View>
    <Text style={styles.widgetSubtext}>Feels warmer than the actual temperature due to the humidity.</Text>
  </LinearGradient>
);

// Cloud Cover Widget
const CloudCoverWidget = ({ data }) => (
  <LinearGradient
    colors={['#4facfe', '#00f2fe']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Cloud cover</Text>
    <View style={styles.cloudContainer}>
      <View style={styles.cloudCircle}>
        <CloudIcon size={60} color="#FFFFFF" />
        <Text style={styles.cloudLabel}>Cloudy</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#4A90E2' }]} />
      <Text style={styles.statusText}>Cloudy ({data?.current?.cloudCover || 88}%)</Text>
    </View>
    <Text style={styles.widgetSubtext}>Decreasing with partly sunny sky at 6:00 am.</Text>
  </LinearGradient>
);

// Precipitation Widget
const PrecipitationWidget = ({ data }) => (
  <LinearGradient
    colors={['#a8edea', '#fed6e3']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Precipitation</Text>
    <View style={styles.precipitationContainer}>
      <View style={styles.precipitationCircle}>
        <Text style={styles.precipitationValue}>{data?.current?.precipitation || 0}</Text>
        <Text style={styles.precipitationUnit}>cm</Text>
        <Text style={styles.precipitationPeriod}>in next 24h</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
      <Text style={styles.statusText}>No Precipitation</Text>
    </View>
    <Text style={styles.widgetSubtext}>Light rain expected on Wednesday night. Today is expected to see similar precipitation as...</Text>
  </LinearGradient>
);

// Wind Widget
const WindWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Wind</Text>
    <View style={styles.windContainer}>
      <View style={styles.windCompass}>
        <Text style={styles.compassDirection}>N</Text>
        <View style={styles.windArrow} />
        <Text style={styles.compassDirection}>S</Text>
      </View>
      <View style={styles.windDetails}>
        <Text style={styles.windDirection}>From E (90°)</Text>
        <Text style={styles.windSpeed}>{data?.current?.windSpeed || 1} km/h</Text>
        <Text style={styles.windSpeedLabel}>Wind Speed</Text>
        <Text style={styles.windGusts}>{data?.current?.windGusts || 23} km/h</Text>
        <Text style={styles.windGustsLabel}>Wind Gust</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
      <Text style={styles.statusText}>Force: 0 (Calm)</Text>
    </View>
    <Text style={styles.widgetSubtext}>Steady with averages holding at 2 km/h (gusts to 17) expected from E through morning.</Text>
  </LinearGradient>
);

// Humidity Widget
const HumidityWidget = ({ data }) => (
  <LinearGradient
    colors={['#4facfe', '#00f2fe']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Humidity</Text>
    <View style={styles.humidityContainer}>
      <View style={styles.humidityBars}>
        {[...Array(7)].map((_, i) => (
          <View key={i} style={[styles.humidityBar, { height: i < 6 ? '100%' : '80%' }]} />
        ))}
      </View>
      <View style={styles.humidityValues}>
        <Text style={styles.humidityMain}>{data?.current?.humidity || 93}%</Text>
        <Text style={styles.humidityLabel}>Relative Humidity</Text>
        <Text style={styles.dewPoint}>{data?.current?.dewPoint || 26}°</Text>
        <Text style={styles.dewPointLabel}>Dew point</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
      <Text style={styles.statusText}>Extremely humid</Text>
    </View>
    <Text style={styles.widgetSubtext}>Steady at 93%.</Text>
  </LinearGradient>
);

// UV Index Widget
const UVWidget = ({ data }) => (
  <LinearGradient
    colors={['#f093fb', '#f5576c']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>UV</Text>
    <View style={styles.uvContainer}>
      <View style={styles.uvCircle}>
        <Text style={styles.uvValue}>{data?.current?.uvIndex || 9}</Text>
        <View style={styles.uvIndicator} />
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF4500' }]} />
      <Text style={styles.statusText}>Very High</Text>
    </View>
    <Text style={styles.widgetSubtext}>Maximum UV exposure for today will be very high, expected at 11:00 am.</Text>
  </LinearGradient>
);

// AQI Widget
const AQIWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>AQI</Text>
    <View style={styles.aqiContainer}>
      <View style={styles.aqiCircle}>
        <Text style={styles.aqiValue}>{data?.airQuality?.aqi || 82}</Text>
        <View style={styles.aqiIndicator} />
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#4A90E2' }]} />
      <Text style={styles.statusText}>Moderate</Text>
    </View>
    <Text style={styles.widgetSubtext}>Deteriorating air quality with primary pollutant: PM10 90 μg/m³.</Text>
  </LinearGradient>
);

// Visibility Widget
const VisibilityWidget = ({ data }) => (
  <LinearGradient
    colors={['#4facfe', '#00f2fe']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Visibility</Text>
    <View style={styles.visibilityContainer}>
      <View style={styles.visibilityBars}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={[styles.visibilityBar, { opacity: 1 - (i * 0.15) }]} />
        ))}
      </View>
      <Text style={styles.visibilityValue}>{data?.current?.visibility || 2}</Text>
      <Text style={styles.visibilityUnit}>km</Text>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF6B6B' }]} />
      <Text style={styles.statusText}>Good</Text>
    </View>
    <Text style={styles.widgetSubtext}>Improving with a peak visibility distance of 15 km expected at 6:00 am.</Text>
  </LinearGradient>
);

// Pressure Widget
const PressureWidget = ({ data }) => (
  <LinearGradient
    colors={['#a8edea', '#fed6e3']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Pressure</Text>
    <View style={styles.pressureContainer}>
      <View style={styles.pressureBar}>
        <View style={[styles.pressureProgress, { width: '60%' }]} />
        <View style={styles.pressureIndicator} />
      </View>
      <Text style={styles.pressureValue}>{data?.current?.pressure || 1003}</Text>
      <Text style={styles.pressureUnit}>mb</Text>
      <Text style={styles.pressureTime}>5:13 AM (Now)</Text>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FF4500' }]} />
      <Text style={styles.statusText}>Rising</Text>
    </View>
    <Text style={styles.widgetSubtext}>Rising in the last 3 hours. Expected to fall in the next 3 hours.</Text>
  </LinearGradient>
);

// Moon Widget
const MoonWidget = ({ data }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Moon</Text>
    <View style={styles.moonContainer}>
      <View style={styles.moonPath}>
        <View style={styles.moonStart} />
        <View style={styles.moonCurrent} />
        <View style={styles.moonEnd} />
      </View>
      <Text style={styles.moonDuration}>13 hrs 43 mins</Text>
      <View style={styles.moonTimes}>
        <View style={styles.moonTime}>
          <Text style={styles.moonTimeValue}>7:32</Text>
          <Text style={styles.moonTimeLabel}>AM Moonrise</Text>
        </View>
        <View style={styles.moonTime}>
          <Text style={styles.moonTimeValue}>9:16</Text>
          <Text style={styles.moonTimeLabel}>PM Moonset</Text>
        </View>
      </View>
    </View>
  </LinearGradient>
);

// Moon Phase Widget
const MoonPhaseWidget = ({ data }) => (
  <LinearGradient
    colors={['#f093fb', '#f5576c']}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Moon phase</Text>
    <View style={styles.moonPhaseContainer}>
      <View style={styles.moonPhaseCircle}>
        <MoonIcon size={60} color="#FFD700" />
        <Text style={styles.moonPhasePercentage}>10%</Text>
        <Text style={styles.moonPhaseLabel}>Phase of moon</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
      <Text style={styles.statusText}>Next time full moon</Text>
    </View>
    <Text style={styles.widgetSubtext}>10 Jul</Text>
  </LinearGradient>
);

// Main Dashboard Component
const WeatherCards = () => {
  const [weatherData, setWeatherData] = useState(null);

  // useEffect(() => {
  //   // Simulated data - replace with actual API call using your fetchDetailedWeatherData function
  //   const mockData = {
  //     current: {
  //       temperature: 28,
  //       feelsLike: 32,
  //       humidity: 93,
  //       dewPoint: 26,
  //       pressure: 1003,
  //       windSpeed: 1,
  //       windGusts: 23,
  //       cloudCover: 88,
  //       precipitation: 0,
  //       visibility: 2,
  //       uvIndex: 9,
  //     },
  //     airQuality: {
  //       aqi: 82,
  //       aqiLevel: "Moderate",
  //     },
  //   };
  //   setWeatherData(mockData);
  // }, []);

  useEffect(() => {
  const loadWeatherData = async () => {
    try {
      const data = await fetchDetailedWeatherData(25.6, 85.1); // Patna coordinates
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  };
  loadWeatherData();
}, []);

  return (
    <View style={styles.container}>
      <ScrollView  showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.dashboard}>
          <View style={styles.row}>
            <TemperatureWidget data={weatherData} />
            <FeelsLikeWidget data={weatherData} />
            <CloudCoverWidget data={weatherData} />
            <PrecipitationWidget data={weatherData} />
          </View>
          <View style={styles.row}>
            <WindWidget data={weatherData} />
            <HumidityWidget data={weatherData} />
            <UVWidget data={weatherData} />
            <AQIWidget data={weatherData} />
          </View>
          <View style={styles.row}>
            <VisibilityWidget data={weatherData} />
            <PressureWidget data={weatherData} />
            <MoonWidget data={weatherData} />
            <MoonPhaseWidget data={weatherData} />
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
    height: 200,
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
  // Temperature Widget Styles
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  temperatureValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  temperatureBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  temperatureProgress: {
    height: '100%',
    backgroundColor: '#00FFFF',
    borderRadius: 2,
  },
  // Feels Like Widget Styles
  feelsLikeContainer: {
    marginBottom: 15,
  },
  feelsLikeBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 10,
    position: 'relative',
  },
  feelsLikeProgress: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  feelsLikeIndicator: {
    position: 'absolute',
    top: -2,
    right: '30%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  feelsLikeText: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  feelsLikeValues: {
    marginBottom: 10,
  },
  feelsLikeMain: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feelsLikeActual: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  // Cloud Cover Widget Styles
  cloudContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cloudCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  // Precipitation Widget Styles
  precipitationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  precipitationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  precipitationValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  precipitationUnit: {
    color: 'white',
    fontSize: 12,
  },
  precipitationPeriod: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  // Wind Widget Styles
  windContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  windCompass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  compassDirection: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
  },
  windArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#4A90E2',
    transform: [{ rotate: '45deg' }],
  },
  windDetails: {
    flex: 1,
  },
  windDirection: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  windSpeed: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  windSpeedLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  windGusts: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  windGustsLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  // Humidity Widget Styles
  humidityContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  humidityBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    marginRight: 20,
  },
  humidityBar: {
    width: 6,
    backgroundColor: '#4A90E2',
    marginRight: 3,
    borderRadius: 3,
  },
  humidityValues: {
    flex: 1,
  },
  humidityMain: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  humidityLabel: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  dewPoint: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dewPointLabel: {
    color: 'white',
    fontSize: 11,
    opacity: 0.8,
  },
  // UV Widget Styles
  uvContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uvCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  uvValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  uvIndicator: {
    position: 'absolute',
    top: -5,
    right: 10,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FF4500',
  },
  // AQI Widget Styles
  aqiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  aqiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  aqiValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  aqiIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    width: 20,
    height: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  // Visibility Widget Styles
  visibilityContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  visibilityBars: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
  },
  visibilityBar: {
    width: 20,
    height: '100%',
    backgroundColor: '#00FF7F',
    marginRight: 3,
    borderRadius: 2,
  },
  visibilityValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  visibilityUnit: {
    color: 'white',
    fontSize: 14,
  },
  // Pressure Widget Styles
  pressureContainer: {
    marginBottom: 15,
  },
  pressureBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 15,
    position: 'relative',
  },
  pressureProgress: {
    height: '100%',
    backgroundColor: '#9370DB',
    borderRadius: 3,
  },
  pressureIndicator: {
    position: 'absolute',
    top: -2,
    right: '40%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  pressureValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  pressureUnit: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  pressureTime: {
    color: 'white',
    fontSize: 11,
    opacity: 0.7,
    marginTop: 5,
  },
  // Moon Widget Styles
  moonContainer: {
    marginBottom: 15,
  },
  moonPath: {
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  moonStart: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  moonCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  moonEnd: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  moonDuration: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  moonTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moonTime: {
    alignItems: 'center',
  },
  moonTimeValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moonTimeLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  // Moon Phase Widget Styles
  moonPhaseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moonPhaseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moonPhasePercentage: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 15,
  },
  moonPhaseLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
    position: 'absolute',
    bottom: 5,
  },
});

export default WeatherCards;