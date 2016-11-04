'use strict';

var finalCompArray = [];
// query Bing search engine for each input search term, and return objects containing the term and number of web hits
function filterFirstRound(inputArray, outputObjArray, inputText) {
  // set delay to ensure we never trip the API's '5 per second' limit
  var my_delay = 200;
  //as long as array has elements, keep making API calls
  if (inputArray.length > 0) {
    var searchReturn = {};
    // get the next object and create the url
    var searchTerm = inputArray[0];
    var urlSearchString = 'http://g-bing.herokuapp.com/bing/v5.0/search?q=' + searchTerm;
    // remove the current object from the array
    inputArray.shift();
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
        setTimeout(filterFirstRound, my_delay, inputArray, outputObjArray, inputText);
      },
      error: function() {
        console.log('ERROR: ' + searchTerm);
      }
    });
  } else {
    //now that all calls have been made, filter the results and refactor the display
    //only two conditions exist. we will have either 2 searches, or eight searches
    if (outputObjArray.length > 2) {
      var filteredArray = filterAnswers(outputObjArray);
      refactorDisplay(filteredArray);
    } else {
      //if we're doing this function from the second round, there will be 4 calls of this function with two searches each. here we add the totals of each pair of searches, save to an object and push each object to a (blecch!) global variable.
      var aggObj = {
        term: inputText,
        hits: outputObjArray[0].hits + outputObjArray[1].hits
      };
      arrayBuild(aggObj);
      //once we have all four objects in our global array, we filter down to two, and show it to the people
      if (finalCompArray.length === 4) {
        var filteredArray2 = filterAnswers(finalCompArray);
        refactorDisplay(filteredArray2);
      }
    };
  }
}

function arrayBuild(obj) {
  finalCompArray.push(obj);
};

// Text analysis ajax call:
function filterSecondRound(inputArray) {
  var urlTAString = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases';

  //we form the data to the API's expected input
  var formedData = [];
  for (var i=0;i<inputArray.length;i++) {
    var thisData = {
      id: i + 1,
      language: 'en',
      text: inputArray[i]
    };
    formedData.push(thisData);
  };

  var dataDocs = {documents: formedData};

  $.ajax({
    url: urlTAString,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': '358f38392fde4104ac79ff4b235a3c9d'
    },
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(dataDocs),
    success: function(data){
      // In an ideal world, we could afford unlimited calls to the search API, and would run searches on ALL the terms. Here, to save calls, we only scrape the first two returned keywords and add them to a key in the associated formedData object, which already contains the other info we need.
      for (var i=0;i<data.documents.length;i++) {
        for (var j=0;j<formedData.length;j++) {
          if (formedData[j].id===Number(data.documents[i].id)) {
            formedData[j].keyPhrases = [data.documents[i].keyPhrases[0],data.documents[i].keyPhrases[1]];
          }
        };
      };
      //we create unique output arrays to pass to filterFirstRound
      for (var k=0;k<formedData.length;k++) {
        var string = 'outArray' + k;
        formedData[k][string] = [];
        filterFirstRound(formedData[k].keyPhrases, formedData[k][string], formedData[k].text);
      };
    },
    error: function(data) {
      console.log('error: ');
      console.log(data);
    }
  });
};

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
  console.log(answerArray);

  answerArray.sort(compare);
  if (answerArray.length>4) {
    outputArray = answerArray.slice(0,4);
  } else {
    outputArray = answerArray;
  }
  // else {
  //   outputArray = answerArray.slice(0,2);
  // };
  return outputArray;
};

