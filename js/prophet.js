const papa = require('papaparse');
const axios = require('axios');
const _ = require('lodash');
const $ = require('cash-dom');
const moment = require('moment');
const dropzone = require('dropzone');
const chartist = require('chartist');
const lttb = require('downsample-lttb');

$(document).ready(function(){
  const displayedSamples = 200;
  const chartOpt = {
    showPoint: false,
    lineSmooth: true,
    axisX: {
      showGrid: false,
      showLabel: true,
      labelInterpolationFnc: function skipLabels(value, index) {
        if(index % 400  === 0) {
          if(value > 9999999999) value /= 1000;
          return moment.unix(value).format('YYYY-DD-MM');
        } else {
          return null;
        }
      }
    }
  };

  var chart1 = new chartist.Line('#chart1',{},chartOpt);
  var chart2 = new chartist.Line('#chart2',{},chartOpt);

  var myDropzone = new dropzone("#uploadArea", {
    url:'#',
    autoProcessQueue: false,
    acceptedFiles:'text/csv,application/vnd.ms-excel'
  });

  myDropzone.on("addedfile", function(file) {
    switch(file.type) {
      case 'text/csv':
      case 'application/vnd.ms-excel':
        papa.parse(file, {
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

/*
            const data_conv_dates = data.map(function(value,index) {
              return [,value[1]];
            });

            downsampled = lttb.processData(data_conv_dates, displayedSamples);
            let label = downsampled.map(function(value,index) { return value[0]; });
            let serie = downsampled.map(function(value,index) { return value[1]; });
*/
            let label = data.map(function(value,index) { return moment(value[0]).unix(); });
            let serie = data.map(function(value,index) { return value[1]; });

            chart1.update({
              labels: label,
              series: [serie]
            });

            axios.post('http://127.0.0.1:5000/prophet/dataset', data)
              .then(function (response) {
                axios.get(`http://127.0.0.1:5000/prophet/${response.data.id}/predict/365`).then(function (response) {
                  const ds = Object.values(response.data.forecast.ds);
                  const yhat = Object.values(response.data.forecast.yhat);
                  const yhat_lower = Object.values(response.data.forecast.yhat_lower);
                  const yhat_upper = Object.values(response.data.forecast.yhat_upper);
                  chart2.update({
                    labels: ds,
                    series: [yhat,yhat_lower,yhat_upper]
                  });
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
