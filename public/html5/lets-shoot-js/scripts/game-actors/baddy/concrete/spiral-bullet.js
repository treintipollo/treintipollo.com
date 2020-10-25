"use strict";

{
	class SpiralBullet extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._spiralRadiusIncrease = 0;
			this._spiralRadius = 0;
			this._spiralSpeed = 0;
			this._initAngle = 0;

			this._typeVertexCount = 5;
		}

		static GetVertexCount()
		{
			return 5;
		}
		
		SpecificInit(specificProps)
		{
			this._spiralRadiusIncrease = specificProps[0];
			
			if (specificProps[2])
			{
				this._spiralSpeed = specificProps[1] * (Math.PI / 180);
			}
			else
			{
				this._spiralSpeed = -specificProps[1] * (Math.PI / 180);
			}
			
			this._spiralRadius = 0;
			this._speed = 0;
			
			this._initAngle = TrigUtils.calcAngleAtan2(this._center.x, this._center.y, this._parentPos.x, this._parentPos.y);
			
			specificProps = null;
		}
		
		SpecificMovement()
		{
			this._speed += this._spiralSpeed;
			this._spiralRadius += this._spiralRadiusIncrease;
			
			this._center.x = this._parentPos.x + Math.cos(this._speed + this._initAngle) * this._spiralRadius;
			this._center.y = this._parentPos.y + Math.sin(this._speed + this._initAngle) * this._spiralRadius;
			
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
		}
		
		SpecificClean()
		{

		}
	}

	window.SpiralBullet = SpiralBullet;
}