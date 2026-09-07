import { useState, useEffect } from "react";

function App() {

  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Saharanpur");
  const [validationError, setValidationError] = useState<boolean>(false);

  useEffect(() => {
    getWeather();
  }, []);

  type WeatherCondition = {
    id: number,
    main: string,
    description: string,
    icon: string
  }

  type MainWeather = {
    temp: number,
    feels_like: number,
    humidity: number
  }

  type Wind = {
    speed: number
  }

  type Weather = {
    name: string,
    main: MainWeather,
    weather: WeatherCondition[],
    wind: Wind
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    getWeather();
  }

  const getWeather = async () => {
    if (!city.trim()) {
      setValidationError(true);
      setWeather(null);
      return;
    }
    setError(null);
    setValidationError(false);
    setLoading(true);

    try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 404) {
        setError("City not found");
        setWeather(null);
        return;
      }
      throw new Error("Failed To Fetch Weather");
    }
    const data: Weather = await response.json();

    setWeather(data);

    } 
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }

      setWeather(null);
    } 
    finally {
    setLoading(false);
    }
  }
  

  return (
    <main className="flex flex-col gap-0.5 justify-center items-center p-2">

      {/*Header*/}
      <div>
    <h1 className="text-2xl font-bold mt-12">Weather</h1>
    </div>
    
    {/*Search*/}
    <form onSubmit={handleSubmit} className="flex flex-col min-[250px]:flex-row gap-2 p-1.5">
    <input type="text" placeholder="Search City" value={city} onChange={(e) => setCity(e.target.value)} className="border-0 bg-gray-600 w-full py-1 px-2 rounded-sm max-w-2xl" />
    <button disabled={loading} type="submit" className="bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded-sm">{/*loading ? "Searching" : "Search"*/}Search</button>
    </form>

    {/*Weather Card*/}
    <div className="p-1.5 flex flex-col items-center gap-1">
    {loading && <h1>Loading</h1>}
    {validationError && <p className="text-red-500">Please enter a city</p>}

    {error && <h1>{error}</h1>}

    {weather && (
      <>
    <h1 className="text-lg font-bold">{weather.name}</h1>
     <h1 className="text-2xl">{Math.round(weather.main.temp)}°C</h1>
     <p>{weather.weather[0].main}</p>
     <p>{weather.weather[0].description}</p>
     <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Condition" />
     <div className="flex flex-col gap-1.5">
     <p className="bg-gray-800 py-1 px-2 rounded-sm text-gray-200 text-sm">Feels Like {Math.round(weather.main.feels_like)}°C</p>
     <p className="bg-gray-800 py-1 px-2 rounded-sm text-gray-200 text-sm">Humidity {weather.main.humidity}%</p>
     <p className="bg-gray-800 py-1 px-2 rounded-sm text-gray-200 text-sm">Wind Speed {weather.wind.speed} m/s</p>
     </div>
    </>
    )}
    </div>
    </main>
  )
}

export default App;
