import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Thermometer, Search, MapPin } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('Toronto');
  const [searchCity, setSearchCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace with your actual API key
  const API_KEY = '13f092c329299d6c06040e4c87a09990';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity);
      fetchWeather(searchCity);
      setSearchCity('');
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-400 to-blue-600';
    
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes('clear')) return 'from-yellow-400 to-orange-500';
    if (main.includes('cloud')) return 'from-gray-400 to-gray-600';
    if (main.includes('rain')) return 'from-blue-500 to-blue-700';
    if (main.includes('snow')) return 'from-blue-200 to-blue-400';
    if (main.includes('thunder')) return 'from-purple-600 to-purple-900';
    return 'from-blue-400 to-blue-600';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-500 p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Cloud className="w-10 h-10" />
            Weather Dashboard
          </h1>
          <p className="text-white/80 text-lg">Real-time weather information</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 rounded-full text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white text-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/90 text-white p-4 rounded-lg text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Weather Data */}
        {weatherData && !loading && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <div className="flex items-center gap-2 text-white/90 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-2xl font-semibold">
                      {weatherData.name}, {weatherData.sys.country}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    {formatDate(weatherData.dt)}
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={getWeatherIcon(weatherData.weather[0].icon)}
                      alt={weatherData.weather[0].description}
                      className="w-32 h-32"
                    />
                    <div>
                      <div className="text-7xl font-bold text-white">
                        {Math.round(weatherData.main.temp)}°
                      </div>
                      <div className="text-white/80 text-xl capitalize mt-2">
                        {weatherData.weather[0].description}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-white/90 space-y-3">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5" />
                    <span>Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5" />
                    <span>Min: {Math.round(weatherData.main.temp_min)}°C / Max: {Math.round(weatherData.main.temp_max)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Humidity */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-6 h-6 text-blue-200" />
                  <span className="text-white/70 text-sm">Humidity</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.main.humidity}%
                </div>
              </div>

              {/* Wind Speed */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-6 h-6 text-blue-200" />
                  <span className="text-white/70 text-sm">Wind Speed</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.wind.speed} m/s
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Gauge className="w-6 h-6 text-blue-200" />
                  <span className="text-white/70 text-sm">Pressure</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {weatherData.main.pressure} hPa
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6 text-blue-200" />
                  <span className="text-white/70 text-sm">Visibility</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {(weatherData.visibility / 1000).toFixed(1)} km
                </div>
              </div>
            </div>

            {/* Sunrise/Sunset */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <Sun className="w-10 h-10 text-yellow-300 mx-auto mb-2" />
                  <div className="text-white/70 text-sm mb-1">Sunrise</div>
                  <div className="text-white text-xl font-semibold">
                    {formatTime(weatherData.sys.sunrise)}
                  </div>
                </div>
                <div className="h-16 w-px bg-white/20"></div>
                <div className="text-center">
                  <Sun className="w-10 h-10 text-orange-300 mx-auto mb-2" />
                  <div className="text-white/70 text-sm mb-1">Sunset</div>
                  <div className="text-white text-xl font-semibold">
                    {formatTime(weatherData.sys.sunset)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>Powered by OpenWeatherMap API</p>
          <p className="mt-1">COMP 3123 - Full Stack Development Lab Test 2</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
