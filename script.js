$("#searchBtn").on("click", function () {
    event.preventDefault();
    $("#current-head, #current-temp, #current-humidity, #current-wind, #current-uv").empty();
           
    var APIkey = "e1063e4c4655b3290f4d3a7f070875e2";
    var searchField = $("#search-term").val().trim().toLowerCase();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchField + "&APPID=" + APIkey;
    

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        
        var KtoCelcius = (response.main.temp - 273.15).toFixed(2);
        var currentCity = $("<h2>").text(response.name);
        var currentTemp = $("<p>").text("Temperature: " + KtoCelcius + "\xB0" + "C");
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%")
        var currentWind = $("<p>").text("Wind Speed: " + response.wind.speed + "m/s")
        
        $("#current-head").append(currentCity);
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

        
    })
})