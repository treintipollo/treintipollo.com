function PoolCreator() {}

PoolCreator.prototype.create = function() {
	//This Pools can not be reduced by means of clever coding, or it is not worth it doing so.
	//-------------------------------------------------------
	TopLevel.container.createTypePool("Ship", Ship, 3);
	TopLevel.container.createTypePool("PowerShip", PowerShip, 1);
	
	TopLevel.container.createTypePool("BadGuy", ConcreteBadGuy, 1);
	TopLevel.container.createTypePool("BadGuyArmourPiece", BadGuyArmourPiece, 2);
	
	TopLevel.container.createTypePool("CloneShip", CloneShip, 10);
	TopLevel.container.createTypePool("CargoShip", CargoShip, 1);


	TopLevel.container.createTypePool("Star", Star, 40);
	TopLevel.container.createTypePool("Shot", Shot, 70);
	TopLevel.container.createTypePool("Target", Target, 6);
	TopLevel.container.createTypePool("HomingTarget", HomingTarget, 6);
	TopLevel.container.createTypePool("Explosion", Explosion, 40);
	TopLevel.container.createTypePool("Debry", Debry, 30);

	TopLevel.container.createTypePool("Boss_1", Boss_1, 4);
	TopLevel.container.createTypePool("Tentacle", Tentacle, 20);
	TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);

	TopLevel.container.createTypePool("EnemyRocket", EnemyRocket, 30);
	TopLevel.container.createTypePool("Fireball", Fireball, 40);
	TopLevel.container.createTypePool("MultiShot", MultiShot, 20);

	TopLevel.container.createTypePool("Line", Line, 3);
	TopLevel.container.createTypePool("PercentageLine", PercentageLine, 66);
	TopLevel.container.createTypePool("Text", ConcreteText, 8);
	TopLevel.container.createTypePool("WhiteFlash", WhiteFlash, 2);

	TopLevel.container.createTypePool("Splash", Splash, 1);

	TopLevel.container.createTypePool("PowerShot", PowerShot, 2);
	TopLevel.container.createTypePool("PowerShotSine", PowerShotSine, 2);
	TopLevel.container.createTypePool("PowerShotCircle", PowerShotCircle, 3);

	//The Pools below could be reduced drastically with a little extra work.
	//---------------------------------------------------------------------
	//Provided all of this is implemented It would reduce pools from 5456 objects in memory to 2533. That's about a 53% memory footprint reduction!
	//A little less since I would have to create additional configuration objects, but still, probably over 50%.

	//This pool can be reduced drastically by implementing line Vs. Circle and line Vs. Polygon colision detection
	//Also, Boss beam would look better as a result, and the code in StraightBeam would be slightly simplified. From 200 objects to maybe 3. That's like a 98%!
	TopLevel.container.createTypePool("BeamCollider", BeamCollider, 200);

	//All the things below can be solved by extending the configurationSystem, to be able to receive an object with initialization arguments.

	//This looks like a place where I can reduce the pool size, significantly. From 120 to 20 Objects. A Wooping 84%!
	//I would need to have a base Rocket, which receives the prototypes for Small, Large and Cluster for drawing aswell as Swarm and Homing for behaviour.
	TopLevel.container.createTypePool("SmallSwarmRocket", SmallSwarmRocket, 20);
	TopLevel.container.createTypePool("LargeSwarmRocket", LargeSwarmRocket, 20);
	TopLevel.container.createTypePool("ClusterSwarmRocket", ClusterSwarmRocket, 20);

	TopLevel.container.createTypePool("SmallHomingRocket", SmallHomingRocket, 20);
	TopLevel.container.createTypePool("LargeHomingRocket", LargeHomingRocket, 20);
	TopLevel.container.createTypePool("ClusterHomingRocket", ClusterHomingRocket, 20);

	TopLevel.container.createTypePool("BadGuyRocket", BadGuyRocket, 15);

	//This pools could definetely be reduced. From 4340 objects to maybe 2500. That's like a 42% decrease!
	//It would take quite a bit of work because all the particle structure is a kind of shaky.
	TopLevel.container.createTypePool("ExhaustParticle", ExhaustParticle, 500);
	TopLevel.container.createTypePool("ShotChargeParticle", ShotChargeParticle, 40);
	TopLevel.container.createTypePool("BurstParticle", BurstParticle, 500);
	TopLevel.container.createTypePool("BurstParticleRadius", BurstParticleRadius, 300);
	TopLevel.container.createTypePool("StraightParticle", StraightParticle, 3000);
	TopLevel.container.createTypePool("TractorBeamParticle", TractorBeamParticle, 300);

	//Small gain, but instead of pooling 10 objects I could pool only five if I used MultiPowerUp for all my powerUp needs.
	TopLevel.container.createTypePool("ShotPowerUp", ShotPowerUp, 1);
	TopLevel.container.createTypePool("RocketPowerUp", RocketPowerUp, 1);
	TopLevel.container.createTypePool("HomingRocketPowerUp", HomingRocketPowerUp, 1);
	TopLevel.container.createTypePool("WeaponPowerUp", WeaponPowerUp, 2);
	TopLevel.container.createTypePool("HPPowerUp", HPPowerUp, 1);
	TopLevel.container.createTypePool("SpeedPowerUp", SpeedPowerUp, 2);
	TopLevel.container.createTypePool("LivesPowerUp", LivesPowerUp, 1);
	TopLevel.container.createTypePool("MultiPowerUp", MultiPowerUp, 2);
};