require('@babel/polyfill');
const _ = require('lodash');
const $ = require('cash-dom');
const axios = require('axios');
const moment = require('moment');
const mime = require('mime');
const papa = require('papaparse');
const chart = require('chart.js');

/* *** Color palette *************** */
const blue = [
  'rgba(11,19,43,0.2)',     // #0b132b Maastricht Blue
  'rgba(28,37,65,0.2)',     // #1c2541 Yankees Blue
  'rgba(58,80,107,0.2)',    // #3a506b Independence
  'rgba(91,192,190,0.2)',   // #5bc0be Sea Serpent
  'rgba(111,255,233,0.2)'   // #6fffe9 Aquamarine
];

function constructTable(dataset) {
  let table = `<p>${dataset.length} lines imported</p>
  <table class="table">
    <thead>
      <tr>
        <th>Line</th>
        <th>Date</th>
        <th>Value</th>
        <th></th>
      </tr>
    </thead>
  <tbody>`;
  const nbRowDisplay = 8;
  let idx = 1;
  _.take(dataset,nbRowDisplay).forEach(function(value){
    table = `${table}<tr>
    <td>${idx++}</td>
    <td>${value[0]}</td>
    <td>${value[1]}</td>
  </tr>`});
  table = `${table}<tr><td> </td><td>...</td><td>...</td></tr>`;
  idx = dataset.length -nbRowDisplay +1;
  _.takeRight(dataset,nbRowDisplay).forEach(function(value){
    table = `${table}<tr>
    <td>${idx++}</td>
    <td>${value[0]}</td>
    <td>${value[1]}</td>
  </tr>`});
  table = `${table}</tbody></table>`;
  $('#dataTable').html(table);
}

function constructGraphSource(dataset) {
  const label = dataset.map(function(value,index) { return moment(value[0]).unix(); });
  const serie = dataset.map(function(value,index) { return value[1]; });

  const chartSource = new chart($('#chart-source'), {
    type: 'line',
    data: {
      labels: label,
      datasets: [
        { label:"Dataset", data:serie, backgroundColor:[blue[0]], fill: false, pointRadius:0 }
      ]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY'
            }
          }
        }]
      }
    }
  });

  return serie;
}

function constructGraphForecast(response,serie) {
  const ds = Object.values(response.data.forecast.ds);
  const yhat = Object.values(response.data.forecast.yhat);
  const yhat_lower = Object.values(response.data.forecast.yhat_lower);
  const yhat_upper = Object.values(response.data.forecast.yhat_upper);

  const chartForecast = new chart($('#chart-forecast'), {
    type: 'line',
    data: {
      labels: ds,
      datasets: [
        { label:"Dataset", data:serie, backgroundColor:[blue[0]], fill: false, showLine:false },
        { label:"yhat", data:yhat, backgroundColor:[blue[1]], fill: false, pointRadius:0 },
        { label:"yhat_lower", data:yhat_lower, backgroundColor:[blue[2]], fill: 2, pointRadius:0 },
        { label:"yhat_upper", data:yhat_upper, backgroundColor:[blue[3]], fill: 2, pointRadius:0 }
      ]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY'
            }
          }
        }]
      }
    }
  });
}

function parse_file(file) {
  papa.parse(file, {
    dynamicTyping: true,
    skipEmptyLines: 'greedy',
    complete: function(results) {
      if(!moment(results.data[0][0]).isValid()) results.data.shift();
      const dataset = results.data;
      constructTable(dataset);
      const serie = constructGraphSource(dataset);
      $("#send-data").on("click", function(e) {
        $('.step3').removeClass('step3');
        axios.post('/prophet/dataset', dataset).then(function(response) {
          axios.get(`/prophet/${response.data.id}/predict/365`).then(function(response) {
            constructGraphForecast(response, serie);
          });
        });
      });
    }
  });
}

$(document).ready(function(){
  document.getElementById("file").addEventListener("change", handleFiles, false);
  function handleFiles() {
      const file = _.last(this.files);
      switch (mime.getExtension(file.type)) {
        case 'csv':
        case 'xls':
          $('#file-name').text(file.name);
          $('div .file').removeClass('is-danger');
          $('.step2').removeClass('step2');
          parse_file(file);
        break;
        default:
          $('div .file').addClass('is-danger');
          $('#file-name').text('Please upload a csv...');
      }
  }
});
