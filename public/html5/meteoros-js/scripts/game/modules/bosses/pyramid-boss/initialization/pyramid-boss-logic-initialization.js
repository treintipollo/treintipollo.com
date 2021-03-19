"use strict";

{
	class PyramidBossLogicInitialization extends UfoBaseInitialization
	{
		constructor(hp, moves, moveWaitTime, speed, attackWaitTime, heightLimit, actorManager)
		{
			super(hp, moves, moveWaitTime, speed, attackWaitTime, heightLimit, actorManager);

			this._hitsBeforeDamage 			= 0;
			this._damageTime 				= 0;
			this._nextMeteorTime 			= 0;
			this._meteorCount 				= 0;
			this._meteorIds 				= null;
			this._meteorProbabilities 		= null;
			this._laserAmounts 				= null;
			this._laserAmountProbabilities 	= null;
			this._bombCount 				= 0;
			this._initSyatemRadius_1 		= 0;
			this._stopSyatemRadius_1 		= 0;
			this._particleSpeedRange_1 		= null;
			this._initSyatemRadius_2 		= 0;
			this._stopSyatemRadius_2 		= 0;
			this._particleSpeedRange_2 		= null;
		}
		
		ownParameters(hitsBeforeDamage, damageTime)
		{
			this._hitsBeforeDamage = hitsBeforeDamage;
			this._damageTime 	   = damageTime;
		}
		
		attackParameters(meteorBatchCount, meteorIds, meteorProbabilities, nextMeteorTime, laserAmounts, laserAmountProbabilities, bombBatchCount)
		{
			this._nextMeteorTime  	  = nextMeteorTime;
			this._meteorCount 		  = meteorBatchCount;
			this._meteorIds 		  = meteorIds;
			this._meteorProbabilities = meteorProbabilities;
			
			this._laserAmounts 			   = laserAmounts;
			this._laserAmountProbabilities = laserAmountProbabilities;
			
			this._bombCount = bombBatchCount;
		}
		
		attackParticlesParameters1(initRadius, stopRadius, particleSpeedRange)
		{
			this._initSyatemRadius_1   = initRadius;
			this._stopSyatemRadius_1   = stopRadius;
			this._particleSpeedRange_1 = particleSpeedRange;
		}
		
		attackParticlesParameters2(initRadius, stopRadius, particleSpeedRange)
		{
			this._initSyatemRadius_2   = initRadius;
			this._stopSyatemRadius_2   = stopRadius;
			this._particleSpeedRange_2 = particleSpeedRange;
		}
		
		destroy()
		{
			super.destroy();
			
			this._meteorIds 			   = null;
			this._meteorProbabilities 	   = null;
			this._laserAmounts 			   = null;
			this._laserAmountProbabilities = null;
			this._particleSpeedRange_1 	   = null;
			this._particleSpeedRange_2 	   = null;
		}
	}

	window.PyramidBossLogicInitialization = PyramidBossLogicInitialization;
}