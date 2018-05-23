$(document).on('scroll', function(){
	if($(this).scrollTop()> 100) {
		$('.header').css({position: 'fixed', opacity: 1});
		
	} else {
		$('.header').css({position: 'relative', opacity: 1});
		
	}

});