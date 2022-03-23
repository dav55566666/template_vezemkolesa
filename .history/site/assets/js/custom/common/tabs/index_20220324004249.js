function getActiveIndex(ec) {
  return $(ec).closest('.tab__nav__item').index();
}

function activateNavItem(eventCaller) {
  const activeIndex = getActiveIndex(eventCaller);

  $(eventCaller)
    .closest('.tab__container')
    .find('.tab__nav__item__trigger')
    .removeClass('tab__nav__item__trigger-active');

  $(eventCaller)
    .closest('.tab__container')
    .find('.tab__nav__item')
    .eq(activeIndex)
    .find('.tab__nav__item__trigger')
    .addClass('tab__nav__item__trigger-active');
}

function activateTabContent(eventCaller) {

  const activeIndex = getActiveIndex(eventCaller);

  $(eventCaller)
    .closest('.tab__container')
    .find('.tab__content__item')
    .removeClass('tab__content__item-active');

  $(eventCaller)
    .closest('.tab__container')
    .find('.tab__content__item')
    .eq(activeIndex)
    .addClass('tab__content__item-active');
}

$(function() {
  $('.tab__nav__item__trigger').on('click', function(e) {
    e.preventDefault();
    activateNavItem(this);
    activateTabContent(this);
  });

  document
    .querySelectorAll('.tab__nav__item__trigger-active')
    .forEach(item => {
      activateTabContent(item);
    });
});
$(".opencreditpopap").click(function(event){
  $(".credit_popap").css("display", "flex")
  event.stopPropagation()
  $("body").click(function(){
    $(".credit_popap").css("display", "none")
  })  
})
