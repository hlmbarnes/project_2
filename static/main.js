var map;
var infowindow;


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
    radius: '500',
    types: ['bar', 'brewery', 'beer']
  };
   
  infowindow = new google.maps.InfoWindow();

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
           createMarker(results[i]);

      }
    }
  }

function createMarker(place){
  alert (place.name + " detail: "+ place.formatted_address);
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br></div>');
    infowindow.open(map, this);
  });


}
google.maps.event.addDomListener(window, 'load', initialize);