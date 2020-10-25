"use strict";

{
	class StraightBullet extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._moveVector = null;
			this._tmpValues = null;

			this._typeVertexCount = 3;
		}

		static GetVertexCount()
		{
			return 3;
		}
		
		SpecificInit(specificProps)
		{
			if (specificProps[0] !== null)
			{
				this._moveVector = new Point();
				this._moveVector.x = specificProps[0].x * this._maxSpeed;
				this._moveVector.y = specificProps[0].y * this._maxSpeed;
			}
			else
			{
				if (this._target !== null)
				{
					this._tmpValues = VectorUtils.normalize(this._target, this._center, this._maxSpeed);
					this._moveVector = this._tmpValues[0];
				}
				else
				{
					this._tmpValues = VectorUtils.normalize(this._center, specificProps[1], this._maxSpeed / 4);
					this._moveVector = this._tmpValues[0];
				}
			}
			
			specificProps = null;
			this._tmpValues = null;
		}
		
		SpecificMovement()
		{
			this._center.x += this._moveVector.x;
			this._center.y += this._moveVector.y;
			
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
			this._moveVector = null;
			this._tmpValues = null;
		}
	}

	window.StraightBullet = StraightBullet;
}