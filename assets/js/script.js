var apiKey = "9195677d0010c5ed8b3059b59c364e87"
var now = (dayjs().format(' (M/DD/YYYY)'));

var current = document.getElementById('current');
var currentCity = document.getElementById("currentCity");
var humidityEl = document.getElementById('humidityEl');
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

                        console.log(data);
                        //---------------------- NEED TO GET WEATHER ICON ----------------------------------------

                        // use coordinates in api url
                        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

                        
                        fetch(oneCall)
                            .then(function (response) {
                                response.json()
                                    .then(function (data) {
                                        // show current temperature, degree symbol(&#176)
                                        var currentTemp = data.current.temp;
                                        console.log("Temp: " + currentTemp);
                                        tempEl.innerHTML = "Temp: " + currentTemp + "<span>&#176;</span>F";
                                        // show current wind speed
                                        var windSpeed = data.current.wind_speed;
                                        console.log("Wind: " + windSpeed + "MPH");
                                        windEl.innerText = "Wind: " + windSpeed + " MPH"
                                        // show current humidity
                                        var humidity = data.current.humidity;
                                        console.log("Humidity: " + humidity + " %");
                                        humidityEl.innerText = "Humidity: " + humidity + "%";
                                        // show curret UV Index
                                        var uvi = data.daily[0].uvi;
                                        console.log("UV Index: " + uvi);
                                        uvEl.innerHTML = "UV Index: ";
                                        // add color that indicates whether the conditions are favorable, moderate, or severe
                                        var uvSpan = document.createElement("span");
                                        uvSpan.textContent = uvi;

                                        if (uvi < 3){
                                            uvSpan.setAttribute("class", "badge bg-success");
                                        } else if (uvi < 6){
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
}
//---------------------------------------End handleInputSubmit Function------------------------------------------


searchForm.addEventListener('submit', handleInputSubmit);
