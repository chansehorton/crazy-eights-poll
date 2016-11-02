// function staggeredCall() {
//
//   var prom1 = new Promise(function(resolve){
//     resolve(filterFirstRound(pollItemsJQOBatch1));
//   });
//
//   prom1.then(function(result1){
//     console.dir('inside prom1: ', result1);
//     testTimeout(result1);
//   });
//
//   function testTimeout(result1){
//     setTimeout(function(){
//       var prom2 = new Promise(function(resolve){
//         console.dir('inside prom2: ', result1);
//         resolve(filterFirstRound(pollItemsJQOBatch2));
//       });
//
//       prom2.then(function(result2){
//         console.dir("data returned from prom2:", result2);
//       });
//     },1000);
//   };
// };

// staggeredCall();

// function getExample() {
//   var filteredResults1 = new Promise(function(resolve) {
//     return filterFirstRound(pollItemsJQOBatch1);
//   });
//   filteredResults1.resolve('somejunk').then(function(data) {
//     console.log(data);
//   });
//   var filteredResults2 = filteredResults1.then(function(resultA) {
//     return new Promise(function(resolve) {
//       setTimeout(function() {
//         filterFirstRound(pollItemsJQOBatch2);
//       }, 1000);
//     });
//   });
//   Promise.all([filteredResults1, filteredResults2]).then(function(resultA, resultB) {
//     console.log(resultA);
//     console.log(resultB);
//   });
// };




// Promise.all([filteredResults1, filteredResults2]).then(function(result1, result2){
//   console.log("result1 in Promise.all",result1);
//   return result1.concat(result2);
// });

// filteredResults2.then(function(data){
//   console.log("in #2 then");
//   console.log(data);
// })
// var filteredResults2 = filteredResults1.then(function(resultA) {
//   return new Promise(function(resolve) {
//     setTimeout(function() {
//       filterFirstRound(pollItemsJQOBatch2);
//     }, 1000);
//   });
// });
// Promise.all([filteredResults1, filteredResults2]).then(function(resultA, resultB) {
//   console.log(resultA);
//   console.log(resultB);
// });







    // var allResults = getExample();
    // console.log(allResults);



    // var filteredResults1 = new Promise(function(resolve) {
    //   filterFirstRound(pollItemsJQOBatch1);
    // });
    //
    // filteredResults1.then(function(values) {
    //   setTimeout(function() {
    //     var filteredResults2 = new Promise(function(resolve) {
    //       filterFirstRound(pollItemsJQOBatch2);
    //     });
    //   }, 1000);
    // });
    // var filteredResults1 = filterFirstRound(pollItemsJQOBatch1);
    // var resultsProm2;
    // var filteredResults2 = new Promise(function(resolve) {
    //   window.setTimeout(function() {
    //     resultsProm2 = filterFirstRound(pollItemsJQOBatch2);
    //   }, 1000);
    // });

    // var resultsProm1 = Promise.resolve(filteredResults1);
    // var resultsProm2 = Promise.resolve(filteredResults2);


    // Promise.all([resultsProm1, resultsProm2]).then(function(values) {
    //   console.log(values);
    //   console.log(resultsProm1);
    //   console.log(resultsProm2);
    // });
