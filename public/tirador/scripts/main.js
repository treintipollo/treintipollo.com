var TopLevel = {
	canvas: null,
	context: null,
	game: null,
	container:null,

	attributesGetter: null,

	powerUpFactory: null,
	playerShipFactory: null,
	rocketFactory: null,
	starFactory:null,
	weaponFactory: null,

	playerData: null, 
	hudController:null,
	animationActors: null,
	gameModeController: null,

	pools: null,
	attributes: null,
	texts: null,
	configuration: null,
	collisionPairs: null,

	resetGame: function() {
		TimeOutFactory.stopAllTimeOuts();
		TweenMax.killAll();

		this.rocketFactory.stop();
		this.starFactory.speedDown();

		this.playerData.softReset();
		this.container.removeAll();		

		this.animationActors.reset();
		this.playerShipFactory.reset();
	},

	textFeedbackDisplayer: {
		textArgs:[],

		showFeedBack: function(name, x, y) {
			if(!name)
				return;

			this.textArgs[0] = x;
			this.textArgs[1] = y;
			
			return TopLevel.container.add(name, this.textArgs);
		}
	},


};
window.TopLevel = TopLevel;
	
//Tweek weapons
		//Homing
			//Homing rockets explosion size. Smaller.
			//Homing rockets drawing (Smaller)

//TODO: Buscar algo de musica y efectos de sonido
	//Ver si encuentro packs de sonidos de SNES o algo por el estilo.

//Esto no es para este juego.
//TODO: Simplify GameObject, extend Delegate.

//TODO: Nestable GameObjects 
	//follow the tranformation of their respective parents
	//A nested gameObject is drawn in the same layer as it's parent and top of it


//TODO: Be able to configure hitArea.
		//Multiple hit areas for a single GameObject
		//Hit area should follow the tranformation of it's owner.

//TODO: Get a better "inherit" method.
		//One that supports _super properly.

//TODO:Single Utility Object, so that the global scope has less litter.

//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
		//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
		//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
		//Con ese nombre y el scope puede hacer percha esa referencia.

//TODO: Optimizations
	//TODO: Reduce memory Footprint.
	//TODO: Optimize drawing method.
			//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
			//This will not be possible where procedural animations take place. Like the eye of the Boss or its tentacles. But things like Rockets and particles could be cached.
			//Reduce object pool sizes.
			//Reduce amount of objects created to cache data.
	//TODO: //I Could setup the GameObjects in a way in which I can specify if they need an update or not. 
			//That could reduce method calls greatly, since a lot of GameObjects don't use update at all.
			//Same could be done with draw

$(function(){
	//This is the main creation function, the game officially starts when this is called.
	var creation = function() {
		TopLevel.canvas    = document.getElementById("game");
		TopLevel.context   = TopLevel.canvas.getContext("2d");
		TopLevel.container = new ObjectsContainer(TopLevel.context).setDefaultLayer(2);

		TopLevel.weaponFactory     = new WeaponFactory();
		TopLevel.playerShipFactory = new PlayerShipFactory();
		TopLevel.powerUpFactory    = new PowerUpFactory();
		TopLevel.rocketFactory     = new EnemyRocketFactory();
		TopLevel.starFactory       = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
		
		TopLevel.attributesGetter = new AttributesGetter();

		TopLevel.hudController      = new HudController();
		TopLevel.playerData         = new PlayerController();
		TopLevel.animationActors    = new CutSceneController();
		TopLevel.gameModeController = new GameModeController();

		TopLevel.pools          = new PoolCreator();
		TopLevel.configuration  = new ConfigurationCreator();
		TopLevel.texts          = new TextConfigurationCreator();
		TopLevel.collisionPairs = new CollisionPairCreator();
		TopLevel.attributes     = new AttributeCreator();

		TopLevel.playerShipFactoryConfiguration = new PlayerShipFactoryConfiguration();
		TopLevel.powerUpConfiguration           = new PowerUpConfiguration();

		ArrowKeyHandler.init();

		//GameObject pooling method
		TopLevel.pools.create();
		//All things related to GameObject configuration
		TopLevel.configuration.create();
		TopLevel.texts.create();
		TopLevel.collisionPairs.create();				
		TopLevel.attributes.create();
		
		//Boss Configurations
		Boss_1_ConfigurationGetter.createConfigurations();

		TopLevel.powerUpConfiguration.setUp();
		TopLevel.playerShipFactoryConfiguration.setUp();

		//This takes care of updating the HUD
		TopLevel.hudController.init(TopLevel.playerData);

		//The reference to the player ship held in PlayerData
		TopLevel.playerData.ship = TopLevel.playerShipFactory.firstShip(TopLevel.canvas.width/2 - 45, TopLevel.canvas.height + 50);

		//Start the StarFactory which will never stop working.
		TopLevel.starFactory.start();
	}

	//Game creation starts here.
	TopLevel.game = new GameSetUp(creation);

	//var whiteFlash = new WhiteFlashContainer();

	//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, function(){
	 	//TopLevel.container.add('FadeToBlack').start();	
	 	//TopLevel.game.softPause();
	 	//whiteFlash.on(null, null, {x:TopLevel.canvas.width/2, y:TopLevel.canvas.height/2});
	//});
});