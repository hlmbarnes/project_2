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


// function initMap() {
//   var mapDiv = document.getElementById('map');
//   var map = new google.maps.Map(mapDiv, {
//   center: {lat: 44.540, lng: -78.546},
//   zoom: 8
//         });
// }


// })