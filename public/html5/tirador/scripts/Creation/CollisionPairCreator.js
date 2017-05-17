function CollisionPairCreator() {}

CollisionPairCreator.prototype.create = function() {
	TopLevel.container.addCollisionPair("BadGuy", "BadGuyPowerUp");

	TopLevel.container.addCollisionPair("Ship", "BadGuy");
	TopLevel.container.addCollisionPair("Ship", "PowerUp");
	TopLevel.container.addCollisionPair("Ship", "BeamCollider");
	TopLevel.container.addCollisionPair("Ship", "Common_Baddy");
	TopLevel.container.addCollisionPair("Ship", "Bullet_Baddy");
	TopLevel.container.addCollisionPair("Ship", "Boss_1");
	TopLevel.container.addCollisionPair("Ship", "TentacleSegment");
	TopLevel.container.addCollisionPair("Ship", "CloneShot");

	TopLevel.container.addCollisionPair("Shot", "BadGuy");
	TopLevel.container.addCollisionPair("Shot", "Common_Baddy");
	TopLevel.container.addCollisionPair("Shot", "Boss_1");
	TopLevel.container.addCollisionPair("Shot", "TentacleSegment");

	TopLevel.container.addCollisionPair("BeamCollider_PowerBeam", "BadGuy");
	TopLevel.container.addCollisionPair("BeamCollider_PowerBeam", "Common_Baddy");

	TopLevel.container.addCollisionPair("PowerShot", "BadGuy");
	TopLevel.container.addCollisionPair("PowerShot", "Common_Baddy");
	TopLevel.container.addCollisionPair("PowerShot", "Boss_1");
	TopLevel.container.addCollisionPair("PowerShot", "TentacleSegment");

	TopLevel.container.addCollisionPair("Rocket", "BadGuy");
	TopLevel.container.addCollisionPair("Rocket", "Common_Baddy");
	TopLevel.container.addCollisionPair("Rocket", "Boss_1");
	TopLevel.container.addCollisionPair("Rocket", "TentacleSegment");

	TopLevel.container.addCollisionPair("Target", "BadGuy");
	TopLevel.container.addCollisionPair("Target", "Common_Baddy");
	TopLevel.container.addCollisionPair("Target", "Boss_1");
}