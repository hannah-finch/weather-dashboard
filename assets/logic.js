/*
Basic plan, to be adjusted along the way as I run into to issues obvs:

- Get API key
- on page load, add click listener to search button and city buttons
- get location... it's gonna have to convert from city to latitude and longitude, don't know how yet... read documentation
  - do a console.log to see if I can convert it right before passing the data
- fetch the weather
  - get location value
  - variables for key, units, url (API) with parameters in it.
    - lat and lon??? Still not sure how the conversion will work. key, units
    - put in template string so I can insert variables right in it
    - fetch(url) then response, conditional if there's an error?
    - pass the data to a show weather function
- show the weather
  - good place for a console.log check to see if I got data
  - create the card elements inside JavaScript with template literals... the current weather will be in different card at top, just insert info to that div
    - make variables for the data (city, date, icon, temp, wind, humidity)
    - check out data array in the console to know what to put
    - the date is gonna be a timestamp, I'll have to convert... dayjs
*/

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', fetchWeather);

function fetchWeather() {
  console.log('clicked');

  let cityInput = document.getElementById('city-input').value;
  // TODO: convert city to lat and lon - I saw there is an easy way to do this with OpenWeather geo thing

  let key = "2f93013543aedabf89d7193f3daf51f3";
  let units = "imperial";
  // I just put in an example lat and lon for now
  let lat = "51.5073219";
  let lon = "-0.1276474";
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;

  fetch(url)
    // return results in JSON file
    .then(response => {
      return response.json();
    })
    // pass the data to this function
    .then (function (data) {
      // create forecast header
      const forecastContainer = document.getElementById('forecast-container');
      const forecastHeader = document.createElement('h3');
      // print forecast header
      forecastHeader.textContent = '5-day Forecast';
      forecastContainer.prepend(forecastHeader);

      let city = (data.city.name);
      console.log(city);
      // extract current weather first
      let currentWeather = {
        timestamp : (data.list[0].dt),
        icon : (data.list[0].weather[0].icon),
        temp: (data.list[0].main.temp),
        wind : (data.list[0].wind.speed),
        humidity : (data.list[0].main.humidity),
      }
      console.log(currentWeather);

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




      // rewrite this section to create not get

      // const cityNameEl = document.getElementById('city-name');
      // const currentDateEl = document.getElementById('date-today');
      // const currentIconEl = document.getElementById('icon-today');
      // const currentTempEl = document.getElementById('temp-today');
      // const currentWindEl = document.getElementById('wind-today');
      // const currentHumidityEl = document.getElementById('humidity-today');
      // const cardsContainer = document.getElementById('cards-container');

      cityNameEl.textContent = city;
      currentDateEl.textContent = currentWeather.timestamp; // change timestamp to a date
      currentIconEl.src = currentWeather.icon; //this is obviously not going to work, worry about it later
      currentTempEl.textContent = `Temp: ${currentWeather.temp}°F`;
      currentWindEl.textContent = `Wind: ${currentWeather.wind} MPH`;
      currentHumidityEl.textContent = `Humidity: ${currentWeather.humidity}%`;

      // remove any cards when a new search is done
      cardsContainer.innerHTML = "";

      todayHeader.classList.add('today-header');
      todayCard.classList.add('today-card');
      currentIconEl.classList.add('icon');

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
        console.log(weather);

        // create forecast cards
        let forecastCard = document.createElement('div');
        let forecastDate = document.createElement('h4');
        let forecastIcon = document.createElement('img');
        let forecastTemp = document.createElement('p');
        let forecastWind = document.createElement('p');
        let forecastHumidity = document.createElement('p');

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