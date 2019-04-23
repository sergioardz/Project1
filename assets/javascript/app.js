// ! when window loads
window.onload = function () {

    // hide the results
    $("#selectcontainer").hide();
    $("#currentcontainer").hide();
    $("#randomcontainer").hide();
    $("#beerhuntcontainer").hide();
    $("#beerresultcontainer").hide();

    // app version
    console.log("app v4");
};

// ! beer icon thingy
// works as a home button
$("#beericon").click(function () {

    // hide and show containers accordingly
    $("#titlediv").show();
    $("#searchcontainer").show();
    $("#selectcontainer").hide();
    $("#currentcontainer").hide();
    $("#randomcontainer").hide();
    $("#beerhuntcontainer").hide();
    $("#beerresultcontainer").hide();

});

// ! another location clicked
// another location option clicked
$("#select").on("click", function (event) {

    // preventing default behavior
    event.preventDefault();

    // hide and show containers accordingly
    $("#titlediv").hide();
    $("#searchcontainer").hide();
    $("#selectcontainer").show(500);
});

// ! my current location clicked
// current location option clicked
$("#current").on("click", function (event) {

    // preventing default behavior
    event.preventDefault();

    // ? getting my current city based on my public ip

    // get my public ip
    var myPublicIpUrl = "https://api.ipify.org?";

    // ajax call to get the public ip
    $.ajax({ url: myPublicIpUrl, method: "GET" }).done(function (response) {

        // get my public ip
        var myPublicIp = response;
        console.log("my public ip: " + myPublicIp);

        // another ajax call to get the city, latitude and longitude based on the public ip
        $.ajax({
            url: "https://geo.ipify.org/api/v1",
            dataType: "json",
            data: { apiKey: "at_knMW8P4hXMF72fVn0z8jG2ZnwPsAy", ipAddress: myPublicIp }
        })
            .done(function (response) {

                // storage the respone in the html
                var mylocation = response.location;

                // update the html
                $("#cityregioncountry").text(mylocation.city + ", " + mylocation.region + ", " + mylocation.country);
                $("#latlong").text("latitude: " + mylocation.lat + ", longitude: " + mylocation.lng);

                // console stuff
                console.log("country: " + response.location.country);
                console.log("region: " + response.location.region);
                console.log("city: " + response.location.city);
                console.log("latitude : " + response.location.lat);
                console.log("longitude : " + response.location.lng);
                console.log("---------------------------------------------");

                // Store Latitude and Longitude as variables
                myLat = response.location.lat;
                myLng = response.location.lng;

                // Run a GetJSON from locations.json to get the closest location from current one
                $.getJSON("locations.json", function (response) {
                    for (i = 0; i < response.data.length; i++) {
                        var D = distance(myLat, myLng, response.data[i].latitude, response.data[i].longitude, unit);
                        response.data[i].distAway = D;
                    }
                    var minDistAway = Number.POSITIVE_INFINITY;
                    var minDistAwayLocName;
                    for (i = 0; i < response.data.length; i++) {
                        if (response.data[i].distAway < minDistAway) {
                            minDistAway = response.data[i].distAway;
                            minDistAwayLocName = response.data[i].name;
                            minDistAwayLocality = response.data[i].locality;
                            minDistAwayRegion = response.data[i].region;
                            minDistAwayLat = response.data[i].latitude;
                            minDistAwayLng = response.data[i].longitude;
                        }
                    }
                    console.log(minDistAway);
                    console.log(minDistAwayLocName);
                    console.log(minDistAwayLocality);
                    console.log(minDistAwayRegion);
                    console.log(minDistAwayLat);
                    console.log(minDistAwayLng);
                    $("#currentcontainer").append("<p>The closest location is in: " + minDistAwayLocality + ", " + minDistAwayRegion + "</p>");

                    // insert google map and stuff
                    var map;
                    var marker;
                    var service;
                    var infowindow;
                    var myLatLng = { lat: minDistAwayLat, lng: minDistAwayLng };
                    var auxquery = minDistAwayLocName + " " + minDistAwayLocality + ", " + minDistAwayRegion;
                    console.log(auxquery);
                    var closeLoc = new google.maps.LatLng(minDistAwayLat, minDistAwayLng);
                    infowindow = new google.maps.InfoWindow();
                    map = new google.maps.Map(
                        document.getElementById("map"), { center: closeLoc, zoom: 9 });
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: auxquery
                    });

                })

                // run the google map
                // initMap(mylocation.lat, mylocation.lng);
            })
    })

    // Function to get distance from 2 lat-lng locations

    function distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    // ? google maps functions

    // var map;
    // var service;
    // var infowindow;

    // initializing map
    // function initMap(mylat, mylng) {

    //     var mylocation = new google.maps.LatLng(mylat, mylng);
    //     infowindow = new google.maps.InfoWindow();

    //     map = new google.maps.Map(document.getElementById("map"), { center: mylocation, zoom: 10 });

    //     var request = { query: "Spindletap Brewery", fields: ["name", "geometry"] };

    //     service = new google.maps.places.PlacesService(map);

    //     service.findPlaceFromQuery(request, function (results, status) {

    //         if (status === google.maps.places.PlacesServiceStatus.OK) {

    //             for (var i = 0; i < results.length; i++) {

    //                 createMarker(results[i]);
    //             }

    //             map.setCenter(results[0].geometry.location);
    //         }
    //     });
    // }

    // creating marker
    // function createMarker(place) {

    //     var marker = new google.maps.Marker({

    //         map: map,
    //         position: place.geometry.location
    //     });

    //     google.maps.event.addListener(marker, 'click', function () {

    //         infowindow.setContent(place.name);
    //         infowindow.open(map, this);
    //     });
    // }

    // if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (position) {

    //     console.log("google maps stuff: ");
    //     console.log(position);

    //     var lat = position.coords.latitude;
    //     var lng = position.coords.longitude;
    //     console.log("latitude: " + lat);
    //     console.log("longitude: " + lng);

    //     $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false&key=AIzaSyDw8hFnyQv4weAe34Uhrba3H22o52PYXKc", function (data) {
    //         // console.log(data);
    //         // console.log(data.results[6].formatted_address);
    //     })
    // });
    // else {
    //     console.log("geolocation is not supported");
    // }

    // hide and show containers accordingly
    $("#titlediv").hide();
    $("#searchcontainer").hide();
    $("#currentcontainer").show(500);
});

