//	Spreadsheet API
document.addEventListener('DOMContentLoaded', function() {
	var gData;
	var URL = SPREADSHEET_KEY;
	Tabletop.init( { key: URL, callback: showInfo, simpleSheet: true } );
});
function showInfo(data) {
	var map = L.mapbox.map('map', MAPBOX_MAP_ID)
		.setView([38.3486917, -81.632324], 11);

	for (var i = 0; i < data.length; i++) {
		var coord = [data[i].lat, data[i].long];
		var title = data[i].name;
		var desc = data[i].address;
		var active = data[i].active;
		var type = data[i].type;
		addDistributionCenter(map, coord, title, desc, active, type);
	}
}

//	Add markers
function addDistributionCenter(map, coord, title, address, active, type) {
	var color, symbol;
	if (type === "Handout") {
		symbol = 'water';
	} else {
		symbol = 'bank';
	}
	if (active === "Yes") {
		color = '#a3e46b';
	} else if (active === "Unknown") {
		color = '#f1f075';
	} else if (active === "No") {
		color = '#f86767';
		symbol = 'cross';
	}
	L.mapbox.markerLayer({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [coord[1], coord[0]]
		},
		properties: {
			title: title,
			description: "Has water: " + active + "<br />" + "Handout or purchase: " + type + "<br />" + "<a href='https://www.google.com/maps/preview#!q="+address+"' target=_blank>"+ address+"</a>",
			'marker-size': 'medium',
	    	'marker-color': color,
	    	'marker-symbol': symbol
		}
	}).addTo(map);
}

//Phone input masking

jQuery(function($){
   $("#phone").mask("(999) 999-9999");
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
