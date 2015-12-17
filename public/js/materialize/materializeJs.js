

$(document).ready( function () {

	$(".button-collapse").sideNav();
	
	smoothScroll.init({
		speed: 1000, // Integer. How fast to complete the scroll in milliseconds
   		easing: 'easeInOutCubic', // Easing pattern to use
	});

	$('.slider').slider({full_width: true});

	$('.modal-trigger').leanModal();

	$('select').material_select();
	 $('.parallax').parallax();
})