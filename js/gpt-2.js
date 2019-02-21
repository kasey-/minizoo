require('@babel/polyfill');
const $ = require('cash-dom');
const axios = require('axios');

$(document).ready(function(){
  $('#submit').on('click', function(){
    $('#control').addClass('is-loading');
    $('#generated').html('<p>Generating text ... this can take up to one minute ...</p>');
    const data = {
      text:$('#source').val(),
      size:150,
      top_k:40
    };
    if(data.text) {
      axios.post('/gpt-2/generate', data)
        .then(function(response){
          $('#generated').html(`<p>${response.data.replace(/\n+/g, "<br />")}...</p>`);
        })
        .catch(function(error){
          console.error(error);
        })
        .then(function(){
          $('#control').removeClass('is-loading');
        });
    }
  });
});
