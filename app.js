document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#search-btn");
    const search = document.querySelector("#search-bar");
    const unitSelector = document.getElementById("unit-toggle");

    const API_key = "7f94ebd01d5b67723e000b07c8cf2758"; 
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_key}`;

    let rawData = null;
    let currentUnit = "metric";
    
    btn.addEventListener("click", () => {
        const city = search.value.trim().toLowerCase();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert("Please enter a city name.");
        }
    });

    unitSelector.addEventListener("change", () => {
        currentUnit = unitSelector.value;
        if (rawData) updateDisplayWithUnit(rawData, currentUnit);
    });

    async function fetchWeatherData(city) {
        const url = `${BASE_URL}&q=${city}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            rawData = data;
            updateDisplayWithUnit(data, currentUnit);
        } catch (error) {
            alert("Invalid Response! Please try again.");
            console.error(error);
        }
    }

    function updateDisplayWithUnit(data, unit) {
        const temp = convertTemp(data.main.temp, unit);
        const minTemp = convertTemp(data.main.temp_min, unit);
        const maxTemp = convertTemp(data.main.temp_max, unit);
        const feelsLike = convertTemp(data.main.feels_like, unit);
        const windSpeed = convertSpeed(data.wind.speed, unit);
        const pressure = data.main.pressure;
        const visibility = convertVisibility(data.visibility, unit);
        const humidity = data.main.humidity;

        const city = data.name;
        const condition = data.weather[0].main.toLowerCase();

        document.querySelector(".temperature").innerText = `${temp}`;
        document.querySelector(".humidity").innerText = `${humidity}%`;
        document.querySelector(".wind").innerText = `${windSpeed}`;
        document.querySelector(".city-name").innerText = `${city}`;

        document.querySelector(".min-max-temp").innerText = `${maxTemp} / ${minTemp}`;
        document.querySelector(".pressure").innerText = `${pressure} hPa`;
        document.querySelector(".feels-like").innerText = `${feelsLike}`;
        document.querySelector(".visibility").innerText = `${visibility}`;

        updateWeatherImage(condition);
    }

    function updateWeatherImage(condition) {
        const weatherImg = document.querySelector(".weather-icon");
        const icons = {
            clear: "clear.png",
            clouds: "clouds.png",
            drizzle: "drizzle.png",
            mist: "mist.png",
            snow: "snow.png",
            rain: "rain.png"
        };
        weatherImg.src = `assets/images/${icons[condition] || "snow.png"}`;
    }

    function convertTemp(kelvinVal, unit) {
        switch (unit) {
            case "standard":
                return Math.round(kelvinVal) + " K";
            case "imperial":
                return Math.round((kelvinVal - 273.15) * 9 / 5 + 32) + "°F";
            case "metric":
            default:
                return Math.round(kelvinVal - 273.15) + "°C";
        }
    }

    function convertSpeed(speed, unit) {
        switch (unit) {
            case "imperial":
                return `${(speed * 2.237).toFixed(1)} mph`;
            case "metric":
                return `${(speed * 3.6).toFixed(1)} km/h`;
            case "standard":
            default:
                return `${speed.toFixed(1)} m/s`;
        }
    }

    function convertVisibility(val, unit) {
        switch (unit) {
            case "imperial":
                return `${(val / 1609.34).toFixed(2)} mi`;
            case "metric":
                return `${(val / 1000).toFixed(1)} km`;
            case "standard":
            default:
                return `${val} m`;
        }
    }
});
