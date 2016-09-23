//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//

function getPlayerMove(data) {
  // TODO : IMPLEMENT THE BETTER STRATEGY FOR YOUR BOT
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;

  var ballStop = getBallStats(ball, data.settings);

  //if (data.playerIndex == 2)
	var attackDirection = Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - ball.settings.radius * 2);

	if ((
		{
			attackDirection = 0;	
			velocity = 0;
		}
		
	
	
		
  //ball of the left
  // if (ballStop.x < currentPlayer.x) {
	  // //above ball.settings.radius
	  // if (ballStop.y < currentPlayer.y) {
	      // attackDirection = Math.atan2(ballStop.y - currentPlayer.y - ball.settings.radius, ballStop.x - currentPlayer.x - ball.settings.radius);
	  // } else
	  // {
		  // attackDirection = Math.atan2(ballStop.y - currentPlayer.y + ball.settings.radius, ballStop.x - currentPlayer.x - ball.settings.radius);
	  // }
  // }

  
  return {
    direction: attackDirection,
    velocity: currentPlayer.velocity + data.settings.player.maxVelocityIncrement
  };
}

function getDistance(ball, currentPlayer)
{
	Math.abs(ball.x - data.x)<=20)&&
		(Math.abs(ball.y - data.y)<=20))
	return 
}

function getBallStats(ball, gameSettings) {
  var stopTime = getStopTime(ball);
  var stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

  var x = ball.x + stopDistance * Math.cos(ball.direction);
  var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
