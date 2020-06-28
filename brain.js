$(document).ready(function () {
    // moment object
    var m = moment.parseZone()
    console.log(m)
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
        ["New York, NY, USA", 40.7127753, -74.0059728],
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
        console.log(yourList)
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
            theLocation = $(this).text()
            theLat = $(this).attr("lat")
            theLong = $(this).attr("long")
            produceWeatherResults(theLocation, theLat, theLong)            

        });

        }

        
function produceWeatherResults(theLocation,theLat,theLong) {
        console.log(theLocation)
            // Here we are building the URL we need to query the database
            
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ theLat +"&lon="+ theLong +"&units=imperial&exclude=hourly,minutely&appid=" + APIKey;
            
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
                $("#cityName").text(cityName);
                // grab the temp of the city
                var cityTemp = OpenWeatherMap.current.temp
                // add the temp to the DOM
                $("#temperature").text("Temperature: " + cityTemp);
                // grab list.main.humidity
                var cityHumidity = OpenWeatherMap.current.humidity
                // add the humidity to the DOM
                $("#humidity").text("Humidity: " + cityHumidity);
                // get the wind speed
                var cityWindSpeed = OpenWeatherMap.current.wind_speed
                // add the wind speed to the DOM
                $("#windSpeed").text("Wind Speed: " + cityWindSpeed + "MPH");
                // get the disc list.weather.description
                var cityDisc = OpenWeatherMap.current.weather[0].description
                // add the UV index to the DOM
                $("#cityDisc").text("Description: " + cityDisc);

                // clear out the forecast container
                
                var forcastContainer = $("#forcastContainer")
                
                for (j = 0; j < OpenWeatherMap.list.length; j++) {
                // get the date
                var theDate = OpenWeatherMap.list[j].dt_txt
                // get the temp
                var theTemp = OpenWeatherMap.list[j].main.temp
                // get the humidity
                var theHumi = OpenWeatherMap.list[j].main.humidity

                // create a new div for the
                var carousel = $("<div>")
                // add class to the carousel
                carousel.addClass("carousel")
                carousel.attr("data-flickity>")
                // add the carousel to the forcastContainer
                carousel.appendTo(forcastContainer);



                // create a new div for the carousel-cell
                var carouselCell = $("<div>")
                // add carousel class to the card
                carouselCell.addClass("carousel-cell");
                // attach the carousel to the carousel Container
                carousel.append(carouselCell);

                //create a card for the day
                var weatherCard = $("<div>")
                // add the card class to the DIV
                weatherCard.addClass("card")
                weatherCard.attr("style", "width: 18rem;");
                // add the weather card to the carousel class
                weatherCard.appendTo(carouselCell);
                
                // create the card-body
                var cardBody = $("<div>")
                cardBody.addClass("card-body");
                // add the card body to the weather card
                cardBody.appendTo(weatherCard)
                
                // add a card title
                var cardTitle = $("<h5>")
                // add class to the card title
                cardTitle.addClass("card-title");
                // add text the card-title
                cardTitle.text(theDate)
                // append the card title to the card body
                cardTitle.appendTo(cardBody);
                
                // add a card humidity
                var cardTemp = $("<h6>")
                // add class to the card title
                cardTemp.addClass("card-subtitle mb-2 text-muted");
                // add text the card-title
                cardTemp.text(theTemp)
                // append the card title to the card body
                cardTemp.appendTo(cardBody);

                // add a card humidity
                var cardHumid = $("<h6>")
                // add class to the card title
                cardHumid.addClass("card-subtitle mb-2 text-muted");
                // add text the card-title
                cardHumid.text(theHumi)
                // append the card title to the card body
                cardHumid.appendTo(cardBody);

                // append the card body to the card
                carouselCell.appendTo(carousel);

                    
                }

            });
    
}

});