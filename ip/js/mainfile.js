var myPlaces=[
    {
    name: "Trident hotel",
    lat: 18.927491,
    lng: 72.821116,
    show: true,
    selected: false,
    venuId: "4c1efc7963750f474693ba67"
    },
    {
    name: "Hard Rock Cafe",
    lat: 19.006721,
    lng: 72.829226,
    show: true,
    selected: false,
    venuId: "4b0587ccf964a52037a222e3"
    },
    {
    name: "Jogger's Park",
    lat: 19.063280,
    lng: 72.851040,
    show: true,
    selected: false,
    venuId: "4b0587d2f964a52009a322e3"
    },
    {
    name: "Marine Drive Beach",
    lat: 18.943584,
    lng: 72.822871,
    show: true,
    selected: false,
    venuId: "4b0587d1f964a520d1a222e3"
    },
    {
    name: "Wankhede Stadium",
    lat: 18.938899,
    lng: 72.825778,
    show: true,
    selected: false,
    venuId: "4b0587dbf964a5207da422e3"
    },
    {
    name: "Shivaji Park",
    lat: 19.027069,
    lng: 72.838101,
    show: true,
    selected: false,
    venuId: "4b0587d2f964a52014a322e3"
    },
  {
    name: "Narayan Dosa Restaurant",
    lat: 18.957284,
    lng: 72.813516,
    show: true,
    selected: false,
    venuId: "4d455cd44e5d3704695cf693"
    },
{
    name: "Starbucks Coffee Shop",
    lat: 19.141571,
    lng: 72.830693,
    show: true,
    selected: false,
    venuId:"507fcb7a498e5d07b1604ea2"
    },
{
    name: "Bandra Fort Monument",
    lat: 19.042023,
    lng: 72.818396,
    show: true,
    selected: false,
    venuId: "4c9832b2671db60c41b3b7f6"
    },

{
    name: "Grand Hyatt Hotel",
    lat: 19.077421,
    lng: 72.851313,
    show: true,
    selected: false,
    venuId: "4b0587caf964a520dfa122e3"
    },

{
    name: "Taj Hotel",
    lat: 18.921729,
    lng: 72.833031,
    show: true,
    selected: false,
    venuId: "4b0587caf964a520f1a122e3"
    },

{
    name: "Intercontinental Hotel",
    lat: 18.935092,
    lng: 72.824249,
    show: true,
    selected: false,
    venuId: "4bc78f5293bdeee1838337ae"
    },

{
    name: "Chhatrapati Shivaji International Airport ",
    lat: 19.089560,
    lng: 72.865614,
    show: true,
    selected: false,
    venuId: "4b0587e5f964a5202ea622e3"
    },

{
    name: "Dahisar Railway Station",
    lat: 19.250189,
    lng: 72.859206,
    show: true,
    selected: false,
    venuId: "4ba3bba8f964a520795938e3"
    },

{
    name: "Gateway of India Monument",
    lat: 18.921984,
    lng: 72.834654,
    show: true,
    selected: false,
    venuId: "4b0587d1f964a520cea222e3"
    },
{
    name: "IIT Bombay University",
    lat: 19.133430,
    lng: 72.913268,
    show: true,
    selected: false,
    venuId: "4b11f6fdf964a520a08723e3"
    },


];
var viewModel = function() {

  var self = this;

  self.errorDisplay = ko.observable('');

  // populates the  mapList with every Model
  self.mapList = [];
  myPlaces.forEach(function(marker){
    self.mapList.push(new google.maps.Marker({
      position: {lat: marker.lat, lng: marker.lng},
      map: map,
      name: marker.name,
      show: ko.observable(marker.show),  // sets observable for checking
      selected: ko.observable(marker.selected),
      venuId: marker.venuId,   // foursquare id
      animation: google.maps.Animation.DROP
    }));
  });

  //stores the mapList length
  self.mapListLength = self.mapList.length;

  //set current map item
  self.currentMapItem = self.mapList[0];

  // function to make marker bounce but stop after the delay of 500ms
  self.makeBounce = function(marker){
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null);}, 500);
  };

  // function to add API information to each marker
  self.addApiInfo = function(passMark){
      $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + passMark.venuId + '?client_id=4PHWJ0J5G23SDODBMUSO5QAL35MJ53JI2YQ4V4FVK5VVMYKQ&client_secret=AAXVYPBJJQ1LTHIEMJCXYKP1U1DWO5IWFPIPPYDSUGZFWTEY&v=20170514',
        dataType: "json",//foresquare id and client
        success: function(data){
          // store results to display likes and ratings
          var result = data.response.venue;
          // add likes and ratings to marker
          passMark.likes = result.hasOwnProperty('likes') ? result.likes.summary: "";
          passMark.rating = result.hasOwnProperty('rating') ? result.rating: "";
        },
        //alert if there is any  error in recievng json
        error: function(e) {
          self.errorDisplay("Foursquare data is unavailable. Please try again later.");
        }
      });
  };
    // iterates through mapList and add marker event listener and API information
  for (var i=0; i < self.mapListLength; i++){
    (function(passMark){
            self.addApiInfo(passMark);
            //add the click event listener to mapMarker
            passMark.addListener('click', function(){
                self.setSelected(passMark);
            });
        })(self.mapList[i]);
  }

  self.filterText = ko.observable('');
  self.applyFilter = function() {
    var currentFilter = self.filterText();
    infowindow.close();
    //filter the list as user seach
    if (currentFilter.length === 0) {
            self.setAllShow(true);
        } else {
            for (var i = 0; i < self.mapListLength; i++) {
                if (self.mapList[i].name.toLowerCase().indexOf(currentFilter.toLowerCase()) > -1) {
                    self.mapList[i].show(true);
                    self.mapList[i].setVisible(true);
                } else {
                    self.mapList[i].show(false);
                    self.mapList[i].setVisible(false);
                }
            }
    }
    infowindow.close();
  };
  // to make all markers visible
  self.setAllShow = function(showVar) {
    for (var i = 0; i < self.mapListLength; i++) {
      self.mapList[i].show(showVar);
      self.mapList[i].setVisible(showVar);
    }
  };
  self.setAllUnselected = function() {
        for (var i = 0; i < self.mapListLength; i++) {
            self.mapList[i].selected(false);
        }
    };
  self.setSelected = function(location) {
        self.setAllUnselected();
        location.selected(true);
        self.currentMapItem = location;
        formattedLikes = function() {
            if (self.currentMapItem.likes === "" || self.currentMapItem.likes === undefined) {
                return "No likes to display";
            } else {
                return "Location has " + self.currentMapItem.likes;
            }
        };
        formattedRating = function() {
            if (self.currentMapItem.rating === "" || self.currentMapItem.rating === undefined) {
                return "No rating to display";
            } else {
                return "Location is rated " + self.currentMapItem.rating;
            }
        };
        var formattedInfoWindow = "<h5>" + self.currentMapItem.name + "</h5>" + "<div>" + formattedLikes() + "</div>" + "<div>" + formattedRating() + "</div>";
        infowindow.setContent(formattedInfoWindow);
        infowindow.open(map, location);
        self.makeBounce(location);
    };
};