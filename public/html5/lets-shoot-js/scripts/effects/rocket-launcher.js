"use strict";

{
	class RocketLauncher
	{
		constructor(x, y, width, angle)
		{
			this._rocket = null;
			this._pos = null;
			this._width = 0;
			this._angle = 0;
			this._shotsPerRoundMax = 0;
			this._roundWaitTime = 0;
			this._rocketLifeRange = null;
			this._rocketSpeedRange = null;
			this._frameCounter = 0;

			this._pos = new Point(x, y);
			this._width = width;
			this._angle = angle * (Math.PI / 180);
		}
		
		Init(shotsPerRoundMax, roundWaitTime, rocketLifeRange, rocketSpeedRange)
		{
			this._shotsPerRoundMax = shotsPerRoundMax;
			this._roundWaitTime = roundWaitTime;
			this._rocketLifeRange = rocketLifeRange;
			this._rocketSpeedRange = rocketSpeedRange;
			
			this._frameCounter = 0;
			this._rocket = [];
		}
		
		Update()
		{
			let shots = 0;
			let widht = 0;
			let rocketPosition = null;
			let rocketSpeed = 0;
			let rocketLife = 0;
			
			rocketPosition = new Point();
			
			if (this._frameCounter % this._roundWaitTime === 0)
			{
				shots = NumberUtils.randRange(1, this._shotsPerRoundMax, true);
				
				for (let i = 0; i < shots; i++)
				{
					widht = NumberUtils.randRange(0, this._width, true);
					rocketPosition.x = this._pos.x + Math.cos(this._angle) * widht;
					rocketPosition.y = this._pos.y + Math.sin(this._angle) * widht;
					
					rocketSpeed = NumberUtils.randRange(this._rocketSpeedRange.x, this._rocketSpeedRange.y, true);
					rocketLife = NumberUtils.randRange(this._rocketLifeRange.x, this._rocketLifeRange.y, true);
					
					this._rocket.push(new Rocket(rocketPosition.x, rocketPosition.y, this._angle - Math.PI / 2, rocketSpeed, rocketLife));
				}
			}
			
			if (this._rocket.length > 0)
			{
				for (let i = 0; i < this._rocket.length; i++)
				{
					if (this._rocket[i])
					{
						if (this._rocket[i].Update() === 0)
						{
							this._rocket[i].Clean();
							this._rocket[i] = null;
							this._rocket.splice(i, 1);
						}
					}
				}
			}
			
			this._frameCounter++;
			
			rocketPosition = null;
		}
		
		Clean()
		{
			for (let i = 0; i < this._rocket.length; i++)
			{
				this._rocket[i].Clean();
				this._rocket[i] = null;
			}
			
			this._rocket = null;
			this._pos = null;
		}
	}

	window.RocketLauncher = RocketLauncher;
}