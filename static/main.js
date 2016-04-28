// var map = new google.maps.Map();

// $(function(){
var map = new google.maps.Map();

  function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: 47.6062, lng: -122.335167},
      zoom: 8
    });
  }
// function initialize() {
//   var Seattle = new google.maps.LatLng(47.6062, -122.335167);

//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: Seattle,
//     zoom: 15,
//     scrollwheel: false
//   });

// 	infowindow = new google.maps.InfoWindow();
//   	var service = new google.maps.places.PlacesService(map);
//   	service.nearbySearch({
//     	location: Seattle,
//     	radius: 500,
//     	type: ['bar', 'brewery']
//   	}, callback);
// 	}

// 	function callback(results, status) {
//   if (status === google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       createMarker(results[i]);
//     }
//   }
// }

// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//     infowindow.setContent(place.name);
//     infowindow.open(map, this);
//   });
// }

  Specify location, radius and place types for your Places API search.
  var request = {
    location: Seattle,
    radius: '500',
    types: ['bar', 'brewery']
  };

  Create the PlaceService and send the request.
  Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location


        });
      }
    }
  });
}

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
