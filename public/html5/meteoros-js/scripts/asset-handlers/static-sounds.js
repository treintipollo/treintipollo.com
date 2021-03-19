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
			
			Sounds.VICTORY_BGM 		= SoundManager.Add("assets/GAMEOVER_VICTORY.wav", true);
			Sounds.MAINGAME_1_BGM 	= SoundManager.Add("assets/MAINGAME_1.wav", true);
			Sounds.MAINGAME_2_BGM 	= SoundManager.Add("assets/MAINGAME_2.wav", true);
			Sounds.MAINGAME_3_BGM 	= SoundManager.Add("assets/MAINGAME_3.wav", true);
			Sounds.MAINGAME_4_BGM 	= SoundManager.Add("assets/MAINGAME_4.wav", true);
			Sounds.SPLASH_BGM 		= SoundManager.Add("assets/SPLASH_GAMEOVER.wav", true);
			Sounds.BOSS_BGM 		= SoundManager.Add("assets/BOSS.wav", true);
			Sounds.NO_SOUND			= -1;

			Sounds.BGM_ORDER = [
				Sounds.SPLASH_BGM,
				Sounds.MAINGAME_1_BGM,
				Sounds.MAINGAME_2_BGM,
				Sounds.MAINGAME_3_BGM,
				Sounds.MAINGAME_4_BGM,
				Sounds.VICTORY_BGM,
				Sounds.BOSS_BGM
			];
		}
		
		static Update()
		{
			SoundManager.Update();
		}
	}

	window.Sounds = Sounds;
}