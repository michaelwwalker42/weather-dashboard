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
if (localStorage.getItem("cities") !== null) {
    cities = JSON.parse(localStorage.getItem("cities"));
}


//-------------------------------------------handleInputSubmit Function------------------------------------------

function handleInputSubmit(event) {
    event.preventDefault();
    showHistory();

    // display city name and current date
    var cityName = searchInput.value;
    currentCity.textContent = cityName + now;
    current.setAttribute("class", "border border-dark shadow p-1 my-2");
    // show forecast container
    forecastContainer.innerHTML = "";
    forecastContainer.classList.remove("d-none");
    forecastH3.textContent = "5-Day Forecast:"
    // get weather for input city
    fetchWeather(cityName);

    saveCities(cityName);

    searchInput.value = '';

}
//---------------------------------------End handleInputSubmit Function------------------------------------------

//----------------------------------------------fetchWeather function----------------------------------------------

function fetchWeather(city) {
    // template literal
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    // variables for latitude and longitude coordinates
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    // show icon for current weather                         
                    var weatherIcon = (data.weather[0].icon);
                    var iconEl = document.createElement("img");
                    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    iconEl.setAttribute("class", "icon");
                    currentCity.append(iconEl);
                    // use coordinates in api url
                    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;


                    fetch(oneCall)
                        .then(function (response) {
                            response.json()
                                .then(function (data) {
                                    // loop over first 5 days of forecast
                                    for (let index = 0; index < 5; index++) {
                                        // create card elements to show forecast
                                        var forecastCardEl = document.createElement("div");
                                        forecastCardEl.setAttribute("class", "card-body forecastCard m-1 p-1 col-2 fs-5 text-white");
                                        // create element to show forecast date
                                        var forecastDay = dayjs((data.daily[index].dt) * 1000).format('M/DD/YYYY');
                                        var forecastDayEl = document.createElement('p');
                                        forecastDayEl.innerText = forecastDay;
                                        forecastDayEl.setAttribute("class", "card-header darkBlue text-center");
                                        // create element for forecast temperature
                                        var dailyTemp = data.daily[index].temp.day;
                                        var dailyTempEl = document.createElement('p');
                                        dailyTempEl.innerHTML = "Temp: " + dailyTemp + "<span>&#176;</span>F";

                                        // create element for forecast wind                                        
                                        var dailyWindSpeed = data.daily[index].wind_speed;
                                        var dailyWindSpeedEl = document.createElement("p");
                                        dailyWindSpeedEl.innerText = "Wind: " + dailyWindSpeed + "  MPH";
                                        // create element to show forecast humidity
                                        var dailyHumidity = data.daily[index].humidity;
                                        var dailyHumidityEl = document.createElement('p');
                                        dailyHumidityEl.innerText = "Humidity: " + dailyHumidity + " %";
                                        // create element for forecast weather icon
                                        var dailyIcon = data.daily[index].weather[0].icon;
                                        var dailyIconEl = document.createElement("img");
                                        dailyIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`);
                                        dailyIconEl.setAttribute("class", "icon");

                                        // append forecast elements to forecast cards
                                        forecastCardEl.append(forecastDayEl);
                                        forecastCardEl.append(dailyIconEl);
                                        forecastCardEl.append(dailyTempEl);
                                        forecastCardEl.append(dailyWindSpeedEl);
                                        forecastCardEl.append(dailyHumidityEl);
                                        // append forecast cards to container
                                        forecastContainer.append(forecastCardEl);

                                    }

                                    // show current temperature, degree symbol(&#176)
                                    var currentTemp = data.current.temp;
                                    tempEl.innerHTML = "Temp: " + currentTemp + "<span>&#176;</span>F";
                                    // show current wind speed
                                    var windSpeed = data.current.wind_speed;
                                    windEl.innerText = "Wind: " + windSpeed + " MPH"
                                    // show current humidity
                                    var humidity = data.current.humidity;
                                    humidityEl.innerText = "Humidity: " + humidity + "%";
                                    // show curret UV Index
                                    var uvi = data.daily[0].uvi;
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
                        });
                })
        })
};
//-------------------------------------------End fetchWeather function----------------------------------------------

function saveCities(city) {
    cities.unshift(city);
    cities.splice(7);
    localStorage.setItem("cities", JSON.stringify(cities));
};

function showHistory() {

    pastSearches.innerHTML = "";
    for (let index = 0; index < cities.length; index++) {
        var pastSearchButton = document.createElement("button");
        pastSearchButton.innerText = cities[index];
        pastSearchButton.setAttribute("class", "btn lightBlue w-100 mt-2 text-black");

        pastSearches.append(pastSearchButton);
    }
};



searchForm.addEventListener('submit', handleInputSubmit);
pastSearches.addEventListener('click', function(event){
    
    var pastCity = event.target.innerText;
    console.log(pastCity);
    currentCity.innerText = pastCity;
    forecastContainer.innerHTML = "";
    fetchWeather(event.target.innerText);
})
