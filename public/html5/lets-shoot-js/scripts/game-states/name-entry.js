"use strict";

{

	const CHARS = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"$%^&*()-=+{}[]:;'@#<>,./?_`;

	const DIFFICULTIES = ["EASY", "NORMAL", "HARD"];

	class NameEntry extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._title = null;
			this._titlePos = null;
			this._titleEndPos = null;

			this._stateCompleted = false;

			this._first = null;
			this._second = null;
			this._third = null;
			this._alpha = 0;
			this._fadeIn = true;

			this._firstLastButton = null;
			this._firstNextButton = null;

			this._secondLastButton = null;
			this._secondNextButton = null;

			this._thirdLastButton = null;
			this._thirdNextButton = null;

			this._firstIndex = { value: 0 };
			this._secondIndex = { value: 0 };
			this._thirdIndex = { value: 0 };

			this._score = null;
			this._ok = null;
			this._buttonPressed = -1;
			this._name = "";
			this._rank = "";

			this._pointer = null;
		}
		
		Init()
		{
			this._titlePos = new Point(-300, -300);
			this._title = new Text(this._titlePos, "Digital-7", 85, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			
			const difficulty = DIFFICULTIES[DifficultySelect._difficultyIndex];
			this._title.Update(`${difficulty} HIGHSCORE !!!`, 0xff00ff00, true);

			this._titlePos.x = this._stage.stageWidth + this._title._dimentions.x / 2;
			this._titlePos.y = this._title._dimentions.y / 2 + 10;
			this._titleEndPos = new Point(this._stage.stageWidth / 2, this._titlePos.y);

			const scorePos = this._titleEndPos.clone();
			scorePos.y += 150;

			this._score = new Text(scorePos, "Digital-7", 60, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._score.Update(`SCORE:${ChainCounter._globalScore}`, 0xff00ff00, true, true, true, 0);

			this._ok = new SplashButton(this._stage.stageWidth / 2, 520, "OK", "Digital-7", 100, 0xff00ff00, 0xff880000, this._stage);
			this._ok.Init(1, 5, 0.05, 10, 20, false, true);

			const firstPoint = new Point(this._stage.stageWidth / 2 - 170, this._stage.stageHeight / 2);
			const secondPoint = new Point(this._stage.stageWidth / 2 + 150 - 170, this._stage.stageHeight / 2);
			const thirdPoint = new Point(this._stage.stageWidth / 2 + 300 - 170, this._stage.stageHeight / 2);

			this._first = new Text(firstPoint, "Digital-7", 90, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._second = new Text(secondPoint, "Digital-7", 90, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._third = new Text(thirdPoint, "Digital-7", 90, 0xff00ff00, this._stage, true, true, 0xff000000, true, 0xffffffff);

			this._firstLastButton = new Button(firstPoint.clone(), "<", "Digital-7", 40, 0xff0000ff, this._stage);
			this._firstNextButton = new Button(firstPoint.clone(), ">", "Digital-7", 40, 0xff0000ff, this._stage);

			this._firstLastButton.UpdatePos(-33, 25);
			this._firstNextButton.UpdatePos(55, 25);

			this._firstLastButton.Update(0, false);
			this._firstNextButton.Update(0, false);

			this._secondLastButton = new Button(secondPoint.clone(), "<", "Digital-7", 40, 0xff0000ff, this._stage);
			this._secondNextButton = new Button(secondPoint.clone(), ">", "Digital-7", 40, 0xff0000ff, this._stage);

			this._secondLastButton.UpdatePos(-33, 25);
			this._secondNextButton.UpdatePos(55, 25);

			this._secondLastButton.Update(0, false);
			this._secondNextButton.Update(0, false);

			this._thirdLastButton = new Button(thirdPoint.clone(), "<", "Digital-7", 40, 0xff0000ff, this._stage);
			this._thirdNextButton = new Button(thirdPoint.clone(), ">", "Digital-7", 40, 0xff0000ff, this._stage);

			this._thirdLastButton.UpdatePos(-33, 25);
			this._thirdNextButton.UpdatePos(55, 25);

			this._thirdLastButton.Update(0, false);
			this._thirdNextButton.Update(0, false);

			this._first.Update("A", 0xff00ff00, false, true, true, 0);
			this._second.Update("A", 0xff00ff00, false, true, true, 0);
			this._third.Update("A", 0xff00ff00, false, true, true, 0);

			this._pointer = new CustomPointer(this._stage);

			this._alpha = 0;
			this._fadeIn = true;
			this._stateCompleted = false;

			this._rank = window.GetRank(
				ChainCounter._globalScore,
				DifficultySelect._difficultyIndex
			);
		}
		
		Run()
		{
			SoundManager.Play(Sounds.INTRO_BGM);
			
			const difficulty = DIFFICULTIES[DifficultySelect._difficultyIndex];
			this._title.Update(`${difficulty} HIGHSCORE !!!`, 0xff00ff00, true);
			
			if (this._fadeIn)
			{
				if (!this.ScrollTitle())
				{
					if (this._UpdateOKButton())
					{
						if (this._alpha > 0)
						{
							this._alpha -= 0.1;
						}
						else
						{
							this._alpha = 0;
						}
					}
					else
					{
						if (this._alpha < 1)
						{
							this._alpha += 0.1;
						}
						else
						{
							this._alpha = 1;
						}
					}
					
					this._score.Update(`RANK: ${this._rank} - SCORE:${ChainCounter._globalScore}`, 0xff00ff00, true, true, true, this._alpha);

					this._LetterInputUpdate(this._first, this._firstLastButton, this._firstNextButton, this._firstIndex, this._alpha);
					this._LetterInputUpdate(this._second, this._secondLastButton, this._secondNextButton, this._secondIndex, this._alpha);
					this._LetterInputUpdate(this._third, this._thirdLastButton, this._thirdNextButton, this._thirdIndex, this._alpha);
				}
				
				this._pointer.Update();
			}
			else
			{
				if (this._pointer !== null)
				{
					this._pointer.Clean();
					this._pointer = null;
				}

				this.ScrollTitle();
				this._UpdateOKButton();

				if (this._alpha > 0)
				{
					this._alpha -= 0.1;
				}
				else
				{
					this._alpha = 0;
				}

				this._score.Update(`RANK: ${this._rank} - SCORE:${ChainCounter._globalScore}`, 0xff00ff00, true, true, true, this._alpha);

				this._LetterInputUpdate(this._first, this._firstLastButton, this._firstNextButton, this._firstIndex, this._alpha);
				this._LetterInputUpdate(this._second, this._secondLastButton, this._secondNextButton, this._secondIndex, this._alpha);
				this._LetterInputUpdate(this._third, this._thirdLastButton, this._thirdNextButton, this._thirdIndex, this._alpha);
			}
		}
		
		_LetterInputUpdate(text, lastButton, nextButton, index, alpha)
		{
			lastButton.Update(alpha, false);
			nextButton.Update(alpha, false);

			if (lastButton.CheckCollision(window.LetsShoot._click))
			{
				index.value--;

				if (index.value < 0)
					index.value = CHARS.length - 1;
			}

			if (nextButton.CheckCollision(window.LetsShoot._click))
			{
				index.value++;

				if (index.value >= CHARS.length)
					index.value = 0;
			}
			
			text.Update(CHARS[index.value], 0xff00ff00, false, true, true, alpha);
		}

		_UpdateOKButton()
		{
			var buttonsDone = 0;
			
			if (this._buttonPressed !== -1)
			{
				if (this._ok.Update(true))
				{
					buttonsDone++;
				}
			}
			else
			{
				if (this._ok.CheckCollision(window.LetsShoot._click))
				{
					this._titleEndPos.x = -600;
					this._fadeIn = false;
					this._stateCompleted = true;
					this._name = `${this._first.GetText().text}${this._second.GetText().text}${this._third.GetText().text}`;

					this._buttonPressed = 0;
				}
				
				this._ok.Update(false);
			}
			
			if (buttonsDone === 1)
			{
				return true;
			}
			
			return false;
		}

		Completed()
		{
			if (this._title !== null)
			{
				this._title.Clean();
				this._title = null;
			}

			if (this._pointer !== null)
			{
				this._pointer.Clean();
				this._pointer = null;
			}
			
			if (this._first !== null)
			{
				this._first.Clean();
				this._first = null;
			}

			if (this._second !== null)
			{
				this._second.Clean();
				this._second = null;
			}

			if (this._third !== null)
			{
				this._third.Clean();
				this._third = null;
			}

			if (this._firstLastButton !== null)
			{
				this._firstLastButton.Clean();
				this._firstLastButton = null;
			}

			if (this._firstNextButton !== null)
			{
				this._firstNextButton.Clean();
				this._firstNextButton = null;
			}

			if (this._secondLastButton !== null)
			{
				this._secondLastButton.Clean();
				this._secondLastButton = null;
			}

			if (this._secondNextButton !== null)
			{
				this._secondNextButton.Clean();
				this._secondNextButton = null;
			}

			if (this._thirdLastButton !== null)
			{
				this._thirdLastButton.Clean();
				this._thirdLastButton = null;
			}

			if (this._thirdNextButton !== null)
			{
				this._thirdNextButton.Clean();
				this._thirdNextButton = null;
			}

			if (this._score !== null)
			{
				this._score.Clean();
				this._score = null;
			}

			if (this._ok !== null)
			{
				this._ok.Clean();
				this._ok = null;
			}

			this._titlePos = null;
			this._titleEndPos = null;
			
			this._alpha = 0;
			this._buttonPressed = -1;
			
			this._firstIndex.value = 0;
			this._secondIndex.value = 0;
			this._thirdIndex.value = 0;

			window.AddHighscoreEntry(
				ChainCounter._globalScore,
				this._name,
				MainBody._endTime - MainBody._startTime,
				DifficultySelect._difficultyIndex
			);
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
			
			if (completed < 1)
			{
				return true;
			}
			else
			{
				if (this._stateCompleted)
				{
					this._isCompleted = true;
					this._nextState = LetsShoot.HIGHSCORES_TABLE;
					
					this._nextStateArgs = {
						lastState: LetsShoot.HIGHSCORE_NAME_ENTRY,
						difficulty: DifficultySelect._difficultyIndex,
						rank: this._rank
					}
				}

				return false;
			}
		}
	}

	window.NameEntry = NameEntry;
}