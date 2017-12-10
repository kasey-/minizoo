$(document).ready(function() {
	var canvas  = document.querySelector('#canvas');
	var context = canvas.getContext('2d');
	canvas.width  = 280;
	canvas.height = 280;

	var Mouse = { x: 0, y: 0 };
	var lastMouse = { x: 0, y: 0 };
	context.fillStyle = 'white';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.color     = 'black';
	context.lineWidth = 10;
  context.lineJoin  = context.lineCap = 'round';
	var rect = canvas.getBoundingClientRect();

	window.addEventListener('resize', function(event){
    rect = canvas.getBoundingClientRect();
  });

	canvas.addEventListener('mousemove', function(e) {
		lastMouse.x = Mouse.x;
		lastMouse.y = Mouse.y;
		Mouse.x = e.pageX - rect.left;
		Mouse.y = e.pageY - rect.top;
	}, false );

	canvas.addEventListener('mousedown', function(e) {
		canvas.addEventListener('mousemove', onPaint, false );
	}, false );

	canvas.addEventListener('mouseup', function() {
		canvas.removeEventListener('mousemove', onPaint, false );
	}, false );

	var onPaint = function() {
		context.lineWidth   = context.lineWidth;
		context.lineJoin    = 'round';
		context.lineCap     = 'round';
		context.strokeStyle = context.color;

		context.beginPath();
		context.moveTo( lastMouse.x, lastMouse.y );
		context.lineTo( Mouse.x, Mouse.y );
		context.closePath();
		context.stroke();
	};

  $('input[type="reset"]').on('click', function() {
    context.clearRect( 0, 0, 280, 280 );
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);
		$('#result').text('');
  });

  $('input[type="submit"]').on('click', function(){
    var canvasObj = document.getElementById('canvas');
    var img = canvasObj.toDataURL();
    qwest.post('/mnist/number',{'img':img})
    .then(function(xhr, response) {
       $('#result').text(response[1]);
    })
    .catch(function(e, xhr, response) {
       console.log(e, xhr, response);
    });
  });
});
