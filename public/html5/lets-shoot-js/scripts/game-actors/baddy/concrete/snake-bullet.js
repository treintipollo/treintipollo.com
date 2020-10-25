"use strict";

{
	class SnakeBullet extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._moveVector = null;
			this._tmpValues = null;
			this._bulletStats = null;
			this._parent = null;
			
			this._childTime = 0;
			this._frameCounter = 0;
		
			this._angle = 0;
			this._perpendicularAngle = 0;
			this._currentOscilattion = 0;
			this._maxOscillation = 0;
			this._oscillator = 0;
			
			this._followTime = 0;
			this._stopSeekingRadius = 0;
			this._isSeeking = false;
			this._erraticMovement = false;

			this._typeVertexCount = 6;
		}

		static GetVertexCount()
		{
			return 6;
		}
		
		SpecificInit(specificProps)
		{
			this._maxOscillation = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._childTime = NumberUtils.randRange(specificProps[1].x, specificProps[1].y, true);
			
			this._followTime = NumberUtils.randRange(specificProps[2].x, specificProps[2].y, true);
			this._stopSeekingRadius = specificProps[3];
			
			this._parent = specificProps[4];
			
			this._isSeeking = true;
			this._erraticMovement = false;
			this._frameCounter = 0;
			
			this._moveVector = new Point();
			
			if (this._target !== null)
			{
				this._tmpValues = VectorUtils.normalize(this._target, this._center, this._maxSpeed / 2);
				this._moveVector = this._tmpValues[0];
			}
			else
			{
				this.CalcRelativeCuadrant();
				this._perpendicularAngle = this._angle + 90 * (Math.PI / 180);
				
				this._moveVector.x = Math.cos(this._angle);
				this._moveVector.y = Math.sin(this._angle);
				
				this._currentOscilattion = 0;
				this._oscillator = 0;
				
				this._speed = this._maxSpeed / 3;
			}
			
			specificProps = null;
			
			this._bulletStats = new BaddyParameters();
			this._bulletStats.SetDrawParameters(1, 0xffffffff, 0xffff6a02);
			this._bulletStats.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 20);
			this._bulletStats.SetOptions(false, true);
			this._bulletStats.SetUpdateParameters(12, 2, this._radius / 2, this._maxLife / 10);
		}
		
		SpecificMovement()
		{
			if (this._target !== null)
			{
				if (this._isSeeking)
				{
					if (!VectorUtils.inRange(this._center, this._target, this._stopSeekingRadius))
					{
						if (this._frameCounter % this._followTime == 0)
						{
							if (this._erraticMovement)
							{
								this._angle = (NumberUtils.randRange(-180, 180)) * (Math.PI / 180);
								
								this._moveVector.x = Math.cos(this._angle) * this._maxSpeed;
								this._moveVector.y = Math.sin(this._angle) * this._maxSpeed;
								
								this._followTime /= 3;
								
								this._erraticMovement = false;
							}
							else
							{
								this._tmpValues = VectorUtils.normalize(this._target, this._center, this._maxSpeed / 2);
								this._moveVector = this._tmpValues[0];
								
								this._followTime *= 3;
								
								this._erraticMovement = true;
							}
						}
					}
					else
					{
						this._isSeeking = false;
					}
				}
				
				this._center.x += this._moveVector.x;
				this._center.y += this._moveVector.y;
			}
			else
			{
				this._oscillator += 0.017 * (this._speed * 2);
				
				this._pos.x += (this._moveVector.x * this._speed);
				this._pos.y += (this._moveVector.y * this._speed);
				
				this._currentOscilattion = Math.sin(this._oscillator) * this._maxOscillation;
				
				this._center.x = this._pos.x + Math.cos(this._perpendicularAngle) * this._currentOscilattion;
				this._center.y = this._pos.y + Math.sin(this._perpendicularAngle) * this._currentOscilattion;
			}
			
			if (this._frameCounter % this._childTime == 0)
			{
				BaddyManager.SetType("SnakeBaddy");
				BaddyManager.SetStatsByClass(this._bulletStats, "SnakeBulletTrail");
				BaddyManager.SetSpecificParams(false);
				BaddyManager.Add(this._center, null, this._center);
				BaddyManager.CleanForNextType();
			}
			
			const diameter = this._radius * 2;

			// Kill when off screen
			if (this._center.x + diameter >= 0 && this._center.x - diameter <= this._stage.stageWidth)
			{
				if (this._center.y + diameter >= 0 && this._center.y - diameter <= this._stage.stageHeight)
				{

				}
				else
				{
					this._life = 0;
				}
			}
			else
			{
				this._life = 0;
			}
			
			this._frameCounter++;
		}
		
		SpecificClean()
		{
			this._moveVector = null;
			this._bulletStats.Clean();
			this._bulletStats = null;
			this._tmpValues = null;
		}
		
		CalcRelativeCuadrant()
		{
			if (this._center.x >= this._parent.x)
			{
				if (this._center.y >= this._parent.y)
				{
					// Cuadrante 4
					this._angle = (NumberUtils.randRange(0, 90)) * (Math.PI / 180);
				}
				else
				{
					// Cuadrante 1
					this._angle = (NumberUtils.randRange(0, -90)) * (Math.PI / 180);
				}
			}
			else
			{
				if (this._center.y >= this._parent.y)
				{
					// Cuadrante 3
					this._angle = (NumberUtils.randRange(90, 180)) * (Math.PI / 180);
				}
				else
				{
					// Cuadrante 2
					this._angle = (NumberUtils.randRange(-90, -180)) * (Math.PI / 180);
				}
			}
		}
	}

	window.SnakeBullet = SnakeBullet;
}