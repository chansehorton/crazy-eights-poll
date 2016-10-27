'use strict';

$( document ).ready(function() {
  $(".button-collapse").sideNav();

  var pollItems = $('#poll_items').children().children();
  var optionsArray = [];

  $.each(pollItems, function() {
    optionsArray.push($(this).children().val());
  });

  $.post('https://strawpoll.me/api/v2/polls', {
    title: 'chanse test poll',
    options: optionsArray,
    multi: false
  })
    .done(function(response) {
      console.log(response);
    })
    .fail(function(response) {
      console.log('error');
      console.log(response);
    });
});
