$(document).ready(function() {
  $(window).scroll(function() {
    const scroll = $(window).scrollTop();
    if (scroll >= 50) {
      $('#header').addClass('fixed');
      // $("#imglogo").attr('src', 'images/logo-w.png');
    } else {
      $('#header').removeClass('fixed');
      // $("#imglogo").attr('src', 'images/logo.png');
    }
    const scrollPos = $(document).scrollTop();
    $('a.page-scroll').each(function () {
      const currLink = $(this);
      const refElement = $(currLink.attr('href'));
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.main-menu ul li').removeClass('active');
        currLink.parent('li').addClass('active');
      } else {
        currLink.parent('li').removeClass('active');
      }
    });
  });

  $(function() {
    $(document).on('click', 'a.page-scroll', function(event) {
      $('a.page-scroll').parent('li').removeClass('active');
      $(this).parent('li').addClass('active');
      const $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - $('#header').height()
      }, 1000, 'easeInOutExpo');
      event.preventDefault();
    });
  });
});