function cityWeather() {
    $("#current-head, #current-temp, #current-humidity, #current-wind, #current-uv").empty();
          
    
    var APIkey = "e1063e4c4655b3290f4d3a7f070875e2";
    var searchField = $("#search-term").val().trim().toLowerCase();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchField + "&APPID=" + APIkey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        
        var displayMoment = $("<h2>");
        var currentMoment = moment();

        $("#city-name").empty();
        $("#city-name").append(displayMoment.text(" (" + currentMoment.format("L") + ") "));
        var cityName = $("<h2>").text(response.name);
        $("#city-name").prepend(cityName);
        var weatherIcon = $("<img>");
        
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
        
        var KtoCelcius = (response.main.temp - 273.15).toFixed(2);
        var currentTemp = $("<p>").text("Temperature: " + KtoCelcius + "\xB0C");
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Wind Speed: " + response.wind.speed + "m/s");
       
        $("#current-temp").append(currentTemp);
        $("#current-humidity").append(currentHumidity);
        $("#current-wind").append(currentWind);


        var longitude = response.coord.lon;
        var latitude = response.coord.lat;
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?APPID=" + APIkey+ "&lat=" + latitude + "&lon=" + longitude;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function(uvIndex) {
            console.log(uvIndex);
            var uvIndicate = $("<button>");
     
            if (uvIndex.value < 3) {
                // Green if UV condition is favourable
                uvIndicate.addClass("btn btn-success");
            } else if (uvIndex.value > 6) {
                // Yellow if UV condition is moderate
                uvIndicate.addClass("btn btn-danger");
            } else {
                // Red if UV condition is severe
                uvIndicate.addClass("btn btn-warning");
            }

            uvIndicate.text(uvIndex.value);
            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndicate);
        })

        // QueryURL for 5-days forecast
        var forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchField + "&APPID=" + APIkey;

        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function(forecast) {
            console.log(forecast);
            
            // Selects information at 24hrs from the current day and so on
            for (var i = 7; i < forecast.list.length; i += 8) {
                var forecastDate = $("<h5>");
                var forecastIndexID = (i +1) / 8;
                var forecastDayAdd = currentMoment.add(1, 'days').format("L");
                console.log("#forecast-date-" + forecastIndexID, i, forecastDayAdd);
                $("#forecast-date-" + forecastIndexID).empty();
                $("#forecast-date-" + forecastIndexID).append(forecastDate.text(forecastDayAdd));

                var forecastIcon = $("<img>");
                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + forecast.list[i].weather[0].icon + ".png");
                $("#forecast-icon-" + forecastIndexID).empty();
                $("#forecast-icon-" + forecastIndexID).append(forecastIcon);
                console.log(forecast.list[i].weather[0].icon);

                var KtoCelciusForecast = (forecast.list[i].main.temp - 273.15).toFixed(2);
                $("#forecast-temp-" + forecastIndexID).text("Temp: " + KtoCelciusForecast + "\xB0C");
                $("#forecast-humidity-" + forecastIndexID).text("Humidity" + forecast.list[i].main.humidity);

                $(".forecast").addClass("bg-primary text-white");
            }
        })
    })
}


$("#searchBtn").on("click", function () {
    event.preventDefault();
    cityWeather();
})