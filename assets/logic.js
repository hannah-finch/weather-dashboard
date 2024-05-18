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
    // TODO: pass the data to the showWeather function
    .then ((data) => {
      showWeather(data);
    })
}

// My brain is currently exhausted, but I think something like this should go in a for loop. Maybe I can append it in a separate function so I don't have to separate the current data from the forecast data. I'm sure there's a better way to do this, I'm just tired.
function showWeather(response) {
  console.log(response)
  // construct card for current weather
  // HTML container for current weather card
  const currentContainer = document.getElementById('today-container');
  // card for current weather
  const currentCard = document.createElement("div");
  // container for city name, date, icon
  const currentHeader = document.createElement("div");
  const cityNameEl = document.createElement("h2");
  const currentDateEl = document.createElement("h2");
  const currentIconEl = document.createElement("img");
  const currentTempEl = document.createElement("p");
  const currentWindEl = document.createElement("p");
  const currentHumidityEl = document.createElement("p");

  // add classes
  currentHeader.classList.add("today-header");
  currentIconEl.classList.add("icon-today");

  // add content
  // I put in filler info for now. Icon source isn't working
  cityNameEl.textContent = "City Name";
  currentDateEl.textContent = "(9/13/2022)";
  currentIconEl.src = "./images/filler-icon.png";
  currentTempEl.textContent = "Temp: 76.62";
  currentWindEl.textContent = "Wind: 8.43";
  currentHumidityEl.textContent ="Humidity: 44%";

  currentHeader.append(cityNameEl, currentDateEl, currentIconEl);
  currentCard.append(currentHeader, currentTempEl, currentWindEl, currentHumidityEl);
  currentContainer.append(currentCard);

}