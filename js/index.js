'use strict';

$( document ).ready(function() {
  $(".button-collapse").sideNav();

  var pollItems = $('#poll_items').children().children();
  var optionsArray = [];

  $.each(pollItems, function() {
    optionsArray.push($(this).children().val());
  });


  // $.getJSON('https://g-strawpoll.herokuapp.com/api/v2/polls/1')
  //   .done(function(response) {
  //     console.log(response);
  //   })
  //   .fail(function(response) {
  //     console.log('error');
  //     console.log(response);
  //   });

  console.log(JSON.stringify({
    title: 'chanse test',
    options: optionsArray,
    multi: false
  }));
// {
//    "title": "This is a test poll.",
//    "options": [
//        "Option #1",
//        "Option #2"
//    ],
//    "multi": true
// })

  $.post('https://g-strawpoll.herokuapp.com/api/v2/polls', JSON.stringify({
    title: 'chanse test poll',
    options: optionsArray,
    multi: false
  }))
    .done(function(response) {
      console.log(response);
    })
    .fail(function(response) {
      console.log('error');
      console.log(response);
    });
});
