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