
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const apiKey = "fe00fc5ce66c5592090ae5d2261df9da";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

function convertToLocalTime(unixTimestamp, timezoneOffset) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000); // Apply timezone offset in seconds
  return formatTo12Hour(date); // Pass the Date object
}

// Function to format time into 12-hour format
function formatTo12Hour(date) {
  let hours = date.getUTCHours(); // Get hours in local time (after applying the offset)
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes; // Pad minutes with 0
  return `${hours}:${minutes} ${ampm}`;
}



async function checkWeather(city) {
  const response = await fetch(apiUrl + `&q=${city}` + `&appid=${apiKey}`);
  const data = await response.json();

  console.log(data);

  if (response.status == 404) {
    alert("City not found");
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").textContent = "Invalid City name";
    document.querySelector(".weather").style.display = "none";
  } 
  else {
    const cityName = data.name;
    const timezoneOffsetSeconds = data.timezone; // seconds
    const sunriseTimestamp = data.sys.sunrise; // UNIX timestamp in seconds
    const sunsetTimestamp = data.sys.sunset; // UNIX timestamp in seconds

    const sunriseTime = convertToLocalTime(
      sunriseTimestamp,
      timezoneOffsetSeconds
    );
    const sunsetTime = convertToLocalTime(
      sunsetTimestamp,
      timezoneOffsetSeconds
    );
    document.querySelector(".error").style.display = "none";
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".sunrise-time").textContent = sunriseTime;
    document.querySelector(".sunset-time").textContent = sunsetTime;

    if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Snow") {
      weatherIcon.src = "images/snow.png";
    }

    document.querySelector(".weather").style.display = "block";
  }
}

searchButton.addEventListener("click", () => {
  let city = searchBox.value;
  checkWeather(city);
  searchBox.value = "";
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
