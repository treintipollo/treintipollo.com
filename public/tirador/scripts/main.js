var snakeGame = {
	canvas: null,
	context: null,
	container:null
};

//TODO: Bajar el nivel del arma de player cuando colisiona.
	//Mover la nave y algun texto.

//TODO: Emoticones de la nave

//TODO: Los GameObjects tienen que poder agregarse solos al manager para no andar pasando 
//esa referencia por todas partes.
//TODO: GameObject especial que tenga el comportamiento de destruir Tweens cuando se destruye o resetea.

//TODO: Boss con brazos moviles como lo que dibuje.

//TODO: Sacar los metodos setStyle y setFill de GameObject porque son al pedo.
//TODO: Pasarle un delta time a todas las cosas

$(function(){
  var stats = new Stats();

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  setInterval( function () {
    stats.begin();
    stats.end();
  }, 1000 / 60 );

	snakeGame.canvas  = document.getElementById("game");
	snakeGame.context = snakeGame.canvas.getContext("2d");
	
	snakeGame.container = new ObjectsContainer(snakeGame.context);

	snakeGame.container.addCollisionPair("Ship", "EnemyRocket");
	snakeGame.container.addCollisionPair("Ship", "WeaponPowerUp");

	snakeGame.container.addCollisionPair("Shot"     , "EnemyRocket");
	snakeGame.container.addCollisionPair("PowerShot", "EnemyRocket");
	snakeGame.container.addCollisionPair("Rocket"   , "EnemyRocket");
	snakeGame.container.addCollisionPair("Explosion", "EnemyRocket");
	snakeGame.container.addCollisionPair("Debry"    , "EnemyRocket");

	var starFactory = new StartFactory(snakeGame.canvas.width, snakeGame.canvas.height, 5, 600, 1, snakeGame.container);
	var rocketFactory = new EnemyRocketFactory(snakeGame.canvas.width, snakeGame.canvas.height, 4, 7, 800, snakeGame.container, 10);

	var ship = new Ship(snakeGame.container);

	ship.x = snakeGame.canvas.width/2;
	ship.y = snakeGame.canvas.height - 100;

	snakeGame.container.add(ship, 0, true);
	starFactory.start();
	rocketFactory.start();

	 window.requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback,  element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

	window.requestAnimationFrame = requestAnimationFrame;
	window.requestAnimationFrame(mainLoop);
});


function mainLoop() {
	window.requestAnimationFrame(mainLoop);

	snakeGame.container.update();
	snakeGame.container.draw();
}


