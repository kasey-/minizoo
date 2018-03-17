
function forEach(array, fn) {
  for (var i = 0; i < array.length; i++){
    fn(array[i], i);
  }
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}

ready(function(){
  var myDropzone = new Dropzone("#uploadArea", {
    url: "/inception/picture",
    paramName: "img",
    acceptedFiles: "image/*",
    previewTemplate: '<figure class="image preview is-512x512">'+
    '<img data-dz-thumbnail></figure>',
    thumbnailWidth: 512,
    thumbnailHeight: 512
  });

  myDropzone.on("success", function(file) {
    var result = '<table class="table is-striped is-hoverable">';
    result += '<thead>';
    result += '<tr>';
    result += '<th>Label</th>';
    result += '<th>Probability</th>';
    result += '</tr>';
    result += '</thead>';
    result += '<tbody>';
    forEach(JSON.parse(file.xhr.response), function(item, i){
      result += '<tr>';
      result += '<td>'+item['label']+'</td>';
      result += '<td>'+item['prob'].toFixed(2)+' %</td>';
      result += '</tr>';
    });
    result += '</tbody>';
    result += '</table>';
    document.querySelector('#result').innerHTML = result;
  });

  myDropzone.on("addedfile", function(file) {
    if(myDropzone.files.length > 1) {
      myDropzone.removeFile(myDropzone.files[0]);
    }
  });
});
