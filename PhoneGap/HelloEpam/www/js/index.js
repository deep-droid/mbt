var watch = 0;



window.onload = function() {
	//init();
	document.addEventListener("deviceready", init, false);
}

function reset() {
    console.log("reset");
     var iW = window.innerWidth;
     var iH = window.innerHeight;
     xPos = (iW-target.width)/2;
     yPos = (iH-target.height)/2;

	cnv.clearRect(0, 0, canvas.width, canvas.height);
    cnv.drawImage(target, xPos, yPos);
}

function onAcceleration(acceleration) {
    document.getElementById("xOut").innerHTML = acceleration.x;
    document.getElementById("yOut").innerHTML = acceleration.y;
    document.getElementById("zOut").innerHTML = acceleration.z;
	cnv.clearRect(0, 0, canvas.width, canvas.height);
	xPos += -1*(acceleration.x * 0.5);
	yPos += (acceleration.y * 0.5);

	console.log("x=" + xPos + " y=" + yPos);
	cnv.drawImage(target, xPos, yPos); 
}
function onError() {
	alert("Accelerometer error");
}

function onBatteryStatus(info) {
    console.log("battery: " + JSON.stringify(info));
    document.getElementById("spanBattery").innerHTML = (info.level? info.level : "???") +"% " + (info.isPlugged ? "plugged" : "unplugged");
}

function init()
{
	document.getElementById("btnReset").onclick = reset;

     var iW = window.innerWidth;
     var iH = window.innerHeight;
     canvas = document.getElementById('myCanvas');
     cnv = canvas.getContext("2d");
     cnv.canvas.width = iW;
     cnv.canvas.height = iH-40;
     target = new Image();
     target.src = "img/epam.png";
     xPos = (iW-target.width)/2;
     yPos = (iH-target.height)/2;

     console.log("init x=" + xPos + " y=" + yPos + " w=" + iW + " h=" + iH);

     target.onload = function ()
     {
         cnv.drawImage(target, xPos, yPos);
     }

	var options = { frequency: 100 };
	watch = navigator.accelerometer.watchAcceleration(onAcceleration, onError, options);

	window.addEventListener("batterystatus", onBatteryStatus, false);
}