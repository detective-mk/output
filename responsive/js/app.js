$(function () {
  $('.js_headerNav_trigger').on('click', function () {
    $(this).toggleClass('is_active');
    $('.js_headerNav_target').toggleClass('is_active');
  });

  $('.bl_headerNav_item').on('click', function () {
    $('.js_headerNav_target').removeClass('is_active');
    $('.js_headerNav_trigger').removeClass('is_active');
  });
});