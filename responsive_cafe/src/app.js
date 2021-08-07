var $ = require("jquery");

$(function () {
  $('.spMenu__inner').on('click', function () {
    $(this).toggleClass('active');
    $('.spMenu').toggleClass('active');
    $('.header__menu').toggleClass('active');
  });

  if (window.matchMedia("(max-width: 414px)")) {
    $('.headerMenu__item').on('click', function () {
      $('.spMenu__inner').removeClass('active');
      $('.spMenu').removeClass('active');
      $('.header__menu').removeClass('active');
    });
  }

  $(window).on('load scroll', function () {
    $('.animation').each(function () {
      let target = $(this).offset().top;
      let scroll = $(window).scrollTop();
      let height = $(window).height();
      if (scroll > target - height) {
        $(this).addClass('active');
      }
    });
  });
});