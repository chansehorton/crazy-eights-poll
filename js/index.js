'use strict';

//'inputArray' is array of jQuery objects
function filterFirstRound (inputJQOArray) {
  var outputObjArray =[];
  $.each(inputJQOArray, function() {
    var searchReturn = {};
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
        searchReturn.term = searchTerm;
        searchReturn.hits = response.webPages.totalEstimatedMatches;
        outputObjArray.push(searchReturn);
      },
      error: function(response) {
        console.log('ERROR: ' + searchTerm);
      }
    });
  });
  return outputObjArray;
};


function compare(a,b) {
  if (a.hits > b.hits)
    {return -1;}
  if (a.hits < b.hits)
    {return 1;}
  return 0;
};

function refactorDisplay(array) {
  $('#poll_items').children().children().not('.button').remove();

  if (array.length>4) {
    $('#poll_items').first().prepend('<div class="row top-row"></div><div class="row bottom-row"></div>');

    for (var i=0;i<array.length;i++) {
      if (i<2) {
        $('.top-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[i].term + '</textarea></div>');
      } else {
        $('.bottom-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[i].term + '</textarea></div>');
      };
    };
  } else {
    $('#poll_items').first().prepend('<div class="row top-row">');
  };
}


$(document).ready(function() {

  var testArray1 = [
    {term: 'crazy eights',
     hits: 1},
    {term: 'forward unto the breach',
     hits: 2},
    {term: 'carousel',
     hits: 3},
    {term: 'blue sock removal',
     hits: 4},
    {term: 'subjugated shoehorn',
     hits: 5},
    {term: 'yellow submarine',
     hits: 6},
    {term: 'carpet cleaning',
     hits: 7},
    {term: 'fallujah supply management',
     hits: 8}
  ];

  $('#submit_button').click(function(e) {
    e.preventDefault();
    var pollItemsJQOBatch2 = $('#poll_items').children().children().not('.button');
    var pollItemsJQOBatch1 = pollItemsJQOBatch2.splice(0,4);

    // link to ajax search query function here

    var testArray2 = [];

    testArray1.sort(compare);
    var outArray = testArray1.splice(0,4);


    refactorDisplay(outArray);
    // var pollItems = $('#poll_items').children().children().not('.button');
    // var pollItemsJQOBatch1 = pollItems.slice(0,1);
    // var pollItemsJQOBatch2 = pollItems.slice(1,2);


    function getExample() {
      var filteredResults1 = new Promise(function(resolve) {
        return resolve(filterFirstRound(pollItemsJQOBatch1));
      });
      // var filteredResults2 = filteredResults1.then(function(data) {
      //   return new Promise(function(resolve) {
      //     resolve(filterFirstRound(pollItemsJQOBatch2));
      //   });
      //
      //     // setTimeout(function(){
      //     //   console.log("in set timeout");
      //     // }, 1000);
      //     // console.log("1st one",data);
      //   });
      // });

      filteredResults2.then(function(data){
        console.log(data);
      });


    };


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
