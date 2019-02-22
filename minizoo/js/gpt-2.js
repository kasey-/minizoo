require('@babel/polyfill');
const $ = require('cash-dom');
const axios = require('axios');

function handleError(error) {
  console.error(error);
  $('#control').removeClass('is-loading');
  $('#generated').html(`<article class="message is-danger">
  <div class="message-body">Error while getting the api answer ... try again later.</div>
  </article>`);
}

function checkAnswer(uuid) {
  axios.get('/gpt-2/generate/'+uuid)
    .then(function(response) {
      switch (response.data.status) {
        case 'done':
          $('#generated').html(
            `<p>${response.data.result.replace(/\n+/g, "<br />")}...</p>`);
          $('#control').removeClass('is-loading');
          break;
        case 'pending':
          setTimeout(checkAnswer,5000,uuid);
          break;
        default:
          throw "Unknow error";
      }
    })
    .catch(function(error){
      handleError(error);
    })
}

$(document).ready(function(){
  $('#submit').on('click', function() {
    $('#control').addClass('is-loading');
    $('#generated').html('<p>Generating text ... this can take up to one minute ...</p>');
    const data = {
      text:$('#source').val(),
      length:150,
      top_k:40
    };
    if(data.text) {
      axios.post('/gpt-2/generate', data)
        .then(function(response){
          const uuid = response.data;
          setTimeout(checkAnswer,5000,uuid);
        })
        .catch(function(error){
          handleError(error);
        })
        .then(function(){
          $('#control').removeClass('is-loading');
        });
    }
  });
});
