function ConfigurationCreator() {}

ConfigurationCreator.prototype.create = function() {

	//Configurations
	//Collidable GameObjects
	TopLevel.container.createTypeConfiguration("Ship", "Ship").collisionId("Ship").saveOnReset().args({
		gender: Ship.MALE
	}).addCallback("shot", this, function() {
		SoundPlayer.playSingle("Shot");
	});

	TopLevel.container.createTypeConfiguration("PartnerShip", "Ship").collisionId("Ship").args({
		gender: Ship.FEMALE
	});

	TopLevel.container.createTypeConfiguration("PowerShip", "PowerShip").collisionId("Ship");

	TopLevel.container.createTypeConfiguration("TestBadGuy", "BadGuy").args({
		tProto: BadGuy.prototype
	});
	TopLevel.container.createTypeConfiguration("IntroBadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: IntroBadGuy.prototype
	});

	TopLevel.container.createTypeConfiguration("Middle_1_BadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: MiddleBadGuy.prototype,
		rocketType: "BadGuySmallAimedRocket",
		rocketTimeOut: 100,
		rocketAmount: 15,
		rocketRadius: 100,
		rocketAccelerationMin: 0.8,
		rocketAccelerationMax: 1.2,
		rocketDeploySpeedMin: 1,
		rocketDeploySpeedMax: 1.7,
		speed: 220,
		blastRadius: 15
	});

	TopLevel.container.createTypeConfiguration("Middle_2_BadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: MiddleBadGuy.prototype,
		rocketType: "BadGuyLargeHomingRocket",
		rocketTimeOut: 200,
		rocketAmount: 5,
		rocketRadius: 100,
		rocketAccelerationMin: 0.05,
		rocketAccelerationMax: 0.2,
		rocketDeploySpeedMin: 1,
		rocketDeploySpeedMax: 1.7,
		speed: 220,
		blastRadius: 15
	});

	TopLevel.container.createTypeConfiguration("Middle_3_BadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: MiddleBadGuy.prototype,
		rocketType: "BadGuyClusterAimedRocket",
		rocketTimeOut: 150,
		rocketAmount: 8,
		rocketRadius: 100,
		rocketAccelerationMin: 0.8,
		rocketAccelerationMax: 1.2,
		rocketDeploySpeedMin: 0.6,
		rocketDeploySpeedMax: 1.8,
		speed: 240,
		blastRadius: 15
	});

	TopLevel.container.createTypeConfiguration("End_1_BadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: End_1_BadGuy.prototype,
		rocketType: "BadGuySmallAimedRocket",
		rocketTimeOut: 100,
		rocketAmount: 15,
		rocketRadius: 100,
		rocketAccelerationMin: 0.8,
		rocketAccelerationMax: 1.2,
		rocketDeploySpeedMin: 1,
		rocketDeploySpeedMax: 1.7,
		speed: 250,
		blastRadius: 15
	});

	TopLevel.container.createTypeConfiguration("End_2_BadGuy", "BadGuy").collisionId("BadGuy").args({
		tProto: End_2_BadGuy.prototype,
		rocketType: ["BadGuySmallAimedRocket", "LastBadGuyLargeHomingRocket", "BadGuyClusterAimedRocket"],
		rocketTimeOut: [100, 200, 150],
		rocketAmount: [15, 5, 8],
		rocketRadius: [100, 100, 100],
		rocketAccelerationMin: [0.8, 0.2, 0.8],
		rocketAccelerationMax: [1.2, 0.3, 1.2],
		rocketDeploySpeedMin: [1, 1, 0.6],
		rocketDeploySpeedMax: [1.7, 1.7, 1.8],
		blastRadius: [15, 15, 15],
		speed: 260
	});

	TopLevel.container.createTypeConfiguration("BadGuySmallAimedRocket", "BadGuyRocket").layer(3).collisionId("Common_Baddy").args({
		tProto: BadGuySmallAimedRocket.prototype
	});
	TopLevel.container.createTypeConfiguration("BadGuyLargeHomingRocket", "BadGuyRocket").layer(3).collisionId("Common_Baddy").args({
		tProto: BadGuyLargeHomingRocket.prototype
	});
	TopLevel.container.createTypeConfiguration("BadGuyClusterAimedRocket", "BadGuyRocket").layer(3).collisionId("Common_Baddy").args({
		tProto: BadGuyClusterAimedRocket.prototype
	});
	TopLevel.container.createTypeConfiguration("LastBadGuyLargeHomingRocket", "BadGuyRocket").layer(3).collisionId("Common_Baddy").args({
		tProto: BadGuyLargeHomingRocket.prototype
	});

	TopLevel.container.createTypeConfiguration("BadGuyArmourPiece_Right", "BadGuyArmourPieceRight").collisionId("Common_Baddy");
	TopLevel.container.createTypeConfiguration("BadGuyArmourPiece_Left", "BadGuyArmourPieceLeft").collisionId("Common_Baddy");

	TopLevel.container.createTypeConfiguration("Splash", "Splash");
	TopLevel.container.createTypeConfiguration("EndingMessage", "EndingMessage");

	TopLevel.container.createTypeConfiguration("FadeToBlack", "FadeToBlack").layer(-2);

	TopLevel.container.createTypeConfiguration("Small_Shot", "Shot").layer(1).collisionId("Shot").args({
		big: false
	});
	TopLevel.container.createTypeConfiguration("Big_Shot", "Shot").layer(1).collisionId("Shot").args({
		big: true
	});
	TopLevel.container.createTypeConfiguration("Clone_Small_Shot", "Shot").layer(1).collisionId("CloneShot").args({
		big: false
	});
	TopLevel.container.createTypeConfiguration("Clone_Big_Shot", "Shot").layer(1).collisionId("CloneShot").args({
		big: true
	});

	TopLevel.container.createTypeConfiguration("Single_Power_Shot_1", "PowerShot").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Single_Power_Shot_2", "PowerShot").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Single_Power_Shot_3", "PowerShot").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Double_Power_Shot_1", "PowerShotSine").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Double_Power_Shot_2", "PowerShotSine").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Double_Power_Shot_3", "PowerShotSine").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Triple_Power_Shot_1", "PowerShotCircle").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Triple_Power_Shot_2", "PowerShotCircle").collisionId("PowerShot");
	TopLevel.container.createTypeConfiguration("Triple_Power_Shot_3", "PowerShotCircle").collisionId("PowerShot");

	TopLevel.container.createTypeConfiguration("SmallSwarmRocket", "SmallSwarmRocket").layer(1).collisionId("Rocket");
	TopLevel.container.createTypeConfiguration("LargeSwarmRocket", "LargeSwarmRocket").layer(1).collisionId("Rocket");
	TopLevel.container.createTypeConfiguration("ClusterSwarmRocket", "ClusterSwarmRocket").layer(1).collisionId("Rocket");

	TopLevel.container.createTypeConfiguration("MicroHomingRocket", "MicroHomingRocket").layer(1).collisionId("Rocket");
	TopLevel.container.createTypeConfiguration("SmallHomingRocket", "SmallHomingRocket").layer(1).collisionId("Rocket");
	TopLevel.container.createTypeConfiguration("LargeHomingRocket", "LargeHomingRocket").layer(1).collisionId("Rocket");

	TopLevel.container.createTypeConfiguration("Debry", "Debry").layer(2).collisionId("Rocket");

	TopLevel.container.createTypeConfiguration("ShotPowerUp", "ShotPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("RocketPowerUp", "RocketPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("WeaponPowerUp", "WeaponPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("HPPowerUp", "HPPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("SpeedPowerUp", "SpeedPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("LivesPowerUp", "LivesPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});
	TopLevel.container.createTypeConfiguration("MultiPowerUp", "MultiPowerUp").collisionId("PowerUp").layer(-2).addCallback("pickUp", this, function() {
		SoundPlayer.playSingle("PowerUp");
	});

	TopLevel.container.createTypeConfiguration("BuyGuyWeaponPowerUp", "WeaponPowerUp").collisionId("BadGuyPowerUp");
	TopLevel.container.createTypeConfiguration("BuyGuyHealthPowerUp", "HPPowerUp").collisionId("BadGuyPowerUp");
	TopLevel.container.createTypeConfiguration("BuyGuySpeedPowerUp", "SpeedPowerUp").collisionId("BadGuyPowerUp");

	TopLevel.container.createTypeConfiguration("CloneShip", "CloneShip").layer(2).collisionId("Common_Baddy");
	TopLevel.container.createTypeConfiguration("CargoShip", "CargoShip").layer(2).collisionId("Common_Baddy");

	TopLevel.container.createTypeConfiguration("Small_EnemyRocket_1", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 7
	});
	TopLevel.container.createTypeConfiguration("Small_EnemyRocket_2", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 8
	});
	TopLevel.container.createTypeConfiguration("Small_EnemyRocket_3", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 9
	});
	TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_1", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 11
	});
	TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_2", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 11
	});
	TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_3", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 12
	});
	TopLevel.container.createTypeConfiguration("Large_EnemyRocket_1", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 14
	});
	TopLevel.container.createTypeConfiguration("Large_EnemyRocket_2", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 14
	});
	TopLevel.container.createTypeConfiguration("Large_EnemyRocket_3", "EnemyRocket").layer(3).collisionId("Common_Baddy").args({
		mainDim: 15
	});

	TopLevel.container.createTypeConfiguration("Fireball", "Fireball").collisionId("Bullet_Baddy");
	TopLevel.container.createTypeConfiguration("MultiShot", "MultiShot").collisionId("Bullet_Baddy");

	TopLevel.container.createTypeConfiguration("Boss_1_A", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});

	TopLevel.container.createTypeConfiguration("Boss_1_B", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_C", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_D", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_E", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_F", "Boss_1").layer(2).collisionId("Boss_1").addMode(ObjectsContainer.UNSHIFT).addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});

	TopLevel.container.createTypeConfiguration("Boss_1_Helper_Beam_1", "Boss_1").collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_1", "Boss_1").collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_2", "Boss_1").collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_1", "Boss_1").collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_2", "Boss_1").collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});

	TopLevel.container.createTypeConfiguration("SubBoss_1", "Boss_1").layer(1).collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("SubBoss_2", "Boss_1").layer(1).collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});
	TopLevel.container.createTypeConfiguration("SubBoss_3", "Boss_1").layer(1).collisionId("Boss_1").addCallback("hit", this, function() {
		SoundPlayer.playSingle("BossHit");
	}).addCallback("laser", this, function() {
		SoundPlayer.playLoop("Laser");
	}).addCallback("stopLaser", this, function() {
		SoundPlayer.stop("Laser");
	});

	TopLevel.container.createTypeConfiguration("BeamCollider", "BeamCollider").collisionId("BeamCollider");
	TopLevel.container.createTypeConfiguration("BeamCollider_PowerBeam", "BeamCollider").collisionId("BeamCollider_PowerBeam");

	//-------------------------------------------------------
	//-------------------------------------------------------
	//GameObjects with non collidable counterparts
	TopLevel.container.createTypeConfiguration("TentacleSegment_Collide", "TentacleSegment").layer(3).collisionId("TentacleSegment").addMode(ObjectsContainer.UNSHIFT);
	TopLevel.container.createTypeConfiguration("HomingTarget", "HomingTarget").collisionId("Target").saveOnReset();
	TopLevel.container.createTypeConfiguration("Explosion_Damage", "Explosion").collisionId("Rocket");

	//GameObjects with collidable counterparts
	TopLevel.container.createTypeConfiguration("TentacleSegment_Show", "TentacleSegment").layer(3).addMode(ObjectsContainer.UNSHIFT);
	TopLevel.container.createTypeConfiguration("Explosion_Effect", "Explosion");
	TopLevel.container.createTypeConfiguration("Target", "Target").saveOnReset();

	//-------------------------------------------------------
	//-------------------------------------------------------
	//Visual Only GameObjects
	TopLevel.container.createTypeConfiguration("Tentacle", "Tentacle").layer(3).addMode(ObjectsContainer.UNSHIFT).args({
		minLength: 4
	});
	TopLevel.container.createTypeConfiguration("WeakTentacle", "Tentacle").layer(3).addMode(ObjectsContainer.UNSHIFT).args({
		minLength: 4
	});
	TopLevel.container.createTypeConfiguration("LongTentacle", "Tentacle").layer(3).addMode(ObjectsContainer.UNSHIFT).args({
		minLength: 4
	});
	TopLevel.container.createTypeConfiguration("BabyTentacle", "Tentacle").layer(1).addMode(ObjectsContainer.UNSHIFT).args({
		minLength: 4
	});

	TopLevel.container.createTypeConfiguration("Star", "Star").layer(4).saveOnReset();
	TopLevel.container.createTypeConfiguration("WhiteFlash", "WhiteFlash");

	TopLevel.container.createTypeConfiguration("Line", "Line");
	TopLevel.container.createTypeConfiguration("PercentageLine", "PercentageLine");

	TopLevel.container.createTypeConfiguration("ExhaustParticle", "ExhaustParticle").layer(1);
	TopLevel.container.createTypeConfiguration("ShotChargeParticle", "ShotChargeParticle");
	TopLevel.container.createTypeConfiguration("BurstParticle", "BurstParticle");
	TopLevel.container.createTypeConfiguration("BurstParticle_Blood", "BurstParticle").layer(3);
	TopLevel.container.createTypeConfiguration("StraightParticle", "StraightParticle");
	TopLevel.container.createTypeConfiguration("BurstParticleRadius", "BurstParticleRadius");
	TopLevel.container.createTypeConfiguration("TractorBeamParticle", "TractorBeamParticle").layer(1);
};