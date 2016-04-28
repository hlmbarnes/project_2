var map;
var infowindow;
var service;

function initialize() {
  var Seattle = new google.maps.LatLng(47.6062, -122.335167);

  map = new google.maps.Map(document.getElementById('map'), {
    center: Seattle,
    zoom: 15,
    scrollwheel: false
  });

  // Specify location, radius and place types for your Places API search.
  var request = {
    location: Seattle,
    radius: '800',
    keyword: 'brewery'
  };
   
  infowindow = new google.maps.InfoWindow();

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  service = new google.maps.places.PlacesService(map);

  service.radarSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {
        var request = {placeId: results[i].place_Id};
             createMarker(results[i]);     
        }
 
  }
  else{ alert(status)};
}

function createMarker(placeOK){
  
  var marker = new google.maps.Marker({
        map: map,
        position: placeOK.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        service.getDetails({placeId: placeOK.place_id}, function(place, status){
        if (status === google.maps.places.PlacesServiceStatus.OK){
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 
              place.formatted_address + '<br>'+'<strong>'+place.formatted_phone_number+'</strong><br>'+
              place.website +'</div>');
              infowindow.open(map, marker);
            }
            else{ alert(status)};
      });
    
  });

}
google.maps.event.addDomListener(window, 'load', initialize);