// ! random container stuff
// random beer option event clicked
$("#random").on("click", function (event) {

    // preventing default behavior
    event.preventDefault();

    // show a new beer
    showRandomBeer();

    // hide and show containers accordingly
    $("#titlediv").hide();
    $("#searchcontainer").hide();
    $("#randomcontainer").show(500);
});

// showing a new random beer
$("#nextbeer").on("click", function (event) {

    // preventing default behavior
    event.preventDefault();

    // show a new beer
    showRandomBeer();

    // scroll to top of the screen
    document.body.scrollTop = document.documentElement.scrollTop = 0;
});

// random beer function
let showRandomBeer = function () {

    // all locations id will be stored in this array
    var allLocationIDs = [];

    // json call to the file that contains all data
    $.getJSON("./assets/json/alldata.json", function (response) {

        // iterate all the json and store the ids
        for (i = 0; i < response.data.length; i++) {

            allLocationIDs.push(response.data[i].id);
        }

        // generate random number from 0 to the all locations lenght
        var r = Math.floor(Math.random() * allLocationIDs.length);

        // store the object from the json in a var
        var beer = response.data[r];
        console.log(beer);

        // update the html - name
        $("#r_beername").text(beer.name);

        // update the html - photo (label)
        if (beer.hasOwnProperty("labels")) {
            $("#r_beerphoto").attr("src", beer.labels.medium);
        }
        else {
            $("#r_beerphoto").attr("src", "https://bit.ly/2GzN4gH");
        }

        // update the html - description
        if (beer.hasOwnProperty("description")) {
            $("#r_beerdescription").text(beer.description);
        }
        else {
            $("#r_beerdescription").text("-");
        }

        // update the html - style
        if (beer.hasOwnProperty("style")) {
            $("#r_stylecategoryname").text(beer.style.category.name);
            $("#r_stylename").text(beer.style.name);
            $("#r_styledescription").text(beer.style.description);
        }
        else {
            $("#r_stylecategoryname").text("-");
            $("#r_stylename").text("-");
            $("#r_styledescription").text("-");
        }

        // update the html - abv
        if (beer.hasOwnProperty("abv")) {
            $("#r_abv").text(beer.abv);
        }
        else {
            $("#r_abv").text("-");
        }

        // update the html - ibu
        if (beer.hasOwnProperty("ibu")) {
            $("#r_ibu").text(beer.ibu);
        }
        else {
            $("#r_ibu").text("-");
        }

        // update the html - available
        if (beer.hasOwnProperty("available")) {
            $("#r_availability").text(beer.available.name + " / " + beer.available.description);
        }
        else {
            $("#r_availability").text("-");
        }

        // beer location
        var locationID;

        // json call to the master file to get the location id
        $.getJSON("./assets/json/master.json", function (master) {

            // iterate the data
            for (i = 1; i < master.data.length; i++) {

                // if the beer id is found
                if (beer.id === master.data[i].C) {

                    // save the location id in a var
                    locationID = master.data[i].G;
                }
            }

            // json call to the locations file
            $.getJSON("./assets/json/locations.json", function (response) {

                // iterate the data
                for (i = 0; i < response.data.length; i++) {

                    // find the beer location id 
                    if (locationID === response.data[i].id) {

                        // update the html
                        $("#r_wheretobuy").text(response.data[i].locality + ", " + response.data[i].region);
                    }
                }
            })
        })

        // clear the aray
        allLocationIDs = [];
    })
};

