"use strict";

{
	const tempArrayView = new Int32Array(new ArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4));

	class Base_System
	{
		constructor(particleClass, particleAmount)
		{
			//Particle Properties
			this._particleWidth = 0;
			this._particleHeight = 0;
			this._particleColor = 0x000000;
			this._waitTimeBetweenInitializations = 0;
			this._particlesPerFrame = 0;
			this._particleLife = null;
			this._particleRotation = 0;
			this._interpolationColor = 0x000000;
			this._interpolationSize = null;
			this._particleGraphicsRange = null;
			this._particleLifeModifier = 0;
			this._particleSpecificProps = null;
		
			//System Properties
			this._deadCallback = null;
			this._lifeType = 0;
			this._systemSpecificProps = null;
			
			this._particleGraphicsIndex = 0;
			this._nextParticleIndex = 0;
			this._systemDead = false;
			this._particlesAlive = false;
			this._deltaTimeAccumulator = 0;

			this._processedPos  = new Point();
			this._particlePool  = new Array(particleAmount);
			this._controller    = new SystemController(this);

			for (let i = 0; i < particleAmount; i++)
				this._particlePool[i] = new particleClass();
		
			this._recycle = true;
		}
		
		InitBase(systemInitArguments, pos, getController, deadCallback, graphicsRanges)
		{
			this._recycle      		     = false;
			this._particleGraphicsIndex  = -1;
			this._nextParticleIndex      = 0;
			this._deltaTimeAccumulator   = 0;
			
			this._particleWidth 				 = systemInitArguments._width;
			this._particleHeight 				 = systemInitArguments._height;
			this._particleRotation 				 = systemInitArguments._rotation;
			this._particleColor 				 = systemInitArguments._color;
			this._particleLife 					 = systemInitArguments._lifeRange;
			this._waitTimeBetweenInitializations = systemInitArguments._waitTimeSec;
			this._particlesPerFrame 			 = systemInitArguments._particlesPerFrame;
			this._particleLifeModifier			 = systemInitArguments._particleLifeModifier;
			
			this._controller._clear    = false;
			this._controller._stop     = false;
			this._controller._life     = systemInitArguments._systemLife;
			this._controller._maxLife  = systemInitArguments._systemLife;
			this._controller._rotation = systemInitArguments._rotation;
			this._controller._pos 	   = pos;
			
			this._lifeType 			   = systemInitArguments._lifeType;
			this._interpolationColor   = systemInitArguments._interpolationColor;
			this._interpolationSize    = systemInitArguments._interpolationSize;
			this._deadCallback 		   = deadCallback;
			
			if (systemInitArguments._graphicsRange !== -1)
			{
				this._particleGraphicsRange = graphicsRanges[systemInitArguments._graphicsRange];
			}
			
			if (systemInitArguments._particleProps)
			{
				this._particleSpecificProps = systemInitArguments._particleProps;
			}
			
			if (systemInitArguments._systemProps)
			{
				this.InitSpecific(systemInitArguments._systemProps);
			}
			
			if (getController)
			{
				return this._controller;
			}
			
			return null;
		}
		
		GetController()
		{
			return this._controller;
		}
		
		InitSpecific(specificProps)
		{

		}
		
		OnBatchCreated()
		{

		}
		
		ProcessInitPos(x, y)
		{
			this._processedPos.x = x;
			this._processedPos.y = y;
		}
		
		Update(deltaTime)
		{
			// Initializing block
			this._systemDead = false;
			
			if (this._controller._life !== -666)
			{
				if (this._controller._life > 0 && this._controller.canProduceParticles())
				{
					if (this._lifeType === 0)
					{
						this._controller._life--;
					}
					else
					{
						this._controller._life -= deltaTime;
					}
				}
				else
				{
					this._systemDead = true;
				}
			}
			else
			{
				if (!this._controller.canProduceParticles())
				{
					this._systemDead = true;
				}
			}
			
			// Grab the next available particle only if the system is alive
			if (!this._systemDead)
			{
				if (this._deltaTimeAccumulator < this._waitTimeBetweenInitializations)
				{
					this._deltaTimeAccumulator += deltaTime;
				}
				else
				{
					this._deltaTimeAccumulator = 0;
					
					// Initiating as many particles as needed per cycle.
					for (let i = 0; i < this._particlesPerFrame; i++)
					{
						const currentParticle = this._particlePool[this._nextParticleIndex];
						
						// Next particle should be available for use, can't take particles that haven't finished their cycle yet.
						if (!currentParticle._enable)
						{
							const currentSystemPos = this._controller._pos;
							
							this.ProcessInitPos(currentSystemPos.x, currentSystemPos.y);
							
							// Initializing the current particle
							if (this._particleGraphicsRange)
							{
								this._particleGraphicsIndex = NumberUtils.randRange(this._particleGraphicsRange.x, this._particleGraphicsRange.y - 1, true);
							}

							currentParticle.InitBase(this._processedPos.x, this._processedPos.y, this._controller._rotation, this._particleWidth, this._particleHeight, this._particleColor, this._particleLife, this._particleGraphicsIndex, this._interpolationColor, this._interpolationSize, this._particleLifeModifier, currentSystemPos);
							currentParticle.InitSpecific(this._particleSpecificProps);
							
							// Advancing to next index
							if (this._nextParticleIndex < this._particlePool.length - 1)
							{
								this._nextParticleIndex++;
							}
							else
							{
								this._nextParticleIndex = 0;
							}
						}
					}
					
					this.OnBatchCreated();
				}
			}
			
			this._particlesAlive = false;
			
			// Update block
			if (!this._recycle)
			{
				for (let j = this._particlePool.length - 1; j >= 0; j--)
				{
					const currentParticle = this._particlePool[j];
					
					if (currentParticle._enable)
					{
						this._particlesAlive = true;
						
						currentParticle.Update(deltaTime);
						
						if (currentParticle._graphicsIndex === -1)
						{
							// Square particles

							ParticleSystemManager._context.fillStyle = currentParticle.Color;

							tempArrayView[0] = Base_Particle._x;
							tempArrayView[1] = Base_Particle._y;
							tempArrayView[2] = Base_Particle._w;
							tempArrayView[3] = Base_Particle._h;

							ParticleSystemManager._context.fillRect(
								tempArrayView[0],
								tempArrayView[1],
								tempArrayView[2],
								tempArrayView[3]
							);
						}
						else
						{
							// Custom Graphics particles, rotation and scaling
							const particleGraphics = ParticleSystemManager._particleGraphics[currentParticle._graphicsIndex];
							
							const width = particleGraphics.width;
							const height = particleGraphics.height;

							if (currentParticle._angle !== 0 || currentParticle._scale.x !== 1 || currentParticle._scale.y !== 1)
							{
								const a = Math.PI * (currentParticle._angle / 360);
								const c = Math.cos(a);
								const s = Math.sin(a);
								
								ParticleSystemManager._context.setTransform(
									c * currentParticle._scale.x,
									s,
									-s,
									c * currentParticle._scale.y,
									currentParticle._pos.x,
									currentParticle._pos.y
								);
								
								ParticleSystemManager._context.drawImage(
									particleGraphics,
									0,
									0,
									width,
									height,
									0,
									0,
									width,
									height
								);
							}
							else
							{
								// Custom Graphics particles no transformation
								ParticleSystemManager._context.drawImage(
									particleGraphics,
									0,
									0,
									width,
									height,
									currentParticle._pos.x,
									currentParticle._pos.y,
									width,
									height
								);
							}
						}
					}
				}
			}
			
			// Destroy block
			if (this._systemDead && !this._particlesAlive)
			{
				if (this._deadCallback)
				{
					this._deadCallback(this);
				}
				
				this._controller.clean();
				
				this._recycle = true;
				
				this._particleGraphicsRange = null;
				this._particleLife 		   	= null;
				this._interpolationSize 	= null;
				this._particleSpecificProps = null;
				this._systemSpecificProps   = null;
				this._deadCallback		   	= null;
				
				ParticleSystemManager.SystemDead();
			}
			
			if (this._controller._stop)
			{
				this.interrupt();

				ParticleSystemManager.SystemDead();
			}
		}
		
		interrupt()
		{
			this._controller.clean();
			
			this._recycle = true;
			
			this._particleGraphicsRange = null;
			this._particleLife 		   	= null;
			this._interpolationSize 	= null;
			this._particleSpecificProps = null;
			this._systemSpecificProps   = null;
			this._deadCallback		   	= null;
			
			for (let j = this._particlePool.length - 1; j >= 0; j--)
			{
				this._particlePool[j]._enable = false;
			}
		}
	}

	window.Base_System = Base_System;
}