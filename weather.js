function getWeather() {
  const city = document.getElementById("city").value.trim();
  const apiKey = "0196eb753b32483ebb3144743262904";


  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      const location = data.location.name;
      const tempC = data.current.temp_c;
      const tempF = data.current.temp_f;
      const condition = data.current.condition.text;
      const windM = data.current.wind_mph;
      const windK = data.current.wind_kph;

      document.getElementById("result").innerHTML =
        `Location: ${location}
        Temperature: ${tempC}°C | ${tempF}F <br> 
        Condition: ${condition} <br> 
        Wind: ${windM} | ${windK}`;
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

    document.getElementById("button").addEventListener("click", getWeather);