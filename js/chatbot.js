const $ = require('cash-dom');

$(document).ready(function() {
  const client = new ApiAi.ApiAiClient({
    accessToken: '6accf0059725498aafd9e0a777019cbd'
  });

  $("#submit").on('click',function() {
    send_message();
  });

  $("#chat_input").on('keydown',function(keyDown) {
    if(keyDown.keyCode == 13)
      send_message();
  });

  function send_message(){
    const chat_input = $("#chat_input").val();
    if(chat_input) {
      $("#chat_input").val('');
      add_message(chat_input,false);
      client.textRequest(chat_input)
        .then((response) => {
          let result;
          try {
            result = response.result.fulfillment.speech;
          } catch(error) {
            result = `Something goes wrong sorry... ${error}`;
          }
          add_message(result,true);
        }).catch((error) => {
          add_message(`Something goes wrong sorry... ${error}`,true);
        });
    }
  }

  function add_message(message,is_chatbot){
    let html_message = "";
    if(!is_chatbot) {
      html_message = `
<article class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img src="/img/avatar.png">
      </p>
  </figure>
  <div class="media-content>
    <div class="content">
      <p>${message}</p>
    </div>
  </div>
</article>`;
    } else {
      html_message = `
<article class="media">
  <div class="media-content">
    <div class="content is-pulled-right">
      <p>${message}</p>
    </div>
  </div>
  <figure class="media-right">
    <p class="image is-64x64">
      <img src="/img/customer-support.png">
    </p>
  </figure>
</article>`;
    }
    $(html_message).insertAfter("#chat_box");
  }
});
