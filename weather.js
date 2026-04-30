const apiKey = "0196eb753b32483ebb3144743262904";

    function displayWeather(data){
      const location = data.location.name;
      const tempC = data.current.temp_c;
      const tempF = data.current.temp_f;
      const atmosphere = data.current.condition.text;
      const windM = data.current.wind_mph;
      const windK = data.current.wind_kph;
      const humidity = data.current.humidity;

      document.getElementById("result").innerHTML =
        `Location: ${location} <br>
        Temperature: ${tempC}°C | ${tempF}F <br> 
        Atmosphere: ${atmosphere} <br> 
        Wind: ${windM} Mph | ${windK} Kph <br>
        Humidity: ${humidity}%`;
    }

function getWeather() {
  const city = document.getElementById("city").value.trim();


  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {displayWeather(data)})
    .catch(error => {console.log("Error:", error);});
}

    document.getElementById("button").addEventListener("click", getWeather);

    document.getElementById("currentBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather, showError);
     } else {
     document.getElementById("result").innerHTML =
      "Geolocation not supported.";
     }
     });


    function showWeather(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {displayWeather(data)})
        .catch(err => {
          document.getElementById("result").innerHTML = "Error fetching weather.";
          console.error(err);});
    }

    function showError() {
      document.getElementById("output").innerHTML =
        "Location access denied.";
    }