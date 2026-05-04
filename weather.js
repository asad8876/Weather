const apiKey = "0196eb753b32483ebb3144743262904";

const STORAGE_KEY = "recentCities";

/* ---------- STORAGE ---------- */
const getCities = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveCity = (city) => {
  let cities = getCities().filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.slice(0, 5)));
};

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

/* ---------- DROPDOWN ---------- */
function renderDropdown(show = false) {
  const cities = getCities();
  const d = document.getElementById("recentDropdown");

  if (!d) return;

  if (cities.length === 0) {
    d.style.display = "none";
    d.innerHTML = "";
    return;
  }

  d.innerHTML = cities
    .map(c => `<div class="dropdown-item p-2 cursor-pointer hover:bg-gray-100">${c}</div>`)
    .join("");

  d.style.display = show ? "block" : "none"; // ✅ control visibility
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

  resultBox.innerHTML = `<p class="font-bold md:mb-3" text-sm>Today's Weather</p>
    ${alert ? `<div style="color:red;font-weight:bold">${alert}</div>` : ""}
    Location: ${place}<br>
    <div class="flex items-center justify-center gap-2">
      Temperature: ${temp}${unit} 
      <button id="toggleBtn" class="px-2 py-1 bg-white rounded border text-xs md:text-base">${isCelsius ? "°F" : "°C"}</button>
    </div>  
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
    <div class="forecastContainer flex flex-col">
      <p class="forecastHeading text-center text-white font-bold
      xl:text-2xl xl:mt-12
      md:mt-20 mb-5">Upcoming 6 Days Forecast</p>

      <div class="forecastRow w-full flex flex-wrap justify-center items-center gap-3 mt-5">
        ${days.slice(1).map(day => {
          const style = getWeatherStyle(day.day.condition.text);

          return `
            <div class="forecastCard bg-white rounded-lg text-center border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between 
            xl:w-50 h-36 p-3
            md:w-50 h-36">
              <strong>${new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}</strong><br>
              ${style.icon} ${day.day.condition.text}<br>
              🌡️ ${day.day.mintemp_c}°C - ${day.day.maxtemp_c}°C
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

/* ---------- FETCH ---------- */
function fetchWeather(url, cityName) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) return resultBox.innerHTML = "City not found";
      weatherInfo = data;
      renderDropdown();
      showWeather(data);
    })
    .catch(() => resultBox.innerHTML = "Error fetching weather");
}

function getCityWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return resultBox.innerHTML = "Enter a city name";

  saveCity(city);        // ✅ store city
  renderDropdown();      // ✅ update dropdown

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

  document.getElementById("city").addEventListener("focus", () => {
    renderDropdown(true);
  });

  document.getElementById("recentDropdown").addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    const cityInput = document.getElementById("city");
    const dropdown = document.getElementById("recentDropdown");

    cityInput.value = e.target.textContent;
    dropdown.style.display = "none"; // ✅ hide dropdown

    getCityWeather();
  }
});
   document.getElementById("city").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const value = e.target.value.trim();
    if (!value) return;

    saveCity(value);
    renderDropdown();
    document.getElementById("recentDropdown").style.display = "block";

    fetchWeather(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${value}&days=7`
    );
  }
});

  const cityInput = document.getElementById("city");
  const dropdown = document.getElementById("recentDropdown");

  document.addEventListener("click", (e) => {
    if (!cityInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
  renderDropdown();
});