//refactors the display for 2 or 4 answers
function refactorDisplay(array) {

  $('#poll_items').children().remove();

  $('#poll_items').first().prepend('<div id="col_1" class="col s10 m6 offset-s1"></div><div id="col_2" class="col s10 m6 offset-s1"></div>');

// on first pass, simply display the four top results, on second round, display all four inputs, but highlight the cards of the ones with the top two aggregate hits
  if (array[0].term.length <= 30) {
    for (var i=0;i<array.length;i++) {
      if (i<2) {
        $('#col_1').append('<div class="card-panel cyan darken-1"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[i].term + '</textarea></div>');
      } else {
        $('#col_2').append('<div class="card-panel cyan darken-1"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[i].term + '</textarea></div>');
      };
    };
  } else {
    document.getElementById('submit_button').setAttribute("disabled","true");
    for (var j=0;j<array.length;j++) {
      switch(j) {
        case 0:
          $('#col_1').append('<div class="card-panel green"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[j].term + '</textarea></div>');
          break;
        case 1:
          $('#col_2').append('<div class="card-panel green"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[j].term + '</textarea></div>');
          break;
        case 2:
          $('#col_1').append('<div class="card-panel cyan darken-1"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[j].term + '</textarea></div>');
          break;
        case 3:
          $('#col_2').append('<div class="card-panel cyan darken-1"><textarea class="poll-item-med white-text" cols="30" rows="6">' +  array[j].term + '</textarea></div>');
          break;
      };
    };
  };
}


$(document).ready(function() {

//test arrays to save API calls during testing
  // var testArray1 = [
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
  //
  // var testArray2 = [
  //   {
  //   hits: 1,
  //   term: "In the beginning it was too far away for Shadow to focus on. Then it became a distant beam of hope, and he learned how to tell himself 'this too shall pass' when the prison shit went down, as prison shit always did. One day the magic door would open and he'd walk through it. So he marked off the days on his Songbirds of North America calendar, which was the only calendar they sold in the prison commissary, and the sun went down and he didn't see it and the sun came up and he didn't see it. He practiced coin tricks from a book he found in the wasteland of the prison library; and he worked out; and he made lists in his head of what he'd do when he got out of prison."
  //   },
  //   {
  //     hits: 2,
  //     term: "Through the gap in the wall can be seen a large green meadow; beyond the meadow, a stream; and beyond the stream there are trees. From time to time shapes and figures can be seen, amongst the trees, in the distance. Huge shapes and odd shapes and small, glimmering things which flash and glitter and are gone. Although it is perfectly good meadowland, none of the villagers has ever grazed animals on the meadow on the other side of the wall. Nor have they used it for growing crops."
  //   },
  //   {
  //     hits: 3,
  //     term: "It was a city in which the very old and the awkwardly new jostled each other, not uncomfortably, but without respect; a city of shops and offices and restaurants and homes, of parks and churches, of ignored monuments and remarkably unpalatial palaces; a city of hundreds of districts with strange names -- Crouch End, Chalk Farm, Earl's Court, Marble Arch -- and oddly distinct identities; a noisy, dirty, cheerful, troubled city, which fed on tourists, needed them as it despised them, in which the average speed of transportation through the city had not increased in three hundred years, following five hundred years of fitful road-widening and unskillful compromises between the needs of traffic, whether horse-drawn, or, more recently, motorized, and the needs of pedestrians; a city inhabited by and teeming with people of every color and manner and kind."
  //   },
  //   {
  //     hits: 4,
  //     term: "Before Fat Charlie's father had come into the bar, the barman had been of the opinion that the whole Karaoke evening was going to be an utter bust. But then the little old man had sashayed into the room, walked past the table of several blonde women, with the fresh sunburns and smiles of tourists, who were sitting by the little makeshift stage in the corner. He had tipped his hat to them, for he wore a hat, a spotless white fedora, and lemon-yellow gloves, and then he walked over to their table. They giggled."
  //   }
  // ];

  $('#submit_button').click(function(e) {
    e.preventDefault();

    //NOTE: refactor this using closure??

    var outputArray = [];
    finalCompArray = [];

    var pollItems = $('#poll_items').children().children().children();
    var pollItemArray = [];

    $.each(pollItems, function() {
      pollItemArray.push($(this).val());
    });

    $('#poll_items').children().remove();

    $('#poll_items').append('<div class="progress cyan darken-1"><div class="indeterminate cyan lighten-4"></div></div>');

    if (pollItemArray.length > 4) {
      filterFirstRound(pollItemArray, outputArray);
      // *** testing functionality
      // setTimeout(function() {
      //   refactorDisplay(filterAnswers(testArray1));
      // }, 5000);
    } else {
      filterSecondRound(pollItemArray);
      // *** testing functionality
      // setTimeout(function() {
      //   refactorDisplay(filterAnswers(testArray2));
      // }, 5000);
    };
  });
});
