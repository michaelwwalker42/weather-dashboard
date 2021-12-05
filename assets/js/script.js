var apiKey = "9195677d0010c5ed8b3059b59c364e87"
var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&units=imperial&appid={API key}"

var getCoords = "api.openweathermap.org/data/2.5/weather?q={city name}&appid=" + apiKey
// template literal
// var temp = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=${apiKey}`


var searchInput = document.getElementById("searchInput");
var searchForm = document.getElementById("searchForm");
var current = document.getElementById('current');
var now = (dayjs().format('(M/DD/YYYY)'));






//-------------------------------------------handleInputSubmit Function------------------------------------------

function handleInputSubmit(event) {
    event.preventDefault();

    var cityName = searchInput.value;
    var cityEl = document.createElement('h2');
    cityEl.textContent = cityName + now;
    current.append(cityEl);


    fetchCoords(cityName);
    searchInput.value = '';

}
//---------------------------------------End handleInputSubmit Function------------------------------------------




function fetchCoords(city) {
    
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    console.log(city,lat,lon);     
                    console.log(data);                                   
                })
        })
}



searchForm.addEventListener('submit', handleInputSubmit);
