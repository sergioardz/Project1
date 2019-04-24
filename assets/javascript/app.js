// ! when window loads
window.onload = function () {

    // hide the results
    $("#selectcontainer").hide();
    $("#currentcontainer").hide();
    $("#randomcontainer").hide();
    $("#beerhuntcontainer").hide();
    $("#beerresultcontainer").hide();

    // app version
    console.log("app v9");
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
                // console.log("---------------------------------------------");

                // Store Latitude and Longitude as variables
                myLat = response.location.lat;
                myLng = response.location.lng;

                // Run a GetJSON from locations.json to get the closest location from current one
                $.getJSON("assets/json/locations.json", function (response) {
                    var unit = "M";
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
                    breweryID = master.data[i].F;
                }
            }

            $.getJSON("assets/json/breweries.json", function (response) {
                for (i = 0; i < response.data.length; i++) {
                    if (breweryID === response.data[i].id) {
                        console.log("Brewery Name: " + response.data[i].name);
                        if (response.data[i].nloc > 1) {
                            locationID = response.data[i].locations[Math.floor(Math.random() * response.data[i].nloc)];
                            console.log("Location ID: " + locationID);
                        }
                        else {
                            locationID = response.data[i].locations;
                            console.log("Location ID: " + locationID);
                        }
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
                    function getRestaurant(param1, param2) {
                        var opencity = param1;
                        var opencountry = param2;
                        console.log(opencity, "   ", opencountry);
                        var urlopentable = "https://opentable.herokuapp.com/api/restaurants";
                        var x, y, x1, x2, x3, x4, x5 =0;
                        xarray = [];
                    
                        hotelSummary = {
                            Price1: {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: []},
                            Price2: {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: []},
                            Price3: {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: []},
                            Price4: {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: []},
                            Price5: {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: []},
                        };
                        hotelFinal = {
                                otId:[],
                                otName:  [],
                                otCity: [],
                                otState: [],
                                otCountry: [],
                                otAddress: [],
                                otPhone: [],
                                otZip: [],
                                otImgURL: [],
                                otReserveURL: [],
                                otLat: [],
                                otLong: [],
                                otPrice: []};
                    
                        // Getting restaurants by city
                        $.ajax({
                            url: urlopentable, //API Call
                            dataType: "json",
                            type: "GET",
                            async: false,
                            data: {
                                city: opencity,
                                //zip: 32000,
                                //state: "CHH",
                                country: opencountry,
                                per_page: 50,
                                // appid: yelpkey,
                            },
                            success: function(opendata) {
                                console.log('Received Open Table: ', opendata);
                                if (opendata.total_entries > opendata.per_page){x = opendata.per_page}
                                else { x= opendata.total_entries};
                    
                                $.each(opendata.restaurants, function(index, val) {
                                    var sttr = "hotelSummary.Price" + val.price + ".otId.push(val.id)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otName.push(val.name.substr(0,24))";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otCity.push(val.city)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otState.push(val.state)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otCountry.push(val.country)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otAddress.push(val.address)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otPhone.push(val.phone.substr(0,(val.phone.length - 1)))";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otZip.push(val.postal_code)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otImgURL.push(val.image_url)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otReserveURL.push(val.reserve_url)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otLat.push(val.lat)";
                                    eval(sttr);
                                    var sttr = "hotelSummary.Price" + val.price + ".otLong.push(val.lng)";
                                    eval(sttr);
                                })          
                            }
                        });
                    
                        console.log(hotelSummary);
                        if(hotelSummary.Price5.otId.length > 6) {x5 = 6}
                        else {x5 = hotelSummary.Price5.otId.length}
                        if (x5 < 6) {
                            if (hotelSummary.Price4.otId.length > (6- x5)) {x4 = (6-x5)}
                            else {x4 = hotelSummary.Price4.otId.length}
                        }
                        else {x4 = 0}
                        if ((x5 + x4) < 6) {
                            if (hotelSummary.Price3.otId.length > (6 - (x5+x4))) {x3 = (6-(x4+x5))}
                            else { x3 = hotelSummary.Price3.otId.length}
                        }
                        else {x3 = 0}
                        if ((x5 + x4+ x3) < 6) {
                            if (hotelSummary.Price2.otId.length > (6 - (x5+x4+x3))) {x2 = (6-(x3+x4+x5))}
                            else {x2 = hotelSummary.Price2.otId.length}
                        }
                        else {x2 = 0}
                        if ((x5 + x4 + x3 + x2) < 6) {
                            if (hotelSummary.Price1.otId.length > (6 - (x5+x4+x3+x2))) {x1 = (6-(x2+x3+x4+x5))}
                            else {x1 = hotelSummary.Price1.otId.length;}
                        }
                        else {x1 = 0}
                    
                        //  Completing final object/array with only 5 restaurants
                        for (x=1; x<6; x++) {
                            var str = "x" + x;
                            for (y=0; y < eval(str); y++) {
                                var str2 = "hotelSummary.Price" + x + ".otName[" + y + "]";            
                                hotelFinal.otName.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otId[" + y + "]";            
                                hotelFinal.otId.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otCity[" + y + "]";            
                                hotelFinal.otCity.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otState[" + y + "]";            
                                hotelFinal.otState.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otCountry[" + y + "]";            
                                hotelFinal.otCountry.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otAddress[" + y + "]";            
                                hotelFinal.otAddress.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otPhone[" + y + "]";            
                                hotelFinal.otPhone.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otZip[" + y + "]";            
                                hotelFinal.otZip.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otImgURL[" + y + "]";            
                                hotelFinal.otImgURL.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otReserveURL[" + y + "]";            
                                hotelFinal.otReserveURL.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otLat[" + y + "]";            
                                hotelFinal.otLat.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otLong[" + y + "]";            
                                hotelFinal.otLong.push(eval(str2));
                                var str2 = "hotelSummary.Price" + x + ".otPrice[" + y + "]";            
                                hotelFinal.otPrice.push(eval(x));
                            }
                        }
                    
                        var row8 = $("<tr>").append(
                            $("<td>").text(hotelFinal.otName[0]),
                            $("<td>").text(hotelFinal.otName[1]),
                            $("<td>").text(hotelFinal.otName[2]),
                            $("<td>").text(hotelFinal.otName[3]),
                            $("<td>").text(hotelFinal.otName[4]),
                            $("<td>").text(hotelFinal.otName[5]),
                        );
                        var icon7 = "<img src=" + hotelFinal.otImgURL[0] + " height=150px width=150px/>";
                        var icon8 = "<img src=" + hotelFinal.otImgURL[1] + " height=150px width=150px/>";
                        var icon9 = "<img src=" + hotelFinal.otImgURL[2] + " height=150px width=150px/>";
                        var icon10 = "<img src=" + hotelFinal.otImgURL[3] + " height=150px width=150px/>";
                        var icon11 = "<img src=" + hotelFinal.otImgURL[4] + " height=150px width=150px/>";
                        var icon12 = "<img src=" + hotelFinal.otImgURL[5] + " height=150px width=150px/>";
                        
                        var row9 = $("<tr>").append(
                            $("<td>").append(icon7),
                            $("<td>").append(icon8),
                            $("<td>").append(icon9),
                            $("<td>").append(icon10),
                            $("<td>").append(icon11),
                            $("<td>").append(icon12),
                        );
                        var link1 = "<a href=" + hotelFinal.otReserveURL[0] + ">Link</a>";
                        var link2 = "<a href=" + hotelFinal.otReserveURL[1] + ">Link</a>";
                        var link3 = "<a href=" + hotelFinal.otReserveURL[2] + ">Link</a>";
                        var link4 = "<a href=" + hotelFinal.otReserveURL[3] + ">Link</a>";
                        var link5 = "<a href=" + hotelFinal.otReserveURL[4] + ">Link</a>";
                        var link6 = "<a href=" + hotelFinal.otReserveURL[5] + ">Link</a>";
                    
                        var row10 = $("<tr>").append(
                            $("<td>").append(link1),
                            $("<td>").append(link2),
                            $("<td>").append(link3),
                            $("<td>").append(link4),
                            $("<td>").append(link5),
                            $("<td>").append(link6),
                        );
                        var row11 = $("<tr>").append(
                            $("<td>").text("Phone: " + hotelFinal.otPhone[0]),
                            $("<td>").text("Phone: " + hotelFinal.otPhone[1]),
                            $("<td>").text("Phone: " + hotelFinal.otPhone[2]),
                            $("<td>").text("Phone: " + hotelFinal.otPhone[3]),
                            $("<td>").text("Phone: " + hotelFinal.otPhone[4]),
                            $("<td>").text("Phone: " + hotelFinal.otPhone[5]),
                        );
                        
                        $("#wrapper3").append(row8, row9, row10, row11);
                    
                        console.log("Final Array: ", hotelFinal);
                        // $("#rImg1").attr("src", hotelFinal.otImgURL[0]); 
                        // $("#rImg2").attr("src", hotelFinal.otImgURL[1]); 
                        // $("#rImg3").attr("src", hotelFinal.otImgURL[2]); 
                        // $("#rImg4").attr("src", hotelFinal.otImgURL[3]); 
                        // $("#rImg5").attr("src", hotelFinal.otImgURL[4]); 
                        // $("#rImg6").attr("src", hotelFinal.otImgURL[5]); 
                        // $('#rName1').text(hotelFinal.otName[0]);
                        // $('#rlink1').attr("href", hotelFinal.otReserveURL[0]);
                        // $('#rphone1').text("Phone: " + hotelFinal.otPhone[0]);
                        // $('#rName2').text(hotelFinal.otName[1]);
                        // $('#rlink2').attr("href", hotelFinal.otReserveURL[1]);
                        // $('#rphone2').text("Phone: " + hotelFinal.otPhone[1]);
                        // $('#rName3').text(hotelFinal.otName[2]);
                        // $('#rlink3').attr("href", hotelFinal.otReserveURL[2]);
                        // $('#rphone3').text("Phone: " + hotelFinal.otPhone[2]);
                        // $('#rName4').text(hotelFinal.otName[3]);
                        // $('#rlink4').attr("href", hotelFinal.otReserveURL[3]);
                        // $('#rphone4').text("Phone: " + hotelFinal.otPhone[3]);
                        // $('#rName5').text(hotelFinal.otName[4]);
                        // $('#rlink5').attr("href", hotelFinal.otReserveURL[4]);
                        // $('#rphone5').text("Phone: " + hotelFinal.otPhone[4]);
                        // $('#rName6').text(hotelFinal.otName[5]);
                        // console.log(hotelFinal.otReserveURL[5]);
                        // $('#rlink6').attr("href", hotelFinal.otReserveURL[5]);
                        // $('#rphone6').text("Phone: " + hotelFinal.otPhone[5]);
                    }
                    
                    var weatherkey = "3eaf6100e9b1bdb38f073d8f5016bcf2";
                    // var city = "El Paso";
                    var latitud = 30.267153;
                    var longitud = -97.743057;
                    var url5 = "https://api.openweathermap.org/data/2.5/forecast";
                    var urlHoy = "https://api.openweathermap.org/data/2.5/weather";
                    var hoy = moment(new Date()).format("MMM DD YYYY");
                    var hoyDayOfWeek = moment(hoy).format('dddd');
                    var hcity, hlatitud, hlongitud, htemp, hcountry, hhumidity, hdesc, hicon, hIconLocation = "";
                    
                    // Getting today's forecast
                    $.ajax({
                        url: urlHoy, //API Call
                        dataType: "json",
                        type: "GET",
                        async: false,
                        data: {
                            lat: latitud,
                            lon: longitud,
                            appid: weatherkey,
                            units: "metric"
                        },
                        success: function(datahoy) {
                            console.log('Received dataHoy:', datahoy)
                            hcity = datahoy.name;
                            hlatitud = datahoy.coord.lat;
                            hlongitud = datahoy.coord.lon;
                            hcountry = datahoy.sys.country;
                            htemp = Math.round(datahoy.main.temp) + "°C";
                            hhumidity = datahoy.main.humidity + "%";
                            hdesc = datahoy.weather[0].description;
                            hicon = datahoy.weather[0].icon;
                            hIconLocation = "https://openweathermap.org/img/w/" + hicon + ".png";            
                        }
                    });
                    
                    tSummary = {
                        header:[hoy,hoyDayOfWeek,hcity,hlatitud,hlongitud,hcountry,htemp,hhumidity,hdesc,hIconLocation],
                        day:  [],
                        maxi: [],
                        mini: [],
                        iconos: []};
                    
                    var row1 = $("<tr>").append(
                        $("<td>").text(tSummary.header[2] + ", " + tSummary.header[5])
                    );
                    var row2 = $("<tr>").append(
                        $("<td>").text(tSummary.header[1]),
                        $("<td>").text(tSummary.header[0])
                    );
                    var icon1 = "<img src=" + hIconLocation + " />";
                    var row3 = $("<tr>").append(
                        $("<td>").text(tSummary.header[6]),
                    );
                    $("#wrapper").append(row1, row2, icon1, row3);
                      
                    // $('#t0DayOfWeek').text(tSummary.header[1]);
                    // $('#t0Date').text(tSummary.header[0]);
                    // $('#tCity').text(tSummary.header[2] + ", " + tSummary.header[5]);
                    // $('#t0temp').text(tSummary.header[6]);
                    // $("#t0Icon").attr('src', hIconLocation); 
                    
                    
                    // Getting info from 5 days in the future forecast
                    $.ajax({
                        url: url5, //API Call
                        dataType: "json",
                        type: "GET",
                        async: false,
                        data: {
                            lat: latitud,
                            lon: longitud,
                            appid: weatherkey,
                            units: "metric",
                            cnt: "40"
                        },
                        success: function(data5) {
                            console.log('Received dataForecast:', data5)
                            $.each(data5.list, function(index, val) {
                                var hora = val.dt_txt.substr(val.dt_txt.length -8);
                            if (hora === "03:00:00"){
                                var fday = val.dt_txt.substr(8,2);
                                var fmonth = val.dt_txt.substr(5,2);
                                var fyear = val.dt_txt.substr(0,4);
                                var ffecha = fmonth + "/" + fday + "/" + fyear;
                                var fformat = "MM/DD/YYYY";
                                var fconverted = moment(ffecha, fformat);
                                var fDayOfWeek = moment(fconverted).format('dddd').substr(0,3) + " " + fday;
                                var t1 = Math.round(val.main.temp_min) + "°C";
                                var fhumidity = val.main.humidity + "%";
                                var fdesc = val.weather[0].description;
                                var ficon = val.weather[0].icon;
                                var fIconLocation = "https://openweathermap.org/img/w/" + ficon + ".png";
                                tSummary.day.push(fDayOfWeek);
                                tSummary.iconos.push(fIconLocation);
                            }
                            if (hora === "15:00:00"){
                                var t2 = Math.round(val.main.temp_max) + "°C";
                                if (t1<t2){
                                    tSummary.maxi.push(t2);
                                    tSummary.mini.push(t1);
                                }
                                else {
                                    tSummary.maxi.push(t1);
                                    tSummary.mini.push(t2);
                                }
                            }
                            });
                        }
                        
                    })
                    
                    var row4 = $("<tr>").append(
                        $("<td>").text("Date"),
                        $("<td>").text(tSummary.day[0]),
                        $("<td>").text(tSummary.day[1]),
                        $("<td>").text(tSummary.day[2]),
                        $("<td>").text(tSummary.day[3]),
                        $("<td>").text(tSummary.day[4]),
                    );
                    var icon2 = "<img src=" + tSummary.iconos[0] + " />";
                    var icon3 = "<img src=" + tSummary.iconos[1] + " />";
                    var icon4 = "<img src=" + tSummary.iconos[2] + " />";
                    var icon5 = "<img src=" + tSummary.iconos[3] + " />";
                    var icon6 = "<img src=" + tSummary.iconos[4] + " />";
                    
                    var row5 = $("<tr>").append(
                        $("<td>").text("FC"),
                        $("<td>").append(icon2),
                        $("<td>").append(icon3),
                        $("<td>").append(icon4),
                        $("<td>").append(icon5),
                        $("<td>").append(icon6),
                    );
                    var row6 = $("<tr>").append(
                        $("<td>").text("Max"),
                        $("<td>").text(tSummary.maxi[0]),
                        $("<td>").text(tSummary.maxi[1]),
                        $("<td>").text(tSummary.maxi[2]),
                        $("<td>").text(tSummary.maxi[3]),
                        $("<td>").text(tSummary.maxi[4]),
                    );
                    var row7 = $("<tr>").append(
                        $("<td>").text("Min"),
                        $("<td>").text(tSummary.mini[0]),
                        $("<td>").text(tSummary.mini[1]),
                        $("<td>").text(tSummary.mini[2]),
                        $("<td>").text(tSummary.mini[3]),
                        $("<td>").text(tSummary.mini[4]),
                    );
                    
                    $("#wrapper2").append(row4, row5, row7, row6);
                    
                    
                    // Printing info from 5 days in the future forecast
                    // $('#t1DayOfWeek').text(tSummary.day[0]);
                    // $("#t1Icon").attr("src", tSummary.iconos[0]); 
                    // $('#t1maxtemp').text(tSummary.maxi[0]);
                    // $('#t1mintemp').text(tSummary.mini[0]);
                    
                    // $('#t2DayOfWeek').text(tSummary.day[1]);
                    // $("#t2Icon").attr("src", tSummary.iconos[1]);
                    // $('#t2maxtemp').text(tSummary.maxi[1]);
                    // $('#t2mintemp').text(tSummary.mini[1]);
                    
                    // $('#t3DayOfWeek').text(tSummary.day[2]);
                    // $("#t3Icon").attr("src", tSummary.iconos[2]);
                    // $('#t3maxtemp').text(tSummary.maxi[2]);
                    // $('#t3mintemp').text(tSummary.mini[2]);
                    
                    // $('#t4DayOfWeek').text(tSummary.day[3]);
                    // $("#t4Icon").attr("src", tSummary.iconos[3]);
                    // $('#t4maxtemp').text(tSummary.maxi[3]);
                    // $('#t4mintemp').text(tSummary.mini[3]);
                    
                    // $('#t5DayOfWeek').text(tSummary.day[4]);
                    // $("#t5Icon").attr("src", tSummary.iconos[4]);
                    // $('#t5maxtemp').text(tSummary.maxi[4]);
                    // $('#t5mintemp').text(tSummary.mini[4]);
                    
                    console.log(tSummary);
                    getRestaurant(tSummary.header[2], tSummary.header[5]);
            })
        })

        // clear the aray
        allLocationIDs = [];
    })
});

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

    

}