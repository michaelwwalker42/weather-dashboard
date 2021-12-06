var apiKey = "9195677d0010c5ed8b3059b59c364e87"

var current = document.getElementById('current');
var currentCity = document.getElementById("currentCity");
var humidityEl = document.getElementById('humidityEl');
var searchInput = document.getElementById("searchInput");
var searchForm = document.getElementById("searchForm");
var tempEl = document.getElementById('tempEl');
var uvEl = document.getElementById('uvEl');
var windEl = document.getElementById('windEl');

var now = (dayjs().format(' (M/DD/YYYY)'));





//-------------------------------------------handleInputSubmit Function------------------------------------------

function handleInputSubmit(event) {
    event.preventDefault();

    var cityName = searchInput.value;
    currentCity.textContent = cityName + now;

    fetchCoords(cityName);
    searchInput.value = '';


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
                        console.log(city);
                        console.log("Latitude: " + lat);
                        console.log("Longitude: " + lon);
                        // use coordinates in api url
                        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

                        // get UV index
                        fetch(oneCall)
                            .then(function (response) {
                                response.json()
                                    .then(function (data) {
                                        var currentTemp = data.current.temp;
                                        console.log("Temp: " + currentTemp);
                                        // show current temperature, degree symbol(&#176)
                                        tempEl.innerHTML = "Temp: " + currentTemp + "<span>&#176;</span>F";
                                        
                                        var windSpeed = data.current.wind_speed;
                                        console.log("Wind: " + windSpeed + "MPH");
                                        // show current wind speed
                                        windEl.innerText = "Wind: " + windSpeed + " MPH"

                                        var humidity = data.current.humidity;
                                        console.log("Humidity: " + humidity + " %");
                                        // show current humidity
                                        humidityEl.innerText = "Humidity: " + humidity + "%";

                                        var uvi = data.daily[0].uvi;
                                        console.log("UV Index: " + uvi);
                                        // show curret UV Index
                                        uvEl.innerHTML = "UV Index: " + uvi;
                                    })
                            });
                    })
            })
    };
}
//---------------------------------------End handleInputSubmit Function------------------------------------------


searchForm.addEventListener('submit', handleInputSubmit);
