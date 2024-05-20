/*
Left to do:
- convert timestamps to date... dayjs? I think I have to *1000 because the timestamp from OpenWeather is seconds and normal dayjs timestamps are milliseconds
- get the icons
- make buttons functional

- add conditional if city input is blank, return


I just realized the buttons on the side are supposed to be from search history, not just set cities. SOOO that changes a lot. Make a new plan now....
- gonna need an array of search history saved in local
- make a getButtons function to display the buttons from history
- when the search button is clicked:
  - get location
  - fetch weather
  - create and prepend button, button text should be city name from data
  - add the city name to local storage
- when any button is clicked:
  - send button text to get location
  - fetch weather

- so... change getLatLon so city variable is outside it, use city as a parameter
- on search button click, set city to input, send to getLatLon
- on button click, set city to button name, send to getLatLon
- should I limit the number of buttons? if array.length > n, pop the last one off?
*/

const key = "2f93013543aedabf89d7193f3daf51f3";
let cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];
const cityButtonContainer = document.getElementById('city-button-container');

function getButtons() {
  cityArray.forEach((cityName) => {
    console.log(cityName);
    const cityButton = document.createElement('button');
    cityButton.textContent = cityName;
    cityButtonContainer.prepend(cityButton);
  })
}

if (cityArray != []) {
  getButtons();
}

// add event listener to search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function(event){
  event.preventDefault();
  let cityInput = document.getElementById('city-input').value;

  // put city into cityArray and save in storage
  cityArray.push(cityInput);
  localStorage.setItem('cityArray', JSON.stringify(cityArray));
  console.log(cityArray);

  // now make new button
  const cityButton = document.createElement('button');
  cityButton.textContent = cityInput;
  cityButtonContainer.prepend(cityButton);

  //send to getLatLon function
  getLatLon(cityInput);
});

// use delegation to add event listeners to the history buttons
cityButtonContainer.addEventListener('click', (event) => {
  const cityBtn = event.target;
  // set cityInput to the text on the button
  let cityInput = cityBtn.innerText;
  console.log(cityInput);
  // send to getLatLon function
  getLatLon(cityInput)
})

// function to convert city input value to latitude and longitude via open weather map geo API and pass to fetchWeather function
function getLatLon(cityInput) {
  // cityInput = document.getElementById('city-input').value;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput},&appid=${key}`;

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