const apiKey = "9195677d0010c5ed8b3059b59c364e87";
const now = (dayjs().format(' (M/DD/YYYY)'));
const current = document.getElementById('current');
const currentCity = document.getElementById("currentCity");
const humidityEl = document.getElementById('humidityEl');
const forecast = document.getElementById('forecast');
const forecastH3 = document.getElementById('forecastH3');
const forecastContainer = document.getElementById('forecastContainer');
const pastSearches = document.getElementById('pastSearches');
const cityInput = document.getElementById("cityInput");
const stateInput = document.getElementById("stateInput");
const searchForm = document.getElementById("searchForm");
const tempEl = document.getElementById('tempEl');
const uvEl = document.getElementById('uvEl');
const windEl = document.getElementById('windEl');


function handleInputSubmit(event) {
  event.preventDefault();

  const city = cityInput.value.trim();
  const state = stateInput.value.trim();

  if (!city) {
    return alert("You must enter a city")
  }

  getCoords(city, state);

  cityInput.value = '';
  stateInput.value = '';
};

function getCoords(city, state) {
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`

  fetch(geoURL)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(data => {
      const { lat, lon, name, state } = data[0];
      showWeather(lat, lon, name, state);
    })
    .catch(console.err);
}

function showWeather(lat, lon, name, state) {
  const oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

  fetch(oneCall)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(data => {
      console.log(data);
      const currentTemp = parseInt(data.current.temp);

      const { icon, description } = data.current.weather[0];

      // current city 
      currentCity.textContent = `${name}, ${state} ${now}`;
      current.setAttribute("class", "border border-dark shadow p-1 my-2");
      // show weather icon
      const iconEl = document.createElement("img");
      iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
      iconEl.setAttribute("class", "icon");
      currentCity.append(iconEl);
      // show current temp   
      tempEl.innerHTML = `Temp: ${currentTemp}<span>&#176;</span>F`

    })
    .catch(console.err);
}

searchForm.addEventListener('submit', handleInputSubmit);
