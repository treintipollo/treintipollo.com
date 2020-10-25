"use strict";

{
	class ShotgunBullet extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._burst = false;
			this._angle = 0;
			this._moveVector = null;
			this._burstAmount = 0;

			this._typeVertexCount = 4;
		}

		static GetVertexCount()
		{
			return 4;
		}
		
		SpecificInit(specificProps)
		{
			this._angle = TrigUtils.calcAngleAtan2(this._target.x, this._target.y, this._center.x, this._center.y);
			this._moveVector = new Point();
			this._speed = this._maxSpeed-(NumberUtils.randRange(4, this._maxSpeed / 2));
			
			if (specificProps[0] !== 0)
			{
				this._burst = false;
				this._angle += (NumberUtils.randRange(-specificProps[0], specificProps[0])) * (Math.PI / 180);
			}
			else
			{
				this._burst = true;
				this._life /= 10;
				this._maxLife /= 10;
			}
			
			this._moveVector.x = Math.cos(this._angle);
			this._moveVector.y = Math.sin(this._angle);
			
			this._burstAmount = specificProps[1];
			
			specificProps = null;
		}
		
		SpecificMovement()
		{
			this._center.x += this._moveVector.x*this._speed;
			this._center.y += this._moveVector.y*this._speed;
			
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
			
			if (this._burst)
			{
				if (this._life <= 0)
				{
					BaddyManager.SetType("ShotgunBullet");
			 		BaddyManager.SetStatsByName("BossBullet");
			 		BaddyManager.SetSpecificParams(360, 0);
			 		
					for(let i = 0; i < this._burstAmount; i++)
					{
			 			BaddyManager.Add(this._center, this._target, null);
					}
					
					BaddyManager.CleanForNextType();
				}
			}
		}
		
		SpecificClean()
		{
			this._moveVector = null;
		}
	}
	
	window.ShotgunBullet = ShotgunBullet;
}