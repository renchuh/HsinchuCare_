(function ($) {
"use strict"; // Start of use strict

// Preloader Start
  $(window).load(function () {
    $('.loader').fadeOut();
    $('#preloader')
        .delay(350)
        .slideUp('slow');
    $('body')
        .delay(350)
  });
// Preloader End

// Dropdown Menu Script Start

$('#mainNav ul.navbar-nav li.dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});
// Dropdown Menu Script End

$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  if (scroll >= 62) {
    $("#mainNav").addClass("new-menu");
  } else {
    $("#mainNav").removeClass("new-menu");
  }

});

// mobile Menu area
$('nav.mobile_menu').meanmenu({
  meanScreenWidth: '991'
});
$('nav.mean-nav li > a:first-child').on('click', function () {
  $('a.meanmenu-reveal').click();
});

// Header Video Style--------------------------

// Jquery counterUp
$('.counter').counterUp({
  time: 3000
});

//Our Classes Slider
var all_classes_slide = $('.all-classes-slider');
all_classes_slide.owlCarousel({
  loop:true,
  margin:15,
  autoplay:true,
  nav:false,
  dots:true,
  smartSpeed: 3000,
  autoplayHoverPause: !0,
  responsive:{
    0:{
      items:1
    },
    600:{
      items:2
    },
    992:{
      items:3
    }
  }
});
$('.all_classes_slide_nav .testi_next').on('click', function() {
  all_classes_slide.trigger('next.owl.carousel');
});

$('.all_classes_slide_nav .testi_prev').on('click', function() {
  all_classes_slide.trigger('prev.owl.carousel');
});
//Our Classes Slider

//Comment From Trainee Slider
var trainee_slide = $('.comment-from-trainee-slider');
  trainee_slide.owlCarousel({
  loop:true,
  margin:15,
  autoplay:true,
  nav:false,
  dots:true,
  smartSpeed: 3000,
  autoplayHoverPause: !0,
  responsive:{
    0:{
      items:1
    },
    600:{
      items:1
    },
    992:{
      items:1
    }
  }
});
//Comment From Trainee Slider

// Veno Box
$('.venobox').venobox();

//--------- Initialize WOW JS
new WOW().init();

// --------Scroll To Top---------

  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('#scroll').fadeIn();
    } else {
      $('#scroll').fadeOut();
    }
  });
  $('#scroll').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });

// --------Scroll To Top---------

// --------Paroller JS---------
  if($('.paroller').length){
    $('.paroller').paroller({
      factor: 0.05,            // multiplier for scrolling speed and offset, +- values for direction control
      factorLg: 0.05,          // multiplier for scrolling speed and offset if window width is less than 1200px, +- values for direction control
      type: 'foreground',     // background, foreground
      direction: 'horizontal' // vertical, horizontal
    });
  }

// --------Paroller JS---------

  // ----------------- AOS Animation
  if ($("[data-aos]").length) {
    AOS.init({
      duration: 1000,
      mirror: true,
    });
  }

// ------------ Parallax Js -------------//

  var $layer_2 = $(".layer-2"),
      $container = $("body"),
      container_w = $container.width(),
      container_h = $container.height();

  $(window).on("mousemove.parallax", function(event) {
    var pos_x = event.pageX,
        pos_y = event.pageY,
        left = 0,
        top = 0;

    left = container_w / 2 - pos_x;
    top = container_h / 2 - pos_y;


    TweenMax.to($layer_2, 1, {
      css: {
        transform:
            "translateX(" + left / 24 + "px) translateY(" + top / 12 + "px)"
      },
      ease: Expo.easeOut,
      overwrite: "all"
    });

  });

})(jQuery); // End of use strict