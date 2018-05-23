
var map;
function initMap(){
	//map options
	var options = {
		 zoom: 7,
		 center: {lat:30.0668, lng:79.0193}
	}
	var container= $('.map')[0];

	//new maps
	map = new google.maps.Map(container, options);
}

//ADD-MARKER-Function
	
function addMarker(props, map) {
		var marker = new google.maps.Marker({
			position: props.location,
			map: map
		});
		
		if(props.icon) {
			marker.setIcon(props.icon);
		}
    
		if(props.name){
			
			var cont = '<img src="'+props.imageUrl+'" width="200"/><h3>'+props.name+'</h3>';
			var infoWindow = new google.maps.InfoWindow({
				content: cont
			});
			marker.addListener('click', function(){
                map.setCenter(marker.getPosition());
                smoothZoom(map, 15, map.getZoom());
				//infoWindow.open(map, marker); 
			});
			marker.addListener('mouseover', function(){
				infoWindow.open(map, marker); 
			});
			marker.addListener('mouseout', function(){
				infoWindow.close(map, marker); 
			});
		}
	}

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 200); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  

var plotMap = function(cities, map){
	
	if(cities){
		for(var i=0; i<cities.length; i++){
			addMarker(cities[i], map);
		}
	}
};




var cities;
$(function(map){
	$.ajax({
    	'type':'GET',
        'async': true,
        'url': '/data/cities.json',
        'dataType': 'json',
         success: function(data){
        	console.log("succsess");
        	console.log(data);
        },
    }).done(function(result){
    		console.log("done");
    		console.log(map)
    			if(result){
    				cities = result;
    				plotMap(cities, map);
    			} 	
    });
});

setTimeout(function(){plotMap(cities,map)}, 1000);










