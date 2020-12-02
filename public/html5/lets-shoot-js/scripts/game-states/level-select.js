"use strict";

{
	class LevelSelection extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._levelSelect = null;
			this._upgradeMenu = null;
			this._menuCreated = false;
			
			this._upgradeCost = null;
			this._lastOption = 0;
			this._currentOption = 0;
			
			this._playerAttributeSetter = null;
			this._playerAttributeGetter = null;
			this._playerAttributeMax = null;
			this._buttonText = null;
		}

		Init()
		{
			this._levelSelect = new LevelSelect(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 600, 400, 0xff999999, 10, 3, 4, this._stage);
			this._levelSelect.Init(10);
			this._levelSelect.SetTitle("LEVEL SELECT", "Digital-7", 70, 0xff00ff00);
			this._levelSelect.SetScore("SCORE: ", "Digital-7", 70, 0xff00ff00);

			this._upgradeCost = [];
			
			switch (DifficultySelect._difficulty)
			{
				case DifficultySelect.EASY:
					this._upgradeCost.push(800000); //Power-Up
					this._upgradeCost.push(400000); //Range-Up
					this._upgradeCost.push(400000); //Speed-Up
					this._upgradeCost.push(250000); //Bomb-Up
					this._upgradeCost.push(1000000); //Continue
					this._upgradeCost.push(700000); //Firerate-Up
					this._upgradeCost.push(700000); //Bullet Damage-Up
					break;
				case DifficultySelect.NORMAL:
					this._upgradeCost.push(4000000);
					this._upgradeCost.push(1000000);
					this._upgradeCost.push(1000000);
					this._upgradeCost.push(500000);
					this._upgradeCost.push(5500000);
					this._upgradeCost.push(1100000);
					this._upgradeCost.push(1100000);
					break;
				case DifficultySelect.HARD:
					this._upgradeCost.push(5500000);
					this._upgradeCost.push(2000000);
					this._upgradeCost.push(2000000);
					this._upgradeCost.push(1000000);
					this._upgradeCost.push(6500000);
					this._upgradeCost.push(2000000);
					this._upgradeCost.push(2000000);
					break;
			}
			
			this._playerAttributeSetter = [];
			this._playerAttributeSetter.push(MainBody.SetAttackBit);
			this._playerAttributeSetter.push(MainBody.SetRange);
			this._playerAttributeSetter.push(MainBody.SetSpeed);
			this._playerAttributeSetter.push(MainBody.SetBomb);
			this._playerAttributeSetter.push(MainBody.SetContinue);
			this._playerAttributeSetter.push(MainBody.SetFirerate);
			this._playerAttributeSetter.push(MainBody.SetBulletDamage);
			
			this._playerAttributeGetter = [];
			this._playerAttributeGetter.push(MainBody.GetAttackBit);
			this._playerAttributeGetter.push(MainBody.GetRange);
			this._playerAttributeGetter.push(MainBody.GetSpeed);
			this._playerAttributeGetter.push(MainBody.GetBomb);
			this._playerAttributeGetter.push(MainBody.GetContinue);
			this._playerAttributeGetter.push(MainBody.GetFirerate);
			this._playerAttributeGetter.push(MainBody.GetBulletDamage);
			
			this._playerAttributeMax = [];
			this._playerAttributeMax.push(MainBody._attackBitMax);
			this._playerAttributeMax.push(MainBody._rangeMax);
			this._playerAttributeMax.push(MainBody._speedMax);
			this._playerAttributeMax.push(MainBody._bombsMax);
			this._playerAttributeMax.push(MainBody._continuesMax);
			this._playerAttributeMax.push(MainBody._fireRateMax);
			this._playerAttributeMax.push(MainBody._bulletDamageMax);
			
			this._buttonText = [];
			this._buttonText.push("MORE BULLETS");
			this._buttonText.push("MORE RANGE");
			this._buttonText.push("MORE SPEED");
			this._buttonText.push("EXTRA BOMB");
			this._buttonText.push("EXTRA CONTINUE");
			this._buttonText.push("INCREASE FIRE RATE");
			this._buttonText.push("EXTRA BULLET DAMAGE");
			
			this._menuCreated = false;
			this._lastOption = -1;
		}
		
		Run()
		{
			SoundManager.Play(Sounds.INTRO_BGM);
			
			if (!this._levelSelect._isUpgradeSelected)
			{
				this._levelSelect.Update();
				
				if (this._levelSelect._isScrollOutComplete)
				{
					this._isCompleted = true;
					
					if (this._levelSelect._backToSplash)
					{
						this._nextState = LetsShoot.SPLASH_SCREEN;
					}
					else
					{
						this._nextState = LetsShoot.LEVEL_INTRO;
					}
				}
			}
			else
			{
				if (!this._menuCreated)
				{
					this._upgradeMenu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
					this._upgradeMenu.SetTitle("BUY UPGRADES", "Digital-7", 40, 0xff00ffff);
					
					for (let i = 0; i < this._buttonText.length; i++)
					{
						if (this._playerAttributeGetter[i]() < this._playerAttributeMax[i])
						{
							this._upgradeMenu.AddButton(this._buttonText[i], "Digital-7", 25, 0xffF4DC1B, "COST: " + this._upgradeCost[i].toString(), 10);
						}
						else
						{
							this._upgradeMenu.AddButton(this._buttonText[i], "Digital-7", 25, 0xffF4DC1B, "MAXED OUT", 10);
						}
					}
					
					this._upgradeMenu.AddButton("EXIT", "Digital-7", 25, 0xffff0000);
					this._upgradeMenu.Init(true, true, false);
					
					this._levelSelect.RemovePointer();
					this._menuCreated = true;
				}
				
				this._currentOption = this._upgradeMenu.Update(LetsShoot._click);
			
				if (this._lastOption === -1)
				{
					if ((this._currentOption > -1) && (this._currentOption != this._upgradeMenu.GetButtonAmount()))
					{
						if (this._playerAttributeGetter[this._currentOption]() < this._playerAttributeMax[this._currentOption])
						{
							if (ChainCounter._globalScore > this._upgradeCost[this._currentOption])
							{
								this._levelSelect.ClearSecret(LevelSelect._difficulty, LevelSelect._branch);
								
								SoundManager.Play(Sounds.CASH);
								
								this._playerAttributeSetter[this._currentOption]();
								
								ChainCounter._globalScore -= this._upgradeCost[this._currentOption];
							}
							else
							{
								SoundManager.Play(Sounds.NEGATIVE);
							}
						}
						else
						{
							SoundManager.Play(Sounds.NEGATIVE);
						}
					}
				}
				
				for (let i = 0; i < this._upgradeCost.length; i++)
				{
					if (ChainCounter._globalScore < this._upgradeCost[i])
					{
						this._upgradeMenu.UpdateButtonTooltip(i, "NOT ENOUGH SCORE");
					}
					
					if (this._playerAttributeGetter[i]() >= this._playerAttributeMax[i])
					{
						this._upgradeMenu.UpdateButtonTooltip(i, "MAXED OUT");
					}
				}
				
				if (this._currentOption === this._upgradeMenu.GetButtonAmount())
				{
					this._upgradeMenu.StartFadeOut();
				}
				
				if (this._currentOption === -2)
				{
					this._levelSelect.AddPointer();
					
					this._levelSelect._isUpgradeSelected = false;
					this._menuCreated = false;
					this._upgradeMenu.Clean();
					this._upgradeMenu = null;
				}
				
				this._lastOption = this._currentOption;
			}
			
			this._levelSelect.DrawScore();
		}
		
		Completed()
		{
			this._levelSelect.Clean();
			this._levelSelect = null;
			
			if (this._upgradeMenu != null)
			{
				this._upgradeMenu.Clean();
				this._upgradeMenu = null;
			}
			
			for (let i = 0; i < this._playerAttributeGetter.length; i++)
			{
				this._playerAttributeSetter[i] = null;
				this._playerAttributeGetter[i] = null;
				this._playerAttributeMax[i] = null;
				this._buttonText[i] = null;
			}
			
			this._playerAttributeSetter = null;
			this._playerAttributeGetter = null;
			this._playerAttributeMax = null;
			this._buttonText = null;
		}
		
		CleanSpecific()
		{
		
		}
	}

	window.LevelSelection = LevelSelection;
}