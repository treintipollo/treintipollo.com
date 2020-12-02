"use strict";

{
	class FreeUpgrade extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._title = null;
			this._titlePos = null;
			this._titleEndPos = null;
			this._upgradeMenu = null;
			this._menuCreated = false;
			this._upgradeSelected = false;
			this._lastOption = 0;
			this._currentOption = 0;
			this._scrollingOut = false;
			this._rocketLauncher = null;
			this._playerAttributeSetter = null;
			this._playerAttributeGetter = null;
			this._playerAttributeMax = null;
			this._buttonText = null;
		}
		
		Init()
		{
			this._titlePos = new Point(-300, -300);
			this._title = new Text(this._titlePos, "Digital-7", 85, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._title.Update("CONGRATULATIONS !!!", 0xff00ff00, true);
			this._titlePos.x = this._stage.stageWidth + this._title._dimentions.x / 2;
			this._titlePos.y = this._title._dimentions.y / 2 + 10;
			this._titleEndPos = new Point(this._stage.stageWidth / 2, this._title._dimentions.y / 2 + 10);
			
			this._scrollingOut = false;
			this._menuCreated = false;
			this._upgradeSelected = false;
			this._lastOption = -1;
			
			this._rocketLauncher = new RocketLauncher(0, this._stage.stageHeight, this._stage.stageWidth, 0);
			this._rocketLauncher.Init(5, 70, new Point(15, 25), new Point(15, 25));
			
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
		}
		
		Run()
		{
			if (!this._upgradeSelected)
			{
				if (this._upgradeMenu !== null)
				{
					if (this._currentOption === this._upgradeMenu.GetButtonAmount())
					{
						SoundManager.Stop(Sounds.FREE_UPGRADE_BGM);
					}
					else
					{
						SoundManager.Play(Sounds.FREE_UPGRADE_BGM);
					}
				}
				else
				{
					SoundManager.Play(Sounds.FREE_UPGRADE_BGM);
				}
			}
			else
			{
				SoundManager.Stop(Sounds.FREE_UPGRADE_BGM);
			}
			
			if (!this.ScrollText())
			{
				if (!this._menuCreated)
				{
					this._upgradeMenu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2 + this._title._dimentions.y / 2, 0xffff0000, 0xff000000, 10, this._stage);
					this._upgradeMenu.SetTitle("ONE FREE UPGRADE, YAY !", "Digital-7", 40, 0xff00ffff);
					
					for(let i = 0; i < this._buttonText.length; i++)
					{
						if (this._playerAttributeGetter[i]() < this._playerAttributeMax[i])
						{
							this._upgradeMenu.AddButton(this._buttonText[i], "Digital-7", 25, 0xffF4DC1B);
						}
						else
						{
							this._upgradeMenu.AddButton(this._buttonText[i], "Digital-7", 25, 0xffF4DC1B, "MAXED OUT", 10);
						}
					}
					
					this._upgradeMenu.AddButton("EXIT", "Digital-7", 25, 0xffff0000, "???", 10);
					this._upgradeMenu.Init(true, false, false);
					
					this._menuCreated = true;
				}
				
				if (this._upgradeMenu !== null)
				{
					this._currentOption = this._upgradeMenu.Update(LetsShoot._click);
					
					if (this._lastOption === -1)
					{
						if ((this._currentOption > -1) && (this._currentOption !== this._upgradeMenu.GetButtonAmount()))
						{
							if (this._playerAttributeGetter[this._currentOption]() < this._playerAttributeMax[this._currentOption])
							{
								SoundManager.Play(Sounds.CASH);
								this._playerAttributeSetter[this._currentOption]();
								this._upgradeSelected = true;
							}
							else
							{
								SoundManager.Play(Sounds.NEGATIVE);
							}
						}
					}
					
					if ((this._currentOption !== -1 && this._upgradeSelected) || this._currentOption === this._upgradeMenu.GetButtonAmount())
					{
						this._scrollingOut = true;
						this._titleEndPos.x = -this._title._dimentions.x / 2 - 1;
						this._upgradeMenu.StartFadeOut();
					
						if (this._currentOption === this._upgradeMenu.GetButtonAmount())
						{
							MainBody._freeUpgradesPassed++;
						}
					}
					
					this._lastOption = this._currentOption;
				}
			}
			
			this._rocketLauncher.Update();
		}
		
		Completed()
		{
			this._title.Clean();
			this._upgradeMenu.Clean();
			this._rocketLauncher.Clean();
			
			this._title = null;
			this._upgradeMenu = null;
			this._titlePos = null;
			this._titleEndPos = null;
			
			for(let i = 0; i < this._playerAttributeGetter.length; i++)
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
		
		ScrollText()
		{
			let exit;
			
			if (this._scrollingOut)
			{
				exit = this._upgradeMenu.Update(LetsShoot._click);
			}
			
			this._title.Update("CONGRATULATIONS !!!", 0xff00ff00, true);
			
			if (this._titlePos.x > this._titleEndPos.x)
			{
				this._titlePos.x -= 10;
			}
			else
			{
				this._titlePos.x = this._titleEndPos.x;
				
				if (this._scrollingOut)
				{
					if (exit === -2)
					{
						this._isCompleted = true;
						this._nextState = LetsShoot.LEVEL_SELECT;
					}
				}
				
				return false;
			}
			
			return true;
		}
	}

	window.FreeUpgrade = FreeUpgrade;
}