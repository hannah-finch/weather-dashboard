/*
Left to do:
- write function to get location and pass to fetch weather function.
- add event listeners to all the location buttons that pass set location info to fetch weather function
- convert timestamps to date... dayjs? I think I have to *1000 because the timestamp from OpenWeather is seconds and normal dayjs timestamps are milliseconds
*/

// add event listener to buttons
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', fetchWeather);

// I just put in an example lat and lon for now
let lat = "51.5073219";
let lon = "-0.1276474";

function getLocation() {
  let cityInput = document.getElementById('city-input').value;
  // TODO: convert city to lat and lon - I saw there is an easy way to do this with OpenWeather geo thing... pass data into fetchWeather function
}

function fetchWeather() {
  let key = "2f93013543aedabf89d7193f3daf51f3";
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;

  fetch(url)
    // return results in JSON file
    .then(response => {
      return response.json();
    })
    // pass the data to this function
    .then (function (data) {
      // get forecast header and add text
      const forecastHeader = document.getElementById('forecast-header');
      forecastHeader.textContent = '5-day Forecast';

      // get city name from data
      let city = (data.city.name);

      // extract the current weather first
      let currentWeather = {
        timestamp : (data.list[0].dt),
        icon : (data.list[0].weather[0].icon),
        temp: (data.list[0].main.temp),
        wind : (data.list[0].wind.speed),
        humidity : (data.list[0].main.humidity),
      }

      // get and create elements for current weather card
      const todayContainer = document.getElementById('today-container');
      const cardsContainer = document.getElementById('cards-container');
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
      cityNameEl.textContent = city;
      currentDateEl.textContent = currentWeather.timestamp; // change timestamp to a date
      currentIconEl.src = currentWeather.icon; //this is obviously not going to work, worry about it later
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

      // iterate through data to get weather info
      for (let i = 1; i < 6; i++) {
        let weather = {
          timestamp : (data.list[i].dt),
          icon : (data.list[i].weather[0].icon),
          temp: (data.list[i].main.temp),
          wind : (data.list[i].wind.speed),
          humidity : (data.list[i].main.humidity),
        }

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
        forecastDate.textContent = weather.timestamp; //change to date later
        forecastTemp.textContent = `Temp: ${weather.temp}°F`;
        forecastWind.textContent = `Wind: ${weather.wind} MPH`;
        forecastHumidity.textContent = `Humidity: ${weather.humidity}%`;

        // append elements to card
        forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);

        // print cards to page
        cardsContainer.append(forecastCard);
      }
    });
}