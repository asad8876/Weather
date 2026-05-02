const apiKey = "0196eb753b32483ebb3144743262904";

let isCelsius = true;
let weatherInfo = null;

const resultBox = document.getElementById("result");
const forecastBox = document.getElementById("forecast");

/* ---------- ALERT ---------- */
function getAlert(tempC) {
  if (tempC > 40) return "⚠️ Extreme Heat Alert!";
  if (tempC < 0) return "❄️ Extreme Cold Alert!";
  return "";
}

/* ---------- WEATHER STYLE ---------- */
function getWeatherStyle(text) {
  const t = text.toLowerCase();

  const styles = [
    { keys: ["sun", "clear"], icon: "☀️", bg: "linear-gradient(to right,#fceabb,#f8b500)" },
    { keys: ["partly", "cloud"], icon: "☁️", bg: "linear-gradient(to right,#bdc3c7,#2c3e50)" },
    { keys: ["rain", "drizzle"], icon: "🌧️", bg: "linear-gradient(to right,#4b79a1,#283e51)" },
    { keys: ["snow"], icon: "❄️", bg: "linear-gradient(to right,#e6dada,#274046)" },
    { keys: ["thunder", "storm", "thundery"], icon: "⛈️", bg: "linear-gradient(to right,#141e30,#243b55)" }
  ];

  const match = styles.find(s => s.keys.some(k => t.includes(k)));
  return match || { icon: "🌤️", bg: "#87CEEB" };
}

/* ---------- MAIN WEATHER ---------- */
function showWeather(data) {
  const current = data.current;
  const place = data.location.name;

  const style = getWeatherStyle(current.condition.text);
  resultBox.style.background = style.bg;

  const temp = isCelsius ? current.temp_c : current.temp_f;
  const wind = `${current.wind_kph} Kph (${current.wind_mph} Mph)`;
  const unit = isCelsius ? "°C" : "°F";

  const alert = getAlert(current.temp_c);

  resultBox.innerHTML = `
    ${alert ? `<div style="color:red;font-weight:bold">${alert}</div>` : ""}
    Location: ${place}<br>
    Temperature: ${temp}${unit} 
    <button id="toggleBtn">${isCelsius ? "°F" : "°C"}</button><br>
    Weather: ${style.icon} ${current.condition.text}<br>
    Wind: ${wind}<br>
    Humidity: ${current.humidity}%
  `;

  document.getElementById("toggleBtn").onclick = () => {
  isCelsius = !isCelsius; // ✔ only current weather changes
  showWeather(weatherInfo);
};

  forecastBox.innerHTML = showForecast(data);
}

/* ---------- FORECAST ---------- */
function showForecast(data) {
  const days = data.forecast?.forecastday;
  if (!days) return "No forecast data";

  return `
    <h3>Forecast</h3>
    ${days.slice(1).map(day => {
      const style = getWeatherStyle(day.day.condition.text);
      const unit = "°C";

      const min = day.day.mintemp_c;
      const max = day.day.maxtemp_c;

      return `
        <div style="margin:10px;padding:10px;background:rgba(255,255,255,0.2);border-radius:8px;">
          <strong>${new Date(day.date).toDateString()}</strong><br>
          ${style.icon} ${day.day.condition.text}<br>
          🌡️ ${min}${unit} - ${max}${unit}
        </div>
      `;
    }).join("")}
  `;
}

/* ---------- FETCH ---------- */
function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) return resultBox.innerHTML = "City not found";
      weatherInfo = data;
      showWeather(data);
    })
    .catch(() => resultBox.innerHTML = "Error fetching weather");
}

function getCityWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return resultBox.innerHTML = "Enter a city name";

  fetchWeather(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
}

function getLocationWeather(pos) {
  const { latitude, longitude } = pos.coords;

  fetchWeather(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7`);
}

function locationError() {
  resultBox.innerHTML = "Location access denied.";
}

/* ---------- EVENTS ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").onclick = getCityWeather;

  document.getElementById("currentBtn").onclick = () => {
    navigator.geolocation.getCurrentPosition(getLocationWeather, locationError);
  };
});