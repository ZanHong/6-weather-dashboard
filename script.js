// Function that generate current and future weather information
function CreateCityWeather(searchCity, listBtns) {
    // Empties these divs so that contents are not duplicated
    $("#current-temp, #current-humidity, #current-wind, #current-uv").empty();
    
    // Adds a button of the new input to the list when it's entered
    CreateCityListBtns(listBtns);

    // Current weather with temperature, humidity and windspeed
    var APIkey = "e1063e4c4655b3290f4d3a7f070875e2";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?&appid=" + APIkey + "&q=" + searchCity;

    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var displayMoment = $("<h2>");
        var currentMoment = moment();

        // Empties the header if there's a new input or clicked button
        $("#city-name").empty();
        $("#city-name").append(displayMoment.text(" (" + currentMoment.format("l") + ") ")
        );

        var cityName = $("<h2>").text(response.name);
        $("#city-name").prepend(cityName);
        var weatherIcon = $("<img>");
        
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        
        // Empties the header icon if there's a new input or clicked button
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);

        // Converting Kelvin to Celsius
        var KtoCelcius = (response.main.temp - 273.15).toFixed(2);
        var currentTemp = $("<p>").text("Temperature: " + KtoCelcius + "\xB0C");
        var currentHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var currentWind = $("<p>").text("Wind Speed: " + response.wind.speed + "m/s");
       
        $("#current-temp").append(currentTemp);
        $("#current-humidity").append(currentHumidity);
        $("#current-wind").append(currentWind);

        
        // Current UV Index
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;

        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?APPID=" + APIkey+ "&lat=" + latitude + "&lon=" + longitude;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (uvIndex) {
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


            // Forecast Weather for the next 5 days
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?&appid=" + APIkey + "&q=" + searchCity;
            var forecastWeather = $("#forecast-weather");
            forecastWeather.addClass("pt-3");

            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            }).then(function (forecast) {
                console.log(forecast);
                
                // Selects information at 24hrs from the current day and so on
                for (var i = 7; i < forecast.list.length; i += 8) {
                    var forecastDate = $("<h5>");
                    // The equation below is used to make sure numbers 1 to 5 are generated for indexing the IDs below
                    var forecastIndexID = (i +1) / 8;
                    var forecastDayAdd = currentMoment.add(1, 'days').format("l");
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
                    $("#forecast-humidity-" + forecastIndexID).text("Humidity: " + forecast.list[i].main.humidity + "%");
    
                    $(".forecast").addClass("bg-primary text-white");
                }
            });
        });
    });
}

// A function to create buttons in the search list
function CreateCityListBtns(listBtns) {
    // Empties the list to prevent duplicates when this function is run
    $("#city-list").empty();
    $("#city-list").addClass("pt-3");

    // Returns an array of the object's properties (in this case the cities input)
    var cityProperty = Object.keys(listBtns);
    console.log(cityProperty);
    for (var i = 0; i < cityProperty.length; i++) {
        var CityListBtns = $("<button>");
        CityListBtns.addClass("list-group-item list-group-item-action");

        // For each of the string in the array, change the string to lower case and then split them if there exist a space between the strings
        var splitStr = cityProperty[i].toLowerCase().split(" ");
        for (var j = 0; j < splitStr.length; j++) {
            // Then change each first character of the split string (if any) to upper case
            splitStr[j] = splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
        }
        
        // join the split string if any then append it to #city-list
        var joinCityString = splitStr.join(" ");
        CityListBtns.text(joinCityString);

        $("#city-list").prepend(CityListBtns);
    }
}

// Run the below function once the document has finished rendering
$(document).ready(function () {
    var listBtns = JSON.parse(localStorage.getItem("listBtns"));

    // Sets an empty object if there's nothing
    if (listBtns == null) {
        listBtns = {};
    }

    // Calling this function here displays the previously STORED object items when the document is ready
    CreateCityListBtns(listBtns);

    // Hide these divs then the document has finished rendering
    $("#current-weather").hide();
    $("#forecast-weather").hide();


    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        var searchCity = $("#search-city").val().trim().toLowerCase();

        // If there is an input, set the input value for listBtns
        if (searchCity != "") {
            listBtns[searchCity] = true;
            localStorage.setItem("listBtns", JSON.stringify(listBtns));

            // Running the function here and another .on() function below so that the weather info is displayed
            CreateCityWeather(searchCity, listBtns);

            // Show these divs when search button is clicked
            $("#current-weather").show();
            $("#forecast-weather").show();
        }
    });


    // Standard .on("click") only didn't work
    // Found this method on StackOverflow where it targets buttons that are dynamically generated under <ul id="city-list">
    $("#city-list").on("click", "button", function (event) {
        event.preventDefault();
        var searchCity = $(this).text();

        // Running the function here and the .on() function above so that the weather info is displayed
        CreateCityWeather(searchCity, listBtns);

        // Show these divs when a city list button is clicked
        $("#current-weather").show();
        $("#forecast-weather").show();
    });
});