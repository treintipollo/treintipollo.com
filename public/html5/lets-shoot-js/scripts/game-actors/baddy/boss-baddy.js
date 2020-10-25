"use strict";

{
	let ISDEAD = false;

	class BossBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			// Stuff below needs to be visible to all Bosses patterns
			this._corners = null;
			this._attackPoint = null;
			this._rotations = null;
			
			this._tmpValues = null;
			this._moveVector = null;
			
			this._doFinalAttack = false;
			this._isAttacking = false;
			
			this._branch = 0;
			this._currentMovement = 0;
			this._frameCounter = 0;
			this._slowMovementSpeed = 0;
			this._starRadius = 0;
			this._maxRotation = 0;
			this._basicMovementTimer = 0;
			this._basicMovementTimerInit = 0;
			this._collisionRadius = 0;
			
			this._originalColor = null;
			this._transitionColorTransform = null;
			
			// Booses don't need to know any of these
			this._innerVertexes = null;
			
			this._timerRange = null;
			this._calcMoveVector = false;
			
			this._slowMovementRange = null;
			this._slowMovementLenght = 0;
			this._slowMovementInitSpeed = 0;
			
			this._cornerMovementSpeed = 0;
			this._cornerMovementInitSpeed = 0;
			this._moveAmount = 0;
			
			this._isCharging = false;
			this._isMoving = false;
			this._lastCorner = 0;
			this._cornerDistance = 0;
			
			this._attackTimeRange = null;
			this._attackTime = 0;
			this._shootRadius = 0;
			
			this._deathTime = 0;
			
			this._bossStateMachine = null;
			this._bigBossCurrentState = 0;
			
			this._lastHitState = false;
			
			this._feedbackFrame = null;
			this._fullRect = null;
			this._lifeMeter = null;
			this._lifeMeterBG = null;
			this._attackMeter = null;
			this._attackMeterBG = null;
			this._lifeMeterColor = 0;
			this._attackTimerText = null;
			this._lifeMeterText = null;
			this._explodingFeedBack = null;
			this._initFeedBackBlowUp = false;

			this._typeVertexCount = 5;
		}

		static GetVertexCount()
		{
			return 5;
		}

		static get _isDead()
		{
			return ISDEAD;
		}

		static set _isDead(v)
		{
			ISDEAD = v;
		}
		
		SpecificInit(specificProps)
		{
			// Baddy parameters
			this._branch = specificProps[0];
			this._timerRange = specificProps[1];
			this._slowMovementRange = specificProps[2];
			this._slowMovementSpeed = specificProps[3];
			this._cornerMovementSpeed = specificProps[4];
			this._attackTimeRange = specificProps[5];
			this._deathTime = specificProps[6];
		
			// Each of this adds is an individual Boss
			this._bossStateMachine = new StateMachine(this);
			this._bossStateMachine.Add(new RammBoss(this._stage, new Point(2, 5)));
			this._bossStateMachine.Add(new BounceBoss(this._stage, new Point(this._maxSpeed / 2, this._maxSpeed)));
			this._bossStateMachine.Add(new ExplodeBoss(this._stage, new Point(3, 7), new Point(500, 700)));
			this._bossStateMachine.Add(new SnakeBoss(this._stage));
			this._bossStateMachine.Add(new BigBoss(this._stage, 8, 4, 1, 1000, 200, 5));
			
			// If it is not the starting Boss, choose pattern according to branch
			// Else choose a random starting pattern for the Big Boss
			if (this._branch !== 4)
			{
				this._bossStateMachine.SetFirst(this._branch);
			}
			else
			{
				this._bigBossCurrentState = NumberUtils.randRange(0, this._branch - 1, true);
				this._bossStateMachine.SetFirst(this._bigBossCurrentState);
			}
			
			// This holds the vertexes for the inner pentagon.
			this._innerVertexes = [];
			// This array holds the positions the Boss will be moving along during it's "Corner Movement" routine.
			this._corners = [];
			// Shots will come out of this positions
			this._attackPoint = [];
			this._rotations = [];
			
			this._calcMoveVector = true;
			this._doFinalAttack = false;
			this._isCharging = true;
			this._isAttacking = false;
			this._isMoving = false;
			this._lastHitState = false;
			this._initFeedBackBlowUp = true;
			this._frameCounter = 0;
			this._lastCorner = 0;
			this._moveAmount = 1;
			this._maxRotation = this._rotationSpeedInit * 10;
			this._slowMovementInitSpeed = this._slowMovementSpeed;
			this._cornerMovementInitSpeed = this._cornerMovementSpeed;
			
			this._currentMovement = 0;
			this._basicMovementTimer = NumberUtils.randRange(this._timerRange.x, this._timerRange.y, true);
			this._basicMovementTimerInit = this._basicMovementTimer;
			
			// Saving original Radius
			this._starRadius = this._radius;
			
			let nodeSize = Grid_Revenge.GetNodeSize();
			
			// Top Right
			this._corners.push(new Point(this._stage.stageWidth - nodeSize.x, nodeSize.y));
			// Top Left
			this._corners.push(new Point(nodeSize.x, nodeSize.y));
			// Bottom Left
			this._corners.push(new Point(nodeSize.x, this._stage.stageHeight - nodeSize.y));
			// Bottom Right
			this._corners.push(new Point(this._stage.stageWidth - nodeSize.x, this._stage.stageHeight - nodeSize.y));
			
			this._originalColor = this.transform.colorTransform;
			this._transitionColorTransform = new ColorTransform();
			
			ISDEAD = false;
			
			// This will be used to draw the Bosses life meter and time for next attack meter
			this.CreateFeedback(nodeSize, 10);
		}
		
		SpecificSpawn()
		{
			if (this._bossStateMachine.CurrentStateFirstCall())
				this._bossStateMachine.Update();
		}

		SpecificMovement()
		{
			// This actually makes sense without a comment!
			if (this._wasHitByBomb)
			{
				this.SlowDown();
				this.CoolDown();
			}
			
			if (this._lastHitState && !this._wasHitByBomb)
			{
				// I Avoid choosing pattern 0 here to be sure the game won't lock up in an infinite while
				if (!this._doFinalAttack)
				{
					this.GlobalReset(1);
				}
				else
				{
					this.GlobalReset();
				}
			}
			
			if (!this._doFinalAttack)
			{
				this.ChoosePattern();
			}
			
			this._lastHitState = this._wasHitByBomb;
			
			this.BasicPattern();
			
			// Specific Attack pattern Update
			this._bossStateMachine.Update();
			
			// Having the same IF as the one right above seems kinda stupid, well it isn't
			// so shut the fuck up! When the timer for a given pattern runs out, and for a a single
			// frame the currentMovement is -1, I don't want to go into the default generic or specific 
			// cases, so I do this whole bolony after that logic to avoid weird behaiviours from the boss.
			if (!this._doFinalAttack)
			{
				this.CheckPatternTimer();
			}
			else
			{
				if (this._basicMovementTimer > 0)
				{
					this._basicMovementTimer--;
				}
			}
			
			// Updating shooting spots positions.
			for (let i = 0; i < this._vertexCount; i++)
			{
				this._attackPoint[i].x = this._center.x + Math.cos(this._rotations[i] + (this.rotation * (Math.PI / 180))) * this._shootRadius;
				this._attackPoint[i].y = this._center.y + Math.sin(this._rotations[i] + (this.rotation * (Math.PI / 180))) * this._shootRadius;
			}
			
			// This Triggers death animation and it's attack
			if (!ISDEAD)
			{
				if (this._life <= 1)
				{
					this._life = 1;
					this._currentMovement = 666;
				}
			}
			
			this.DrawBossFeedBack();
			this.ChooseMusic();
			
			this._frameCounter++;
		}
		
		SpecificClean()
		{
			this._bossStateMachine.Clean();
			this._bossStateMachine = null;
			
			if (this._explodingFeedBack !== null)
			{
				this._explodingFeedBack.Clean();
				this._explodingFeedBack = null;
			}
			
			if (this._attackTimerText !== null)
			{
				this._attackTimerText.Clean();
				this._attackTimerText = null;
			}

			if (this._lifeMeterText !== null)
			{
				this._lifeMeterText.Clean();
				this._lifeMeterText = null;
			}

			if (this._feedbackFrame)
				this._stage.removeChild(this._feedbackFrame);
			
			this._feedbackFrame = null;
			this._fullRect = null;
			this._attackMeter = null;
			this._attackMeterBG = null;
			this._lifeMeter = null;
			this._lifeMeterBG = null;
			
			this._innerVertexes = null;
			this._timerRange = null;
			this._moveVector = null;
			this._tmpValues = null;
			this._slowMovementRange = null;
			this._corners = null;
			this._attackPoint = null;
			this._rotations = null;
			this._originalColor = null;
			this._transitionColorTransform = null;
		}
		
		Draw()
		{
			// Drawing star
			if (this._isVisible)
			{
				this.visible = true;
			}
			else
			{
				this.visible = false;
			}
			
			this._radius = (this._radius / Math.sin(126 * (Math.PI / 180))) * (Math.sin(18 * (Math.PI / 180)));
			
			let tmpX, tmpY;
			
			for (let i = 0; i < this._vertexCount; i++)
			{
				tmpX = this.x + Math.cos((this._shapeAngle * i) + (this._shapeAngle / 2)) * this._radius;
				tmpY = this.y + Math.sin((this._shapeAngle * i) + (this._shapeAngle / 2)) * this._radius;
				
				this._innerVertexes.push(new Point(tmpX, tmpY));
			}
		}
		
		ChangeRadius()
		{
			// Calculating the inRadius of the inner shape of the pentagram
			let midPoint01 = new Point();
			midPoint01.x = this._center.x + (this._innerVertexes[0].x + this._innerVertexes[1].x) / 2;
			midPoint01.y = this._center.y + (this._innerVertexes[0].y + this._innerVertexes[1].y) / 2;
			
			this._radius = VectorUtils.calcDistance(this._center, midPoint01)[2];
			this._collisionRadius = VectorUtils.calcDistance(this._center, midPoint01)[2];
			
			// Hardcoding this, because it is used a lot for collision and it seems a bit unfair at times
			this._starRadius -= 15;
			
			midPoint01 = null;
			
			// For lack of a better place, shooting spots are calculated here
			this._shootRadius = this._radius * 2;
			
			let tmpX, tmpY;
			for (let i = 0; i < this._vertexCount; i++)
			{
				tmpX = this._center.x + Math.cos(this._shapeAngle * i) * this._shootRadius;
				tmpY = this._center.y + Math.sin(this._shapeAngle * i) * this._shootRadius;
				
				this._attackPoint.push(new Point(tmpX, tmpY));
				this._rotations.push(this._shapeAngle * i);
			}
		}
		
		CalcSegmentVertexes(vertexes, index)
		{
			let vertexA;
			let vertexB;
			
			let res = [];
			
			if (index === this._vertexCount - 2)
			{
				vertexA = vertexes[index];
		  		vertexB = vertexes[0];
			}
			else if (index === this._vertexCount - 1)
			{
				vertexA = vertexes[index];
		  		vertexB = vertexes[1];
			}
			else
			{
				vertexA = vertexes[index];
		  		vertexB = vertexes[index + 2];
			}
		  	
		  	res.push(vertexA.clone());
		  	res.push(vertexB.clone());
		  	
		  	return res;
		}
		
		ChooseMusic()
		{
			if (this._bigBossCurrentState < 4)
			{
				SoundManager.Play(Sounds.BOSS_BGM);
			}
			else
			{
				if (SoundManager.SoundPlaying(Sounds.BOSS_BGM))
				{
					SoundManager.Stop(Sounds.BOSS_BGM);
				}
				
				if (!SoundManager.SoundPlaying(Sounds.LIGHT_SABER))
				{
					SoundManager.Play(Sounds.BIG_BOSS_BGM);
				}
			}
		}
		
		ChoosePattern()
		{
			if (this._currentMovement === -1)
			{
				this._currentMovement = NumberUtils.randRange(0, 2, true);
				this._basicMovementTimer = NumberUtils.randRange(this._timerRange.x, this._timerRange.y, true);
				this._basicMovementTimerInit = this._basicMovementTimer;
			}
			
			// Increase speed of basic movement when health is below 40%
			if (this._life < this._maxLife * 0.4)
			{
				this._slowMovementSpeed = this._slowMovementInitSpeed * 2;
				this._cornerMovementSpeed = this._cornerMovementInitSpeed + (this._cornerMovementInitSpeed / 2);
				
				// As soon as life goes below 40% and it is the last Boss, go into true attack patterns
				if (this._branch === 4)
				{
					// This will make sure the movement timer only resets to 0, If it was the first time.
					// After it, _bigBossCurrentState should remain at 4 till the end of the fight.
					if (this._bigBossCurrentState !== 4)
					{
						this._basicMovementTimer = 0;
						SoundManager.Play(Sounds.LIGHT_SABER);
					}
				}
			}
			
			if (this._life < this._maxLife * 0.2)
			{
				// Spam final attack when health is below 20%
				this._currentMovement = -1;
				this._doFinalAttack = true;
				this.CheckPatternTimer();
			}
		}
		
		BasicPattern()
		{
			// Execute chosen movement pattern.
			switch(this._currentMovement)
			{
				case 0:
					this.ReAppear();
					this.SlowMovement();
					break;
				case 1:
					this.ReAppear();
					this.CornerMovement();
					break;
				case 666:
					this.ReAppear();
					this.DeathTwitch();
					break;
				default:
					// Go visible again only if _bigBossCurrentState !== 2 (Explode Boss Special Attack)
					if (this._branch === 4 && this._bigBossCurrentState !== 2)
					{
						this.ReAppear();
					}
					// All bosses should do a cool down, if they are red and choose to do their special attack
					this.CoolDown();
					break;
			}
		}
		
		CheckPatternTimer()
		{
			// Checking when it is time to change pattern
			if (this._basicMovementTimer > 0)
			{
				this._basicMovementTimer--;
			}
			else
			{
				// Ok, this kinda has to be hardcoded, excusi.
				if (this._branch === 4)
				{
					if (this._life >= this._maxLife * 0.4)
					{
						if (this._bigBossCurrentState < 3)
						{
							this._bigBossCurrentState++;
						}
						else
						{
							this._bigBossCurrentState = 0;
						}
					}
					else
					{
						// As soon as life drops below 40% the Big Boss assumes it's true attack pattern.
						this._bigBossCurrentState = 4;
					}
					
					this._bossStateMachine.EndCurrent(this._bigBossCurrentState);
				}
				
				// Resets common and specific properties
				this.GlobalReset();
			}
		}
		
		ReAppear()
		{
			this._isVisible = true;

			if (this._originalColor.alphaMultiplier < 1)
			{
				this._originalColor.alphaMultiplier += 0.02;
			}
			else
			{
				this._originalColor.alphaMultiplier = 1;
			}
		}
		
		CoolDown()
		{
			this._isHitable = true;
			
			if (this._transitionColorTransform.blueMultiplier < 1)
			{
				this._transitionColorTransform.blueMultiplier +=  0.1;
				this._transitionColorTransform.greenMultiplier += 0.1;
				
				this.transform.colorTransform = this._transitionColorTransform;
			}
			else
			{
				// Making sure the transition transform is at usable values for next time
				this._transitionColorTransform.redMultiplier = 1;
				this._transitionColorTransform.blueMultiplier = 1;
				this._transitionColorTransform.greenMultiplier = 1;
				// Original Color
				this.transform.colorTransform = this._originalColor;
			}
		}
		
		SlowMovement()
		{
			let rotationMultiplier;
			let colorMultiplier;
			
			this._radius = this._collisionRadius;
			
			if (this._rotationSpeed > this._rotationSpeedInit + 1)
			{
				rotationMultiplier = NumberUtils.normalize(this._rotationSpeed, this._rotationSpeedInit, this._maxRotation);
				this._rotationSpeed -= rotationMultiplier;
				
				// Cooling down
				colorMultiplier = NumberUtils.normalize(this._rotationSpeed, this._maxRotation, this._rotationSpeedInit);
				this._transitionColorTransform.blueMultiplier = this._originalColor.blueMultiplier * colorMultiplier;
				this._transitionColorTransform.greenMultiplier = this._originalColor.greenMultiplier * colorMultiplier;
				this._transitionColorTransform.redMultiplier = this._originalColor.redMultiplier * colorMultiplier;
				this.transform.colorTransform = this._transitionColorTransform;
			}
			else
			{
				// Making sure the trnasition transform is at usable values for next time
				this._transitionColorTransform.redMultiplier = 1;
				this._transitionColorTransform.blueMultiplier = 1;
				this._transitionColorTransform.greenMultiplier = 1;
				// Original Color
				this.transform.colorTransform = this._originalColor;
				
				this._rotationSpeed = this._rotationSpeedInit;
				
				// Touchable again
				this._isHitable = true;
				
				if (this._calcMoveVector)
				{
					this._calcMoveVector = this.CalcSlowMoveVector();
				}
				
				// When destination is reached calculate a new move Vector
				if (this._slowMovementLenght > 0)
				{
					this._slowMovementLenght -= this._slowMovementSpeed;
				}
				else
				{
					this._calcMoveVector = true;
				}
				
				// This causes the Boss to move in a wave like form, so it won't look so stiff when moving around.
				if (this._moveVector !== null)
				{
					this._center.x += this._moveVector.x + (Math.sin(this._frameCounter / 10));
					this._center.y += this._moveVector.y + (-Math.sin(this._frameCounter / 10));
				}
			}
		}
		
		CalcSlowMoveVector()
		{
			let nextPos = new Point();
			let angle;
			
			// Amount to move in the direction calculated
			this._slowMovementLenght = NumberUtils.randRange(this._slowMovementRange.x, this._slowMovementRange.y, true);
			
			// Make the calculation for a new move vector until a valid one is found.
			// A valid vector is one that doesn't lead outside the screen.
			while (true)
			{
				angle = (NumberUtils.randRange(0, 360)) * (Math.PI / 180);
				
				nextPos.x = this._center.x + Math.sin(angle) * this._slowMovementLenght;
				nextPos.y = this._center.y + Math.cos(angle) * this._slowMovementLenght;
				
				if (nextPos.x >= 0 && nextPos.x <= this._stage.stageWidth)
				{
					if (nextPos.y >= 0 && nextPos.y <= this._stage.stageHeight)
					{
						this._tmpValues = VectorUtils.normalize(nextPos, this._center, this._slowMovementSpeed);
						this._moveVector = this._tmpValues[0];
						
						return false;
					}
				}
			}
			
			return true;
		}
		
		CornerMovement()
		{
			if (this._isCharging)
			{
				this.Charge();
			}
			
			if (this._isMoving)
			{
				this.CornerTranslation();
			}
			
			if (this._isAttacking)
			{
				this.Attack();
			}
		}
		
		Charge()
		{
			let rotationMultiplier;
			
			if (this._rotationSpeed < this._maxRotation)
			{
				rotationMultiplier = NumberUtils.normalize(this._rotationSpeed + 1, this._rotationSpeedInit, this._maxRotation);
				this._rotationSpeed += rotationMultiplier;
				
				// Color transition to invincible RED!
				this._transitionColorTransform.blueMultiplier -= rotationMultiplier;
				this._transitionColorTransform.greenMultiplier -= rotationMultiplier;
				
				this.transform.colorTransform = this._transitionColorTransform;
				
				// If life is below 40% choose between 1 and 4 times to change positions,
				// otherwise move only once.
				if (this._life < this._maxLife * 0.4)
				{
					this._moveAmount = NumberUtils.randRange(1, 7, true);
				}
				else
				{
					this._moveAmount = 2;
				}
			}
			else
			{
				this._radius = this._starRadius;
				
				// Set true red
				this._transitionColorTransform.redMultiplier = 1;
				this._transitionColorTransform.blueMultiplier = 0;
				this._transitionColorTransform.greenMultiplier = 0;
				this.transform.colorTransform = this._transitionColorTransform;
				// Becoming invisible
				this._isHitable = false;
				
				this._isMoving = true;
				this._isCharging = false;
				
				this.CalcCornerMoveVector();
			}
		}
		
		CalcCornerMoveVector()
		{
			let nextCornerIndex = this._lastCorner;
			
			while (nextCornerIndex === this._lastCorner)
			{
				nextCornerIndex = NumberUtils.randRange(0, 3, true);
			}
			
			let nextCorner = this._corners[nextCornerIndex];
			this._tmpValues = VectorUtils.normalize(nextCorner, this._center, this._cornerMovementSpeed);
			this._moveVector = this._tmpValues[0];
			this._cornerDistance = this._tmpValues[1];
			
			this._lastCorner = nextCornerIndex;
			
			this._tmpValues = null;
			nextCorner = null;
		}
		
		CornerTranslation()
		{
			ParticleSystemMessages.Send("boss-invinsible", {
				x: this._center.x,
				y: this._center.y,
				radius: this._starRadius
			});
			
			if (this._cornerDistance > 0)
			{
				this._cornerDistance -= this._cornerMovementSpeed;
				
				this._center.x += this._moveVector.x;
				this._center.y += this._moveVector.y;
			}
			else
			{
				if (this._moveAmount > 1)
				{
					this._isCharging = true;
					this._isAttacking = false;
					this._isMoving = false;
					this._moveAmount--;
				}
				else
				{
					this._isCharging = false;
					this._isMoving = false;
					this._isAttacking = true;
					
					this._attackTime = NumberUtils.randRange(this._attackTimeRange.x, this._attackTimeRange.y, true);
				}
			}
		}
		
		Attack()
		{
			let rotationMultiplier;
			let colorMultiplier;
			
			this._radius = this._collisionRadius;
			
			if (this._rotationSpeed > this._rotationSpeedInit + 1)
			{
				rotationMultiplier = NumberUtils.normalize(this._rotationSpeed, this._rotationSpeedInit, this._maxRotation);
				this._rotationSpeed -= rotationMultiplier;
				
				// Cooling down to attack
				colorMultiplier = NumberUtils.normalize(this._rotationSpeed, this._maxRotation, this._rotationSpeedInit);
				this._transitionColorTransform.blueMultiplier = this._originalColor.blueMultiplier * colorMultiplier;
				this._transitionColorTransform.greenMultiplier = this._originalColor.greenMultiplier * colorMultiplier;
				this._transitionColorTransform.redMultiplier = this._originalColor.redMultiplier * colorMultiplier;
				this.transform.colorTransform = this._transitionColorTransform;
			}
			else
			{
				// Reseting the transition transform to usable values for next time.
				this._transitionColorTransform.redMultiplier = 1;
				this._transitionColorTransform.blueMultiplier = 1;
				this._transitionColorTransform.greenMultiplier = 1;
				// Setting real color
				this.transform.colorTransform = this._originalColor;
				
				this._rotationSpeed = this._rotationSpeedInit;
				
				// Becoming hittable again
				this._isHitable = true;

				if (this._attackTime > 0)
				{
					this._attackTime--;
					
					this._center.x += Math.sin(this._frameCounter / 10);
					this._center.y += -Math.cos(this._frameCounter / 20);
				}
				else
				{
					this._isCharging = true;
					this._isAttacking = false;
					this._isMoving = false;
				}
			}
		}
		
		SlowDown()
		{
			let rotationMultiplier;
			
			this._radius = this._collisionRadius;
			
			if (this._rotationSpeed > this._rotationSpeedInit + 1)
			{
				rotationMultiplier = NumberUtils.normalize(this._rotationSpeed, this._rotationSpeedInit, this._maxRotation);
				this._rotationSpeed -= rotationMultiplier;
			}
		}
		
		DeathTwitch()
		{
			let rand = NumberUtils.randRange(0, Math.PI * 2);
			
			// Lot's of hardcoding here, suck it up.
			if (this._deathTime > 0)
			{
				this._deathTime--;
				
				if (rand >= Math.PI)
				{
					if (!SoundManager.SoundPlaying(Sounds.SPARK))
					{
						SoundManager.Play(Sounds.SPARK);
					}
				}
				else
				{
					if (!SoundManager.SoundPlaying(Sounds.SPARK2))
					{
						SoundManager.Play(Sounds.SPARK2);
					}
				}
				
				if (NumberUtils.randRange(0, 1, true))
				{
					this._center.x += Math.cos(rand) * 5;
					this._center.y += Math.sin(rand) * 5;
					
					this.scaleX += Math.cos(this._deathTime) / 10;
					this.scaleY += Math.cos(this._deathTime) / 10;
				}
				else
				{
					this._center.x -= Math.cos(rand) * 5;
					this._center.y -= Math.sin(rand) * 5;
					
					this.scaleX -= Math.cos(this._deathTime) / 10;
					this.scaleY -= Math.cos(this._deathTime) / 10;
				}
				
				if (this.scaleX < 0.5)
				{
					this.scaleX = 0.5;
					this.scaleY = 0.5;
				}
				if (this.scaleX > 1.5)
				{
					this.scaleX = 1.5;
					this.scaleY = 1.5;
				}
				
				this._radius = this._collisionRadius * this.scaleX;
			}
			else
			{
				this._life = 0;
				
				ISDEAD = true;
			}
		}

		CreateSegments()
		{
			// Until this point the shape was rotatin using it's rotation property, and the rotation
			// for the vertexes was the only thing saved.
			// Here the actual positions of the vertexes for the segments that will fly away are calculated.
			const vertexes = this.CalcVertexPositions();

			// Setting this to change flow in Update and Draw
			this._initializingBlowUp = false;

			const name = this._strengthName + this._name + "Segment";

			// Here is the creation of the segments that will fly away.
			for (let j = 0; j < this._vertexCount; j++)
			{
				const segment = new Baddy_Segment(
					DynamicGraphics.GetSpriteSheet(),
					name,
			 		this.CalcSegmentVertexes(vertexes, j),
			 		this._center,
			 		this._stage,
			 		this._isVisible
			 	);

				segment.transform.colorTransform.redMultiplier = this._originalColor.redMultiplier;
				segment.transform.colorTransform.greenMultiplier = this._originalColor.greenMultiplier;
				segment.transform.colorTransform.blueMultiplier = this._originalColor.blueMultiplier;
				segment.transform.colorTransform.alphaMultiplier = this._originalColor.alphaMultiplier;

			 	this._segments.push(segment);

			 	segment.SetUpdateParams(this._segmentSpeedRange, this._segmentRotSpeedRange, this._segmentLife);
			 	segment.SetDrawParams(this._lineColor, this._lineWidth, name);
			}
		}
		
		GlobalReset(nextMovement = -1)
		{
			this._calcMoveVector = true;
			this._isCharging = true;
			this._isAttacking = false;
			this._isMoving = false;
			this._currentMovement = nextMovement;
			
			if (window.RammBoss)
				window.RammBoss.ResetStaticVariables();
			
			if (window.BounceBoss)
				window.BounceBoss.ResetStaticVariables();
			
			if (window.ExplodeBoss)
				window.ExplodeBoss.ResetStaticVariables();
			
			if (window.SnakeBoss)
				window.SnakeBoss.ResetStaticVariables();
		}
		
		CreateFeedback(offset, borderThickness)
		{
			const width = this._stage.stageWidth - (offset.x * 4.5);
			const height = 70;
			const x = this._stage.stageWidth / 2 - (width / 2);
			const y = this._stage.stageHeight - (height * 2);

			const bt = borderThickness;
			const dbt = borderThickness * 2;

			this._fullRect = new Rectangle(x, y, width, height);

			this._feedbackFrame = new Shape();
			this._feedbackFrame.x = this._fullRect.x;
			this._feedbackFrame.y = this._fullRect.y;
			this._feedbackFrame.alpha = 0;
			
			this._attackMeter = new Rectangle(bt, dbt, width - dbt, bt);
			this._attackMeterBG = this._attackMeter.clone();
			
			this._lifeMeter = new Rectangle(bt, this._attackMeter.y + this._attackMeter.height + dbt, width - dbt, bt);
			this._lifeMeterBG = this._lifeMeter.clone();
			
			const attackTimerTextPos = new Point(
				this._attackMeter.x + x,
				this._attackMeter.y + y
			);

			const lifeTimerTextPos = new Point(
				this._lifeMeter.x + x,
				this._lifeMeter.y + y
			);

			this._stage.addChild(this._feedbackFrame);
			
			this._attackTimerText = new Text(attackTimerTextPos, "Digital-7", dbt, 0xff000000, this._stage, true);
			this._lifeMeterText = new Text(lifeTimerTextPos, "Digital-7", dbt, 0xff000000, this._stage, true);
			
			this._attackTimerText.Update("Next Attack", 0xff000000);
			this._lifeMeterText.Update("Boss Life", 0xff000000);

			attackTimerTextPos.y -= this._attackTimerText.GetTextField().height;
			lifeTimerTextPos.y -= this._lifeMeterText.GetTextField().height;

			this._attackTimerText.Update("Next Attack", 0xff000000);
			this._lifeMeterText.Update("Boss Life", 0xff000000);
		}
		
		DrawBossFeedBack()
		{
			let attackMeterModifier;
			let lifeMeterModifier;
			
			if (this._life < this._maxLife * 0.2)
			{
				this._lifeMeterColor = 0xffff0000;
			}
			else if (this._life < this._maxLife * 0.4)
			{
				this._lifeMeterColor = 0xffffff00;
			}
			else
			{
				this._lifeMeterColor = 0xff00ff00;
			}
			
			if (this._life > 1)
			{
				if (this._feedbackFrame.alpha < 1)
				{
					this._feedbackFrame.alpha += 0.05;
				}
				
				attackMeterModifier = NumberUtils.normalize(this._basicMovementTimer, 0, this._basicMovementTimerInit);
				this._attackMeter.width = this._attackMeterBG.width * attackMeterModifier;
				
				lifeMeterModifier = NumberUtils.normalize(this._life, 0, this._maxLife);
				this._lifeMeter.width = this._lifeMeterBG.width * lifeMeterModifier;

				this._feedbackFrame.uncache();

				this._feedbackFrame.graphics.clear();
				
				this._feedbackFrame.graphics.beginFill(0xff777777);
				this._feedbackFrame.graphics.rect(0, 0, this._fullRect.width, this._fullRect.height);
				
				this._feedbackFrame.graphics.beginFill(0xffcccccc);
				this._feedbackFrame.graphics.rect(this._attackMeterBG.x, this._attackMeterBG.y, this._attackMeterBG.width, this._attackMeterBG.height);

				this._feedbackFrame.graphics.beginFill(0xffFC7416);
				this._feedbackFrame.graphics.rect(this._attackMeter.x, this._attackMeter.y, this._attackMeter.width, this._attackMeter.height);
				
				this._feedbackFrame.graphics.beginFill(0xffcccccc);
				this._feedbackFrame.graphics.rect(this._lifeMeterBG.x, this._lifeMeterBG.y, this._lifeMeterBG.width, this._lifeMeterBG.height);
				
				this._feedbackFrame.graphics.beginFill(this._lifeMeterColor);
				this._feedbackFrame.graphics.rect(this._lifeMeter.x, this._lifeMeter.y, this._lifeMeter.width, this._lifeMeter.height);

				this._feedbackFrame.cache(0, 0, this._fullRect.width, this._fullRect.height);
			}
			else
			{
				if (this._initFeedBackBlowUp)
				{
					const bitmap = DynamicGraphics.GetBitmapFromDisplayObjectTransformed(
						this._stage,
						this._feedbackFrame,
						this._fullRect.width,
						this._fullRect.height
					);

					this._explodingFeedBack = new SplashImage(bitmap, this._stage);
					this._explodingFeedBack.Init(this._feedbackFrame.x, this._feedbackFrame.y, 1, 30, 1, 20, 10);
					
					this._stage.removeChild(this._feedbackFrame);
					this._feedbackFrame = null;

					this._initFeedBackBlowUp = false;
				}
				
				this._explodingFeedBack.Update(true);
			}
		}
	}

	window.BossBaddy = BossBaddy;
}