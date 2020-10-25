"use strict";

{
	class AttackBitBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._angle = 0;
			this._radiusModifier = 0;
			this._posAroundParent = null;
			this._lastHitState = false;
			this._tmpValues = null;
			this._moveVector = null;
			
			this._interpolator = 0;

			this._typeVertexCount = 20;
		}

		static GetVertexCount()
		{
			return 20;
		}
		
		SpecificInit(specificProps)
		{
			this._posAroundParent = this._center.clone();
			this._lastHitState = false;
			
			this._radiusModifier = 0;
			this._interpolator = 1;
			this._angle = TrigUtils.calcAngleAtan2(this._center.x, this._center.y, this._parentPos.x, this._parentPos.y);
			
			specificProps = null;
		}
		
		SpecificMovement()
		{
			if (this._life <= 0)
			{
				let color = 0xFF << 24 | this._lineColor;
				
				ParticleSystemMessages.Send("attack-bit", {
					x: this._center.x,
					y: this._center.y,
					color: color
				});
			}
		}
		
		SpecificClean()
		{
			this._posAroundParent = null;
			this._tmpValues = null;
			this._moveVector = null;
		}
		
		OuterUpdate(center, rotRadius, speed)
		{
			let res = false;
			
			if (this._radiusModifier < 1)
			{
				this._radiusModifier += 0.03;
			}
			else
			{
				this._radiusModifier = 1;
				
				res = true;
			}
			
			this._speed += (speed * 0.017);
			
			if (this._interpolator < 1)
			{
				if (!this._wasHitByBomb)
				{
	   				this._interpolator += 0.01;
	   				
	      			this._center.x = NumberUtils.interpolate(this._interpolator, this._center.x, this._posAroundParent.x);
					this._center.y = NumberUtils.interpolate(this._interpolator, this._center.y, this._posAroundParent.y);
				}
   			}
   			else
   			{
   				this._interpolator = 1;
   				this._center.x = center.x + Math.cos(this._angle + this._speed) * (rotRadius * this._radiusModifier);
      			this._center.y = center.y + Math.sin(this._angle + this._speed) * (rotRadius * this._radiusModifier);
			}
   			 
      		this._posAroundParent.x = center.x + Math.cos(this._angle + this._speed) * (rotRadius * this._radiusModifier);
      		this._posAroundParent.y = center.y + Math.sin(this._angle + this._speed) * (rotRadius * this._radiusModifier);
      		
      		if (!this._lastHitState && this._wasHitByBomb)
      		{
      			this._interpolator = 0;
      		}

      		this._lastHitState = this._wasHitByBomb;
      		
      		center = null;
      		
      		return res;
		}
		
		Kill()
		{
			this._life = 0;
		}
	}

	window.AttackBitBaddy = AttackBitBaddy;
}