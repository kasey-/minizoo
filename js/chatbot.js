$(document).ready(function() {
  var client = new ApiAi.ApiAiClient({
    accessToken:'6accf0059725498aafd9e0a777019cbd'
  });

  $("#submit").on('click',function() {
    var chat_input = $("#chat_input").val();
    if(chat_input) {
      $("#chat_input").val('');
      add_message(chat_input,false);
      client.textRequest(chat_input)
        .then(handleResponse)
        .catch(handleError);
    }
  });

  function add_message(message,is_chatbot){
    var html_message = "";
    if(!is_chatbot) {
      html_message += '<article class="media">';
      html_message += '<figure class="media-left">';
      html_message += '<p class="image is-64x64">';
      html_message += '<img src="/img/avatar.png">';
      html_message += '</p>';
      html_message += '</figure>';
      html_message += '<div class="media-content';
      html_message += '<div class="content">';
      html_message += '<p>'+message+'</p>';
      html_message += '</div>';
      html_message += '</div>';
      html_message += '</article>';
    } else {
      html_message += '<article class="media">';
      html_message += '<div class="media-content">';
      html_message += '<div class="content is-pulled-right">';
      html_message += '<p>'+message+'</p>';
      html_message += '</div>';
      html_message += '</div>';
      html_message += '<figure class="media-right">';
      html_message += '<p class="image is-64x64">';
      html_message += '<img src="/img/customer-support.png">';
      html_message += '</p>';
      html_message += '</figure>';
      html_message += '</article>';
    }
    $(html_message).insertAfter("#chat_box");
  }

  function handleResponse(serverResponse) {
    var result;
    try {
      result = serverResponse.result.fulfillment.speech;
    } catch(error) {
      result = "Something goes wrong sorry...";
    }
    add_message(result,true);
  }

  function handleError(serverError) {
    add_message("Something goes wrong sorry... "+serverError,true);
  }
});
