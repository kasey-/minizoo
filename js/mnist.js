$(document).ready(function(){
	var canvas  = document.querySelector('#canvas');
	var context = canvas.getContext('2d');
	canvas.width  = 280;
	canvas.height = 280;

	var Mouse     = {x:0, y:0};
	var lastMouse = {x:0, y:0};
	context.fillStyle = 'white';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.color     = 'black';
	context.lineWidth = 10;
  context.lineJoin  = context.lineCap = 'round';
	var rect = canvas.getBoundingClientRect();

	window.addEventListener('resize', function(event){
    rect = canvas.getBoundingClientRect();
  });

	canvas.addEventListener('mousemove', function(e){
		lastMouse.x = Mouse.x;
		lastMouse.y = Mouse.y;
		Mouse.x = e.pageX - rect.left;
		Mouse.y = e.pageY - rect.top;
	}, false);

	canvas.addEventListener('mousedown', function(e){
		canvas.addEventListener('mousemove', onPaint, false);
	}, false);

	canvas.addEventListener('mouseup', function(){
		canvas.removeEventListener('mousemove', onPaint, false);
	}, false);

	function onPaint(){
		context.lineWidth   = context.lineWidth;
		context.lineJoin    = 'round';
		context.lineCap     = 'round';
		context.strokeStyle = context.color;

		context.beginPath();
		context.moveTo(lastMouse.x, lastMouse.y);
		context.lineTo(Mouse.x, Mouse.y);
		context.closePath();
		context.stroke();
	}

	// mobile touch management
	function getTouchPos(canvasDom, touchEvent){
		rect = canvas.getBoundingClientRect();
	  return{
	    x: touchEvent.touches[0].clientX - rect.left,
	    y: touchEvent.touches[0].clientY - rect.top
	  };
	}

	canvas.addEventListener("touchstart", function(e) {
	  Mouse = getTouchPos(canvas, e);
	  var touch = e.touches[0];
	  var mouseEvent = new MouseEvent("mousedown", {
	    clientX: touch.clientX,
	    clientY: touch.clientY
	  });
	  canvas.dispatchEvent(mouseEvent);
	}, false);

	canvas.addEventListener("touchend", function(e) {
	  var mouseEvent = new MouseEvent("mouseup", {});
	  canvas.dispatchEvent(mouseEvent);
	}, false);

	canvas.addEventListener("touchmove", function(e) {
	  var touch = e.touches[0];
	  var mouseEvent = new MouseEvent("mousemove", {
	    clientX: touch.clientX,
	    clientY: touch.clientY
	  });
	  canvas.dispatchEvent(mouseEvent);
	}, false);

  // deactivate window drag if user touch in the canvas
	document.body.addEventListener("touchstart", function(e) {
	  if (e.target == canvas) e.preventDefault();
	}, false);

	document.body.addEventListener("touchend", function(e) {
	  if (e.target == canvas) e.preventDefault();
	}, false);

	document.body.addEventListener("touchmove", function(e) {
	  if (e.target == canvas) e.preventDefault();
	}, false);

  // Action management
  $('input[type="reset"]').on('click', function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
		$('#result').text('');
  });

  $('input[type="submit"]').on('click', function(){
    var canvasObj = document.getElementById('canvas');
    var img = canvasObj.toDataURL();
    qwest.post('/mnist/number', {'img':img})
    .then(function(xhr, response){
       $('#result').text(response[1]);
    })
    .catch(function(e, xhr, response){
       console.log(e, xhr, response);
    });
  });
});
