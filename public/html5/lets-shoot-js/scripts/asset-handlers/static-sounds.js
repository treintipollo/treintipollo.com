"use strict";

{
	class Sounds
	{
		constructor()
		{
			
		}
		
		static Init()
		{
			SoundManager.Init();
			
			Sounds.INTRO_BGM 			= SoundManager.Add("assets/IntroBGM.mp3", true);
			Sounds.MAIN_BGM 			= SoundManager.Add("assets/MainBGM.mp3", true);
			Sounds.BOSS_BGM 			= SoundManager.Add("assets/BossBGM.mp3", true);
			Sounds.BIG_BOSS_BGM 		= SoundManager.Add("assets/BigBossBGM.mp3", true);
			Sounds.TEST_BGM 		 	= SoundManager.Add("assets/Test.mp3", true);
			Sounds.FREE_UPGRADE_BGM     = SoundManager.Add("assets/FreeUpgradeBGM.mp3", true);

			Sounds.MISSILE 			 	= SoundManager.Add("assets/Missile.mp3");
			Sounds.EXPLOSION 			= SoundManager.Add("assets/Explosion2.mp3");
			Sounds.SPLASH_BUTTON_OVER 	= SoundManager.Add("assets/SplashButtonOver.mp3");
			Sounds.SPLASH_BUTTON_PRESS  = SoundManager.Add("assets/SplashButtonPress.mp3");
			Sounds.MENU_BUTTON_OVER 	= SoundManager.Add("assets/MenuButtonOver.mp3");
			Sounds.MENU_OFF 			= SoundManager.Add("assets/MenuOff.mp3");
			Sounds.MENU_ON  			= SoundManager.Add("assets/MenuOn.mp3");
			Sounds.CASH 				= SoundManager.Add("assets/Cash.mp3");
			Sounds.NEGATIVE 			= SoundManager.Add("assets/Negative.mp3");
			Sounds.LEVEL_SELECTED 		= SoundManager.Add("assets/LevelSelected.mp3");
			Sounds.ALARM 				= SoundManager.Add("assets/Alarm.mp3");
			Sounds.ROCKET_BLOW 		 	= SoundManager.Add("assets/RocketBlow.mp3");
			Sounds.ROCKET_BLOW2 		= SoundManager.Add("assets/RocketBlow2.mp3");
			Sounds.ROCKET_BLOW3 		= SoundManager.Add("assets/RocketBlow3.mp3");
			Sounds.ROCKET_BLOW4 		= SoundManager.Add("assets/RocketBlow4.mp3");
			Sounds.ROCKET_BLOW5 		= SoundManager.Add("assets/RocketBlow5.mp3");
			Sounds.ROCKET_BLOW6 		= SoundManager.Add("assets/RocketBlow6.mp3");
			Sounds.POP 					= SoundManager.Add("assets/Pop.mp3");
			Sounds.POP_2 				= SoundManager.Add("assets/Pop2.mp3");
			Sounds.POP_3 				= SoundManager.Add("assets/Pop3.mp3");
			Sounds.STOP_LIGHT 			= SoundManager.Add("assets/StopLight.mp3");
			Sounds.RAMM_BADDY 			= SoundManager.Add("assets/RammBaddy.mp3");
			Sounds.BOUNCE_BADDY 		= SoundManager.Add("assets/BounceBaddy.mp3");
			Sounds.EXPLODE_BADDY 		= SoundManager.Add("assets/ExplodeBaddy.mp3");
			Sounds.SNAKE_BADDY 		 	= SoundManager.Add("assets/SnakeBaddy.mp3");
			Sounds.SCREEN_SPAWN_ALARM 	= SoundManager.Add("assets/ScreenSpawnAlarm.mp3");
			Sounds.LIGHT_SABER 		 	= SoundManager.Add("assets/LightSaber.mp3");
			Sounds.REGEN 		 		= SoundManager.Add("assets/Regen.mp3");
			Sounds.SPARK 		 		= SoundManager.Add("assets/Spark.mp3");
			Sounds.SPARK2 		 		= SoundManager.Add("assets/Spark1.mp3");
			Sounds.EXPLOSION2 		 	= SoundManager.Add("assets/Explosion.mp3");
			Sounds.COMPLETE 		 	= SoundManager.Add("assets/Complete.mp3");
			Sounds.LAUGH 		 	 	= SoundManager.Add("assets/Laugh.mp3", false, true);
		}
		
		static Update()
		{
			SoundManager.Update();
		}
	}

	Sounds.MISSILE = -1;
	Sounds.EXPLOSION = -1;
	Sounds.EXPLOSION2 = -1;
	Sounds.SPLASH_BUTTON_OVER = -1;
	Sounds.SPLASH_BUTTON_PRESS = -1;
	Sounds.MENU_BUTTON_OVER = -1;
	Sounds.MENU_OFF = -1;
	Sounds.MENU_ON = -1;
	Sounds.CASH = -1;
	Sounds.NEGATIVE = -1;
	Sounds.LEVEL_SELECTED = -1;
	Sounds.ALARM = -1;
	Sounds.ROCKET_BLOW = -1;
	Sounds.ROCKET_BLOW2 = -1;
	Sounds.ROCKET_BLOW3 = -1;
	Sounds.ROCKET_BLOW4 = -1;
	Sounds.ROCKET_BLOW5 = -1;
	Sounds.ROCKET_BLOW6 = -1;
	Sounds.POP = -1;
	Sounds.POP_2 = -1;
	Sounds.POP_3 = -1;
	Sounds.STOP_LIGHT = -1;
	Sounds.RAMM_BADDY = -1;
	Sounds.BOUNCE_BADDY = -1;
	Sounds.EXPLODE_BADDY = -1;
	Sounds.SNAKE_BADDY = -1;
	Sounds.SCREEN_SPAWN_ALARM = -1;
	Sounds.LIGHT_SABER = -1;
	Sounds.REGEN = -1;
	Sounds.SPARK = -1;
	Sounds.SPARK2 = -1;
	Sounds.COMPLETE = -1;
	Sounds.LAUGH = -1;
	
	Sounds.INTRO_BGM = -1;
	Sounds.MAIN_BGM = -1;
	Sounds.BOSS_BGM = -1;
	Sounds.BIG_BOSS_BGM = -1;
	Sounds.TEST_BGM = -1;
	Sounds.FREE_UPGRADE_BGM = -1;

	window.Sounds = Sounds;
}