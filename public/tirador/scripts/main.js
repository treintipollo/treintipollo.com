var TopLevel = {
	canvas: null,
	context: null,
	game: null,
	container: null,

	attributesGetter: null,

	powerUpFactory: null,
	playerShipFactory: null,
	rocketFactory: null,
	starFactory: null,
	weaponFactory: null,

	playerData: null,
	hudController: null,
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
		textArgs: [],

		showFeedBack: function(name, x, y) {
			if (!name)
				return;

			this.textArgs[0] = x;
			this.textArgs[1] = y;

			return TopLevel.container.add(name, this.textArgs);
		}
	},
};
window.TopLevel = TopLevel;

$(function() {
	//This is the main creation function, the game officially starts when this is called.
	var creation = function() {
		TopLevel.canvas = document.getElementById("game");
		TopLevel.context = TopLevel.canvas.getContext("2d");
		TopLevel.container = new ObjectsContainer(TopLevel.context).setDefaultLayer(2);

		TopLevel.weaponFactory = new WeaponFactory();
		TopLevel.playerShipFactory = new PlayerShipFactory();
		TopLevel.powerUpFactory = new PowerUpFactory();
		TopLevel.rocketFactory = new EnemyRocketFactory();
		TopLevel.starFactory = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);

		TopLevel.attributesGetter = new AttributesGetter();

		TopLevel.hudController = new HudController();
		TopLevel.playerData = new PlayerController();
		TopLevel.animationActors = new CutSceneController();
		TopLevel.gameModeController = new GameModeController();

		TopLevel.pools = new PoolCreator();
		TopLevel.configuration = new ConfigurationCreator();
		TopLevel.texts = new TextConfigurationCreator();
		TopLevel.collisionPairs = new CollisionPairCreator();
		TopLevel.attributes = new AttributeCreator();

		TopLevel.playerShipFactoryConfiguration = new PlayerShipFactoryConfiguration();
		TopLevel.powerUpConfiguration = new PowerUpConfiguration();

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
		TopLevel.playerData.ship = TopLevel.playerShipFactory.firstShip(TopLevel.canvas.width / 2 - 45, TopLevel.canvas.height + 50);

		//Start the StarFactory which will never stop working.
		TopLevel.starFactory.start();
	}

	SoundPlayer.createChannels(5);
	SoundPlayer.add("Shot", "assets/shot.wav");
	
	TopLevel.game = new GameSetUp(creation);

	SoundPlayer.loadAll(function() {
		TopLevel.game.setUp();
	});
});