"use strict";

{
	class AllClear extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._title = null;
			this._titlePos = null;
			this._titleEndPos = null;
			this._score = null;
			this._scorePos = null;
			this._scoreEndPos = null;
			this._currentItemPos = null;
			this._currentItem = null;
			this._currentItemValue = null;
			this._itemAmount = null;
			this._itemString = null;
			this._itemValue = null;
			this._currentItemIndex = null;
			this._currentItemAlpha = null;
			this._totalBonusAlpha = null;
			this._currentItemScore = null;
			this._bonusWait = null;
			this._bonusWaitInit = null;
			this._itemWait = null;
			this._itemWaitInit = null;
			this._currentItemExplode = null;
			this._createExplodingImage = false;
			this._showLastMenu = false;
			this._lastMenu = null;
			this._currentOption = 0;
			this._stateCompleted = false;
		}
		
		Init()
		{
			this._titlePos = new Point(-300, -300);
			this._title = new Text(this._titlePos, "Digital-7", 85, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._title.Update("ALL CLEAR BONUS !!!", 0xff00ff00, true);
	
			this._titlePos.x = this._stage.stageWidth + this._title._dimentions.x / 2;
			this._titlePos.y = this._title._dimentions.y / 2 + 10;
			this._titleEndPos = new Point(this._stage.stageWidth / 2, this._titlePos.y);
			
			this._scorePos = new Point(-300, -300);
			this._score = new Text(this._scorePos, "Digital-7", 70, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._score.Update("FINAL SCORE: " + ChainCounter._globalScore, 0xffff0000, true);
			
			this._scorePos.x = this._stage.stageWidth + this._score._dimentions.x / 2;
			this._scorePos.y = this._stage.stageHeight - this._title._dimentions.y / 2 - 10;
			this._scoreEndPos = new Point(this._stage.stageWidth / 2, this._scorePos.y);
			
			this._currentItemPos = new Point(this._stage.stageWidth / 2, this._titlePos.y + (this._title._dimentions.y * 2));
			this._currentItem = new Text(this._currentItemPos, "Digital-7", 70, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._currentItemValue = new Text(new Point(this._currentItemPos.x, this._currentItemPos.y+150), "Digital-7", 90, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._currentItem.Update("bla", 0xff00ff00, true, false, false);
			this._currentItemValue.Update("bla", 0xff00ff00, true, false, false);
			
			this.CreateArrays();
			
			this._currentItemIndex = 0;
			this._currentItemAlpha = 0;
			this._totalBonusAlpha = 0;
			this._currentItemScore = 0;
			this._currentOption = -1;
			
			this._bonusWait = 50;
			this._itemWait = 50;
			this._bonusWaitInit = this._bonusWait;
			this._itemWaitInit = this._itemWait;
			
			this._createExplodingImage = true;
			this._showLastMenu = false;
			this._stateCompleted = false;
		}
		
		Run()
		{
			SoundManager.Play(Sounds.INTRO_BGM);
			
			let itemString;
			
			this._title.Update("ALL CLEAR BONUS !!!", 0xff00ff00, true);
			this._score.Update("SCORE: " + ChainCounter._globalScore, 0xffff0000, true);
			
			if (!this.ScrollTitle())
			{
				if (!this._showLastMenu)
				{
					if (this._itemString[this._currentItemIndex])
					{
						itemString = this._itemString[this._currentItemIndex] + this._itemAmount[this._currentItemIndex].toString();
						this._currentItem.Update(itemString, 0xff00ff00, true, false, true, this._currentItemAlpha);
					}
					
					this._currentItemValue.Update(this._currentItemScore.toString(), 0xff00ff00, true, false, true, this._totalBonusAlpha);
					
					if (!this.FadeInCurrentItem())
					{
						this.CountBonus();
					}
				}
				else
				{
					if (this.LastMenuUpdate())
					{
						// This will make the title and score scroll out of the screen
						// to the given positions. And when that is done, the state will be completed.
						this._stateCompleted = true;
						this._titleEndPos.x = -this._title._dimentions.x / 2;
						this._scoreEndPos.x = -this._score._dimentions.x / 2;
					}
				}
			}
		}
		
		Completed()
		{
			if (this._title !== null)
			{
				this._title.Clean();
				this._title = null;
			}
			if (this._score !== null)
			{
				this._score.Clean();
				this._score = null;
			}
			if (this._currentItem !== null)
			{
				this._currentItem.Clean();
				this._currentItem = null;
			}
			if (this._currentItemValue !== null)
			{
				this._currentItemValue.Clean();
				this._currentItemValue = null;
			}
			
			this._itemAmount = null;
			this._itemString = null;
			this._itemValue = null;
			
			this._titlePos = null;
			this._titleEndPos = null;
			this._scorePos = null;
			this._scoreEndPos = null;
			this._currentItemPos = null;
			
			if (this._currentItemExplode !== null)
			{
				this._currentItemExplode.Clean();
				this._currentItemExplode = null;
			}
			
			if (this._lastMenu !== null)
			{
				this._lastMenu.Clean();
				this._lastMenu = null;
			}
		}
		
		CleanSpecific()
		{
		}
		
		ScrollTitle()
		{	
			let completed = 0;
				
			if (this._titlePos.x > this._titleEndPos.x)
			{
				this._titlePos.x -= 10;
			}
			else
			{
				this._titlePos.x = this._titleEndPos.x;
				completed++;
			}
			
			if (this._scorePos.x > this._scoreEndPos.x)
			{
				this._scorePos.x -= 10;
			}
			else
			{
				this._scorePos.x = this._scoreEndPos.x;
				completed++;
			}
			
			if (completed < 2)
			{
				return true;
			}
			else
			{
				if (this._stateCompleted)
				{
					this._isCompleted = true;
				}
			}
			
			return false;
		}
		
		FadeInCurrentItem()
		{
			if (this._currentItemAlpha < 1)
			{
				this._currentItemAlpha += 0.05;
				
				if (this._totalBonusAlpha < 1)
				{
					this._totalBonusAlpha += 0.5;
				}
				
				return true;
			}
			else
			{
				this._currentItemAlpha = 1;
			}
			
			return false;
		}
		
		CountBonus()
		{
			// Add all the Bonus to a sub total
			if (this._currentItemIndex < this._itemAmount.length)
			{
				if (this._itemAmount[this._currentItemIndex] > 0)
				{
					if (this._bonusWait > 0)
					{
						this._bonusWait--;
					}
					else
					{
						if (this._itemWait > 0)
						{
							this._itemWait--;
						}
						else
						{
							this._itemAmount[this._currentItemIndex]--;
							this._currentItemScore += this._itemValue[this._currentItemIndex];
							SoundManager.Play(Sounds.CASH);
							
							this._itemWait = this._itemWaitInit;
						}
					}
				}
				else
				{
					if (this._itemWait > 0)
					{
						this._itemWait--;
					}
					else
					{
						if (this._createExplodingImage)
						{
							this._currentItemExplode = new SplashImage(this._GetCurrentItemBitmap(this._currentItem), this._stage);
							this._currentItemExplode.Init(this._currentItem.GetTextField().x, this._currentItem.GetTextField().y, 1, 5, 1, 20, 10);
							
							this._createExplodingImage = false;
							SoundManager.Play(Sounds.SPLASH_BUTTON_PRESS);
						}

						this._currentItem.Update("blabla", 0xff00ff00, true, false, false);
						
						if (this._currentItemExplode.Update(true))
						{
							this.BonusCountReset();
						}
					}
				}
			}
			else
			{
				// Adds the previous subtotal to the total score
				if (this._itemWait > 0)
				{
					this._itemWait--;
				}
				else
				{
					if (this._createExplodingImage)
					{
						this._currentItemExplode = new SplashImage(this._GetCurrentItemBitmap(this._currentItemValue), this._stage);
						this._currentItemExplode.Init(this._currentItemValue.GetTextField().x, this._currentItemValue.GetTextField().y, 1, 5, 1, 20, 10);
						
						this._createExplodingImage = false;
						
						ChainCounter._globalScore += this._currentItemScore;
						SoundManager.Play(Sounds.CASH);
					}
					this._currentItemValue.Update("blabla", 0xff00ff00, true, false, false);
					
					if (this._currentItemExplode.Update(true))
					{
						this.BonusCountReset();
						
						this._showLastMenu = true;

						// By now I don't give a shit about order, and this class does't deserve it either
						// It's just for this game.
						this._lastMenu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
						this._lastMenu.SetTitle("OPTIONS", "Digital-7", 50, 0xffffff00);
						this._lastMenu.AddButton("SUBMIT SCORE", "Digital-7", 30, 0xff0000ff);
						// this._lastMenu.AddButton("EPILOGUE", "Digital-7", 30, 0xff0000ff, "COMING SOON", 10);
						this._lastMenu.Init(true, false, false);
					}
				}
			}
		}
		
		_GetCurrentItemBitmap(textObject)
		{
			const x = textObject.GetX();
			const y = textObject.GetY();
			const width = textObject.GetWidth();
			const height = textObject.GetHeight();
			
			const canvas = new OffscreenCanvas(textObject.GetWidth(), textObject.GetHeight());
			const context = canvas.getContext("2d");
			
			context.save();
			context.translate(-x, 0);
			textObject.GetDisplayObject().draw(context, true);
			context.restore();

			return new Bitmap(canvas);
		}

		LastMenuUpdate()
		{
			this._currentOption = -1;
			
			// Update unless an option was already chosen, hence the menu is no longer in place
			if (this._lastMenu !== null)
			{
				this._currentOption = this._lastMenu.Update(LetsShoot._click);
			}
			
			// Switch between the different Buttons the in-game menu has.
			// "Resume" or case 0 doesn't have any special logic attached to it.
			switch (this._currentOption)
			{
				// Title Screen
				case 0:
					this._nextState = LetsShoot.SPLASH_SCREEN;
					break;
			}
			
			// If an option was selected start fade out.
			if (this._currentOption !== -1)
			{
				this._lastMenu.StartFadeOut();
			}
		
			// Once the Fade-out of the menu is complete, destroy it.
			if (this._currentOption === -2)
			{
				if (this._lastMenu !== null)
				{
					this._lastMenu.Clean();
					this._lastMenu = null;
					
					return true;
				}
			}
			
			return false;
		}
		
		BonusCountReset()
		{
			this._currentItemIndex++;
			this._bonusWait = this._bonusWaitInit;
			this._itemWait = this._itemWaitInit;
			this._currentItemAlpha = 0;
			this._createExplodingImage = true;
			
			this._currentItemExplode.Clean();
			this._currentItemExplode = null;
		}
		
		CreateArrays()
		{
			this._itemString = [];
			this._itemAmount = [];
			this._itemValue = [];
			
			this._itemString.push("BOMBS:  ");
			this._itemString.push("LIVES:  ");
			this._itemString.push("CONTINUES:  ");
			this._itemString.push(DifficultySelect._difficulty + "  CLEAR:  ");
			this._itemString.push("NO FREEBIES:  ");
			
			this._itemAmount.push(MainBody._bombs);
			this._itemAmount.push(MainBody._lives);
			this._itemAmount.push(MainBody._continues);
			this._itemAmount.push(1);
			this._itemAmount.push(MainBody._freeUpgradesPassed);
			
			this._itemValue.push(3000000);
			this._itemValue.push(10000000);
			this._itemValue.push(25000000);
			
			switch (DifficultySelect._difficulty)
			{
				case DifficultySelect.EASY:
					this._itemValue.push(50000000);
					break;
				case DifficultySelect.NORMAL:
					this._itemValue.push(100000000);
					break;
				case DifficultySelect.HARD:
					this._itemValue.push(150000000);
					break;
			}

			this._itemValue.push(7000000);
		}
	}

	window.AllClear = AllClear;
}