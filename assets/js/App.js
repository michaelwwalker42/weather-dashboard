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
const descEl = document.getElementById('descEl');
const clearButton = document.getElementById('clearButton');
let cities = [];

function handleInputSubmit(event) {
  event.preventDefault();

  const city = cityInput.value.trim();
  const state = stateInput.value.trim();

  if (!city) {
    return alert("You must enter a city")
  }

  getCoords(city, state);
  createHistoryBtns();

  cityInput.value = '';
  stateInput.value = '';
  clearButton.setAttribute('class', 'btn searchBtn text-white w-100 mt-2');
};

function getCoords(city, state) {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`

  fetch(geoURL)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(data => {
      const { lat, lon, name, state } = data[0];
      saveCities(name, state);
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

      const { wind_speed, humidity, temp, uvi } = data.current;
      const { icon, description } = data.current.weather[0];

      // current city 
      currentCity.textContent = `${name}, ${state} ${now}`;
      current.setAttribute("class", "border border-dark shadow-sm  p-1 my-2 bg-white rounded");
      // show weather icon
      const iconEl = document.createElement("img");
      iconEl.setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
      iconEl.setAttribute("class", "icon");
      currentCity.append(iconEl);
      // show current weather   
      tempEl.innerHTML = `Current: ${temp}<span>&#176;</span>F`;
      descEl.innerHTML = `Description: ${description}`;
      windEl.innerText = `Wind: ${wind_speed} MPH`;
      humidityEl.innerText = `Humidity: ${humidity}%`;
      // show curret UV Index
      const uvSpan = document.createElement("span");
      uvSpan.textContent = uvi;
      uvEl.innerHTML = "UV Index: ";
      // add color that indicates whether the conditions are favorable, moderate, or severe
      if (uvi < 3) {
        uvSpan.setAttribute("class", "badge bg-success");
      } else if (uvi < 6) {
        uvSpan.setAttribute("class", "badge bg-warning");
      } else {
        uvSpan.setAttribute("class", "badge bg-danger");
      }
      uvEl.append(uvSpan);


      // forecast
      forecastContainer.innerHTML = "";
      forecastContainer.classList.remove("d-none");
      forecastH3.textContent = "5-Day Forecast:"
      // loop over first 5 days of forecast
      for (let i = 1; i < 6; i++) {
        const forecastDay = dayjs((data.daily[i].dt) * 1000).format('M/DD/YYYY');
        const highTemp = parseInt(data.daily[i].temp.max);
        const lowTemp = parseInt(data.daily[i].temp.min);
        const dailyWindSpeed = parseInt(data.daily[i].wind_speed);
        const dailyHumidity = data.daily[i].humidity;
        const dailyIcon = data.daily[i].weather[0].icon;

        // create card elements to show forecast
        const forecastCardEl = document.createElement("div");
        forecastCardEl.setAttribute("class", "m-1 shadow-sm card-body forecastCard border border-dark col-md-12 col-xl-2 fs-5 text-white rounded-1");
        // forecast date
        const forecastDayEl = document.createElement('p');
        forecastDayEl.innerText = forecastDay;
        forecastDayEl.setAttribute("class", "darkBlue text-center border border-dark rounded");
        // high temp
        const highTempEl = document.createElement('p');
        highTempEl.innerHTML = `High: ${highTemp}<span>&#176;</span>F`;
        // low temp
        const lowTempEl = document.createElement('p');
        lowTempEl.innerHTML = `Low: ${lowTemp}<span>&#176;</span>F`
        // wind                                        
        const dailyWindSpeedEl = document.createElement("p");
        dailyWindSpeedEl.innerText = `Wind: ${dailyWindSpeed} mph`;
        // humidity
        const dailyHumidityEl = document.createElement('p');
        dailyHumidityEl.innerText = `Humidity: ${dailyHumidity}%`;
        // weather icon
        const dailyIconEl = document.createElement("img");
        dailyIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${dailyIcon}@2x.png`);
        dailyIconEl.setAttribute("class", "icon");

        // append forecast elements to forecast cards
        forecastCardEl.append(forecastDayEl, dailyIconEl, highTempEl, lowTempEl, dailyWindSpeedEl, dailyHumidityEl);
        // append forecast cards to container
        forecastContainer.append(forecastCardEl);
      }
    })
    .catch(console.err);
}

function saveCities(city, state) {
  const search = {
    city: city,
    state: state
  }
  // if search already exists don't save
  if (JSON.stringify(cities).includes(JSON.stringify(search))) return;

  // add city to beginning of array so most recent search shows first
  cities.unshift(search);
  // limit search history to 5
  cities = cities.slice(0, 5);
  // save to localstorage
  localStorage.setItem("cities", JSON.stringify(cities));
};

function createHistoryBtns() {
  pastSearches.innerHTML = '';

  cities.forEach(city => {
    const pastSearchButton = document.createElement('button');
    pastSearchButton.innerText = `${city.city}, ${city.state}`;
    pastSearchButton.setAttribute('class', 'btn lightBlue w-100 mt-2 border border-dark');
    pastSearchButton.setAttribute('data-city', city.city);
    pastSearchButton.setAttribute('data-state', city.state);
    pastSearches.append(pastSearchButton);
  })
};

function loadHistory() {
  const storedhistory = localStorage.getItem('cities');

  if (storedhistory) {
    cities = JSON.parse(storedhistory);
    clearButton.setAttribute('class', 'btn searchBtn text-white w-100 mt-2');
  }
}

function clearHistory(event) {
  cities = [];
  localStorage.removeItem('cities');
  pastSearches.innerHTML = "";
  clearButton.setAttribute('class', 'd-none');
}

function previousSearch(event) {
  const pastCity = event.target.getAttribute('data-city');
  const pastState = event.target.getAttribute('data-state');
  getCoords(pastCity, pastState);
  createHistoryBtns();
}

function init() {
  loadHistory();
  createHistoryBtns();
}

init();

pastSearches.addEventListener('click', previousSearch);
searchForm.addEventListener('submit', handleInputSubmit);
clearButton.addEventListener('click', clearHistory);