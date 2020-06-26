$(document).ready(function () {
// define list containing of cities
    var cityList = $("#cityList")
    var yourList = [
        ["New London, CT, US", 41.3556539, -72.0995209],
        ["Groton, CT, US", 41.3556539, -72.0995209],
        ["Kansas City, MO, USA", 39.0997265, -94.5785667]
    ];
    buildCityList(yourList)


    var searchInput = "";
        autocomplete = new google.maps.places.Autocomplete((document.getElementById("searchInput")), {
            types: ["geocode"]
        });



        // event listener for google search bar.
        google.maps.event.addListener(autocomplete,  "place_changed", function () {
        var near_place = autocomplete.getPlace();
        var lati = near_place.geometry.location.lat()
        var logt = near_place.geometry.location.lng()
        console.log(yourList)
        var newCity = $("#searchInput").val()
        var newArray = new Array(newCity, lati, logt)
        newCity = newArray

        yourList.push(newCity)
        console.log(yourList)
        $("#latitudeInput").val(lati);
        $("#longitudeInput").val(logt);
        $("#latitudeView").text(lati);
        $("#longitudeView").text(logt);
        // build new list item with city found in it
        // get the current value of the search bar
        buildCityList(yourList)
           
        });
        
        // event listener for typing in a city and out outputting the coordinates
        $(document).on("change", searchInput, function () {
            document.getElementById("latitudeInput").value = "";
            document.getElementById("longitudeInput").value = "";
            // document.getElementById("latitudeView").innerHTML = "";
            // document.getElementById("longitudeView").innerHTML = "";
        });

        
        function buildCityList(yourList) {
            var yourList = yourList
            // first empty the current contents of the ul for the cities
            cityList.empty();
            for (i = 0; i < yourList.length; i++) {
                // create li buttons for each city
                // new li
                var newLI = $("<li>")
                // format the list item
                newLI.addClass("list-group-item");
                // add the name of the city to the li
                newLI.text(yourList[i][0]);
                // add the latitude attribute to the li
                newLI.attr("lat", yourList[i][1]);
                // add the longitude attribute to the li
                newLI.attr("long", yourList[i][2]);
                // add a data-index to the li
                
                // append the new city to the 
                cityList.append(newLI);

            }

               // event listener for when a city is selected
        $(".list-group-item").on("click", function (e) {
            e.preventDefault();
            theLat = $(this).attr("lat")
            theLong = $(this).attr("long")
            
            // api call to weather
            var APIKey = "19ebe7d8453b09616b508ab44e2e92b8";

            // Here we are building the URL we need to query the database
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ theLat +"&lon="+ theLong +"&units=imperial&appid=" + APIKey;

            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(OpenWeatherMap) {
                // Log the queryURL
                // console.log(OpenWeatherMap);
                // grab the name of the city 
                var cityName = OpenWeatherMap.city.name 
                // add the name of the city to the DOM
                $("#cityName").text(cityName);
                // grab the temp of the city
                var cityTemp = OpenWeatherMap.list[0].main.temp
                // add the temp to the DOM
                $("#temperature").text("Temperature: " + cityTemp);
                // grab list.main.humidity
                var cityHumidity = OpenWeatherMap.list[0].main.humidity
                // add the humidity to the DOM
                $("#humidity").text("Humidity: " + cityHumidity);
                // get the wind speed
                var cityWindSpeed = OpenWeatherMap.list[0].wind.speed
                // add the wind speed to the DOM
                $("#windSpeed").text("Wind Speed: " + cityWindSpeed + "MPH");
                // get the disc list.weather.description
                var cityDisc = OpenWeatherMap.list[0].weather[0].description
                // add the UV index to the DOM
                $("#cityDisc").text("Description: " + cityDisc);

            });
        });

        }

     


        // event listener for when the submit button is selected or enter is clicked
        $("#searchInput").on("submit", function (e) {
            e.preventDefault();
            console.log("The enter button was selected")

        });
        


});