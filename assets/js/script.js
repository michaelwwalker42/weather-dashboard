var apiKey = "9195677d0010c5ed8b3059b59c364e87"

var searchInput = document.getElementById("searchInput");
var searchForm = document.getElementById("searchForm");
var current = document.getElementById('current');
var now = (dayjs().format(' (M/DD/YYYY)'));
var currentCity = document.getElementById("currentCity");




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
                                        var uvi = (data.daily[0].uvi);
                                        console.log("UVI: " + uvi);

                                    })
                            });
                    })
            })
    };
}
//---------------------------------------End handleInputSubmit Function------------------------------------------


searchForm.addEventListener('submit', handleInputSubmit);
