$( document ).ready(function() {
  $('input[name=gender]').click(function(){
    if($('input[name=gender]:checked').val() == 1){
      $('i.silhouette').removeClass("fa-female");
      $('i.silhouette').addClass("fa-male");
    } else {
      $('i.silhouette').removeClass("fa-male");
      $('i.silhouette').addClass("fa-female");
    }
  });

  $("#submit").click(function() {
    const passanger = {
      age:$('input[name=age]').val(),
      sex:$('input[name=gender]:checked').val(),
      pclass:$('input[name=pclass]:checked').val(),
      fare:$('input[name=fare]').val(),
      embarked:$('input[name=embarked]:checked').val()
    };
    $.post( "http://127.0.0.1:5000/titanic",passanger)
    .done(function(data){
      $('#results').text(Math.round((data*100))+"%")
    })
    .fail(function(error){
      console.log(error)
    })
    .always(function() {
    });
  });
});
