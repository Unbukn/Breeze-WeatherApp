$(document).ready(function () {
    // First get the client ip address
    $.getJSON('https://api.ipregistry.co/?key=4sl8k6on8u1sef', function(data) {
    var crntPC = data.ip
    console.log(crntPC)
        // next use ip address to find geo location
        var getTheIP = {
            "async": true,
            "crossDomain": true,
            "url": "https://free-geo-ip.p.rapidapi.com/json/" + crntPC,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "free-geo-ip.p.rapidapi.com",
                "x-rapidapi-key": "d82c676afemsh7edaf163ce44088p1641dajsn681616f67751"
            }
        }

        $.ajax(getTheIP).done(function (theCrntLocation) {
            var theLocation = theCrntLocation.city
            console.log(theLocation); 
            var theLat = theCrntLocation.latitude
            var theLong = theCrntLocation.longitude
            produceWeatherResults(theLocation,theLat, theLong)  
        });
    });

    // define list containing of cities
    var cityList = $("#cityList")
    var yourList = [
        ["Austin, TX, USA", 30.267153, -97.7430608],
        ["Chicago, IL, USA", 41.8781136, -87.6297982],
        ["New York, NY, USA", 40.7127753, -74.0059728],
        ["Orlando, FL, USA", 28.5383355, -81.3792365],
        ["San Francisco, CA, USA", 37.7749295, -122.4194155],
        ["Seattle, WA, USA", 47.6062095, -122.3320708],
        ["Denver, CO, USA", 39.7392358, -104.990251],
        ["Atlanta, GA, USA", 33.7489954, -84.3879824],
        
    ];
    // api call to open weather api
    var APIKey = "19ebe7d8453b09616b508ab44e2e92b8";
    // build a new list based on the your list array
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

        
        function produceWeatherResults(theLocation,theLat,theLong) {
            console.log(theLocation)
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
                console.log(OpenWeatherMap);
                // grab the name of the city 
                var cityName = theLocation
                // add the name of the city to the DOM
                $("#cityName").text("Current City: " + cityName);
                $(".navbar-brand").text("Current City: " + cityName);
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