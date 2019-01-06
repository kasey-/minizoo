require('@babel/polyfill');
const axios = require('axios');
const $ = require('cash-dom');

$(document).ready(function() {
  $('input[name=gender]').on('click',function(){
    if($('input[name=gender]:checked').val() == 1){
      $('i.silhouette').removeClass("fa-female");
      $('i.silhouette').addClass("fa-male");
    } else {
      $('i.silhouette').removeClass("fa-male");
      $('i.silhouette').addClass("fa-female");
    }
  });

  $("#submit").on('click',function() {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const passenger = new FormData();
    passenger.append('age', $('input[name=age]').val());
    passenger.append('sex', $('input[name=gender]:checked').val());
    passenger.append('pclass', $('input[name=pclass]:checked').val());
    passenger.append('fare', $('input[name=fare]').val());
    passenger.append('embarked', $('input[name=embarked]:checked').val());

    axios.post('/titanic/passenger', passenger, config)
     .then(function(response) {
        $('#results').text(Math.round((response*100))+"%");
     })
     .catch(function(error) {
        console.log(error);
     });
  });
});
