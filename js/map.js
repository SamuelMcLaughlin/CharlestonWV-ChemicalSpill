//	Spreadsheet API
document.addEventListener('DOMContentLoaded', function() {
	var gData;
	var URL = SPREADSHEET_KEY;
	Tabletop.init( { key: URL, callback: showInfo, simpleSheet: true } );
});

var map;

function showInfo(data) {

	map = L.mapbox.map('map', "sghodas.gpmob8od");

	// Once we've got a position, zoom and center the map
	// on it, and add a single marker.
	map.on('locationfound', function(e) {
	    map.fitBounds(e.bounds);
	    map.setZoom(12)
	    map.markerLayer.setGeoJSON({
	        type: "Feature",
	        geometry: {
	            type: "Point",
	            coordinates: [e.latlng.lng, e.latlng.lat]
	        },
	        properties: {
	            title: "Current Location",
	            'marker-color': '#000',
	            'marker-symbol': 'star'
	        }
	    });
	});

    if (navigator.geolocation){
        map.locate();
    } else {
        map.setView([38.3486917, -81.632324], 11);
    }

	for (var i = 0; i < data.length; i++) {
		var coord = [data[i].lat, data[i].long];
		var title = data[i].name;
		var desc = data[i].address;
		var active = data[i].active;
		var type = data[i].type;
        var notes = data[i].notes;
		addDistributionCenter(map, coord, title, desc, active, type, notes);
	}
}



//	Add markers
function addDistributionCenter(map, coord, title, address, active, type, notes) {
	var symbol = 'water'
	var color = "#0066FF"
	
	if (type == "Laundromat") {
		symbol = "clothing-store"
		color = "#00CC00"
	} else if (type == "Shower") {
		symbol = "swimming"
		color = "#FFFF00"
	} else if (type == "Restaurant") {
		symbol = "restaurant"
		color = "#f4a460"
	}
	
	L.mapbox.markerLayer({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [coord[1], coord[0]]
		},
		properties: {
			title: title,
			'marker-size': 'medium',
	    	'marker-color': color,
	    	'marker-symbol': symbol,
            description: "Type: " + type + "<br />" +
                "Address: <a href='https://www.google.com/maps/preview#!q="+address+"' target=_blank>"+ address+"</a>" + "<br />" +
                "Info: " + notes
		}
	}).addTo(map);
}

//Phone input masking

jQuery(function($){
   $("#phone").mask("(999) 999-9999");
});

//Collapse
$("#exp1").click(function(){
	$("#content1").toggle('fast');
	$('#exp1').toggleClass('closed');
});

$("#exp2").click(function(){
	$("#content2").toggle('fast');
	$('#exp2').toggleClass('closed');
});


$("#register").click(function(){
	function showResult(text){
		$('#result').addClass('result');
		$('#result').text(text);
	}

	var phone = $("#phone").val().replace(/[^0-9]/gi,'');
	if (phone.length != 10){
		showResult('Please enter a 10 digit phone number.');
	}
	else{
		$('#register').prop('disabled', true);
		$.ajax({
                	url: 'http://wv-find-water-sms.herokuapp.com/phones?number='+phone,
                    dataType: 'jsonp',                    
                    success: function(data){
                    	$('#register').prop('disabled', false);
                    	result = $.parseJSON(data)
                    	showResult(result['message']);
               }
        });	
	}	
})
