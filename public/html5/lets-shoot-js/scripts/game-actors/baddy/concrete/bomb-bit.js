"use strict";

{
	class BombBitBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._wasShot = false;
			this._angle = 0;
			this._radiusModifier = 0;
			this._moveVector = null;
			this._tmpValues = null;
			this._distanceToTarget = 0;
			this._posAroundParent = null;
			this._lastHitState = false;
			this._interpolator = 0;
			
			this._baddyType = null;
			this._specificProperties = null;
			this._playSound = false;

			this._typeVertexCount = 20;
		}

		static GetVertexCount()
		{
			return 20;
		}
		
		SpecificInit(specificProps)
		{
			this._radiusModifier = 0;
			this._interpolator = 1;
			this._angle = TrigUtils.calcAngleAtan2(this._center.x, this._center.y, this._parentPos.x, this._parentPos.y);
			this._wasShot = false;
			this._playSound = true;
			
			this._posAroundParent = this._center.clone();
			
			this._baddyType = ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"];
		
			this._specificProperties = {};
			
			this._specificProperties["RammingBaddy"] = [new Point(20, 40)];
			this._specificProperties["BouncingBaddy"] = [5, 0.30];
			this._specificProperties["ExplodingBaddy"] = [7, 7];
			this._specificProperties["SnakeBaddy"] = [true];
			
			specificProps = null;
		}
		
		SpecificMovement()
		{
			if (this._wasShot)
			{
				this._center.x += this._moveVector.x;
				this._center.y += this._moveVector.y;
				
				if (this._distanceToTarget > 0)
				{
					this._distanceToTarget -= this._maxSpeed;
				}
				else
				{
					this._life = 0;
					
					let color = 0xFF << 24 | this._fillColor;
					
					ParticleSystemMessages.Send("bomb-bit", {
						x: this._center.x,
						y: this._center.y,
						color: color
					});
				}
			}
		}
		
		SpecificClean()
		{
			this._baddyType = null;
			this._specificProperties = null;
			this._moveVector = null;
			this._posAroundParent = null;
		}
		
		AddBaddy(spawnPos)
		{
			let type = NumberUtils.randRange(0, this._baddyType.length - 1, true);
			let strength;
			
			if (this._fillColor == 0xffff0000)
			{
				strength = "Invinsible";
			}
			else if (this._fillColor == 0xffffff00)
			{
				strength = "Strong";
			}
			else if (this._fillColor == 0xffff6a03)
			{
				strength = "Fast";
			}
			else
			{
				strength = "Weak";
			}
			
			BaddyManager.SetType(this._baddyType[type]);
			BaddyManager.SetStatsByName(strength);
			BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyType[type]]);
			BaddyManager.Add(spawnPos, this._target, this._parentPos);
			BaddyManager.CleanForNextType();
			
			if (this._playSound)
			{
				SoundManager.Play(Sounds.SCREEN_SPAWN_ALARM);
				this._playSound = false;
			}
			
			spawnPos = null;
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
			
			this._speed += (speed*0.017);
			
			if (!this._wasShot)
			{
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
   			}
      		
      		if (!this._lastHitState && this._wasHitByBomb)
      		{
      			this._interpolator = 0;
      		}

      		this._lastHitState = this._wasHitByBomb;
      		
      		center = null;
      		
      		return res;
		}
		
		Fire()
		{
			SoundManager.Play(Sounds.MISSILE);
			
			this._wasShot = true;
			
			this._tmpValues = VectorUtils.normalize(this._target, this._center, this._maxSpeed);
			this._moveVector = this._tmpValues[0];
			this._distanceToTarget = this._tmpValues[1];
			
			this._tmpValues = null;
		}
		
		Kill()
		{
			this._life = 0;
		}
	}

	window.BombBitBaddy = BombBitBaddy;
}