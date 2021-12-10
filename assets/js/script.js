var apiKey = "9195677d0010c5ed8b3059b59c364e87";
var now = (dayjs().format(' (M/DD/YYYY)'));
var current = document.getElementById('current');
var currentCity = document.getElementById("currentCity");
var humidityEl = document.getElementById('humidityEl');
var forecast = document.getElementById('forecast');
var forecastH3 = document.getElementById('forecastH3');
var forecastContainer = document.getElementById('forecastContainer');
var pastSearches = document.getElementById('pastSearches');
var searchInput = document.getElementById("searchInput");
var searchForm = document.getElementById("searchForm");
var tempEl = document.getElementById('tempEl');
var uvEl = document.getElementById('uvEl');
var windEl = document.getElementById('windEl');

var cities = [];

function loadHistory() {
    var storedhistory = localStorage.getItem("cities")

    if (storedhistory) {
        cities = JSON.parse(storedhistory);
    }
    createHistoryBtns();
}
loadHistory()

//-------------------------------------------handleInputSubmit Function------------------------------------------

function handleInputSubmit(event) {
    event.preventDefault();

    // display city name and current date
    var cityName = searchInput.value;
    if (!cityName) {
        return alert("You must enter a city")
    }
    // get weather for input city
    fetchWeather(cityName);

    searchInput.value = '';
};
//---------------------------------------End handleInputSubmit Function------------------------------------------

//----------------------------------------------fetchWeather function----------------------------------------------

function fetchWeather(city) {
    // template literal
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            return response.json()

        }).then(function (data) {
            // save search to add to search history
            saveCities(city);
            createWeatherData(data)
            // variables for latitude and longitude coordinates

        })
};

function createWeatherData(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var dataCityName = data.name;
    var weatherIcon = (data.weather[0].icon);

    // use coordinates in api url
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;


    fetch(oneCall)
        .then(function (response) {
            response.json()
                .then(function (res) {

                    // show forecast container
                    forecastContainer.innerHTML = "";
                    forecastContainer.classList.remove("d-none");
                    forecastH3.textContent = "5-Day Forecast:"
                    // loop over first 5 days of forecast
                    for (let index = 1; index < 6; index++) {
                        // create card elements to show forecast
                        var forecastCardEl = document.createElement("div");
                        forecastCardEl.setAttribute("class", "card-body forecastCard m-1 p-1 col-sm-12 col-md-2 fs-5 text-white");
                        // create element to show forecast date
                        var forecastDay = dayjs((res.daily[index].dt) * 1000).format('M/DD/YYYY');
                        var forecastDayEl = document.createElement('p');
                        forecastDayEl.innerText = forecastDay;
                        forecastDayEl.setAttribute("class", "card-header darkBlue text-center");
                        // create element for forecast temperature
                        var dailyTemp = res.daily[index].temp.day;
                        var dailyTempEl = document.createElement('p');
                        dailyTempEl.innerHTML = "Temp: " + dailyTemp + "<span>&#176;</span>F";

                        // create element for forecast wind                                        
                        var dailyWindSpeed = res.daily[index].wind_speed;
                        var dailyWindSpeedEl = document.createElement("p");
                        dailyWindSpeedEl.innerText = "Wind: " + dailyWindSpeed + "  MPH";
                        // create element to show forecast humidity
                        var dailyHumidity = res.daily[index].humidity;
                        var dailyHumidityEl = document.createElement('p');
                        dailyHumidityEl.innerText = "Humidity: " + dailyHumidity + " %";
                        // create element for forecast weather icon
                        var dailyIcon = res.daily[index].weather[0].icon;
                        var dailyIconEl = document.createElement("img");
                        dailyIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`);
                        dailyIconEl.setAttribute("class", "icon");

                        // append forecast elements to forecast cards
                        forecastCardEl.append(forecastDayEl, dailyIconEl, dailyTempEl, dailyWindSpeedEl, dailyHumidityEl);
                        // append forecast cards to container
                        forecastContainer.append(forecastCardEl);
                    }

                    // show current temperature, degree symbol(&#176)
                    currentCity.textContent = dataCityName + now;
                    current.setAttribute("class", "border border-dark shadow p-1 my-2");
                    // show weather icon
                    var iconEl = document.createElement("img");
                    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    iconEl.setAttribute("class", "icon");
                    currentCity.append(iconEl);
                    // show current temp
                    var currentTemp = res.current.temp;
                    tempEl.innerHTML = "Temp: " + currentTemp + "<span>&#176;</span>F";
                    // show current wind speed
                    var windSpeed = res.current.wind_speed;
                    windEl.innerText = "Wind: " + windSpeed + " MPH"
                    // show current humidity
                    var humidity = res.current.humidity;
                    humidityEl.innerText = "Humidity: " + humidity + "%";
                    // show curret UV Index
                    var uvi = res.daily[0].uvi;
                    uvEl.innerHTML = "UV Index: ";
                    // add color that indicates whether the conditions are favorable, moderate, or severe
                    var uvSpan = document.createElement("span");
                    uvSpan.textContent = uvi;
                    if (uvi < 3) {
                        uvSpan.setAttribute("class", "badge bg-success");
                    } else if (uvi < 6) {
                        uvSpan.setAttribute("class", "badge bg-warning");
                    } else {
                        uvSpan.setAttribute("class", "badge bg-danger");
                    }
                    uvEl.append(uvSpan);
                })
        })
}
//-------------------------------------------End fetchWeather function----------------------------------------------

//---------------------------------------------------saveCities function--------------------------------------------

function saveCities(city) {

    if (cities.indexOf(city) !== -1) {
        return
    }
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities));
    createHistoryBtns()
};
//-----------------------------------------------End saveCities function--------------------------------------------

function createHistoryBtns() {
    // create buttons for search history
    pastSearches.innerHTML = "";
    for (let index = cities.length - 1; index >= 0; index--) {

        var pastSearchButton = document.createElement("button");
        pastSearchButton.innerText = cities[index];
        pastSearchButton.setAttribute("class", "btn lightBlue w-100 mt-2 text-black");
        pastSearchButton.setAttribute('data-value', cities[index])
        pastSearches.append(pastSearchButton);
    }
};
//--------------------------------------------pastSearches function---------------------------------------------------
// add event listener to parent element of buttons
pastSearches.addEventListener('click', function (event) {

    var pastCity = event.target.getAttribute('data-value');
    console.log(pastCity)
    fetchWeather(pastCity);
})
//----------------------------------------End pastSearches function---------------------------------------------------

searchForm.addEventListener('submit', handleInputSubmit);
