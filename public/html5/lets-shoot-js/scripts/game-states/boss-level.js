"use strict";

{
	class BossLevel extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._bossParameters = null;
			this._player = null;
			this._levelEndSign = null;
			this._menu = null;
			
			this._createEndSign = false;
			this._pause = false;
			this._exitOptionChose = false;
			this._keyDown = false;
			this._stateFinished = false;
			this._createContinueFrame = false;
			
			this._loosePhrases = null;
			this._bossHP = null;
		}
		
		Init()
		{
			BulletManager.Init(this._stage, 3000, 4);
			BaddyManager.Init(this._stage);
			
			this._player = new MainBody(this._stage);
			this._player.Init(Grid_Revenge.GetNodeSize().x, this._stage.stageHeight - Grid_Revenge.GetNodeSize().y, 30, 1, 0xffffffff, 0xffae00ff, true);
			
			this.SetBossHealth();
			// This adds the Boss to the Manager and gives it different stats according to it's branch.
			// It's just a big and ugly switch.
			this.AddBoss(LevelSelect._branch);
			
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
			let currOption;
			
			if (!this._stateFinished)
			{
				if (this._player._isAlive)
				{
					if (!this._pause)
					{
						if (MainBody._lives >= 0)
						{
							BulletManager.Update();
				      		BaddyManager.Update();
				      		this._player.Update();
							
		    				if (BaddyManager.AllDead())
		    				{
		    					// For all clear bonus, this is the time when the game finishes
		    					if (LevelSelect._branch === 4)
		    						MainBody._endTime = Date.now();

		    					this._nextState = LetsShoot.STAGE_COMPLETE;
		    					this._stateFinished = true;
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

								currOption = -1;
								
								if (this._menu !== null)
								{
									currOption = this._menu.Update(LetsShoot._click);
								}
								
								switch(currOption)
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
								
								if (currOption !== -1)
								{
									this._menu.StartFadeOut();
								}
								
								if (this._exitOptionChose)
								{
									BaddyManager.KillAll();
									BulletManager.Update();
					      			BaddyManager.Update();
								}
								
								if (this._menu === null)
								{
									if (BaddyManager.AllDead())
									{
										this._stateFinished = true;
										
										this._exitOptionChose = false;
										this._createContinueFrame = true;
										MainBody._continues--;
										MainBody._lives += 3;
									}
								}
								
								if (currOption === -2)
								{
									if (!this._exitOptionChose)
									{
										this._exitOptionChose = false;
										this._createContinueFrame = true;
										MainBody._continues--;
										MainBody._lives += 3;
									}
									
									if (this._menu !== null)
									{
										this._menu.Clean();
										this._menu = null;
									}
								}
							}
							else
							{
								BulletManager.Update();
					      		BaddyManager.Update();
								BaddyManager.KillAll();
								
								if (BaddyManager.AllDead())
								{
									this._stateFinished = true;
									this._nextState = LetsShoot.GAME_OVER;
								}
	    					}
						}
					}
					else
					{
						currOption = -1;
						
						// Update unless an option was already chosen, hence the menu is no longer in place
						if (this._menu !== null)
						{
							currOption = this._menu.Update(LetsShoot._click);
						}

						// Switch between the different Buttons the in-game menu has.
						// "Resume" or case 0 doesn't have any special logic attached to it.
						switch(currOption)
						{
							// Back to splash screen
							case 1:
								this._nextState = LetsShoot.SPLASH_SCREEN;
								this._exitOptionChose = true;
								break;
						}
						
						// If an option was selected start fade out.
						if (currOption !== -1)
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
						
						// If Escape is pressed again, resume play and start fade out.
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
						// Only if resume was chosen, set _pause = false.
						if (currOption === -2)
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
					BaddyManager.KillAll("AttackBitBaddy", "BombBitBaddy", "BossBaddy");
					BulletManager.Update();
		      		BaddyManager.Update();
		      		
		      		if (this._player.Update())
		      		{
		      			// This should have the system landing in the Game Over state
		      			if (MainBody._continues <= 0 && MainBody._lives < 0)
		      			{
		      				this._player._isAlive = true;
		      			}
		      			else
		      			{
		      				// Create loose life sign
			      			if (this._createEndSign)
			      			{
			      				let phrase = this._loosePhrases[NumberUtils.randRange(0, this._loosePhrases.length-1, true)];
			      				
			    				this._levelEndSign = new LevelEndSign(phrase, "Digital-7", 90, 0xffff0000, this._stage);
			    				this._levelEndSign.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0x77ff0000, 0x77ff7700, 10, 10, 12, 1);
			    				this._createEndSign = false;
			    			}
			    			
			    			// Update the sign until it has completed it's cycle.
							if (this._levelEndSign.Update())
							{
								this._createEndSign = true;
								this._player._isAlive = true;
								this._levelEndSign.Clean();
								this._levelEndSign = null;
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
			SoundManager.StopAll(true, false);
			
			BulletManager.Clean(true);
			BaddyManager.Clean();
			
			if (this._player !== null)
			{
				this._player.Clean();
				this._player = null;
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
		
		SetBossHealth()
		{
			this._bossHP = new Array();
			
			switch (DifficultySelect._difficulty)
			{
				case DifficultySelect.EASY:
					this._bossHP.push(250000); // ramm boss, bounce boss, explode boss
					this._bossHP.push(400000); // snake boss
					this._bossHP.push(700000); // big boss
					break;
				case DifficultySelect.NORMAL:
					this._bossHP.push(300000); // ramm boss, bounce boss, explode boss
					this._bossHP.push(500000); // snake boss
					this._bossHP.push(1000000); // big boss
					break;
				case DifficultySelect.HARD:
					this._bossHP.push(450000); // ramm boss, bounce boss, explode boss
					this._bossHP.push(650000); // snake boss
					this._bossHP.push(1200000); // big boss
					break;
			}
		}
		
		AddBoss(branch)
		{
			this._bossParameters = new BaddyParameters();
			
			this._bossParameters.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 200);
			this._bossParameters.SetOptions(true, true);
			this._bossParameters.SetSound(true, Sounds.EXPLOSION2);
			
			switch (branch)
			{
				// Ramm Boss
				case 0:
					this._bossParameters.SetDrawParameters(3, 0xffffffff, 0xff000000);
					this._bossParameters.SetUpdateParameters(8, 2, 70, this._bossHP[0]);
					break;
				// Bounce Boss
				case 1:
					this._bossParameters.SetDrawParameters(3, 0xffffffff, 0xff000000);
					this._bossParameters.SetUpdateParameters(12, 2, 70, this._bossHP[0]);
					break;
				// Explode Boss
				case 2:
					this._bossParameters.SetDrawParameters(3, 0xffffffff, 0xff000000);
					this._bossParameters.SetUpdateParameters(12, 2, 70, this._bossHP[0]);
					break;
				// Snake Boss
				case 3:
					this._bossParameters.SetDrawParameters(3, 0xffffffff, 0xff000000);
					this._bossParameters.SetUpdateParameters(12, 2, 70, this._bossHP[1]);
					break;
				// Big Boss
				case 4:
					this._bossParameters.SetDrawParameters(3, 0xffffffff, 0xffffffff);
					this._bossParameters.SetUpdateParameters(12, 2, 70, this._bossHP[2]);
					break;
			}
			
			BaddyManager.SetType("BossBaddy");
			BaddyManager.SetStatsByClass(this._bossParameters, "Boss");
			BaddyManager.SetSpecificParams(branch, new Point(200, 400), new Point(300, 400), 2, 6, new Point(300, 400), 200);
			
	 		BaddyManager.Add(new Point(this._stage.stageWidth - Grid_Revenge.GetNodeSize().x, Grid_Revenge.GetNodeSize().y), this._player.GetPos());
	 		BaddyManager.CleanForNextType();
		}
	}

	window.BossLevel = BossLevel;
}