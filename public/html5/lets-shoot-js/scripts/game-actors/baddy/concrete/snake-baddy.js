"use strict";

{
	const HORIZONTAL_VERTICAL = 0;
	const VERTICAL_HORIZONTAL = 1;
	const PSEUDO_DIAGONAL = 2;

	class SnakeBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._typeVertexCount = 6;
			
			this._isHead = false;
		
			this._movementType = 0;
			this._goingVertical = false;
			this._moveDir = null;
			this._frameCount = 0;
		}

		static GetVertexCount()
		{
			return 6;
		}
		
		SpecificInit(specificProps)
		{
			this._isHead = specificProps[0];
			this._frameCount = 0;
			this._moveDir = new Point();

			this.ChooseMoveType();
		}
		
		SpecificMovement()
		{
			if (this._isHead)
			{
				this._frameCount++;
				
				if (this._frameCount % 10 === 0)
				{
					this.CreateBodyPart();
				}
				
				if (this._frameCount % 50 === 0)
				{
					this.ChooseMoveType();
				}
				
				this.CheckPlayerDir();
				this.Follow(this._movementType);
			}
			else
			{
				if (this._isHitable)
				{
					this._life--;
				}
			}
		}
		
		SpecificClean()
		{
			this._moveDir = null;
		}
		
		ChooseMoveType()
		{
			let type = NumberUtils.randRange(0, 2);
			
			switch(type)
			{
				case HORIZONTAL_VERTICAL:
					this._goingVertical = false;
					this._movementType = 0;
					break;
				case VERTICAL_HORIZONTAL:
					this._goingVertical = true;
					this._movementType = 0;
					break;
				case PSEUDO_DIAGONAL:
					this._goingVertical = false;
					this._movementType = 2;
					break;
			}
		}
		
		CheckPlayerDir()
		{
			if (this._center.x < this._target.x)
			{
				this._moveDir.x = 1;
			}
			else
			{
				this._moveDir.x = -1;
			}
			if (this._center.y < this._target.y)
			{
				this._moveDir.y = 1;
			}
			else
			{
				this._moveDir.y = -1;
			}
		}
		
		Follow(type)
		{
			let deltaX = Math.abs(this._center.x - this._target.x);
			let deltaY = Math.abs(this._center.y - this._target.y);
			
			switch(type)
			{
				case HORIZONTAL_VERTICAL:
					if (!this._goingVertical)
					{
						if (deltaX > this._maxSpeed)
						{
							this._center.x += this._moveDir.x*this._maxSpeed / 2;
						}
						else
						{
							this._goingVertical = true;
						}
					}
					else
					{
						if (deltaY > this._maxSpeed)
						{
							this._center.y += this._moveDir.y*this._maxSpeed / 2;
						}
						else
						{
							this._goingVertical = false;
						}
					}
					break;
				case PSEUDO_DIAGONAL:
					if (!this._goingVertical)
					{
						if (deltaX > this._maxSpeed)
						{
							this._center.x += this._moveDir.x*this._maxSpeed / 2;
						}
						else
						{
							this._goingVertical = true;
						}
						
						if (this._frameCount % 20 === 0)
						{
							this._goingVertical = true;
						}
					}
					else
					{
						if (deltaY > this._maxSpeed)
						{
							this._center.y += this._moveDir.y * this._maxSpeed / 2;
						}
						else
						{
							this._goingVertical = false;
						}
						
						if (this._frameCount % 20 === 0)
						{
							this._goingVertical = false;
						}
					}
					break;
			}
		}
		
		CreateBodyPart()
		{
			let stats = new BaddyParameters();
			let tmpSpecificParams = [];
			
			stats.SetUpdateParameters(this._maxSpeed, this._rotationSpeedInit, this._radiusInit / 2, this._maxLife / 10);
			stats.SetOptions(this._isHitable, this._isVisible);
			stats.SetDrawParameters(this._lineWidth, this._lineColor, 0xff000000);
			stats.SetSegmentParameters(this._segmentSpeedRange, this._segmentRotSpeedRange, this._segmentLife / 2);
 			stats.SetSound(false);
			
			for(let i = 0; i < this._specificParams.length; i++)
			{
				if (i === 0)
				{
					tmpSpecificParams[0] = false;
				}
				else
				{
					tmpSpecificParams[i] = this._specificParams[i];
				}
			}
			
			BaddyManager.SetType(this._name);
			BaddyManager.SetStatsByClass(stats, this._strengthName + "SnakeBodyPart");
			BaddyManager.SetSpecificParamsAsArray(tmpSpecificParams);
			BaddyManager.Add(this._center);
			BaddyManager.CleanForNextType();
		}
	}

	window.SnakeBaddy = SnakeBaddy;
}