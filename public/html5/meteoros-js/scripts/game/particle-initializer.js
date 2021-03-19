"use strict";

{
	class ParticleInitializer
	{
		static initAllParticles(stage, canvasId, externalGraphicsData = null, ... graphics)
		{
			ParticleSystemManager.Init(stage, document.getElementById(canvasId));
			ParticleSystemInitializationManager.init();
			
			if (externalGraphicsData)
			{
				ParticleSystemManager.SetParticleAssetSizes(externalGraphicsData);
				
				for(let i = 0; i < graphics.length; i++)
				{
					ParticleSystemManager.AddParticleAsset(graphics[i], i);
				}
			}
			
			ParticleSystemManager.AddSystem("BaseRadial"	  , Base_System		, Radial			, 20 	, 50);
			ParticleSystemManager.AddSystem("BaseConstraint"  , Base_System		, ConstrainRadial	, 20 	, 50);
			ParticleSystemManager.AddSystem("MeteorTrail"  	  , CirclePerimeter	, ConstrainRadial	, 300 	, 50);
			ParticleSystemManager.AddSystem("OutRadial"		  , Base_System		, OutRadial			, 50 	, 15);
			ParticleSystemManager.AddSystem("CircleConstrain" , CircleArea 		, ConstrainRadial	, 100	, 15);
			ParticleSystemManager.AddSystem("BaseNuclearBlast", Base_System		, CubicBezier		, 100	, 8 );
			ParticleSystemManager.AddSystem("SquareAxis"	  , SquareArea 		, Axis				, 10 	, 4 );
			ParticleSystemManager.AddSystem("SquareAxis2"	  , SquareArea 		, Axis				, 100	, 4 );
			ParticleSystemManager.AddSystem("SquareVacum"	  , SquareArea 		, Vacum				, 10 	, 6 );
			ParticleSystemManager.AddSystem("BatchRadial"	  , Batch	   		, Radial			, 50 	, 20);
			ParticleSystemManager.AddSystem("BaseVortex"	  , CirclePerimeter , Vortex			, 30 	, 15);
			ParticleSystemManager.AddSystem("StraightRadial"  , StraightLine 	, Radial			, 100 	, 4	);
			
			ParticleSystemInitializationManager.register("MissileExhaust", "BaseConstraint",
				[-666, ParticleSystemManager.FRAME_TIME],
				[20, 20, 0, 0xffff0000, new Point(1, 1), 0.03, 3, -1, 0xff335533, new Point(1,1), 5],
				null,
				[new Point(150, 200), new Point(-90, 90), 1, 0]
			);
			
			ParticleSystemInitializationManager.register("MissileExplosion", "BaseRadial",
				[2, ParticleSystemManager.FRAME_TIME],
				[30, 30, 0, 0xffff7700, new Point(3, 7),0.01, 20, -1, 0xffffff00, new Point(2,2), 10],
				null,
				[new Point(10, 20), 2]
			);

			ParticleSystemInitializationManager.register("MeteorExplosion", "BaseRadial",
				[2, ParticleSystemManager.FRAME_TIME],
				[20, 20, 0, 0xffff0000, new Point(1, 4), 0.01, 20, -1, 0xff777777, new Point(3,3), 10],
				null,
				[new Point(10, 20), 2]
			);

			ParticleSystemInitializationManager.register("MeteorTrail", "MeteorTrail",
				[-666, ParticleSystemManager.FRAME_TIME],
				[20, 20, 0, 0xffff0000, new Point(1,2), 0.01, 3, -1, 0xff777777, new Point(1,1), 3],
				[100, 0, 0],
				[new Point(50, 100), new Point(-90, 90)]
			);

			ParticleSystemInitializationManager.register("DomeCrack", "OutRadial",
				[2, ParticleSystemManager.FRAME_TIME],
				[5, 5, 0, 0xffffffff, new Point(1,1), 0.01, 30, 0, null, null, 3],
				null,
				[new Point(-15, -165), new Point(10, 15), 60, 8]
			);
			
			ParticleSystemInitializationManager.register("MeteorCityHit", "CircleConstrain",
				[2, ParticleSystemManager.FRAME_TIME],
				[30, 30, 0, 0xffff0000, new Point(1, 10), 0.01, 100, -1, 0xff335533, new Point(1,1), 10],
				[10],
				[new Point(1, 400), new Point(-30, 30), 3, -0.06]
			);
			
			ParticleSystemInitializationManager.register("BombHit", "BaseNuclearBlast",
				[0.3, ParticleSystemManager.REAL_TIME],
				[20, 20, 0, 0xff0000ff, new Point(3, 7), 0.01, 10, -1, 0xfffffff7, new Point(1,1), 15],
				null,
				[new Point(0, 0), new Point(0, -50), new Point(-30, 10), new Point(-100, 0), 10, true, true]
			);
			
			ParticleSystemInitializationManager.register("CityDestruction", "BaseNuclearBlast",
				[0.7, ParticleSystemManager.REAL_TIME],
				[20, 20, 0, 0xffffff00, new Point(3, 7), 0.01, 7, -1, 0xffff0000, new Point(10,10), 5],
				null,
				[new Point(-40, -40), new Point(20, -20), new Point(20, -200), new Point(-80, -90), 30, true, false]
			);
			
			ParticleSystemInitializationManager.register("CitySmoke", "SquareAxis",
				[-666, ParticleSystemManager.REAL_TIME],
				[20, 20, 0, 0xff777777, new Point(3, 7), 0.3, 3, -1, 0x00000000, new Point(5,5), 5],
				[45, 5, 0, -35],
				[new Point(-50, -90), true]
			);
			
			ParticleSystemInitializationManager.register("HumanVacum", "SquareVacum",
				[5, ParticleSystemManager.REAL_TIME],
				[20, 20, 0, 0xff777777, new Point(10, 10), 0.3, 3, 1, 0x00000000, new Point(5,5), 5],
				[70, 1, -5, 102],
				[new Point(-50, -90), -8, -2]
			);
			
			ParticleSystemInitializationManager.register("UFODeath", "BatchRadial",
				[-666, ParticleSystemManager.REAL_TIME],
				[20, 20, 0, 0xff777777, new Point(1, 2), 0.08, 10, -1, 0x00fffff7, new Point(3,3), 6],
				[50],
				[new Point(10, 12)]
			);
			
			ParticleSystemInitializationManager.register("LaserChargeUp", "SquareVacum",
				[-666, ParticleSystemManager.REAL_TIME],
				[5, 5, 0, 0xffffffff, new Point(10, 10), 0.05, 1, -1, 0xffff0000, new Point(10,10), 5],
				[80, 1, 0, 50],
				[new Point(-70, -100), 0, 7]
			);
			
			ParticleSystemInitializationManager.register("LaserBlast", "SquareAxis2",
				[2, ParticleSystemManager.FRAME_TIME],
				[20, 20, 0, 0xffff0000, new Point(1, 1), 0.01, 100, -1, 0xfffffff7, new Point(1,1), 5],
				[1, 0, 0, 0],
				[new Point(30, -30), false, 10, 1]
			);
			
			// Boss Particles
			ParticleSystemInitializationManager.register("BossChargeUp", "BaseVortex",
				[-666, ParticleSystemManager.REAL_TIME],
				[15, 15, 0, 0xffffffff, new Point(3, 3), 0.05, 2, -1, 0xffffff77, new Point(1,1), 5],
				[60, 50, 1],
				[new Point(-100, -130), 0, 7]
			);
			
			ParticleSystemInitializationManager.register("BossChargeUp_2", "BaseVortex",
				[-666, ParticleSystemManager.REAL_TIME],
				[10, 10, 0, 0xffff0000, new Point(5, 5), 0.05, 3, -1, 0xff335533, new Point(1,1), 5],
				[80, 20, 1],
				[new Point(-70, -100), 0, 7]
			);
			
			ParticleSystemInitializationManager.register("BossAttack", "BaseRadial",
				[2, ParticleSystemManager.FRAME_TIME],
				[30, 30, 0, 0xffffffff, new Point(2, 5), 0.01, 20, -1, 0xffffff77, new Point(1,1), 20],
				null,
				[new Point(10, 20), 2]
			);
			
			ParticleSystemInitializationManager.register("DeathRay", "StraightRadial",
				[2, ParticleSystemManager.FRAME_TIME],
				[25, 25, 0, 0xffff0000, new Point(3, 7), 0.01, 100, -1, 0xff335533, new Point(1,1), 10],
				[new Point(), new Point(), new Point(-10, 10)],
				[new Point(5, 10)]
			);
		}
	}

	window.ParticleInitializer = ParticleInitializer;
}