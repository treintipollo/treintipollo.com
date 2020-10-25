"use strict";
{
	let INSTANCE = null;
	let ALLOWINSTANTIATION = false;

	class Level
	{
		constructor()
		{
			if (!ALLOWINSTANTIATION)
			{
				throw new Error(" Dude! This class is a Singleton, use Level.GetInstance() instead!");
			}

			this._waveCount = 0;
			this._totalWaveCount = 0;
			
			this._baddyType = null;
			this._baddyStrenght = null;
			this._generatorType = null;
			this._colorAmounts = null;
			this._baddyHolder = null;
			
			this._specificProperties = null;
			this._spawnSound = null;
		
			this._difficulty = 0;
			this._actualDifficulty = 0;
			this._branch = 0;
			this._waveCuota = 0;
			
			this._baddyAmount = 0;
			this._spawnWave = false;
			this._waveAGenerators = null;
			this._nextWaveLimit = null;
			
			this._generatorProbability = 0;
			this._mainTypeProbability = 0;
			
			this._cardinalPoints = null;
			this._warningSign = null;
			
			this._playerPos = null;
			this._nodeSize = null;
			this._stage = null;
			
			this._wavesMeterFirstDraw = false;
			this._wavesLeftFrame = null;
			this._waveRect = null;
			this._waveRectOffset = 0;
			this._waveMeter = null;
			this._waveMeterBG = null;
			this._fullRect = null;
			this._explodeMeter = null;
			this._almostDoneImage = null;
			this._almostDoneText = null;
			this._waveMeterText = null;
			
			this._isDoneSpawning = false;
			this._lastSpawnType = 0;
			this._spacedSpawnFirstCall = false;
			this._spacedSpawnCurrentIndex = 0;
			this._spacedSpawnCurrentGeneratorIndex = 0;
			this._spacedSpawnBaddyAmount = 0
			this._spacedSpawnGeneratorAmount = 0;
			this._waitBeforeSpawn = 0;
			
			this._radialSpawnAmount = 0;
			this._levelTypeSpawnAmount = 0;
			this._radialSpawnAngle = 0;
			this._levelTypeSpawnAngle = 0;
			
			this._frameCounter = 0;
		}
		
		static GetInstance()
		{
		  if (INSTANCE === null)
		  {
	          ALLOWINSTANTIATION = true;
	          INSTANCE = new Level();
	          ALLOWINSTANTIATION = false;
          }

          return INSTANCE;
		}
		
		Init(difficulty, branch, gameDifficulty, stage)
		{
			this._stage = stage;
			this._difficulty = difficulty;
			this._actualDifficulty = difficulty + 1;
			this._branch = branch;
			
			this.SetDifficultyVariables(gameDifficulty);
			
			this._nextWaveLimit = [15, 20, 25];
			this._mainTypeProbability = 0.7;
			this._waitBeforeSpawn = Math.floor(25 / this._actualDifficulty);
			
			this._spawnWave = true;
			this._isDoneSpawning = true;
			this._lastSpawnType = -1;
			this._frameCounter = 0;
			this._totalWaveCount = 0;
				
			this.CreateArrays();
			this.CreateSpecificProps();
			this.ArrangeArrays();
			this.SetCardinalSpawnPoints(100, 100, 200);
			this.CreateWarningSigns(10, 15, 0xff0000);

			ChainCounter.addEventListener("change", () => this.DrawLevelMeter(true));
		}
		
		Update(baddiesDestroyed, destroyMeter = false, destroyAlmostDone = false)
		{
			if (!destroyMeter)
			{
				if (this._spawnWave)
				{
					// This is only usefull for the spawning methods that don't spawn every baddy at the same time, look in those
					// for anything regarding this Boolean.
					if (this._isDoneSpawning)
					{
						this.ChooseBaddies();
						
						this._spawnWave = false;
						this._lastSpawnType = -1;
						this._spacedSpawnFirstCall = true;
					}

					this.Spawn();
				}
				else
				{
					let currentBaddyCount = BaddyManager.GetBaddyCount();

					if (currentBaddyCount <= this._nextWaveLimit[this._difficulty])
					{
						this._spawnWave = true;
					}
					else
					{
						this._spawnWave = false;
					}
				}
				
				let currentCuotaAmount = baddiesDestroyed - (this._waveCuota * this._totalWaveCount);
				
				if (currentCuotaAmount >= this._waveCuota)
				{
					this._totalWaveCount++;
				}
				
				if (this._totalWaveCount < this._waveCount)
				{
					this._waveMeter.width = NumberUtils.map(currentCuotaAmount, 0, this._waveCuota, 0, this._waveMeterBG.width);
				}
				else
				{
					const bitmap = DynamicGraphics.GetBitmapFromDisplayObjectTransformed(
						this._stage,
						this._wavesLeftFrame,
						this._fullRect.width,
						this._fullRect.height
					);

					this._explodeMeter = new SplashImage(bitmap, this._stage);
					this._explodeMeter.Init(this._wavesLeftFrame.x, this._wavesLeftFrame.y, 1, 10, 1, 20, 10);
					
					this._stage.removeChild(this._wavesLeftFrame);
					this._wavesLeftFrame = null;

					SoundManager.Play(Sounds.SPLASH_BUTTON_PRESS);
				}
			}
			
			this.DrawWarnings();

			this._frameCounter++;
			
			if (!destroyAlmostDone)
			{
				if (this._explodeMeter === null)
				{
					this.DrawLevelMeter();
				}
				else
				{
					if (this._almostDoneText !== null)
					{
						this._almostDoneText.Update("Almost Done", 0xffff0000);
					}
					
					return this._explodeMeter.Update(true);
				}
			}
			else
			{
				if (this._almostDoneImage === null)
				{
					const x = this._almostDoneText.GetX();
					const y = this._almostDoneText.GetY();
					const width = this._almostDoneText.GetWidth();
					const height = this._almostDoneText.GetHeight();
					const canvas = new OffscreenCanvas(width, height);
					const context = canvas.getContext("2d");
					context.save();
					context.translate(-this._x, 0);
					this._almostDoneText.GetDisplayObject().draw(context, true);
					context.restore();

					this._almostDoneImage = new SplashImage(new Bitmap(canvas), this._stage);
					this._almostDoneImage.Init(this._almostDoneText.GetTextField().x, this._almostDoneText.GetTextField().y, 1, 10, 1, 20, 10);
					
					this._almostDoneText.Clean();
					this._almostDoneText = null;
					
					SoundManager.Play(Sounds.SPLASH_BUTTON_PRESS);
				}
				else
				{
					return this._almostDoneImage.Update(true);
				}
			}
			
			return false;
		}
		
		SetPlayerPos(pos)
		{
			this._playerPos = pos;
		}
		
		SetGridNodeSize(size)
		{
			this._nodeSize = size;
		}
		
		SetWavesLeftMarker(x, y, title, titleSize, barWidth, barHeight, barOffset)
		{
			this._waveRectOffset = barOffset;
			
			let width = ((barWidth + barOffset) * this._waveCount) + barOffset;
			let height = barHeight + (barOffset * 2);
			
			this._wavesLeftFrame = new Shape();
			this._wavesLeftFrame.x = x - width / 2;
			this._wavesLeftFrame.y = y;
			
			let textPos = new Point(this._wavesLeftFrame.x, this._wavesLeftFrame.y);
			this._almostDoneText = new Text(textPos, "Digital-7", 40, 0xffff0000, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._almostDoneText.Update("Almost Done", 0xffff0000, false, false, false);
			
			this._stage.addChild(this._wavesLeftFrame);
			
			this._waveRect = [];
			
			for (let i = 0; i < this._waveCount; i++)
			{
				this._waveRect.push(new Rectangle(((barWidth + barOffset) * i) + barOffset, barOffset + 5, barWidth, barHeight / 2));
			}
			
			this._fullRect = new Rectangle(0, 0, width, height);
			this._waveMeter = new Rectangle(barOffset, (barOffset * 2) + (barHeight / 2),  width - (barOffset * 2), barOffset);
			this._waveMeterBG = new Rectangle(barOffset, (barOffset * 2) + (barHeight / 2),  width - (barOffset * 2), barOffset);

			this._waveMeterText = new Text(new Point(this._wavesLeftFrame.x + 5, this._wavesLeftFrame.y), "Digital-7", titleSize, 0xff000000, this._stage, true);
			this._waveMeterText.Update(title, 0xff000000, false, true);
		}
		
		Clean()
		{
			for (let i = 0; i < this._warningSign.length; i++)
			{
				this._warningSign[i].Clean();
			}
			
			if (this._explodeMeter !== null)
			{
				this._explodeMeter.Clean();
				this._explodeMeter = null;
			}
			
			if (this._almostDoneImage !== null)
			{
				this._almostDoneImage.Clean();
				this._almostDoneImage = null;
			}
			
			if (this._almostDoneText !== null)
			{
				this._almostDoneText.Clean();
				this._almostDoneText = null;
			}

			if (this._waveMeterText !== null)
			{
				this._waveMeterText.Clean();
				this._waveMeterText = null;
			}
			
			this.ResetLevelMeter();

			ChainCounter.removeAllEventListeners();
			
			this._waveMeterBG = null;
			this._waveMeter = null;
			this._warningSign = null;
			this._baddyType = null;
			this._baddyStrenght = null;
			this._generatorType = null;
			this._colorAmounts = null;
			this._cardinalPoints = null;
			this._waveAGenerators = null;
			this._playerPos = null;
			this._specificProperties = null;
			this._nodeSize = null;
			this._nextWaveLimit = null;
			this._baddyHolder = null;
			this._spawnSound = null;
			
			this._stage = null;
			
			INSTANCE = null;
		}
		
		ResetWarnings()
		{
			for (let i = 0; i < this._warningSign.length; i++)
			{
				this._warningSign[i].Reset();
			}
		}
		
		ResetLevelMeter()
		{
			if (this._waveRect !== null)
			{
				for (let i = 0; i < this._waveCount; i++)
				{
					this._waveRect[i] = null;
				}
				
				if (this._stage.contains(this._wavesLeftFrame))
				{
					this._stage.removeChild(this._wavesLeftFrame);
				}
				
				this._wavesLeftFrame = null;
				this._waveRect = null;
			}
		}
		
		DrawWarnings()
		{
			for (let i = 0; i < this._warningSign.length; i++)
			{
				if (this._warningSign[i]._on)
				{
					this._warningSign[i].Update();
				}
			}
		}
		
		DrawLevelMeter(force = false)
		{
			if (!this._wavesLeftFrame)
				return;

			if (this._wavesMeterFirstDraw && !force)
				return;

			this._wavesMeterFirstDraw = true;

			this._wavesLeftFrame.uncache();

			this._wavesLeftFrame.graphics.clear();
			this._wavesLeftFrame.graphics.beginFill(0xff777777);
			this._wavesLeftFrame.graphics.rect(this._fullRect.x, this._fullRect.y, this._fullRect.width, this._fullRect.height);
			this._wavesLeftFrame.graphics.endFill();

			this._wavesLeftFrame.graphics.beginFill(0xff000000);
			this._wavesLeftFrame.graphics.rect(this._waveMeterBG.x, this._waveMeterBG.y, this._waveMeterBG.width, this._waveMeterBG.height);
			this._wavesLeftFrame.graphics.endFill();

			this._wavesLeftFrame.graphics.beginFill(0xffff6a02);
			this._wavesLeftFrame.graphics.rect(this._waveMeter.x, this._waveMeter.y, this._waveMeter.width, this._waveMeter.height);
			this._wavesLeftFrame.graphics.endFill();

			this._wavesLeftFrame.graphics.beginFill(0xff000000);

			for (let i = 0; i < this._waveCount; i++)
				this._wavesLeftFrame.graphics.rect(this._waveRect[i].x, this._waveRect[i].y, this._waveRect[i].width, this._waveRect[i].height);

			this._wavesLeftFrame.graphics.endFill();

			this._wavesLeftFrame.graphics.beginFill(0xff00ff00);

			for (let i = 0; i < this._totalWaveCount; i++)
				this._wavesLeftFrame.graphics.rect(this._waveRect[i].x, this._waveRect[i].y, this._waveRect[i].width, this._waveRect[i].height);

			this._wavesLeftFrame.graphics.endFill();

			this._wavesLeftFrame.cache(0, 0, this._fullRect.width, this._fullRect.height);
		}
		
		ScreenSpawn(multiplier)
		{
			let lenght = this._baddyHolder.length
			let totalToSpawn = lenght * multiplier;
			let spawnPos;
			let currentIndex;
			let typeAmount;
			
			let x = this._nodeSize.x;
			let y = this._nodeSize.y;
			let width = this._stage.stageWidth - (this._nodeSize.x * 2);
			let height = this._stage.stageHeight - (this._nodeSize.y * 2);
			
			for (let i = 0; i < totalToSpawn; i++)
			{
				currentIndex = i & (lenght - 1);
				BaddyManager.SetType(this._baddyHolder[currentIndex]._name);
	 			BaddyManager.SetStatsByName(this._baddyHolder[currentIndex]._strength);
	 			BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyHolder[currentIndex]._name]);
				
				typeAmount = this._baddyHolder[currentIndex]._amount;
				
				for (let j = 0; j < typeAmount; j++)
				{
					spawnPos = this.CalcSpawnPos(x, y, width, height, this._playerPos, 200);
					BaddyManager.Add(spawnPos, this._playerPos);
				}
				
				BaddyManager.CleanForNextType();
			}
			
			lenght = this._waveAGenerators.length
			
			for (let i = 0; i < lenght; i++)
			{
				BaddyManager.SetType(this._waveAGenerators[i]._name);
	 			BaddyManager.SetStatsByName(this._waveAGenerators[i]._strength);
	 			BaddyManager.SetSpecificParams();
				
				BaddyManager.SetGeneratorBaddyType(this._baddyType[0]);
	 			BaddyManager.SetGeneratorBaddyStatsByName(this._baddyStrenght[this._difficulty]);
	 			BaddyManager.SetGeneratorBaddySpecificParamsAsArray(this._specificProperties[this._baddyType[0]]);
				
				typeAmount = this._waveAGenerators[i]._amount;
				
				for (let j = 0; j < typeAmount; j++)
				{
					spawnPos = this.CalcSpawnPos(x, y, width, height, this._playerPos, 200);
					BaddyManager.Add(spawnPos, this._playerPos);
				}
				
				BaddyManager.CleanForNextType();
			}
			
			SoundManager.Play(Sounds.SCREEN_SPAWN_ALARM);
		}
		
		CardinalSpawn(multiplier)
		{
			let lenght = this._baddyHolder.length
			let spawnPos;
			let typeAmount;
			
			for (let k = 0; k < multiplier; k++)
			{
				let rand = NumberUtils.randRange(0, this._cardinalPoints.length - 1, true);
				
				// Turning on warning sign
				this._warningSign[rand]._on = true;
			
				let x = this._cardinalPoints[rand][0].x;
				let y = this._cardinalPoints[rand][0].y;
				let width = this._cardinalPoints[rand][1].x;
				let height = this._cardinalPoints[rand][1].y;
				
				for (let i = 0; i < lenght; i++)
				{
					BaddyManager.SetType(this._baddyHolder[i]._name);
		 			BaddyManager.SetStatsByName(this._baddyHolder[i]._strength);
		 			BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyHolder[i]._name]);
					
					typeAmount = this._baddyHolder[i]._amount;
					
					for (let j = 0; j < typeAmount; j++)
					{
						spawnPos = this.CalcSpawnPos(x, y, width, height);
						BaddyManager.Add(spawnPos, this._playerPos);
					}
					
					BaddyManager.CleanForNextType();
				}
			}
		}
		
		SpacedScreenSpawn(multiplier)
		{
			let x = this._nodeSize.x;
			let y = this._nodeSize.y;
			let width = this._stage.stageWidth - (this._nodeSize.x * 2);
			let height = this._stage.stageHeight - (this._nodeSize.y * 2);
			let spawnPos;
			let doneWithBaddies = false;
			let doneWithGenerators = false;
			
			if (this._spacedSpawnFirstCall)
			{
				this._spacedSpawnCurrentIndex = 0;
				this._spacedSpawnCurrentGeneratorIndex = 0;
				this._spacedSpawnFirstCall = false;
				
				this._spacedSpawnBaddyAmount = 0;
				this._spacedSpawnGeneratorAmount = 0;
			}
			
			if ((this._frameCounter % this._waitBeforeSpawn) === 0)
			{
				if (this._spacedSpawnCurrentIndex < this._baddyHolder.length)
				{
					BaddyManager.SetType(this._baddyHolder[this._spacedSpawnCurrentIndex]._name);
		 			BaddyManager.SetStatsByName(this._baddyHolder[this._spacedSpawnCurrentIndex]._strength);
		 			BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyHolder[this._spacedSpawnCurrentIndex]._name]);
					
					spawnPos = this.CalcSpawnPos(x, y, width, height, this._playerPos, 200);
					BaddyManager.Add(spawnPos, this._playerPos);
					BaddyManager.CleanForNextType();
					
					SoundManager.Play(this._spawnSound[this._baddyHolder[this._spacedSpawnCurrentIndex]._name]);
					
					if (this._spacedSpawnBaddyAmount < this._baddyHolder[this._spacedSpawnCurrentIndex]._amount * multiplier)
					{
						this._spacedSpawnBaddyAmount++;
					}
					else
					{
						this._spacedSpawnBaddyAmount = 0;
						this._spacedSpawnCurrentIndex++;
					}
				}
				else
				{
					doneWithBaddies = true;
				}
				
				if (this._spacedSpawnCurrentGeneratorIndex < this._waveAGenerators.length)
				{
					BaddyManager.SetType(this._waveAGenerators[this._spacedSpawnCurrentGeneratorIndex]._name);
		 			BaddyManager.SetStatsByName(this._waveAGenerators[this._spacedSpawnCurrentGeneratorIndex]._strength);
		 			BaddyManager.SetSpecificParams();
					
					BaddyManager.SetGeneratorBaddyType(this._baddyType[0]);
		 			BaddyManager.SetGeneratorBaddyStatsByName(this._baddyStrenght[this._difficulty]);
		 			BaddyManager.SetGeneratorBaddySpecificParamsAsArray(this._specificProperties[this._baddyType[0]]);
				
					spawnPos = this.CalcSpawnPos(x, y, width, height, this._playerPos, 200);
					BaddyManager.Add(spawnPos, this._playerPos);
					BaddyManager.CleanForNextType();
					
					SoundManager.Play(this._spawnSound[this._baddyType[0]]);
					
					if (this._spacedSpawnGeneratorAmount < this._waveAGenerators[this._spacedSpawnCurrentGeneratorIndex]._amount)
					{
						this._spacedSpawnGeneratorAmount++;
					}
					else
					{
						this._spacedSpawnGeneratorAmount = 0;
						this._spacedSpawnCurrentGeneratorIndex++;
					}
				}
				else
				{
					doneWithGenerators = true
				}
			}

			if (doneWithBaddies && doneWithGenerators)
			{
				return true;
			}
			
			return false;
		}
		
		LevelTypeSpawn()
		{
			let spawnPos = new Point();
			
			if (this._spacedSpawnFirstCall)
			{
				this._spacedSpawnCurrentIndex = 0;
				this._spacedSpawnFirstCall = false;
				this._levelTypeSpawnAngle = ((360 / this._levelTypeSpawnAmount) + NumberUtils.randRange(0, 360, true)) * (Math.PI / 180);
			}
			
			if (this._frameCounter % 5 === 0)
			{
				BaddyManager.SetType(this._baddyType[0]);
		 		BaddyManager.SetStatsByName(this._baddyStrenght[this._difficulty]);
		 		BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyType[0]]);
				
				spawnPos.x =  this._playerPos.x + Math.cos(this._levelTypeSpawnAngle * (this._spacedSpawnCurrentIndex + 1)) * 250;
				spawnPos.y =  this._playerPos.y + Math.sin(this._levelTypeSpawnAngle * (this._spacedSpawnCurrentIndex + 1)) * 250;
				
				BaddyManager.Add(spawnPos, this._playerPos);
				BaddyManager.CleanForNextType();
				
				SoundManager.Play(this._spawnSound[this._baddyType[0]]);
				
				if (this._spacedSpawnCurrentIndex < this._levelTypeSpawnAmount - 1)
				{
					this._spacedSpawnCurrentIndex++;
				}
				else
				{
					return true;
				}
			}
			
			spawnPos = null;
			
			return false;
		}
		
		RadialSpawn()
		{
			let spawnPos = new Point();
			
			if (this._spacedSpawnFirstCall)
			{
				this._spacedSpawnCurrentIndex = 0;
				this._spacedSpawnFirstCall = false;
				this._radialSpawnAngle = ((360 / this._levelTypeSpawnAmount) + NumberUtils.randRange(0, 360, true)) * (Math.PI / 180);
			}
			
			if (this._frameCounter % 5 === 0)
			{
				BaddyManager.SetType(this._baddyType[0]);
		 		BaddyManager.SetStatsByName("RandomFillColor");
		 		BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyType[0]]);
				
				spawnPos.x = this._playerPos.x + Math.cos(this._radialSpawnAngle * (this._spacedSpawnCurrentIndex + 1)) * 250;
				spawnPos.y = this._playerPos.y + Math.sin(this._radialSpawnAngle * (this._spacedSpawnCurrentIndex + 1)) * 250;
				
				BaddyManager.Add(spawnPos, this._playerPos);
				BaddyManager.CleanForNextType();
				
				SoundManager.Play(this._spawnSound[this._baddyType[0]]);
				
				if (this._spacedSpawnCurrentIndex < this._radialSpawnAmount - 1)
				{
					this._spacedSpawnCurrentIndex++;
				}
				else
				{
					return true;
				}
			}
			
			spawnPos = null;
			
			return false;
		}

		CalcSpawnPos(x, y, maxWidth, maxHeight, avoidPos = null, avoidRadius = 0)
		{
			let res = new Point();
			
			if (avoidPos !== null)
			{
				do
				{
					res.x = NumberUtils.randRange(x, x + maxWidth, true);
					res.y = NumberUtils.randRange(y, y + maxHeight, true);
				}
				while(VectorUtils.inRange(avoidPos, res, avoidRadius));
			}
			else
			{
				res.x = NumberUtils.randRange(x, x + maxWidth, true);
				res.y = NumberUtils.randRange(y, y + maxHeight, true);
			}
			
			avoidPos = null;
			
			return res;
		}
		
		ChooseBaddies()
		{
			let rand;
			let currentType;
			let currentStrenght;
			let isGenerator;
			let tmpBaddyHolder;
			let found;
			
			// Chosen Baddy types will go here
			this._waveAGenerators = [];
			this._baddyHolder = [];
			
			for (let k = 0; k < this._colorAmounts.length; k++)
			{
				for (let i = 0; i < this._colorAmounts[k]; i++)
				{
					isGenerator = false;
					found = false;
					rand = Math.random();
					
					// Choose Strenght
					currentStrenght = this._baddyStrenght[k];
					
					// Choose type
					if (rand <=  this._generatorProbability)
					{
						// Is Generator
						isGenerator = true;
						rand = NumberUtils.randRange(0, this._generatorType.length - 1, true);
						currentType = this._generatorType[rand];
						// Strength is overriden by difficulty if a Generator is chosen.
						currentStrenght = this._baddyStrenght[this._difficulty];
						// This is so, because Generators are more valuable that regular baddies
						// The higher the difficulty the more annoying Generators get :P
						i += 2*this._actualDifficulty;
					}
					else
					{
						// Is Baddy
						if (rand <= this._mainTypeProbability)
						{
							// Main Type
							currentType = this._baddyType[0];
						}
						else
						{
							// Sub Types
							rand = NumberUtils.randRange(1, this._baddyType.length - 1, true);
							currentType = this._baddyType[rand];
						}
					}
					
					// Creating Temporary class to hold name and strenght selected
					tmpBaddyHolder = new BaddyHolder(currentType, currentStrenght);
				
					if (isGenerator)
					{
						if (this._waveAGenerators.length > 0)
						{
							for (let j = 0; j < this._waveAGenerators.length; j++)
							{
								// If current type is found, ++ to the amount of that Baddy
								if (tmpBaddyHolder._name === this._waveAGenerators[j]._name && tmpBaddyHolder._strength === this._waveAGenerators[j]._strength)
								{
									this._waveAGenerators[j]._amount++;
									found = true;
								}
							}
							// If current type is not found, add it.
							if (!found)
							{
								this._waveAGenerators.push(tmpBaddyHolder);
								this._waveAGenerators[this._waveAGenerators.length - 1]._amount++;
							}
						}
						else
						{
							this._waveAGenerators.push(tmpBaddyHolder);
							this._waveAGenerators[this._waveAGenerators.length - 1]._amount++;
						}
					}
					else
					{
						if (this._baddyHolder.length > 0)
						{
							for (let j = 0; j < this._baddyHolder.length; j++)
							{
								// If current type is found, ++ to the amount of that Baddy
								if (tmpBaddyHolder._name === this._baddyHolder[j]._name && tmpBaddyHolder._strength === this._baddyHolder[j]._strength)
								{
									this._baddyHolder[j]._amount++;
									found = true;
								}
							}
							// If current type is not found, add it.
							if (!found)
							{
								this._baddyHolder.push(tmpBaddyHolder);
								this._baddyHolder[this._baddyHolder.length - 1]._amount++;
							}
					   }
					   else
					   {
						  this._baddyHolder.push(tmpBaddyHolder);
						  this._baddyHolder[this._baddyHolder.length - 1]._amount++;
					   }
				   }
				}
			}
			
			tmpBaddyHolder = null
		}
		
		Spawn()
		{
			let spawnType;
			
			if (this._lastSpawnType === -1)
			{
			   spawnType = NumberUtils.randRange(0, 5, true);
			}
			else
			{
			   spawnType = this._lastSpawnType;
			}
			
			switch (spawnType)
			{
				case 0:
					this.ScreenSpawn(1);
			 		break;
				case 1:
					this.CardinalSpawn(2);
					break;
			 	case 2:
					this.SpacedScreenSpawn(1);
					this.CardinalSpawn(1);
					break;
				case 3:
					this._isDoneSpawning = this.LevelTypeSpawn();
					break;
				case 4:
					this._isDoneSpawning = this.SpacedScreenSpawn(3);
			 		break;
				case 5:
					this._isDoneSpawning = this.RadialSpawn();
					break;
			}
			
			this._lastSpawnType = spawnType;
		}
		
		CreateWarningSigns(time, warningThickness, color)
		{
			let width = this._stage.stageWidth;
			let height = this._stage.stageHeight;
			
			this._warningSign = [];

			for (let i = 0; i < 4; i++)
			{
				this._warningSign.push(new WarningSign(100, warningThickness, color, this._stage));
			}

			// North
			this._warningSign[0].Init(0,0, width, warningThickness);
			// South
			this._warningSign[1].Init(0, height - warningThickness, width, warningThickness);
			// East
			this._warningSign[2].Init(0,0, warningThickness, height);
			// West
			this._warningSign[3].Init(width - warningThickness, 0, warningThickness, height);
		}
		
		SetDifficultyVariables(gameDifficulty)
		{
			switch (gameDifficulty)
			{
				case DifficultySelect.EASY:
					this._baddyAmount = 1;
					this._waveCount = 10;
					this._radialSpawnAmount = 1;
					this._levelTypeSpawnAmount = 1;
					this._waveCuota = 5 + (3 * this._actualDifficulty);
					
					this._generatorProbability = 0.015;
					break;
				case DifficultySelect.NORMAL:
					this._baddyAmount = 4;
					this._waveCount = 10;
					this._radialSpawnAmount = 2;
					this._levelTypeSpawnAmount = 2;
					this._waveCuota = 8 + (3 * this._actualDifficulty);
					
					this._generatorProbability = 0.020;
					break;
				case DifficultySelect.HARD:
					this._baddyAmount = 5;
					this._waveCount = 10;
					this._radialSpawnAmount = 3;
					this._levelTypeSpawnAmount = 2;
					this._waveCuota = 11 + (3 * this._actualDifficulty);
					
					this._generatorProbability = 0.030;
					break;
			}
			
			this.SetColorAmount(gameDifficulty);
		}
		
		SetColorAmount(gameDifficulty)
		{
			this._colorAmounts = [];
			
			let green;
			let yellow;
			let red;
			
			switch (gameDifficulty)
			{
				case DifficultySelect.EASY:
					switch (this._difficulty)
					{
						case 0:
							green = 0.9;
							yellow = 0.1;
							red = 0;
							break;
						case 1:
							green = 0.6;
							yellow = 0.40;
							red = 0;
							break;
						case 2:
							green = 0.35;
							yellow = 0.60;
							red = 0.05;
							break;
					}
					break;
				case DifficultySelect.NORMAL:
					switch (this._difficulty)
					{
						case 0:
							green = 0.8;
							yellow = 0.2;
							red = 0;
							break;
						case 1:
							green = 0.4;
							yellow = 0.55;
							red = 0.05;
							break;
						case 2:
							green = 0.3;
							yellow = 0.6;
							red = 0.1;
							break;
					}
					break;
				case DifficultySelect.HARD:
					switch (this._difficulty)
					{
						case 0:
							green = 0.7;
							yellow = 0.3;
							red = 0;
							break;
						case 1:
							green = 0.4;
							yellow = 0.5;
							red = 0.1;
							break;
						case 2:
							green = 0.3;
							yellow = 0.55;
							red = 0.15;
							break;
					}
					break;
			}
			
			green *= this._baddyAmount;
			yellow *= this._baddyAmount;
			red *= this._baddyAmount;
			
			this._colorAmounts.push(green, yellow, red);
		}
		
		SetCardinalSpawnPoints(offSet, width, height)
		{
			this._cardinalPoints = [];
			
			for (let i = 0; i < 4; i++)
			{
				this._cardinalPoints.push([]);
			}
			
			// North
			this._cardinalPoints[0].push(new Point(this._stage.stageWidth / 2 - width / 2, -offSet - height), new Point(width, height));
			// South
			this._cardinalPoints[1].push(new Point(this._stage.stageWidth / 2 - width / 2, this._stage.stageHeight + offSet), new Point(width, height));
			// East
			this._cardinalPoints[2].push(new Point(-offSet-height, this._stage.stageHeight / 2 - width / 2), new Point(height, width));
			// West
			this._cardinalPoints[3].push(new Point(this._stage.stageWidth + offSet, this._stage.stageHeight / 2 - width / 2), new Point(height, width));
		}
		
		ArrangeArrays()
		{
			let mainType = this._baddyType.splice(this._branch, 1)[0];
			this._baddyType.unshift(mainType);
		}
		
		CreateArrays()
		{
			this._baddyType = ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"];
			this._generatorType = ["BaseGenerator", "FillGenerator", "CenterGenerator"];

			switch (DifficultySelect._difficulty)
			{
				case DifficultySelect.EASY:
					this._baddyStrenght = ["Weak", "Strong", "Fast"];
					break;
				case DifficultySelect.NORMAL:
					this._baddyStrenght = ["Weak", "Strong", "Fast"];
					break;
				case DifficultySelect.HARD:
					this._baddyStrenght = ["Weak", "Strong", "Invinsible"];
					break;
			}
		}
		
		CreateSpecificProps()
		{
			this._specificProperties = {};
			
			this._specificProperties["RammingBaddy"] = [new Point(20, 40)];
			this._specificProperties["BouncingBaddy"] = [5, 0.30];
			this._specificProperties["ExplodingBaddy"] = [7, 7];
			this._specificProperties["SnakeBaddy"] = [true];
			
			this._spawnSound = {};
			
			this._spawnSound["RammingBaddy"] = Sounds.RAMM_BADDY;
			this._spawnSound["BouncingBaddy"] = Sounds.BOUNCE_BADDY;
			this._spawnSound["ExplodingBaddy"] = Sounds.EXPLODE_BADDY;
			this._spawnSound["SnakeBaddy"] = Sounds.SNAKE_BADDY;
		}
	}

	window.Level = Level;

	class BaddyHolder
	{
		constructor(name, strength)
		{
			this._name = name;
			this._strength = strength;
			this._amount = 0;
		}
	}
}