// ! advanced beer hunt container stuff
$("#beerhunt").on("click", function (event) {

    // preventing default behavior
    event.preventDefault();

    // clean all the dropdowns
    cleanDropdowns();

    // fill the category dropdown
    load_json_data("category", "0");

    // disable button from beerhuntcontainer
    document.getElementById("huntbttn").disabled = true;

    // disable dropdowns accordingly
    document.getElementById("type").disabled = true;
    document.getElementById("brewery").disabled = true;
    document.getElementById("beer").disabled = true;


    // hide and show containers accordingly
    $("#titlediv").hide();
    $("#searchcontainer").hide();
    $("#beerhuntcontainer").show(500);
});

// fill the dropdowns function
let load_json_data = function (dropdown, parent) {

    // json call
    $.getJSON("./assets/json/beers2.json", function (array) {

        // getting the array in a var
        var data = array.data;

        switch (dropdown) {

            case "category":
                // populate the category dropdown
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].parent_id == parent) {
                        $("#" + dropdown).append("<option beerid='" + data[i].id + "'>" + data[i].name + "</option>");
                    }
                }
                break;

            case "type":
                // populate the type dropdown
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].parent_id == parent) {
                        $("#" + dropdown).append("<option beerid='" + data[i].id + "'>" + data[i].name + "</option>");
                    }
                }
                break;

            case "brewery":
                // populate the type dropdown
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].parent_id == parent) {
                        $("#" + dropdown).append("<option beerid='" + data[i].id + "'>" + data[i].name + "</option>");
                    }
                }
                break;

            case "beer":
                // populate the beer dropdown
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].parent_id == parent) {
                        $("#" + dropdown).append("<option beerid='" + data[i].id + "'>" + data[i].name + "</option>");
                    }
                }
                break;

        }

    });

}

// listener for category dropdown
$(document).on("change", "#category", function () {

    // get the id
    var id = $("option:selected", this).attr("beerid");

    // clear and disable everything
    $("#type").empty();
    $("#type").html("<option value='' disabled selected>Select Type</option>");
    $("#brewery").empty();
    $("#beer").empty();
    document.getElementById("type").disabled = true;
    document.getElementById("brewery").disabled = true;
    document.getElementById("beer").disabled = true;
    document.getElementById("huntbttn").disabled = true;

    // load the next dropdown
    load_json_data("type", id);

    // enable type dropdown
    document.getElementById("type").disabled = false;
});

// listener for category dropdown
$(document).on("change", "#type", function () {

    // get the id
    var id = $("option:selected", this).attr("beerid");

    // clear and disable everything
    $("#brewery").empty();
    $("#brewery").html("<option value='' disabled selected>Select Brewery</option>");
    $("#beer").empty();
    document.getElementById("brewery").disabled = true;
    document.getElementById("beer").disabled = true;
    document.getElementById("huntbttn").disabled = true;

    // load the next dropdown
    load_json_data("brewery", id);

    // enable brewery dropdown
    document.getElementById("brewery").disabled = false;
});

// listener for category dropdown
$(document).on("change", "#brewery", function () {

    // get the id
    var id = $("option:selected", this).attr("beerid");

    // clear and disable everything
    $("#beer").empty();
    $("#beer").html("<option value='' disabled selected>Select Beer</option>");
    document.getElementById("beer").disabled = true;
    document.getElementById("huntbttn").disabled = true;

    // load the next dropdown
    load_json_data("beer", id);

    // enable beer dropdown
    document.getElementById("beer").disabled = false;
});

