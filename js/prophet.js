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
    url:'#',
    autoProcessQueue: false,
    acceptedFiles:'text/csv,application/vnd.ms-excel'
  });

  myDropzone.on("addedfile", function(file) {
    switch(file.type) {
      case 'text/csv':
      case 'application/vnd.ms-excel':
        Papa.parse(file, {
          dynamicTyping: true,
          complete: function(results) {
            const {data} = results;
            let table = `<p>${data.length} lines imported</p>
            <table class="table">
              <thead><tr><th>Date</th><th>Value</th></tr></thead>
            <tbody>`;
            _.forEach(_.take(data,6), function(value){
              table = `${table}<tr>
              <td>${value[0]}</td>
              <td>${value[1]}</td>
            </tr>`});
            table = `${table}<tr><td>...</td><td>...</td></tr>`;
            _.forEach(_.takeRight(data,6), function(value){
              table = `${table}<tr>
              <td>${value[0]}</td>
              <td>${value[1]}</td>
            </tr>`});
            table = `${table}</tbody></table>`;
            $('#dataTable').html(table);

            axios.post('http://127.0.0.1:5000/prophet/dataset', data)
              .then(function (response) {
                console.log(response.data);
                axios.get(`http://127.0.0.1:5000/prophet/${response.data.id}/predict/12`).then(function (response) {
                  console.log(response.data);
                }).catch(function (error) {
                  console.log(error);
                });
              }).catch(function (error) {
                console.log(error);
              });
          }
        });
      break;
      default:
        console.log("Wrong type of file: "+file.type);
    }
  });
});
