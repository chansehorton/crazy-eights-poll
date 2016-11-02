'use strict';

// if (indexCheckArray.length === 0) {
//   var filteredArray = filterAnswers(outputObjArray);
//   refactorDisplay(filteredArray);
// };
$.fn.shift = function () {
  var x = this.eq(0);
  this.splice(0,1);
  return x;
};

//'inputJQOArray' is array of jQuery objects
function filterFirstRound(inputJQOArray, outputObjArray) {
  // set delay to ensure we never trip the APIs '5 per second' limit
  var my_delay = 200;
  //as long as array has elements, keep making API calls
  if (inputJQOArray.length > 0) {
    var searchReturn = {};
    // get the next object and create the url
    var searchTerm = inputJQOArray.first().children().val();
    var urlSearchString = 'http://g-bing.herokuapp.com/bing/v5.0/search?q=' + searchTerm;
    // remove the current object from the array
    inputJQOArray.shift();
    //make the ajax call
    $.ajax({
      url: urlSearchString,
      method: 'GET',
      data: {
        count: '1',
        mkt: 'en-us'
      },
      dataType: 'json',
      headers: {
        'Ocp-Apim-Subscription-Key': '7e03310d1c484161a53c9b85033536d3'
      },
      success: function(data) {
        //create object and add to output array
        searchReturn.term = searchTerm;
        searchReturn.hits = data.webPages.totalEstimatedMatches;
        outputObjArray.push(searchReturn);
        //delay before calling API again
        setTimeout(filterFirstRound, my_delay, inputJQOArray, outputObjArray);
      },
      error: function(data) {
        console.log('ERROR: ' + searchTerm);
      }
    });
  } else {
    //now that all calls have been made, filter the results and refactor the display
    var filteredArray = filterAnswers(outputObjArray);
    refactorDisplay(filteredArray);
  }
}

//orders array from highest to lowest number of hits
function compare(a,b) {
  if (a.hits > b.hits)
    {return -1;}
  if (a.hits < b.hits)
    {return 1;}
  return 0;
};

//returns array with top half of answers
function filterAnswers(answerArray) {
  var outputArray = [];
  if (answerArray.length>4) {
    answerArray.sort(compare);
    outputArray = answerArray.slice(0,4);
  } else {
    //NOTE: do a sort for 2 -- below we are arbitrarily removing 2 for testing.
    outputArray = answerArray.slice(0,2);
  };
  return outputArray;
};

//refactors the display for 2 or 4 answers
function refactorDisplay(array) {
  console.dir(array);
  $('#poll_items').children().children().not('.button').remove();

  if (array.length>2) {
    $('#poll_items').children().removeClass('l6 offset-l3').addClass('l10 offset-l1');
    $('#poll_items').children().first().prepend('<div class="row top-row"></div><div class="row bottom-row"></div>');

    for (var i=0;i<array.length;i++) {
      if (i<2) {
        $('.top-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[i].term + '</textarea></div>');
      } else {
        $('.bottom-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[i].term + '</textarea></div>');
      };
    };
  } else {
    $('#poll_items').children().first().prepend('<div class="row top-row">');

    for (var j=0;j<array.length;j++) {
      if (j<1) {
        $('.top-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[j].term + '</textarea></div>');
      } else {
        $('.top-row').append('<div class="col l5 m5 s10 push-l1 push-m1 push-s1"><textarea class="poll-item-med" cols="30" rows="10" maxlength="300">' +  array[j].term + '</textarea></div>');
      };
    };
  };
}


$(document).ready(function() {

  // var testArray = [
  //   {term: 'crazy eights',
  //    hits: 1},
  //   {term: 'forward unto the breach',
  //    hits: 2},
  //   {term: 'carousel',
  //    hits: 3},
  //   {term: 'blue sock removal',
  //    hits: 4},
  //   {term: 'subjugated shoehorn',
  //    hits: 5},
  //   {term: 'yellow submarine',
  //    hits: 6},
  //   {term: 'carpet cleaning',
  //    hits: 7},
  //   {term: 'fallujah supply management',
  //    hits: 8}
  // ];

  // var testArray = [
  //   {text: "In the beginning it was too far away for Shadow to focus on. Then it became a distant beam of hope, and he learned how to tell himself 'this too shall pass' when the prison shit went down, as prison shit always did. One day the magic door would open and he'd walk through it. So he marked off the days on his Songbirds of North America calendar, which was the only calendar they sold in the prison commissary, and the sun went down and he didn't see it and the sun came up and he didn't see it. He practiced coin tricks from a book he found in the wasteland of the prison library; and he worked out; and he made lists in his head of what he'd do when he got out of prison."},
  //   {text: "Through the gap in the wall can be seen a large green meadow; beyond the meadow, a stream; and beyond the stream there are trees. From time to time shapes and figures can be seen, amongst the trees, in the distance. Huge shapes and odd shapes and small, glimmering things which flash and glitter and are gone. Although it is perfectly good meadowland, none of the villagers has ever grazed animals on the meadow on the other side of the wall. Nor have they used it for growing crops."},
  //   {text: "It was a city in which the very old and the awkwardly new jostled each other, not uncomfortably, but without respect; a city of shops and offices and restaurants and homes, of parks and churches, of ignored monuments and remarkably unpalatial palaces; a city of hundreds of districts with strange names -- Crouch End, Chalk Farm, Earl's Court, Marble Arch -- and oddly distinct identities; a noisy, dirty, cheerful, troubled city, which fed on tourists, needed them as it despised them, in which the average speed of transportation through the city had not increased in three hundred years, following five hundred years of fitful road-widening and unskillful compromises between the needs of traffic, whether horse-drawn, or, more recently, motorized, and the needs of pedestrians; a city inhabited by and teeming with people of every color and manner and kind."},
  //   {text:"Before Fat Charlie's father had come into the bar, the barman had been of the opinion that the whole Karaoke evening was going to be an utter bust. But then the little old man had sashayed into the room, walked past the table of several blonde women, with the fresh sunburns and smiles of tourists, who were sitting by the little makeshift stage in the corner. He had tipped his hat to them, for he wore a hat, a spotless white fedora, and lemon-yellow gloves, and then he walked over to their table. They giggled."}
  // ];

  $('#submit_button').click(function(e) {
    e.preventDefault();

    //NOTE: refactor this using closure

    var outputArray = [];

    var pollItems = $('#poll_items').children().children().not('.button');

    // var pollItemsTemp = pollItems.slice(0,2);

    filterFirstRound(pollItems, outputArray);
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
