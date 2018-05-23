window.setTimeout(function(){
	
	for(var i=0; i<cities.length; i++) {
		$('.sidenav__city-list').append('<li class="sidenav__city-list__item" data-lat="'+cities[i].location.lat+'" data-lng="'+cities[i].location.lng+'">'+cities[i].name+'</li>');
	}
	$('.sidenav__city-list__item').on('click', function(event) {
		$('.sidenav__city-list__item').removeClass('sidenav__city-list__item--selected');
	var currentCity = $(event.currentTarget);
	var lat = currentCity.data("lat");
	var lng = currentCity.data("lng");
	currentCity.addClass('sidenav__city-list__item--selected');
	console.log(lat +" " + lng);
	debugger;
	map.setCenter({lat:lat, lng:lng});
	smoothZoom(map, 15, map.getZoom());
	
});

},1000);

