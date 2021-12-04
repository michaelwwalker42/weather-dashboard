var apiKey = "9195677d0010c5ed8b3059b59c364e87"
var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&units=imperial&appid={API key}"

var getCoords = "api.openweathermap.org/data/2.5/weather?q={city name}&appid=" + apiKey
// template literal
var temp = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=${apiKey}`

var searchInput = document.getElementById("searchInput").value;
var searchForm = document.getElementById("searchForm");

function handleInputSubmit(event) {
    event.preventDefault();
    var search = searchInput.value;
    fetchCoords(search);
    //searchInput.value = '';
}

function fetchCoords(city) {
    console.log(city)
}


searchForm.addEventListener('submit', handleInputSubmit);
