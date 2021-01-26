"use strict";

{
	class MainGame extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._player = null;
			this._level = null;
			
			this._levelEndSign = null;
			this._menu = null;
			
			this._createEndSign = false;
			this._pause = false;
			this._exitOptionChose = false;
			this._keyDown = false;
			this._stateFinished = false;
			this._createContinueFrame = false;
			
			this._loosePhrases = [];
		}
		
		Init()
		{
			BulletManager.Init(this._stage, 3000, 4);
			BaddyManager.Init(this._stage);
			ChainCounter.Init(0, 0, this._stage);
			
			this._player = new MainBody(this._stage);
			this._player.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 30);
			
			this._level = Level.GetInstance();
			this._level.Init(LevelSelect._difficulty, LevelSelect._branch, DifficultySelect._difficulty, this._stage);
			this._level.SetPlayerPos(this._player.GetPos());
			this._level.SetGridNodeSize(Grid_Revenge.GetNodeSize());
			this._level.SetWavesLeftMarker(this._stage.stageWidth / 2, this._stage.stageHeight - 85, "Level Meter", 14, 8, 30, 10);
			
			ChainCounter.SetFrameProps(0xff000000, 0xffff0000, 0xff0000ff, 0xff45D7DD, 5);
			ChainCounter.SetTextProps("Digital-7", 50, 0xff00ff00);
			ChainCounter.Create();
			
			this._loosePhrases = [];
			this._loosePhrases.push("LOL");
			this._loosePhrases.push("I PITY THE FOOL !");
			this._loosePhrases.push("XD");
			this._loosePhrases.push("FAIL");
			this._loosePhrases.push("FAILURE");
			this._loosePhrases.push("USE THE BOMB !");
			this._loosePhrases.push("NOOBA");
			this._loosePhrases.push("OWNED");
			
			this._createEndSign = true;
			this._pause = false;
			this._exitOptionChose = false;
			this._keyDown = false;
			this._stateFinished = false;
			this._createContinueFrame = true;
		}
		
		Run()
		{
			if (LevelSelect._difficulty === 2)
			{
				SoundManager.Play(Sounds.MAIN_BGM_1);
			}
			else if (LevelSelect._difficulty === 1)
			{
				SoundManager.Play(Sounds.MAIN_BGM_2);
			}
			else if (LevelSelect._difficulty === 0)
			{
				SoundManager.Play(Sounds.MAIN_BGM_3);
			}
			
			let _currOption;
			
			ChainCounter.Update();
			
			if (!this._stateFinished)
			{
				if (this._player._isAlive)
				{
					if (!this._pause)
					{
						if (MainBody._lives >= 0)
						{
							if (this._player.Update())
							{
								BulletManager.Update();
								BaddyManager.Update();
								
								// Update level while there are still waves left.
								if (this._level._totalWaveCount < this._level._waveCount)
								{
									this._level.Update(ChainCounter.GetBaddiesDestroyed());
				    			}
				    			else
				    			{
				    				// Updating some stuff of level that still need to.
				    				// Once all waves are spawned, wait till every Baddy is dead.
				    				if (this._level.Update(0, true))
				    				{
					    				if (BaddyManager.AllDead())
					    				{
					    					if (this._level.Update(0, true, true))
					    					{
					    						this._level.ResetLevelMeter();
					    						this._stateFinished = true;
												this._nextState = LetsShoot.STAGE_COMPLETE;
					    					}
					    				}
				    				}
								}
								
								if (this._levelEndSign === null)
								{
									if (!this._keyDown)
									{
										// Pause
										if (Key.isDown(Keyboard.ESCAPE))
										{
											this._keyDown = true;
											this._pause = true;
											
											// Initialization of in game menu.
											this._menu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
											this._menu.SetTitle("PAUSE", "Digital-7", 50, 0xffffff00);
											this._menu.AddButton("RESUME", "Digital-7", 30, 0xff0000ff, null, 10);
											this._menu.AddButton("QUIT", "Digital-7", 30, 0xff0000ff, null, 10);
											this._menu.Init(true, true, true, true);
										}
									}
								}
							}
						}
						else
						{
							if (MainBody._continues > 0)
							{
								if (this._createContinueFrame)
								{
									this._menu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
									this._menu.SetTitle("CONTINUES LEFT:  " + MainBody._continues.toString(), "Digital-7", 50, 0xffffff00);
									this._menu.AddButton("YES", "Digital-7", 30, 0xff0000ff, null, 10);
									this._menu.AddButton("NO", "Digital-7", 30, 0xff0000ff, null, 10);
									this._menu.Init(true, true, false, true);
									
									this._createContinueFrame = false;
								}

								_currOption = -1;
								
								if (this._menu !== null)
								{
									_currOption = this._menu.Update(LetsShoot._click);
								}
								
								switch(_currOption)
								{
									case 0:
										if (MainBody._bombs < MainBody._bombsMax)
										{
											this._player.AddBombs(1);
										}
										break;
									case 1:
										this._nextState = LetsShoot.SPLASH_SCREEN;
										this._exitOptionChose = true;
										break;
								}
								
								if (_currOption !== -1)
								{
									this._menu.StartFadeOut();
								}
								
								if (_currOption === -2)
								{
									if (this._exitOptionChose)
									{
										this._stateFinished = true;
									}
									
									this._exitOptionChose = false;
									this._createContinueFrame = true;
									MainBody._continues--;
									MainBody._lives += 3;
									
									if (this._menu !== null)
									{
										this._menu.Clean();
										this._menu = null;
									}
								}
							}
							else
							{
								// Go to Game Over State
								this._level.ResetLevelMeter();
								this._stateFinished = true;
								this._nextState = LetsShoot.GAME_OVER;
	    					}
						}
					}
					else
					{
						_currOption = -1;
						
						// Update unless an option was already chosen, hence the menu is no longer in place
						if (this._menu !== null)
						{
							_currOption = this._menu.Update(LetsShoot._click);
						}
						
						// Switch between the different Buttons the in-game menu has.
						// "Resume" or case 0 doesn't have any special logic attached to it.
						switch(_currOption)
						{
							// Back to splash screen
							case 1:
								this._nextState = LetsShoot.SPLASH_SCREEN;
								this._exitOptionChose = true;
								break;
						}
						
						// If an option was selected start fade out.
						if (_currOption !== -1)
						{
							this._menu.StartFadeOut();
						}
						
						// If one of the options that implies getting out of the game was chose,
						// Wait for all baddies to be dead before exiting.
						if (this._exitOptionChose)
						{
							BaddyManager.KillAll();
							BulletManager.Update();
							BaddyManager.Update();
							
							this._player.Update();
							
							if (BaddyManager.AllDead())
							{
								this._stateFinished = true;
							}
						}
						
						// If Escape is pressed again, resume play
						if (!this._keyDown)
						{
							if (Key.isDown(Keyboard.ESCAPE))
							{
								this._keyDown = true;
								if (this._menu !== null)
								{
									this._menu.StartFadeOut();
								}
							}
						}
						
						// Once the Fade-out of the menu is complete, destroy it.
						// Only if resume was chosen, set this._pause = false.
						if (_currOption === -2)
						{
							if (!this._exitOptionChose)
							{
								this._pause = false;
							}
							if (this._menu !== null)
							{
								this._menu.Clean();
								this._menu = null;
							}
						}
					}
				}
				else
				{
					// Player Death
					if (this._player.Update())
					{
						BaddyManager.KillAll();
						BulletManager.Update();
						BaddyManager.Update();
						
						if (BaddyManager.AllDead())
						{
							// Go to Game Over State
							if (MainBody._continues <= 0 && MainBody._lives < 0)
							{
								this._level.ResetLevelMeter();
								this._stateFinished = true;
								this._nextState = LetsShoot.GAME_OVER;
							}
							else
							{
								// Create a loose life sign
								if (this._createEndSign)
								{
									let phrase = this._loosePhrases[NumberUtils.randRange(0, this._loosePhrases.length - 1, true)];
									
				    				this._levelEndSign = new LevelEndSign(phrase, "Digital-7", 90, 0xffff0000, this._stage);
				    				this._levelEndSign.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0x77ff0000, 0x77ff7700, 10, 10, 12, 1);
				    				this._createEndSign = false;
				    			}
				    			
				    			// Update the sign until it has completed it's cycle.
		    					if (this._levelEndSign.Update())
								{
									this._createEndSign = true;
									this._player._isAlive = true;
									this._level.ResetWarnings();
									this._levelEndSign.Clean();
									this._levelEndSign = null;
								}
							}
						}
					}
				}
				
				// Making sure when Escape is not pressed
				if (!Key.isDown(Keyboard.ESCAPE))
				{
					this._keyDown = false;
				}
			}
			else
			{
				// Waiting till player is dead if it wasn't already before changing state
				if (this._player !== null)
				{
					this._isCompleted = this._player.Die(false);
				}
				else
				{
					this._isCompleted = true;
				}
			}
		}
		
		Completed()
		{
			SoundManager.Stop(Sounds.MAIN_BGM_1);
			SoundManager.Stop(Sounds.MAIN_BGM_2);
			SoundManager.Stop(Sounds.MAIN_BGM_3);

			BulletManager.Clean(true);
			BaddyManager.Clean();
			ChainCounter.Clean();
			
			if (this._player !== null)
			{
				this._player.Clean();
				this._player = null;
			}
			if (this._level !== null)
			{
				this._level.Clean();
				this._level = null;
			}
			if (this._levelEndSign !== null)
			{
				this._levelEndSign.Clean();
				this._levelEndSign = null;
			}
			
			if (this._menu !== null)
			{
				this._menu.Clean();
				this._menu = null;
			}
			
			this._loosePhrases = null;
		}
		
		CleanSpecific()
		{
		
		}
	}

	window.MainGame = MainGame;
}