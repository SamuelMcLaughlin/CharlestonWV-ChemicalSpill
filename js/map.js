
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
	var map = L.mapbox.map('map', 'sghodas.gpm3h8la')
		.setView([38.3486917, -81.632324], 11);

	for (var i = 0; i < data.length; i++) {
		var coord = [data[i].lat, data[i].long];
		var title = data[i].name;
		var desc = data[i].address;
		var active = (data[i].active === "Yes") ? true : false;
		addDistributionCenter(map, coord, title, desc, active);
	}
}

//	Add markers
function addDistributionCenter(map, coord, title, description, active) {
	var color, symbol;
	if (active) {
		color = '#a3e46b';
		symbol = 'water';
	} else {
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
			description: description,
			'marker-size': 'medium',
	    	'marker-color': color,
	    	'marker-symbol': symbol
		}
	}).addTo(map);
}