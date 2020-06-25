$(document).ready(function () {
    console.log(google)
var searchInput = "";
autocomplete = new google.maps.places.Autocomplete((document.getElementById("searchInput")), {
    types: ["geocode"]
});

google.maps.event.addListener(autocomplete,  "place_changed", function () {
   var near_place = autocomplete.getPlace();
   document.getElementById("latitudeInput").value = near_place.geometry.location.lat();
   document.getElementById("longitudeInput").value = near_place.geometry.location.lng();

   document.getElementById("latitudeView").innerHTML = near_place.geometry.location.lat();
   document.getElementById("longitudeView").innerHTML = near_place.geometry.location.lng();
   
   
});
$(document).on("change", "#"+searchInput, function () {
    document.getElementById("latitudeInput").value = "";
    document.getElementById("longitudeInput").value = "";
    document.getElementById("latitudeView").innerHTML = "";
    document.getElementById("longitudeView").innerHTML = "";
});




});