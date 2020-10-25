"use strict";

{
	class ShootingStar
	{
		constructor(x, y, speed, stage)
		{
			this._pos = null;
			this._dir = null;
			this._speed = 0;
			this._stage = null;
			
			this._pos = new SharedPoint(x, y);
			
			const r = NumberUtils.randRange(0, 255, true);
			const g = NumberUtils.randRange(0, 255, true);
			const b = NumberUtils.randRange(0, 255, true);
			const color = 0xFF << 24 | r << 16 | g << 8 | b;
			
			ParticleSystemMessages.Send("shooting-star", {
				pointBuffer: this._pos.buffer,
				color: color
			});

			this._dir = new Point(NumberUtils.randRange(-0.1,0.1), NumberUtils.randRange(-0.1,0.1)); 
			this._speed = speed;
			this._stage = stage;
		}
		
		Update(click)
		{
			this._pos.x += this._dir.x * this._speed;
			this._pos.y += this._dir.y * this._speed;
			
			this.GetNewDir(click);
			this.CheckBorders();
		}
		
		Clean()
		{
			this._pos.Clean();
			this._pos = null;

			this._dir = null;
			this._stage = null;
		}
		
		GetNewDir(click)
		{
			if (click)
				this._dir = VectorUtils.normalize(new Point(this._stage.mouseX, this._stage.mouseY), this._pos)[0];
		}
		
		CheckBorders()
		{
			if (this._pos.x < 0)
			{
				this._pos.x = this._stage.stageWidth;
				
				return true;
			}
			else if (this._pos.y < 0)
			{
				this._pos.y = this._stage.stageHeight;
				
				return true;
			}
			else if (this._pos.x  > this._stage.stageWidth)
			{
				this._pos.x = 0;
				
				return true
			}
			else if (this._pos.y > this._stage.stageHeight)
			{
				this._pos.y = 0;
				
				return true;
			}
			else
			{
				return false;
			}
		}
	}

	window.ShootingStar = ShootingStar;
}