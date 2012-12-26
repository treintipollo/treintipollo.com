var snakeGame = {
	canvas: null,
	context: null,
	container:null
};

$(function(){
	snakeGame.canvas  = document.getElementById("game");
	snakeGame.context = snakeGame.canvas.getContext("2d");
	
	snakeGame.container = new ObjectsContainer(snakeGame.context);

	var starFactory = new StartFactory(snakeGame.canvas.width, snakeGame.canvas.height, 5, 600, 1, snakeGame.container);
	var ship = new Ship(snakeGame.container);

	ship.x = snakeGame.canvas.width/2;
	ship.y = snakeGame.canvas.height - 100;

	snakeGame.container.add(ship);
	starFactory.start();

	setInterval(mainLoop, 30);
});

function mainLoop() {
	//TODO: Pasarle un delta time a update

	snakeGame.container.update();
	snakeGame.container.draw();
}

