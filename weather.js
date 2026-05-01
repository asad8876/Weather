const apiKey = "0196eb753b32483ebb3144743262904";
let useCelsius = true;
let weatherData = null;


function displayWeather(data){
  const location = data.location.name;
  const tempC = data.current.temp_c;
  const tempF = data.current.temp_f;
  const atmosphere = data.current.condition.text;
  const windM = data.current.wind_mph;
  const windK = data.current.wind_kph;
  const humidity = data.current.humidity;
  const temp = useCelsius ? tempC + "°C" : tempF + "°F";   
  const toggleText = useCelsius ? "°F" : "°C";             


  document.getElementById("result").innerHTML =
   `Location: ${location} <br>
    Temperature: ${temp} <button id="toggleBtn">${toggleText}</button><br> 
    Atmosphere: ${atmosphere} <br> 
    Wind: ${windM} Mph | ${windK} Kph <br>
    Humidity: ${humidity}%`;

    document.getElementById("toggleBtn").onclick = () => {
        if(!weatherData) return;
    useCelsius = !useCelsius;
    displayWeather(weatherData);
}
}

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    document.getElementById("result").innerHTML = "Please enter a city name.";
    return;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        document.getElementById("result").innerHTML = "City not found";
      } else {
        weatherData = data;
        displayWeather(data);
      }
    })
    .catch(() => {
      document.getElementById("result").innerHTML = "Failed to fetch weather.";
    });
}

function showWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        document.getElementById("result").innerHTML = data.error.message;
      } else {
        weatherData = data;
        displayWeather(data);
      }
    })
    .catch(err => {
      document.getElementById("result").innerHTML = "Error fetching weather.";
      console.error(err);
    });
}

function showError() {
  document.getElementById("result").innerHTML =
    "Location access denied.";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", getWeather);

  
  document.getElementById("currentBtn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(showWeather, showError); 
  });
});