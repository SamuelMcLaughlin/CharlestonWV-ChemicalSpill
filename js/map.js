
//	Constants
var SPREADSHEET_URL = "https://spreadsheets.google.com/pub?key=0AreUm0TGZqmEdEM1dk5rXzRnY0poNXRKS1FWdzNqb1E&hl=en&output=html";
var SPREADSHEET_KEY = "0AreUm0TGZqmEdEM1dk5rXzRnY0poNXRKS1FWdzNqb1E";

//	Spreadsheet API
document.addEventListener('DOMContentLoaded', function() {
	var gData;
	var URL = SPREADSHEET_KEY;
	Tabletop.init( { key: URL, callback: showInfo, simpleSheet: true } );
});
function showInfo(data) {
	var map = L.mapbox.map('map', 'sghodas.gpmob8od')
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

//Collapse


$("#exp1").click(function(){
	$("#content1").toggle('fast');
	$('#register-box').toggleClass('narrow-register');
	$('#exp1').toggleClass('closed');

});

$("#exp2").click(function(){
	$("#content2").toggle('fast');
	$('#filter-box').toggleClass('narrow-filter');
	$('#exp2').toggleClass('closed');

});

function close(){
  	$("#content1").toggle(false);
	$('#register-box').addClass('narrow-register');
	$('#exp1').addClass('closed');

	$("#content2").toggle(false);
	$('#filter-box').addClass('narrow-filter');
	$('#exp2').addClass('closed');  
}

$(document).ready(function(){
	if($(window).width() < 590)
		close();
})

//Collapse Register on page width change
$( window ).resize(function() {
	if($(window).width() < 590)
		close();
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