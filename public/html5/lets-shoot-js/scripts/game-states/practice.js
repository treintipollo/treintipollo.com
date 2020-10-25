"use strict";

{
	class Practice extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._player = null;
			this._menu = null;
			this._help = null;
			
			this._pause = false;
			this._exitOptionChose = false;
			this._keyDown = false;
			this._stateFinished = false;
			
			this._specificProperties = null;
			this._slots = null;
		}
		
		Init()
		{
			BulletManager.Init(this._stage, 3000, 4);
			BaddyManager.Init(this._stage);
			
			this._player = new MainBody(this._stage);
			this._player.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 30, 1, 0xffffffff, 0xffae00ff);
			
			this._help = new SplashManager(this._stage);
			
			this._help.SetTextProps("Digital-7", 50, 0xff00ff00, 0xbb777777, 10);
			this._help.SetUnderlineProps(0x440000ff, 0xbb0000ff, 2, 5);
			this._help.SetTextMovement(0.05, true, 5, 0.1);
			this._help.AddText(10, 10,  "MOVE:");
			this._help.AddText(10, 70,  "AIM:");
			this._help.AddText(10, 130, "SHOOT:");
			this._help.AddText(10, 190, "BOMB:");
			this._help.AddText(10, 250, "CONTEXT MENU:");
			this._help.AddText(10, 310, "SPAWN TARGETS:");
			
			this._help.SetTextProps("Digital-7", 50, 0xffff0000, 0xbbff0000, 10);
			this._help.SetUnderlineProps(0xbbff0000, 0xbbff0000, 1, 5);
			this._help.SetTextMovement(0.05 , false, 5, 0.3);
			this._help.AddText(120 + 10, 10, ["LEFT ANALOG STICK", "WASD OR ARROW KEYS"]);
			this._help.AddText(85 + 10, 70,  ["RIGTH ANALOG STICK", "MOUSE"]);
			this._help.AddText(145 + 10, 130,["RIGTH ANALOG STICK", "LEFT CLICK"]);
			this._help.AddText(120 + 10, 190,["TOP RIGHT TRIGGER", "SPACE BAR OR RIGHT CLICK"]);
			this._help.AddText(295 + 10, 250,"ESC");
			this._help.AddText(322 + 10, 310,"T");

			this.CreateArrays();
			this.CreateSpecificProps();
			
			this._pause = false;
			this._exitOptionChose = false;
			this._keyDown = false;
			this._stateFinished = false;
		}
		
		Run()
		{
			SoundManager.Play(Sounds.INTRO_BGM);
			
			let currOption;
			
			if (!this._stateFinished)
			{
				// Drawing the help text
				this._help.Update(false, Gamepad.Available() ? 0 : 1);
				
				if (this._player._isAlive)
				{
					if (!this._pause)
					{
						this._player.Update()
						BulletManager.Update();
			      		BaddyManager.Update();
						
						if (!this._keyDown)
						{
							// Pause
							if (Key.isDown(Keyboard.ESCAPE))
							{
								this._keyDown = true;
								this._pause = true;
								
								// Initialization of in game menu.
								this._menu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
								this._menu.SetTitle("OPTIONS", "Digital-7", 50, 0xffffff00);
								this._menu.AddButton("BOMBS", "Digital-7", 30, 0xff0000ff, "MORE TO PRACTICE WITH", 10);
								this._menu.AddButton("START GAME", "Digital-7", 30, 0xff0000ff);
								this._menu.AddButton("TITLE SCREEN", "Digital-7", 30, 0xff0000ff);
								this._menu.Init(true, true, true, true);
							}
							else if (Key.isDown(Keyboard.T))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("main");
							}
							else if (Key.isDown(Keyboard.NUM_1))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("slot-1");
							}
							else if (Key.isDown(Keyboard.NUM_2))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("slot-2");
							}
							else if (Key.isDown(Keyboard.NUM_3))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("slot-3");
							}
							else if (Key.isDown(Keyboard.NUM_4))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("slot-4");
							}
							else if (Key.isDown(Keyboard.NUM_5))
							{
								this._keyDown = true;
								this.SpawnTargetPractice("slot-5");
							}
						}
					}
					else
					{
						currOption = -1;
						
						// Update unless an option was already chosen, hence the menu is no longer in place
						if (this._menu !== null)
							currOption = this._menu.Update(LetsShoot._click);
						
						// Switch between the different Buttons the in-game menu has.
						// "Resume" or case 0 doesn't have any special logic attached to it.
						switch (currOption)
						{
							// Add Some Bombs to player
							case 0:
								this._player.AddBombs(MainBody._bombsMax - MainBody._bombs);
								break;
							// Go to Difficulty Selection
							case 1:
								this._nextState = LetsShoot.DIFFICULTY_SELECT;
								this._exitOptionChose = true;
								break;
							// Go Back to Splash
							case 2:
								this._nextState = LetsShoot.SPLASH_SCREEN;
								this._exitOptionChose = true;
								break;
						}
						
						// If an option was selected start fade out.
						if (currOption !== -1)
							this._menu.StartFadeOut();
						
						// If one of the options that implies getting out of the game was chose,
						// Wait for all baddies to be dead before exiting.
						if (this._exitOptionChose)
						{
							BaddyManager.KillAll();
							BulletManager.Update();
			      			BaddyManager.Update();
							this._player.Update();
						}
						
						// If Escape is pressed again, resume play and start fade out.
						if (!this._keyDown)
						{
							if (Key.isDown(Keyboard.ESCAPE))
							{
								this._keyDown = true;
								
								if (this._menu != null)
									this._menu.StartFadeOut();
							}
						}
						
						// Once the Fade-out of the menu is complete, destroy it.
						// Only if resume was chosen, set this._pause = false.
						if (currOption === -2)
						{
							if (!this._exitOptionChose)
							{
								this._pause = false;
							}
							else
							{
								this._stateFinished = true;
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
					this._player._isAlive = this._player.Update();
					
					// Giving the life back to player since this is practice, and I don't want to fuck up the logic
					if (this._player._isAlive)
						MainBody._lives++;
					
					BaddyManager.KillAll();
					BulletManager.Update();
		      		BaddyManager.Update();
				}
				
				const e = Key.isDown(Keyboard.ESCAPE);
				const t = Key.isDown(Keyboard.T);
				const n1 = Key.isDown(Keyboard.NUM_1);
				const n2 = Key.isDown(Keyboard.NUM_2);
				const n3 = Key.isDown(Keyboard.NUM_3);
				const n4 = Key.isDown(Keyboard.NUM_4);
				const n5 = Key.isDown(Keyboard.NUM_5);

				// Making sure when Escape and the letter T are not pressed
				if(!e && !t && !n1 && !n2 && !n3 && !n4 && !n5)
					this._keyDown = false;
			}
			else
			{
				BulletManager.Update();
			    BaddyManager.Update();
				
				let playerDone = this._player.Die(false);
				let helpDone = this._help.Update(true, Gamepad.Available() ? 0 : 1);
				
				if (playerDone && helpDone)
					this._isCompleted = true;
			}
		}
		
		Completed()
		{
			BulletManager.Clean(true);
			BaddyManager.Clean();
			
			if (this._player !== null)
				this._player.Clean();

			if (this._menu !== null)
				this._menu.Clean()

			if (this._help !== null)
				this._help.Clean();
			
			this._player = null;
			this._menu = null;
			this._help = null;
			this._specificProperties = null;
			this._slots = null;
		}
		
		CleanSpecific()
		{

		}
		
		SpawnTargetPractice(slot)
		{
			let spawnPos = new Point();
			let playerPos = this._player.GetPos();
			let baddy;
			let strenght;
			let x = Grid_Revenge.GetNodeSize().x;
			let y = Grid_Revenge.GetNodeSize().y;
			let width = this._stage.stageWidth - (x * 2);
			let height = this._stage.stageHeight - (y * 2);
			
			SoundManager.Play(Sounds.ALARM);

			const amount = this._slots[slot].amount;
			const baddyType = this._slots[slot].baddyType;
			const baddyStrenght = this._slots[slot].baddyStrenght;
			const generatorBaddyType = this._slots[slot].generatorBaddyType;

			for (let i = 0; i < amount; i++)
			{
				baddy = NumberUtils.randRange(0, baddyType.length - 1, true);
				strenght = NumberUtils.randRange(0, baddyStrenght.length - 1, true);
				
				BaddyManager.SetType(baddyType[baddy]);
	 			BaddyManager.SetStatsByName(baddyStrenght[strenght]);
	 			BaddyManager.SetSpecificParamsAsArray(this._specificProperties[baddyType[baddy]]);
				
	 			if (generatorBaddyType)
	 			{
	 				const genBaddy = NumberUtils.randRange(0, generatorBaddyType.length - 1, true);

	 				BaddyManager.SetGeneratorBaddyType(generatorBaddyType[genBaddy]);
		 			BaddyManager.SetGeneratorBaddyStatsByName(baddyStrenght[strenght]);
		 			BaddyManager.SetGeneratorBaddySpecificParamsAsArray(this._specificProperties[generatorBaddyType[genBaddy]]);
	 			}

				spawnPos = this.CalcSpawnPos(x, y, width, height, playerPos, 200);
				BaddyManager.Add(spawnPos, playerPos);
				BaddyManager.CleanForNextType();
			}
		}
		
		CalcSpawnPos(x, y, maxWidth, maxHeight, avoidPos = null, avoidRadius = 0)
		{
			var res = new Point();
			
			if (avoidPos !== null)
			{
				do
				{
					res.x = NumberUtils.randRange(x, x + maxWidth, true);
					res.y = NumberUtils.randRange(y, y + maxHeight, true);
				}
				while (VectorUtils.inRange(avoidPos, res, avoidRadius));
			}
			else
			{
				res.x = NumberUtils.randRange(x, x + maxWidth, true);
				res.y = NumberUtils.randRange(y, y + maxHeight, true);
			}
			
			return res;
		}
		
		CreateArrays()
		{
			this._slots = {
				"main": {
					baddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					baddyStrenght: ["Weak", "Strong"],
					amount: 30
				},
				"slot-1": {
					baddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					baddyStrenght: ["Fast", "Invinsible"],
					amount: 10
				},
				"slot-2": {
					baddyType: ["BaseGenerator"],
					baddyStrenght: ["Weak", "Strong", "Fast", "Invinsible"],
					generatorBaddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					amount: 3
				},
				"slot-3": {
					baddyType: ["FillGenerator"],
					baddyStrenght: ["Weak", "Strong", "Fast", "Invinsible"],
					generatorBaddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					amount: 3
				},
				"slot-4": {
					baddyType: ["CenterGenerator"],
					baddyStrenght: ["Weak", "Strong", "Fast", "Invinsible"],
					generatorBaddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					amount: 3
				},
				"slot-5": {
					baddyType: ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"],
					baddyStrenght: ["RandomFillColor"],
					amount: 10
				}
			};
		}
		
		CreateSpecificProps()
		{
			this._specificProperties = {};
			
			this._specificProperties["RammingBaddy"] = [new Point(20, 40)];
			this._specificProperties["BouncingBaddy"] = [5, 0.30];
			this._specificProperties["ExplodingBaddy"] = [7, 7];
			this._specificProperties["SnakeBaddy"] = [true];
		}
	}

	window.Practice = Practice;
}