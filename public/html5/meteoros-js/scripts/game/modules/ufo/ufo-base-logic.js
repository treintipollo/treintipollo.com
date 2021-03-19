"use strict";

{
	class UfoBaseLogic extends Logic
	{
		constructor()
		{
			super();

			this._initX = 0;
			this._initY = 0;
			
			this._tumblingTime = 0;
			this._tumblingTimer = 0;
			
			this._deathTimeAccumulator = 0;
			this._deathTime = 0;
			this._deathTimer = 0;
			this._deathAngle = 0;
			this._deathDirX = 0;
			this._deathDirY = 0;
			this._frameCounter = 0;
			this._particleController = null;
			this._deathParticlesPos = null;
			
			this._startDeathMotion = false;
			this._hitTaken = false;
			
			this._hp = 0;
			this._moves = 0;
			this._moveWaitTime = 0;
			this._speed = 0;
			this._attackWaitTime = 0;
			this._hightLimit = 0;
			this._actorManager = null;
			
			this._moving = false;
			this._moveWaitTimer = 0;
			this._attackWaitTimer = 0;
			this._oscillator = 0;
			this._vanishingSpeed = 0;
			
			this._targetCity = null;
			this._startCapture = false;

			this._nextPos	= new Point();
			this._targetPos = new Point();

			this._hitCount = 3;
			this._showHitFeedback = true;
			this._killedByMissile = false;

			this._on_bomb_exploded = (system) => this.onBombExplosionEnd(system);
		}
		
		baseInit(initParams)
		{
			this._hp 			  = initParams._hp;
			this._moves 		  = initParams._moves;
			this._moveWaitTime    = initParams._moveWaitTime;
			this._speed 		  = initParams._speed;
			this._attackWaitTime  = initParams._attackWaitTime;
			this._hightLimit 	  = initParams._heightLimit;
			this._actorManager    = initParams._actorManager;
			
			this._tumblingTime 	  = 0.5;
			this._tumblingTimer	  = 0;
			this._hitTaken		  = false;
			
			this._startDeathMotion  = false;
			this._deathTime 		= 12;
			this._deathTimer 		= 0;
			this._frameCounter 	    = 0;
			this._deathParticlesPos = new SharedPoint();
			this._vanishingSpeed 	= 5;
			
			this._oscillator 	  = NumberUtils.randRange(0, Math.PI * 2);
			this._moveWaitTimer   = 0;
			this._attackWaitTimer = 0;
			this._moving		  = false
			this._startCapture    = false;

			this._killedByMissile = false;
		}
		
		baseUpdate(deltaTime)
		{
			this._oscillator += 0.017 * 5;
			
			if (this._hitTaken)
			{
				if (this._tumblingTimer < this._tumblingTime)
				{
					this._tumblingTimer += deltaTime;
					
					this._rotation = Math.random() * (12 * 2) - 12;
					
					if ((this._frameCounter & 1) === 0)
					{
						this._posX += Math.random() * 5;
						this._posY += Math.random() * 5;
					}
					else
					{
						this._posX = this._initX;
						this._posY = this._initY;
					}
				}
				else
				{
					this.stopTumbling();
				}
			}
			
			if (this._startDeathMotion)
			{
				this._externalParameters["shielding"] = false;
				this._externalParameters["active"] 	= false;
				
				if (this._deathTimer < this._deathTime)
				{
					this._deathTimer += deltaTime * 5;
					this._posX = this._initX + (this._deathDirX * this._deathTimer);
					this._posY = this._initY - (this._deathDirY * this._deathTimer) + (9.8 * 0.5 * this._deathTimer * this._deathTimer);
					
					this._rotation += 10;
				}
				else
				{
					if (this._showHitFeedback && this._killedByMissile)
					{
						const hitFeedbackArguments = Nukes.actorManager.getInitParams("HitFeedback");
						hitFeedbackArguments._logicInitParams[0] = `HIT +${this._hitCount}`;
						Nukes.actorManager.setActor("HitFeedback", this._x, this._y);
						this._externalParameters["HitAmount"] = this._hitCount;
					}

					this._parent.Active = false;
				}
			}
			
			this._deathParticlesPos.x = this._posX;
			this._deathParticlesPos.y = this._posY;
			
			this._frameCounter++;
		}
		
		stopTumbling()
		{
			if (this._hitTaken)
			{
				this._posX = this._initX;
				this._posY = this._initY;
			}
			
			this._hitTaken = false;
			this._rotation = 0;
		}
		
		baseRelease()
		{
			if (this._deathParticlesPos.length > 0 && this._startDeathMotion)
			{
				if (this._deathTimer > this._deathTime)
				{
					this._deathParticlesPos.x = this._posX;
					this._deathParticlesPos.y = this._posY;
					
					ParticleSystemManager.GetSystem("BombHit", this._deathParticlesPos, false, this._on_bomb_exploded);
				}
			}
			
			if (this._particleController)
				this._particleController._clear = true
			
			this._particleController = null;
			this._targetCity   	   	 = null;
			this._actorManager 	   	 = null;
		}
		
		onBombExplosionEnd(system)
		{
			if (this._deathParticlesPos)
			{
				this._deathParticlesPos.x = 0;
				this._deathParticlesPos.y = 0;
			}
		}
		
		baseDestroy()
		{
			this.baseRelease();
			
			if (this._deathParticlesPos)
			{
				this._deathParticlesPos.Clean();
				this._deathParticlesPos = null;
			}

			this._targetPos 	  	  = null;
			this._nextPos		  	  = null;
			this._on_bomb_exploded    = null;
		}
		
		startDeathAnim()
		{
			this._particleController = ParticleSystemManager.GetSystem("UFODeath", this._deathParticlesPos, true);
			
			this._startDeathMotion = true;
			this._hitTaken 		   = false;
			
			this._deathAngle = NumberUtils.randRange(100, 80, true) * NumberUtils.TO_RADIAN;
			this._deathDirX  = Math.cos(this._deathAngle) * 50;
			this._deathDirY  = Math.sin(this._deathAngle) * 50;
		}
		
		onCollide(opponent, deltaTime)
		{
			if (!this._externalParameters["shielding"] && !this._startDeathMotion)
			{
				this._initX = this._posX;
				this._initY = this._posY;
				
				if (this._hp > 0)
				{
					this._hp--;
					this._hitTaken 	  	= true;
					this._tumblingTimer = 0;
				}
				else
				{
					if (opponent instanceof MissileLogic)
						this._killedByMissile = true;

					this.startDeathAnim();
				}
			}
		}
	}

	window.UfoBaseLogic = UfoBaseLogic;
}