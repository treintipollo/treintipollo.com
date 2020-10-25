"use strict";

{
	class Baddy_Segment extends Sprite
	{
		constructor(spritesheet, animationName, vertexes, parentPos, stage, isVisible)
		{
			super(spritesheet, animationName);

			this._stage = stage;
			
			const middlePoint = this.CalcMiddlePoint(vertexes);

			this.x = middlePoint.x;
			this.y = middlePoint.y;

			this._parentPos = parentPos;
			this._moveVector = this.CalcMoveVectors();
			this.rotation = this.CalcInitAngle(vertexes) * (180 / Math.PI);
			
			if (isVisible)
				this._stage.addChild(this);
			
			this._isAlive = true;
			
			this._speed = 0;
			this._rotSpeed = 0;
			this._life = 0;
			this._maxLife = 0;

			this.stop();
		}
		
		SetUpdateParams(speedRange, rotSpeedRange, life)
		{
			this._speed = NumberUtils.randRange(speedRange.x, speedRange.y);
			this._rotSpeed = NumberUtils.randRange(rotSpeedRange.x, rotSpeedRange.y);
			this._life = life;
			this._maxLife = life;
		}
		
		SetDrawParams(color, lineWidth, id)
		{
			const length = DynamicGraphics.GetSegmentLength(id);

			this.regX = length / 2;
			this.regY = lineWidth / 2;
		}
		
		Update()
		{
			if (this._life > 0)
			{
				// Move middle point away from center
				// Speed lowers as the segment disappears
				this.x += this._moveVector.x * (this._speed * this.alpha);
				this.y += this._moveVector.y * (this._speed * this.alpha);
				// Rotate around middle point
				this.rotation += this._rotSpeed
				// Interpolation rules!
				this.alpha = NumberUtils.normalize(this._life, 0, this._maxLife);
				// Making segments smaller as they come closer to ultimate death.
				this.scaleX = this.alpha;
				
				this._life--;
			}
			else
			{
				this._isAlive = false;
			}
		}
		
		Clean()
	    {
	    	this._stage.removeChild(this);
	    	
			this._moveVector = null;
			this._parentPos = null;
	    	this._stage = null;
	    }
		
		CalcInitAngle(vertexes)
		{
			return TrigUtils.calcAngle(vertexes[0].x, vertexes[0].y, vertexes[1].x, vertexes[1].y);
		}
		
		CalcMiddlePoint(vertexes)
		{
		  	return new Point(
		  		(vertexes[0].x + vertexes[1].x) / 2,
		  		(vertexes[0].y + vertexes[1].y) / 2
		  	);
		}

		CalcMoveVectors()
		{
			let deltaMidCenterX = this.x - this._parentPos.x;
			let deltaMidCenterY = this.y - this._parentPos.y;
			let midlenght = Math.sqrt((deltaMidCenterX * deltaMidCenterX) + (deltaMidCenterY * deltaMidCenterY));

			return new Point(deltaMidCenterX / midlenght, deltaMidCenterY / midlenght);
		}
	}

	window.Baddy_Segment = Baddy_Segment;
}