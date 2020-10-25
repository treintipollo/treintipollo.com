"use strict";
{
	let DIFFICULTY = 0;
	let BRANCH = 0;
	
	let INITPARAMS = null;
	let MAXDIF = 0;
	let MAXBRA = 0;

	class LevelSelect
	{
		constructor(x, y, width, height, frameColor, offset, difficultyMax, branchMax, stage)
		{
			this._isScrollOutComplete = false;
			this._isUpgradeSelected = false;
			this._backToSplash = false;
			
			this._frame = null;
			this._rectangle = null;
			this._stage = null;
			this._pos = null;
			this._frameColor = 0;
			this._offSet = 0;
			this._frameEndPos = null;
			this._scrollSpeed = 0;
			this._isScrolling = false;
			this._isLevelSelected = false;
			
			this._currentIndexX = 0;
			this._currentIndexY = 0;
			
			this._title = null;
			this._titleColor = 0;
			this._titleText = "";
			this._titlePos = null;
			this._titleEndPos = null;
			
			this._score = null;
			this._scoreColor = 0;
			this._scoreText = "";
			this._scorePos = null;
			this._scoreEndPos = null;
			
			this._branchMax = 0;
			this._difficultyMax = 0;
			
			this._createMenu = false;
			this._inMenu = false;
			this._contextMenu = null;
			this._keyDown = false;
			this._currentOption = 0;
			
			this._pointer = null;

			this._branchMax = branchMax + 1;
			this._difficultyMax = difficultyMax + 1;
			
			this._pos = new Point(x, y);
			this._width = width;
			this._height = height;
			this._stage = stage;
			this._rectangle = [];
			
			this._frame = new Shape();
			this._cursor = new Shape();
			
			this._frameEndPos = new Point(x - width / 2, y - height / 2);
			
			this._frame.x = -width;
			this._frame.y = y - height / 2;
			
			this._stage.addChild(this._frame);
			this._stage.addChild(this._cursor);
			
			let textPos;
			
			for (let i = 0; i < this._branchMax; i++)
			{
				this._rectangle.push([]);
				
				for (let j = 0; j < this._difficultyMax; j++)
				{
					this._rectangle[i].push(
						new SelectRectangle(j * (width / this._difficultyMax) + offset / 2, i*(height / this._branchMax) + offset / 2, width / this._difficultyMax - offset, height / this._branchMax - offset)
					);
					
					this._rectangle[i][j].SetMiscProps(this._frameEndPos.clone(), new Point(j, i));
					this._rectangle[i][j].SetState(INITPARAMS[i][j]);
					
					textPos = new Point();
					
					textPos.x += this._rectangle[i][j]._rect.x + this._frame.x + (width / this._difficultyMax - offset) / 2;
					textPos.y += this._rectangle[i][j]._rect.y + this._frame.y + (height / this._branchMax - offset) / 2;
					
					let color;

					if (j === 0)
					{
						color = 0xff00ff00;
					}
					else if (j === 1)
					{
						color = 0xffffff00;
					}
					else if (j === 2)
					{
						color = 0xffff0000;
					}
					else
					{
						color = 0xffffffff;
					}
					 
					this._rectangle[i][j].SetText(textPos, "Digital-7", (height / this._branchMax - offset) / 2, color, this._stage);
				}
			}

			this.UnlockLevels();
			this.UnlockSecrets();
			
			textPos = null;
			
			this._frameColor = frameColor;
			this._offSet = offset;
			this._isLevelSelected = false;
			this._isScrolling = true;
			this._isScrollOutComplete = false;
			this._isUpgradeSelected = false;
			this._createMenu = true;
			this._inMenu = false;
			this._keyDown = false;
			this._backToSplash = false;
			
			this.Draw(true, true);

			stage = null;
		}

		static get _difficulty()
		{
			return DIFFICULTY;
		}

		static get _branch()
		{
			return BRANCH;
		}

		static set _difficulty(v)
		{
			DIFFICULTY = v;
		}

		static set _branch(v)
		{
			BRANCH = v;
		}
		
		Init(scrollSpeed)
		{
			this._scrollSpeed = scrollSpeed;
		}
		
		SetTitle(text, font, size, color)
		{
			this._titleColor = color;
			this._titleText = text;
			this._titlePos = new Point(-300, -300);
			
			this._title = new Text(this._titlePos, font, size, this._titleColor, this._stage, true, true, 0xff000000, true, 0xffffffff);
			
			this._title.Update(this._titleText, this._titleColor, true);
			
			this._titlePos.x = this._stage.stageWidth + this._title._dimentions.x / 2;
			this._titlePos.y = this._frame.y - this._title._dimentions.y / 2 - this._offSet;
			
			this._titleEndPos = new Point(this._pos.x, this._frame.y - this._title._dimentions.y / 2 - this._offSet);
		}
		
		SetScore(text, font, size, color)
		{
			this._scoreColor = color;
			this._scoreText = text;
			this._scorePos = new Point(-300, -300);
			
			this._score = new Text(this._scorePos, font, size, this._scoreColor, this._stage, true, true, 0xff000000, true, 0xffffffff);
			
			this._score.Update(this._scoreText, this._scoreColor, true);
			
			this._scorePos.x = this._stage.stageWidth + this._score._dimentions.x / 2;
			this._scorePos.y = this._frame.y + this._frame.height + this._offSet + this._score._dimentions.y / 2;
			
			this._scoreEndPos = new Point(this._pos.x, this._frame.y + this._frame.height + this._offSet + this._score._dimentions.y / 2);
		}
		
		Update()
		{
			if (!this._inMenu)
			{
				if (!this._isScrolling)
				{
					this.AddPointer();
					this._pointer.Update();
					
					this.HandleMouseInput();
				}
				else
				{
					this.ScrollText();
					this.ScrollFrame();
				}
				
				this.Draw(false, true);
				this.DrawText();
			}
			else
			{
				if (this._createMenu)
				{
					this.RemovePointer();
					
					this._contextMenu = new MenuFrame(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0xffff0000, 0xff000000, 10, this._stage);
					this._contextMenu.SetTitle("OPTIONS", "Digital-7", 50, 0xffffff00);
					this._contextMenu.AddButton("BACK", "Digital-7", 30, 0xff0000ff);
					this._contextMenu.AddButton("TITLE SCREEN", "Digital-7", 30, 0xff0000ff, "UNDO ALL PROGRESS", 10);
					this._contextMenu.Init(true, false, true, true);
					
					this._createMenu = false;
				}
				
				this._currentOption = this._contextMenu.Update(LetsShoot._click);
				
				switch(this._currentOption)
				{
					// Back
					case 0:
						break;
					// Title Screen
					case 1:
						this._backToSplash = true;
						break;
				}
				
				if (this._currentOption !== -1)
				{
					this._contextMenu.StartFadeOut();
				}
				
				// If Escape is pressed again, resume play
				if (!this._keyDown)
				{
					if (Key.isDown(Keyboard.ESCAPE))
					{
						this._keyDown = true;
						this._contextMenu.StartFadeOut();
					}
				}
				
				if (this._currentOption === -2)
				{
					this._contextMenu.Clean();
					this._contextMenu = null;
					this._createMenu = true;
					this._inMenu = false;
					this._stage.focus = this._stage;
					
					if (this._backToSplash)
					{
						this._isLevelSelected = true;
						this._isScrolling = true;
					}
					else
					{
						this.AddPointer();
					}
				}
			}
			
			this.HandleKeyBoardInput();
		}
		
		DrawScore()
		{
			this._scorePos.y = this._frame.y + this._frame.height + this._offSet + this._score._dimentions.y / 2;
			this._score.Update(this._scoreText + ChainCounter._globalScore, this._scoreColor, true);
		}
		
		Clean()
		{
			this._stage.removeChild(this._frame);
			this._stage.removeChild(this._cursor);

			this._score.Clean();
			this._title.Clean();
			
			for (let i = 0; i < this._branchMax; i++)
			{
				for (let j = 0; j < this._difficultyMax; j++)
				{
					this._rectangle[i][j].Clean();
				}
			}
			
			this._frame = null;
			this._cursor = null;
			this._score = null;
			this._scorePos = null;
			this._scoreEndPos = null;
			this._title = null;
			this._titlePos = null;
			this._pos = null;
			this._rectangle = null;
			this._stage = null;
			this._frameEndPos = null;
			this._titleEndPos = null;
		}
		
		RemovePointer()
		{
			this._pointer.Clean();
			this._pointer = null;
		}
		
		AddPointer()
		{
			if (!this._pointer)
			{
				this._pointer = new CustomPointer(this._stage);
			}
		}
		
		ClearSecret(currentDifficulty, currentBranch)
		{
			this._rectangle[currentBranch][currentDifficulty].SetState(SelectRectangle.SECRET_COMPLETE);
		}
		
		static SaveInitParams(currentGrid)
		{
			for (let i = 0; i < MAXBRA; i++)
			{
				for (let j = 0; j < MAXDIF; j++)
				{
					INITPARAMS[i][j] = currentGrid[i][j].GetState();
				}
			}
		}
		
		static SetInitParams(difficultyMax, branchMax)
		{
			MAXBRA = branchMax + 1;
			MAXDIF = difficultyMax + 1;
			
			INITPARAMS = [];
			
			for (let i = 0; i < MAXBRA; i++)
			{
				INITPARAMS.push([]);
				for (let j = 0; j < MAXDIF; j++)
				{
					if (i === MAXBRA - 1)
					{
						INITPARAMS[i].push(SelectRectangle.LOCKED_SECRET);
					}
					else if (j === 0)
					{
						INITPARAMS[i].push(SelectRectangle.READY);
					}
					else
					{
						INITPARAMS[i].push(SelectRectangle.LOCK);
					}
				}
			}
		}
		
		static Cleared(currentDifficulty, currentBranch)
		{
			INITPARAMS[currentBranch][currentDifficulty] = SelectRectangle.COMPLETE;
		}
		
		ScrollFrame()
		{
			if (this._frame.x < this._frameEndPos.x)
			{
				this._frame.x += this._scrollSpeed;
			}
			else
			{
				this._frame.x = this._frameEndPos.x;
				
				this._frameEndPos.x = this._stage.stageWidth;
				this._titleEndPos.x = -this._title._dimentions.x / 2 - 1;
				this._scoreEndPos.x = -this._score._dimentions.x / 2 - 1;
				
				if (this._isLevelSelected)
				{
					this._isScrollOutComplete = true;
				}
				
				this._isScrolling = false;
			}
		}
		
		ScrollText()
		{
			if (this._titlePos.x > this._titleEndPos.x)
			{
				this._titlePos.x -= this._scrollSpeed;
			}
			else
			{
				this._titlePos.x = this._titleEndPos.x;
			}
			
			if (this._scorePos.x > this._scoreEndPos.x)
			{
				this._scorePos.x -= this._scrollSpeed;
			}
			else
			{
				this._scorePos.x = this._scoreEndPos.x;
			}
		}
		
		UnlockLevels()
		{
			for (let i = 0; i < this._branchMax; i++)
			{
				for (let j = 0; j < this._difficultyMax; j++)
				{
					if (this._rectangle[i][j].GetState() === SelectRectangle.COMPLETE)
					{
						if (this.isIndexValid(j + 1, i))
						{
							if (this._rectangle[i][j + 1].GetState() === SelectRectangle.LOCK)
							{
								if (j + 1 === this._difficultyMax - 1)
								{
									this._rectangle[i][j + 1].SetState(SelectRectangle.BOSS);
								}
								else
								{
									this._rectangle[i][j + 1].SetState(SelectRectangle.READY);
								}
							}
						}
					}
				}
			}
		}
		
		UnlockSecrets()
		{
			let clearCount;
			
			for (let i = 0; i < this._difficultyMax; i++)
			{
				clearCount = 0;
				
				for (let j = 0; j < this._branchMax - 1; j++)
				{
					if (this._rectangle[j][i].GetState() === SelectRectangle.COMPLETE)
					{
						clearCount++;
					}
				}
				
				if (clearCount >= this._branchMax - 1)
				{
					if (this._rectangle[this._branchMax - 1][i].GetState() === SelectRectangle.LOCKED_SECRET)
					{
						if (i < this._difficultyMax - 1)
						{
							this._rectangle[this._branchMax - 1][i].SetState(SelectRectangle.SECRET);
						}
						else
						{
							this._rectangle[this._branchMax - 1][i].SetState(SelectRectangle.BOSS);
						}
					}
				}
			}
		}
		
		DrawText()
		{
			this._titlePos.y = this._frame.y - this._title._dimentions.y / 2 - this._offSet;
			this._title.Update(this._titleText, this._titleColor, true);
		}
		
		Draw(body, cursor)
		{
			let cursorOnCounter = 0;
			this._cursor.alpha = 0;
			
			if (body)
			{
				this._frame.uncache();
				this._frame.graphics.clear();
				this._frame.graphics.beginFill(this._frameColor);
				this._frame.graphics.rect(0, 0, this._width, this._height);
				this._frame.graphics.endFill();
			}

			for (let i = 0; i < this._branchMax; i++)
			{
				for (let j = 0; j < this._difficultyMax; j++)
				{
					if (this._isScrolling)
					{
						this._rectangle[i][j].Update(this._scrollSpeed);
					}
					else
					{
						this._rectangle[i][j].Update();
					}

					const rect = this._rectangle[i][j]._rect;
					const color = this._rectangle[i][j]._color;

					if (body)
					{
						this._frame.graphics.beginFill(color);
						this._frame.graphics.rect(rect.x, rect.y, rect.width, rect.height);
						this._frame.graphics.endFill();
					}
					
					if (cursor)
					{
						if (this._rectangle[i][j]._cursorOn)
						{
							cursorOnCounter++;
							let currCoord = this._rectangle[i][j].GetCoordinates();
							
							this._currentIndexX = currCoord.x;
							this._currentIndexY = currCoord.y;
							
							if (this._rectangle[i][j].GetState() !== SelectRectangle.LOCK &&
							   this._rectangle[i][j].GetState() !== SelectRectangle.SECRET_COMPLETE &&
							   this._rectangle[i][j].GetState() !== SelectRectangle.COMPLETE &&
							   this._rectangle[i][j].GetState() !== SelectRectangle.LOCKED_SECRET
							   )
							{
								if (!this._isLevelSelected)
								{
									this._rectangle[i][j].UpdateCursor();
								}
								
								this._cursor.alpha = 1;
								this._cursor.uncache();
								this._cursor.graphics.clear();
								this._cursor.graphics.beginFill(this._rectangle[i][j]._cursorColor);

								for (let k = 0; k < 4; k++)
								{
									const rect = this._rectangle[i][j]._cursorMarker[k];
									this._cursor.graphics.rect(rect.x, rect.y, rect.width, rect.height);
								}

								this._cursor.x = rect.x + this._frame.x;
								this._cursor.y = rect.y + this._frame.y;

								this._cursor.graphics.endFill();
								this._cursor.cache(0, 0, rect.width, rect.height);
							}
						}
					}
				}
			}

			if (body)
				this._frame.cache(0, 0, this._width, this._height);
			
			if (cursorOnCounter <= 0)
			{
				this._currentIndexX = -1;
				this._currentIndexY = -1;
			}
		}
		
		HandleMouseInput()
		{
			if (LetsShoot._click)
			{
				if (this._currentIndexX !== -1 && this._currentIndexY !== -1)
				{
					if (this._rectangle[this._currentIndexY][this._currentIndexX].GetState() === SelectRectangle.SECRET)
					{
						this._isUpgradeSelected = true;
						
						DIFFICULTY = this._currentIndexX;
						BRANCH = this._currentIndexY;
					}
					else if (this._rectangle[this._currentIndexY][this._currentIndexX].GetState() !== SelectRectangle.LOCK &&
							this._rectangle[this._currentIndexY][this._currentIndexX].GetState() !== SelectRectangle.SECRET_COMPLETE &&
							this._rectangle[this._currentIndexY][this._currentIndexX].GetState() !== SelectRectangle.COMPLETE &&
							this._rectangle[this._currentIndexY][this._currentIndexX].GetState() !== SelectRectangle.LOCKED_SECRET
					)
					{
						SoundManager.Play(Sounds.LEVEL_SELECTED);
						
						this._isLevelSelected = true;
						this._isScrolling = true;
						
						// Setting static properties so Level can initialize properly after this object is dead.
						DIFFICULTY = this._currentIndexX;
						BRANCH = this._currentIndexY;
						
						// Saving current state of the grid in a static array so the class can initialize in the same state it was when destroyed.
						// Holy Zombie Objects Batman!
						LevelSelect.SaveInitParams(this._rectangle);
						
						// Calling these here, so that they are on par with Draw in method calls.
						this.ScrollText();
						this.ScrollFrame();
						
						// Removing the pointer
						this._pointer.Clean();
						this._pointer = null;
					}
				}
			}
		}
		
		HandleKeyBoardInput()
		{
			if (!this._keyDown)
			{
				// Menu
				if (Key.isDown(Keyboard.ESCAPE))
				{
					this._keyDown = true;
					if (!this._isScrolling)
					{
						this._inMenu = true;
					}
				}
			}
			
			// Making sure when Escape is not pressed
			if (!Key.isDown(Keyboard.ESCAPE))
			{
				this._keyDown = false;
			}
		}
		
		isIndexValid(x, y)
		{
			if (x < 0 || x >= this._difficultyMax)
			{
				return false;
			}
			
			if (y < 0 || y >= this._branchMax)
			{
				return false;
			}
			
			return true;
		}
	}

	window.LevelSelect = LevelSelect;
}