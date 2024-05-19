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

      // print current weather to the page
      const cityNameEl = document.getElementById('city-name');
      const currentDateEl = document.getElementById('date-today');
      const currentIconEl = document.getElementById('icon-today');
      const currentTempEl = document.getElementById('temp-today');
      const currentWindEl = document.getElementById('wind-today');
      const currentHumidityEl = document.getElementById('humidity-today');

      cityNameEl.textContent = city;
      currentDateEl.textContent = currentWeather.timestamp; // change timestamp to a date
      currentIconEl.src = currentWeather.icon; //this is obviously not going to work, worry about it later
      currentTempEl.textContent = `Temp: ${currentWeather.temp}°F`;
      currentWindEl.textContent = `Wind: ${currentWeather.wind} MPH`;
      currentHumidityEl.textContent = `Humidity: ${currentWeather.humidity}%`;



      for (let i = 1; i < 6; i++) {
        let weather = {
          timestamp : (data.list[i].dt),
          icon : (data.list[i].weather[0].icon),
          temp: (data.list[i].main.temp),
          wind : (data.list[i].wind.speed),
          humidity : (data.list[i].main.humidity),
        }
        console.log(weather);
      }
    })
}

// My brain is currently exhausted, but I think something like this should go in a for loop. Maybe I can append it in a separate function so I don't have to separate the current data from the forecast data. I'm sure there's a better way to do this, I'm just tired.
// wait, I don't have to create it I just have to get it... Or maybe I should create a card for the 5-day forecast, but just get for the current?
// function showWeather(response) {
//   console.log(response)

//   const cityNameEl = document.getElementById('city-name');
//   const currentDateEl = document.getElementById('date-today');
//   const currentIconEl = document.getElementById('icon-today');
//   const currentTempEl = document.getElementById('temp-today');
//   const currentWindEl = document.getElementById('wind-today');
//   const currentHumidityEl = document.getElementById('humidity-today');

//   cityNameEl.textContent = "City Name";
//   currentDateEl.textContent = "(9/13/2022)";
//   currentIconEl.src = "../images/filler-icon.png";
//   currentTempEl.textContent = "Temp: 76.62";
//   currentWindEl.textContent = "Wind: 8.43";
//   currentHumidityEl.textContent ="Humidity: 44%";


// }