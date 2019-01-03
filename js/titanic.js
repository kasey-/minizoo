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
    var passenger = {
      age:$('input[name=age]').val(),
      sex:$('input[name=gender]:checked').val(),
      pclass:$('input[name=pclass]:checked').val(),
      fare:$('input[name=fare]').val(),
      embarked:$('input[name=embarked]:checked').val()
    };
    axios.post('/titanic/passenger',passenger)
     .then(function(response) {
        $('#results').text(Math.round((response*100))+"%");
     })
     .catch(function(error) {
        console.log(error);
     });
  });
});
