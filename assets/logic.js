/*
Improvement ideas:
- add conditional if city input is blank, return
- add a loading indicator when getting weather data
- add limit when fetching data for faster loading
- add state after city name in current weather card
*/

const key = "2f93013543aedabf89d7193f3daf51f3";
let cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];
const cityButtonContainer = document.getElementById('city-button-container');
const cardsContainer = document.getElementById('cards-container');
const todayContainer = document.getElementById('today-container');
const forecastHeader = document.getElementById('forecast-header');

// get cities from local storage and display buttons
function getButtons() {
  cityArray.forEach((cityName) => {
    const cityButton = document.createElement('button');
    cityButton.textContent = cityName;
    cityButtonContainer.append(cityButton);
  })
}

// getButtons if there are cities in storage
if (cityArray != []) {
  getButtons();
}

// add event listener to search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function(event){
  event.preventDefault();
  let cityInput = document.getElementById('city-input').value;
  if (cityInput == "") {
    alert("Please enter a city");
    return;
  } else {
    // make new button
    const cityButton = document.createElement('button');
    cityButton.textContent = cityInput;
    cityButtonContainer.prepend(cityButton);
    //send to getLatLon function
    getLatLon(cityInput);
  }
});

// use delegation to add event listeners to the history buttons
cityButtonContainer.addEventListener('click', (event) => {
  const cityBtn = event.target;
  let cityInput = cityBtn.innerText;
  // move button to top of button container
  cityButtonContainer.prepend(cityBtn);
  // send to getLatLon function
  getLatLon(cityInput)
});

function createCurrentCard(currentWeather) {
  // get and create elements for current weather card
  const todayCard = document.createElement('div');
  const todayHeader = document.createElement('div');
  const cityNameEl = document.createElement('h2');
  const currentDateEl = document.createElement('h2');
  const currentIconEl = document.createElement('img');
  const currentTempEl = document.createElement('p');
  const currentWindEl = document.createElement('p');
  const currentHumidityEl = document.createElement('p');

  // remove any existing cards so new cards can replace them
  cardsContainer.innerHTML = "";
  todayContainer.innerHTML = "";

  // set content of current weather card
  cityNameEl.textContent = currentWeather.city;
  currentDateEl.textContent = `(${currentWeather.date})`;
  currentIconEl.src = `https://openweathermap.org/img/w/${currentWeather.icon}.png`;
  currentTempEl.textContent = `Temp: ${currentWeather.temp}°F`;
  currentWindEl.textContent = `Wind: ${currentWeather.wind} MPH`;
  currentHumidityEl.textContent = `Humidity: ${currentWeather.humidity}%`;

  // add classes to current weather card
  todayHeader.classList.add('today-header');
  todayCard.classList.add('today-card');
  currentIconEl.classList.add('icon');

  // append elements of current weather card
  todayHeader.append(cityNameEl, currentDateEl, currentIconEl);
  todayCard.append(todayHeader, currentTempEl, currentWindEl, currentHumidityEl);
  todayContainer.append(todayCard);
}

function createForecastCards(weather) {
  // get forecast header and add text
  forecastHeader.textContent = '5-day Forecast';
  // create forecast cards
  const forecastCard = document.createElement('div');
  const forecastDate = document.createElement('h4');
  const forecastIcon = document.createElement('img');
  const forecastTemp = document.createElement('p');
  const forecastWind = document.createElement('p');
  const forecastHumidity = document.createElement('p');

  // assign classes to card
  forecastCard.classList.add('card');
  forecastIcon.classList.add('icon');

  // put weather data on card
  forecastDate.textContent = weather.date;
  forecastIcon.src = `https://openweathermap.org/img/w/${weather.icon}.png`;
  forecastTemp.textContent = `Temp: ${weather.temp}°F`;
  forecastWind.textContent = `Wind: ${weather.wind} MPH`;
  forecastHumidity.textContent = `Humidity: ${weather.humidity}%`;

  // append elements to card
  forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
  // print cards to page
  cardsContainer.append(forecastCard);
}

// convert city input value to latitude and longitude via open weather map geo API
function getLatLon(cityInput) {
  // put city into cityArray
  cityArray.unshift(cityInput);
  // delete duplicate cities from array;
  cityArray = [...new Set(cityArray)];
  // if there are more than 8 cities in array, delete last one
  if (cityArray.length > 8) {
    cityArray.pop();
  }

  localStorage.setItem('cityArray', JSON.stringify(cityArray));

  // use open weather map geo api to convert city to latitude and longitude
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput},&appid=${key}`;

  fetch(url)
  .then(response => {
    return response.json();
  })

  //extract the latitude and longitude from the data
  .then (function (data) {    
    let lat = data[0].lat;
    let lon = data[0].lon;

    fetchWeather(lat, lon);
  })
};

function fetchWeather(lat, lon) {
  let units = "imperial";
  // OpenWeatherMap limits each request to 40, so split into two requests
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&cnt=1`;
  let url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&start=8&cnt=40`;
  // maybe second one starts on current time stamp plus 24hrs

  fetch(url)
  .then(response => {
    return response.json();
  })

  // extract info from data
  .then (function (data) {
    // extract the current weather
    let currentWeather = {
      city : (data.city.name),
      date : (new Date((data.list[0].dt)*1000)).toLocaleDateString(), // *1000 for milliseconds, convert format
      icon : (data.list[0].weather[0].icon),
      temp: (data.list[0].main.temp),
      wind : (data.list[0].wind.speed),
      humidity : (data.list[0].main.humidity),
    }

    createCurrentCard(currentWeather);
  })

  fetch(url2)
  .then(response => {
    return response.json();
  })

  .then (function (data2) {
    // iterate through data to get weather info
    // data is every 3 hours, for every 24 hours work in multiples of 8
    for (let i = 7; i < 48; i+=8) {

      let weather = {
        // I'm getting an error in the console for the following line, cannot read dt, but it's working... dt is from the data
        date : (new Date((data2.list[i].dt)*1000)).toLocaleDateString(), // *1000 for milliseconds, convert format
        icon : (data2.list[i].weather[0].icon),
        temp: (data2.list[i].main.temp),
        wind : (data2.list[i].wind.speed),
        humidity : (data2.list[i].main.humidity),
      }

      createForecastCards(weather);
    }
  })
}