// listener for category dropdown
$(document).on("change", "#beer", function () {

    // enable hunt button
    document.getElementById("huntbttn").disabled = false;

});

// hunt button
$("#huntbttn").on("click", function () {

    // get the id
    var id = $("option:selected", "#beer").attr("beerid");

    // json call
    $.getJSON("./assets/json/beers2.json", function (array) {

        // getting the array in a var
        var data = array.data;

        // hunt the beer in the beers2 file
        for (var i = 0; i <= data.length - 1; i++) {
            if (data[i].id == id) {

                var beerid = data[i].beer_id;
                console.log("beerid i'm looking for: " + beerid);

                // find the beer on alldata file by beerid
                $.getJSON("./assets/json/alldata.json", function (response) {

                    // iterate all the json and store the ids
                    for (i = 0; i < response.data.length; i++) {

                        if (response.data[i].id == beerid) {

                            var beer = response.data[i];

                            // ! begins update html

                            // update the html - name
                            $("#br_beername").text(beer.name);

                            // update the html - photo (label)
                            if (beer.hasOwnProperty("labels")) {
                                $("#br_beerphoto").attr("src", beer.labels.medium);
                            }
                            else {
                                $("#br_beerphoto").attr("src", "https://bit.ly/2GzN4gH");
                            }

                            // update the html - description
                            if (beer.hasOwnProperty("description")) {
                                $("#br_beerdescription").text(beer.description);
                            }
                            else {
                                $("#br_beerdescription").text("-");
                            }

                            // update the html - style
                            if (beer.hasOwnProperty("style")) {
                                $("#br_stylecategoryname").text(beer.style.category.name);
                                $("#br_stylename").text(beer.style.name);
                                $("#br_styledescription").text(beer.style.description);
                            }
                            else {
                                $("#br_stylecategoryname").text("-");
                                $("#br_stylename").text("-");
                                $("#br_styledescription").text("-");
                            }

                            // update the html - abv
                            if (beer.hasOwnProperty("abv")) {
                                $("#br_abv").text(beer.abv);
                            }
                            else {
                                $("#br_abv").text("-");
                            }

                            // update the html - ibu
                            if (beer.hasOwnProperty("ibu")) {
                                $("#br_ibu").text(beer.ibu);
                            }
                            else {
                                $("#br_ibu").text("-");
                            }

                            // update the html - available
                            if (beer.hasOwnProperty("available")) {
                                $("#br_availability").text(beer.available.name + " / " + beer.available.description);
                            }
                            else {
                                $("#br_availability").text("-");
                            }

                            // beer location
                            var locationID;

                            // json call to the master file to get the location id
                            $.getJSON("./assets/json/master.json", function (master) {

                                // iterate the data
                                for (i = 1; i < master.data.length; i++) {

                                    // if the beer id is found
                                    if (beer.id === master.data[i].C) {

                                        // save the location id in a var
                                        locationID = master.data[i].G;
                                    }
                                }

                                // json call to the locations file
                                $.getJSON("./assets/json/locations.json", function (response) {

                                    // iterate the data
                                    for (i = 0; i < response.data.length; i++) {

                                        // find the beer location id 
                                        if (locationID === response.data[i].id) {

                                            // update the html
                                            $("#br_wheretobuy").text(response.data[i].locality + ", " + response.data[i].region);
                                        }
                                    }
                                })
                            })

                            // ! ends update html

                            break;
                        }
                    }
                })

                break;
            }
        }

    });

    // hide and show containers accordingly
    $("#beerhuntcontainer").hide();
    $("#beerresultcontainer").show(500);

});

// go back to beer hunter button
$("#goback").on("click", function (event) {

    // clean dropdowns
    // cleanDropdowns();

    // disable dropdowns accordingly
    // document.getElementById("type").disabled = true;
    // document.getElementById("brewery").disabled = true;
    // document.getElementById("beer").disabled = true;

    // hide and show containers
    $("#beerhuntcontainer").show(500);
    $("#beerresultcontainer").hide();
});

let cleanDropdowns = function () {

    // clean all the dropdowns
    $("#category").empty();
    $("#category").html("<option value='' disabled selected>Select Category</option>");
    $("#type").empty();
    // $("#type").html("<option value='' disabled selected>Select Type</option>");
    $("#brewery").empty();
    // $("#brewery").html("<option value='' disabled selected>Select Brewery</option>");
    $("#beer").empty();
    // $("#beer").html("<option value='' disabled selected>Select Beer</option>");

    // then fill the category dropdown
    load_json_data("category", "0");

}