'use strict';

$( document ).ready(function() {
  $(".button-collapse").sideNav();

  var pollItems = $('#poll_items').children().children();
  var optionsArray = [];

  $.each(pollItems, function() {
    optionsArray.push($(this).children().val());
  });


  $.getJSON('http://api.bing.net/json.aspx?Appid=Ou2BjEPSIlmePepgIZPQ4sSBTRZTJhmDUrJDcHxsYv0=&query=sushi&sources=web&web.count=1')
    .done(function(response) {
      console.log(response);
    })
    .fail(function(response) {
      console.log('error');
      console.log(response);
    });


});
