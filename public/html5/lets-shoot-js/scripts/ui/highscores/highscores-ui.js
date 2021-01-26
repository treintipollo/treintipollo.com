"use strict";

{
	class HighscoresGui
	{
		constructor(stage)
		{
			this._stage = stage;
			this._alpha = 0;
			this._rows = [];

			this._font = "";
			this._controlColor = 0;
			this._themeColor = 0;

			this._controlFontSize = 0;
			this._themeFontSize = 0;
			this._totalWidth = 0;
			this._totalHeight = 0;
			
			this._page = 0;
			this._difficulties = ["DIFFICULTY: EASY", "DIFFICULTY: NORMAL", "DIFFICULTY: HARD"];
			this._difficultyIndex = 0;

			this._controls = [];
			this._difficulty = null;
		}
		
		SetFont(font, controlColor, themeColor)
		{
			this._font = font;
			this._controlColor = controlColor;
			this._themeColor = themeColor;
		}
		
		SetFontSizes(controlSize, themeSize)
		{
			this._controlFontSize = controlSize;
			this._themeFontSize = themeSize;
		}
		
		AddDifficultyRow(pos)
		{
			const f = this._font;
			const tfs = this._themeFontSize;
			const tc = this._themeColor;
			const s = this._stage;

			this._difficulty = new Button(pos.clone(), "DIFFICULTY: EASY", f, tfs, tc, s);
			
			this._difficulty.Update(0, true, false, false);
		}

		AddRow(pos)
		{
			const rankPos = pos.clone();
			const scorePos = rankPos.clone();
			const namePos = rankPos.clone();
			const timePos = rankPos.clone();

			scorePos.x += 70;
			namePos.x += 335;
			timePos.x += 409;

			const f = this._font;
			const tfs = this._themeFontSize;
			const tc = this._themeColor;
			const s = this._stage;

			const rank = new Text(rankPos, f, tfs, tc, s, true, true, 0xff000000, true, 0xffffffff);
			const score = new Text(scorePos, f, tfs, tc, s, true, true, 0xff000000, true, 0xffffffff);
			const name = new Text(namePos, f, tfs, tc, s, true, true, 0xff000000, true, 0xffffffff);
			const time = new Text(timePos, f, tfs, tc, s, true, true, 0xff000000, true, 0xffffffff);

			const row = { rank, score, name, time };

			rank.Update("1.", tc, false, false, true, 0);
			score.Update("000000000000000", tc, false, false, true, 0);
			name.Update("AAA", tc, false, false, true, 0);
			time.Update("--:--:--", tc, false, false, true, 0);

			this._rows.push(row);

			this._totalWidth = (time.GetTextField().x + time.GetText().width) - rank.GetTextField().x;
			this._totalHeight = (rank.GetTextField().y + rank.GetText().height) - this._rows[0].rank.GetTextField().y;

			rankPos.x -= this._totalWidth / 2;
			scorePos.x -= this._totalWidth / 2;
			namePos.x -= this._totalWidth / 2;
			timePos.x -= this._totalWidth / 2;
		}

		AddControls(pos)
		{
			const f = this._font;
			const cfs = this._controlFontSize;
			const cc = this._controlColor;
			const s = this._stage;

			const lastPos = pos.clone();
			const nextPos = pos.clone();

			this._controls.push(new Button(lastPos, "<<", f, cfs, cc, s));
			this._controls.push(new Button(nextPos, ">>", f, cfs, cc, s));

			this._controls[0].UpdatePos(-(this._totalWidth / 2) - 50, 0);
			this._controls[0].Update(0, false, false, false);

			this._controls[1].UpdatePos((this._totalWidth / 2) + 50, 0);
			this._controls[1].Update(0, false, false, false);
		}
		
		Update(fadeOut)
		{
			if (fadeOut)
			{
				if (this._alpha > 0)
				{
					this._alpha -= 0.1;
				}
				else
				{
					this._alpha = 0;
					
					return - 1;
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

			const highscores = window.HighscoresStorage[this._difficultyIndex];

			for (let i = 0; i < this._rows.length; i++)
			{
				const row = this._rows[i];
				const highscore = highscores[i + (this._rows.length * this._page)];

				row.rank.Update(highscore["rank"], this._themeColor, false, false, true, this._alpha);
				row.score.Update(highscore["score"], this._themeColor, false, false, true, this._alpha);
				row.name.Update(highscore["name"], this._themeColor, false, false, true, this._alpha);
				row.time.Update(highscore["time"], this._themeColor, false, false, true, this._alpha);
			}

			for (let i = 0; i < this._controls.length; i++)
			{
				const control = this._controls[i];

				if (control.CheckCollision(LetsShoot._click))
				{
					if (i === 0)
					{
						this._page--;
						this._UpdatePage();
					}

					if (i === 1)
					{
						this._page++;
						this._UpdatePage();
					}
				}

				control.Update(this._alpha, true, false, true);
			}

			if (this._difficulty.CheckCollision(LetsShoot._click))
			{
				this._difficultyIndex++;

				if (this._difficultyIndex >= this._difficulties.length)
					this._difficultyIndex = 0;

				this._difficulty.Update(this._alpha, true, false, true, this._difficulties[this._difficultyIndex]);
				
				this._page = 0;
				this._UpdatePage();
			}
			else
			{
				this._difficulty.Update(this._alpha, true, false, true);
			}

			return 0;
		}

		_UpdatePage()
		{
			if (this._page < 0)
				this._page = 0;

			if (this._page > 10 - 1)
				this._page = 10 - 1;

			const highscores = window.HighscoresStorage[this._difficultyIndex];

			for (let i = 0; i < this._rows.length; i++)
			{
				const row = this._rows[i];
				const highscore = highscores[i + (this._rows.length * this._page)];

				row.rank.Update(highscore["rank"], this._themeColor, false, false, true, this._alpha);
				row.score.Update(highscore["score"], this._themeColor, false, false, true, this._alpha);
				row.name.Update(highscore["name"], this._themeColor, false, false, true, this._alpha);
				row.time.Update(highscore["time"], this._themeColor, false, false, true, this._alpha);
			}
		}

		SetDifficultyAndPage(difficultyIndex, rank)
		{
			const page = Math.floor((Number(rank) - 1) / 10);

			this._difficultyIndex = difficultyIndex;
			this._page = page;

			this._difficulty.Update(0, true, false, true, this._difficulties[this._difficultyIndex]);

			const highscores = window.HighscoresStorage[this._difficultyIndex];

			for (let i = 0; i < this._rows.length; i++)
			{
				const row = this._rows[i];
				const highscore = highscores[i + (this._rows.length * this._page)];

				row.rank.Update(highscore["rank"], this._themeColor, false, false, true, 0);
				row.score.Update(highscore["score"], this._themeColor, false, false, true, 0);
				row.name.Update(highscore["name"], this._themeColor, false, false, true, 0);
				row.time.Update(highscore["time"], this._themeColor, false, false, true, 0);
			}
		}
		
		Clean()
		{
			for (let i = 0; i < this._rows.length; i++)
			{
				const row = this._rows[i];
				
				if (row)
				{
					row.rank.Clean();
					row.score.Clean();
					row.name.Clean();
					row.time.Clean();
				}
			}

			this._rows.length = 0;

			if (this._controls[0])
				this._controls[0].Clean();
			
			if (this._controls[1])
				this._controls[1].Clean();

			this._controls.length = 0;

			if (this._difficulty)
				this._difficulty.Clean();

			this._difficulty = null;

			this._stage = null;
		}
	}

	window.HighscoresGui = HighscoresGui;
}