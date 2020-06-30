$(document).ready(function () {
// api call to open weather api
var APIKey = "19ebe7d8453b09616b508ab44e2e92b8";
// build a new list based on the your list array

// ask user for geo location
get_location(show_map)


function get_location() {
    if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(show_map);
    
    } else {
      // no native support; maybe try Gears?
    }
}
    // define list containing of cities
    var cityList = $("#cityList")
    // check for saved lists
    var yourList = JSON.parse(localStorage.getItem("WeatherLocations"));
    
    if (yourList == null) {
        // save the default list of cities per the assignment
        // console.log("no saved locations")
        var yourList = [
        ["Chicago, IL, USA", 41.8781136, -87.6297982],
        ["New York, NY, USA", 40.7127753, -74.0059728],
        ["Orlando, FL, USA", 28.5383355, -81.3792365],
        ["San Francisco, CA, USA", 37.7749295, -122.4194155],
        ["Seattle, WA, USA", 47.6062095, -122.3320708],
        ["Denver, CO, USA", 39.7392358, -104.990251],
        ["Atlanta, GA, USA", 33.7489954, -84.3879824],
    ];
    } else {
    //cl results found, save the stored list as your list 
    var yourList = yourList
    }


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
        // get the value of the searchbar contents
        var newCity = $("#searchInput").val()
        // create a new array with the city information
        var newArray = new Array(newCity, lati, logt)

        newCity = newArray
        yourList.push(newCity)
        // save the list with the new location to local storage
        // console.log("adding "+newCity+"to the list and saving to local storage")
        localStorage.setItem("WeatherLocations", JSON.stringify(yourList));
        // build new list item with city found in it
        // get the current value of the search bar
        buildCityList(yourList)
        });
        
        // event listener for typing in a city and out outputting the coordinates
        $(document).on("change", searchInput, function () {
            document.getElementById("latitudeInput").value = "";
            document.getElementById("longitudeInput").value = "";
        });

        function buildCityList(yourList) {
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
            // remove the active class from any others that could be out there
            $(".active").removeClass("active");
            // add the active class to the selected list item
            $(this).addClass("active");
            // grab the location from the list item
            theLocation = $(this).text()
            // grab the latitude from the list item
            theLat = $(this).attr("lat")
            // grab the longitude from the list item
            theLong = $(this).attr("long")
            // produce the results
            produceWeatherResults(theLocation, theLat, theLong)            

        });

        }

        function show_map(position) {
            var theLat = position.coords.latitude;
            var theLong = position.coords.longitude;
            // let's show a map or do something interesting!
            // Here we are building the URL we need to query the database            
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+ theLat +"&lon="+ theLong +"&appid=" + APIKey;
            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(OpenWeatherMap) {
            var theLocation = OpenWeatherMap.name
            produceWeatherResults(theLocation,theLat,theLong)
            });
        }

        function produceWeatherResults(theLocation,theLat,theLong) {
            // console.log(theLocation)
            // Here we are building the URL we need to query the database
            
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ theLat +"&lon="+ theLong +"&cnt=16&units=imperial&exclude=hourly,minutely&appid=" + APIKey;
            
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
                var cityName = theLocation
                // add the name of the city to the DOM
                $("#cityName").text("Current weather in " + cityName);
                // grab the temp of the city
                var cityTemp = OpenWeatherMap.current.temp
                // add the temp to the DOM
                $("#temperature").html('Temperature: ' + cityTemp + '<span>&#8457;</span>');
                // grab list.main.humidity
                var cityHumidity = OpenWeatherMap.current.humidity
                // add the humidity to the DOM
                $("#humidity").html('Humidity: ' + cityHumidity + '<span>&#37;</span>');
                // get the wind speed
                var cityWindSpeed = OpenWeatherMap.current.wind_speed
                // add the wind speed to the DOM
                $("#windSpeed").text("Wind Speed: " + cityWindSpeed + "MPH");
                // get the disc list.weather.description
                var cityDisc = OpenWeatherMap.current.weather[0].description
                // add the UV index to the DOM
                $("#cityDisc").text("Description: " + cityDisc);
                // update the nav crawler
                $(".navbar-brand").html('Current location: ' + cityName + '.       Temperature: ' + cityTemp + '<span>&#8457;</span>' + '       Humidity: ' + cityHumidity + '<span>&#37;</span>' + '       Wind Speed: ' + cityWindSpeed + 'MPH' );
                
                
                for (j = 0; j < OpenWeatherMap.daily.length; j++) {
                var m = moment()
                // get the date
                var theDate = m.add(j, 'days').format('dddd MMM Do');
                // get the temp
                var theTemp = OpenWeatherMap.daily[j].temp.day
                // get the humidity
                var theHumi = OpenWeatherMap.daily[j].humidity
                // add text the card-title
                $("#day"+j).text(theDate)
                // set temperature
                $("#temp"+j).html('Temperature: ' + theTemp + '<span>&#8457;</span>')
                // set humidity
                $("#humidity"+j).html('Humidity: ' + theHumi + '<span>&#37;</span>')           
                    
                }

            });
    
}

});