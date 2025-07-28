
import { useState } from 'react';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'fe808c7e0382c21972be3777b7ca7331'; // Replace with your actual API key

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);


    try {
      const encodedCity = encodeURIComponent(city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('❌ City not found. Please check the spelling.');
        } else if (response.status === 429) {
          throw new Error('⚠️ API request limit exceeded. Try again later.');
        } else {
          throw new Error('❌ Failed to fetch weather data. Please try again.');
        }
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather();
  };

  const getBackgroundUrl = () => {
    if (!weather) {
      return 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80';
    }

    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case 'clear':
        return 'https://images.unsplash.com/photo-1501973801540-537f08ccae7d?auto=format&fit=crop&w=1600&q=80';
      case 'clouds':
        return 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=80';
      case 'rain':
      case 'drizzle':
        return 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80';
      case 'snow':
        return 'https://images.unsplash.com/photo-1608889175600-5d703906e9f1?auto=format&fit=crop&w=1600&q=80';
      case 'thunderstorm':
        return 'https://images.unsplash.com/photo-1606788075761-9d3193a64740?auto=format&fit=crop&w=1600&q=80';
      default:
        return 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url('${getBackgroundUrl()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        padding: '20px',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Overlay for darkening the background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            backgroundColor: '#0288d1',
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: '6px',
          }}
        >
          🌤️ Weather Info Dashboard
        </h1>

        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: '10px',
              width: '250px',
              fontSize: '1rem',
              borderRadius: '4px',
              marginRight: '10px',
              border: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#00bcd4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {loading && <p>⏳ Loading weather data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {weather && (
          <div
            style={{
              margin: '0 auto',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              width: '300px',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>🌤️ {weather.weather[0].description}</p>
            <p>🌡️ Temp: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬️ Wind: {weather.wind.speed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
