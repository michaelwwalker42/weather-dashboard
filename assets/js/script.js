var apiKey = "9195677d0010c5ed8b3059b59c364e87"
var now = (dayjs().format(' (M/DD/YYYY)'));

var current = document.getElementById('current');
var currentCity = document.getElementById("currentCity");
var humidityEl = document.getElementById('humidityEl');
var forecast = document.getElementById('forecast');
var forecastH2 = document.getElementById('forecastH2');
var forecastContainer = document.getElementById('forecastContainer');
var searchInput = document.getElementById("searchInput");
var searchForm = document.getElementById("searchForm");
var tempEl = document.getElementById('tempEl');
var uvEl = document.getElementById('uvEl');
var windEl = document.getElementById('windEl');

//-------------------------------------------handleInputSubmit Function------------------------------------------

function handleInputSubmit(event) {
    event.preventDefault();
    // display city name and current date
    var cityName = searchInput.value;
    currentCity.textContent = cityName + now;
    current.setAttribute("class", "border border-dark p-1 my-2");

    forecastContainer.classList.remove("d-none");
    forecastH2.textContent = "5-Day Forecast:"

    fetchCoords(cityName);
    searchInput.value = '';
    // get latitude and longitude coordinates
}
//---------------------------------------End handleInputSubmit Function------------------------------------------


//----------------------------------------------fetchCoords function----------------------------------------------

function fetchCoords(city) {
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

                                    console.log(data);
                                    for (let index = 0; index < 5; index++) {              
                                       
                                        var dailyTemp = data.daily[index].temp.day;
                                        console.log("Daily temp: " + dailyTemp);

                                        var dailyWindSpeed = data.daily[index].wind_speed;
                                        console.log("Daily wind speed: " + dailyWindSpeed);

                                        var dailyHumidity = data.daily[index].humidity;
                                        console.log("Daily humidity: " + dailyHumidity);

                                        var dailyIcon = data.daily[index].weather[0].icon;
                                        console.log("Daily icon: " + dailyIcon);

                                        var forecastCardEl = document.createElement("div");
                                        forecastCardEl.setAttribute("class", "card-body forecastCard m-1 col-sm-12 col-2 text-white");

                                        var forecastDay = document.createElement('h5');
                                        forecastDay.innerText = dayjs((data.daily[index].dt) * 1000).format('M/DD/YYYY');
                                        
                                        forecastCardEl.append(forecastDay);

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
//-------------------------------------------End fetchCoords function----------------------------------------------

searchForm.addEventListener('submit', handleInputSubmit);
