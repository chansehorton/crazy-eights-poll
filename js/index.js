'use strict';

//'inputArray' is array of jQuery objects
function filterFirstRound (inputArray) {
  $.each(inputArray, function() {
    var searchTerm = ($(this).children().val());
    var urlSearchString = 'http://g-bing.herokuapp.com/bing/v5.0/search?q=' + searchTerm;

    $.ajax({
      url: urlSearchString,
      headers: {
          'Ocp-Apim-Subscription-Key': '7e03310d1c484161a53c9b85033536d3'
      },
      method: 'GET',
      dataType: 'json',
      data: {
        count: '1',
        mkt: 'en-us'
      },
      success: function(response){
        console.log('Success: ');
        console.log(response);
      },
      error: function(response) {
        console.log('ERROR: ');
        console.log(response);
        alert('There was a problem with the search request.' + searchTerm);
      }
    });
  });
};

$( document ).ready(function() {

  $.get("http://localhost:8080/round_1_layout.html", function(data){
    console.log(data);
    $(data).prependTo('#poll_items');
  });

  var pollItems = $('#poll_items').children().children();

  $('#submit_button').click(function(e) {
    e.preventDefault();
    filterFirstRound(pollItems);
  });
});



  // Text analysis ajax call:

  // var urlTAString = '';
  // var urlTAString = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases';

  // $.ajax({
  //   url: urlTAString,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Ocp-Apim-Subscription-Key': '358f38392fde4104ac79ff4b235a3c9d'
  //   },
  //   method: 'POST',
  //   dataType: 'json',
  //   data: JSON.stringify({
  //     'documents':[
  //       {
  //         'id': '1',
  //         'language': 'en',
  //         'text': ''
  //       }
  //     ]
  //   }),
  //   success: function(data){
  //     console.log('success: ');
  //     console.log(data);
  //   },
  //   error: function(data) {
  //     console.log('error: ');
  //     console.log(this);
  //     console.log(data);
  //   }
  // });
