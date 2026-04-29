function getWeather() {
  const city = document.getElementById("city").value.trim();
  const apiKey = "0196eb753b32483ebb3144743262904";


  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      const tempC = data.current.temp_c;
      const tempF = data.current.temp_f;
      const condition = data.current.condition.text;
      const windm = data.current.wind_mph;
      const windk = data.current.wind_kph;
      const location = data.location.name;

      document.getElementById("result").innerHTML =
        `Temperature: ${tempC}°C | ${tempF}F <br> Condition: ${condition}`;
    })
    .catch(error => {
      console.log("Error:", error);
    });
}