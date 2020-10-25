"use strict";

{
	let bitAmount = 0;
	let range = 0;
	let speed = 0;
	let bombs = 0;
	let continues = 0;
	let lives = 0;
	let fireRate = 0;
	let bulletDamage = 0;
	let bulletConcentration = 0;
	let freeUpgradesPassed = 0;

	const attackBitMax = 3;
	const rangeMax = 18;
	const speedMax = 6;
	const bombsMax = 4;
	const livesMax = 3;
	const continuesMax = 2;
	const fireRateMax = 3;
	const fireRateBase = 6;
	const bulletDamageMax = 45;
	const bulletConcentrationMax = 5;

	const RAD_TO_DEG = 180 / Math.PI;
	const DEG_TO_RAD = Math.PI / 180;

	class MainBody
	{
		constructor(stage)
		{
			this._stage = stage;

			this._body = null;
			this._radius = 0;
			this._starRadius = 0;
			this._isAlive = false;
			this._isHitable = false;
		
			this._bits = [];
			this._crossHair = null;
			this._tmpValues = [];
		
			this._lineThickness = 0
			this._lineColor = 0;
			this._fillColor = 0;
			this._pos = null;
			this._radianAngle = 0;
		
			this._bitRadiusModifier = 0;
			this._bitPosModifier = 0;
			this._bitSpeed = 0;
			this._bitCenter = null;
			this._bitIdleRadius = 0;
			this._initBitSpeed = 0;
				
			this._distanceToShootPosInit = 0;
			this._distanceToShootPos = 0;
			this._realDistance = 0;
			
			this._frameCounter = 0;
			this._invincibilityCounter = 0;
			this._bulletSpawnPos = null;
		
			this._dieSpeed = 0;
			this._death = null;
			this._initDeath = false;
			this._bodyBitmap = null;
			
			this._shootBoomb = false;
			this._instantBomb = false;
			this._isKeyDown = false;
			this._livesText = null;
			this._placePlayerOverEverything = false;
			this._bombShot = false;
			
			this._playSpawnSound = false;
			this._doDeathParticles = false;
			
			this._currentNode = null; // node
		}

		Init(xPos, yPos, radius, bombShot = false)
		{
			this._pos = new Point(xPos, yPos);
			this._radius = radius;
			
			this._bitCenter = this._pos.clone();
			this._bitRadiusModifier = 1;
			this._bitPosModifier = 0;
			this._initBitSpeed = 3;
			this._bitSpeed = this._initBitSpeed;
			this._distanceToShootPos = 0;
			
			this._frameCounter = 0;
			this._invincibilityCounter = 150;
			
			// Outer radius
			this._starRadius = this._radius;
			// Inner shape radius
			this._radius = (this._radius / Math.sin(126 * (DEG_TO_RAD))) * (Math.sin(18 * (DEG_TO_RAD)));
			this._distanceToShootPosInit = this._radius * 5;
			this._bitIdleRadius = this._radius * 3;
			
			this._body = DynamicGraphics.GetSprite("player");
			
			// Actual shape positions
			this._body.x = this._pos.x;
			this._body.y = this._pos.y;
			this._body.alpha = 0;
			this._body.scaleX = 0;
			this._body.scaleY = 0;

			this._crossHair = DynamicGraphics.GetSprite("cross-hair");
			
			this._crossHair.x = 0;
			this._crossHair.y = 0;
			this._crossHair.visible = false;
			this._crossHair.alpha = 0;

			// Aim
			this._radianAngle = TrigUtils.calcAngleAtan2(this._stage.mouseX, this._stage.mouseY, this._body.x, this._body.y);
			this._body.rotation = this._radianAngle * RAD_TO_DEG;
			
			this._stage.addChild(this._body);
			this._stage.addChild(this._crossHair);
			
			this._bombShot = bombShot;
			
			this.SetAttackBits();
			// Calling Bits Update method once so that everything is position properly before entering the main loop
			this.BitMovement();
			
			// Misc
			this._dieSpeed = this._radius / 300;
			this._isAlive = true;
			this._initDeath = true;
			this._shootBoomb = false;
			this._isHitable = false;
			this._placePlayerOverEverything = true;
			this._playSpawnSound = true;
			this._doDeathParticles = true;
		}

		Clean()
		{
			this._stage.removeChild(this._body);
			this._stage.removeChild(this._crossHair);
			
			if(this._currentNode != null)
				this._currentNode.RemoveObject(this, Grid_Revenge.PLAYER);
			
			this._currentNode = null;
			
			for(let i = 0; i < this._bits.length; i++)
				this._bits[i].Clean();
			
			if(this._death != null)
			{
				this._death.Clean();
				this._death = null;
			}
			
			if(this._livesText != null)
			{
				this._livesText.Clean();
				this._livesText = null;
			}
			
			this._bits = null;
			this._stage = null;
			this._body = null;
			this._crossHair = null;
			this._tmpValues = null;
			this._pos = null;
			this._bitCenter = null;
			this._bulletSpawnPos = null;
		}

		Update()
		{
			this._frameCounter++;
			
			if (this._isAlive)
			{
				if (this.Appear())
				{
					if (!this._isHitable)
						this.InvincibleBlink();
					
					this._currentNode = Grid_Revenge.SetObjectGridPosition(this, this._currentNode, Grid_Revenge.PLAYER);
					
					this.Input();
					
					// Aim
					if (Gamepad.Available())
					{
						this._radianAngle = Gamepad.GetRigthThumbStick().GetAngle();
						this._crossHair.visible = false;
					}
					else
					{
						this._radianAngle = TrigUtils.calcAngleAtan2(this._stage.mouseX, this._stage.mouseY, this._pos.x, this._pos.y);
						this._crossHair.visible = true;
					}

					this._body.rotation = this._radianAngle*RAD_TO_DEG;
					
					this.Shoot();
		
					//This will place player on toop of everything for the first frame
					if (this._placePlayerOverEverything)
					{
						this._stage.setChildIndex(this._body, this._stage.numChildren - 1);
						this._placePlayerOverEverything = false;
					}
					
					this.BitMovement(true);
					
					// Making sure the cross hair is always on top of everything
					this._stage.setChildIndex(this._crossHair, this._stage.numChildren - 1);

					// Actual shape positions
					this._body.x = this._pos.x;
					this._body.y = this._pos.y;
					this._crossHair.x = this._stage.mouseX;
					this._crossHair.y = this._stage.mouseY;
					
					if(this._livesText === null)
						this._livesText = new Text(this._pos, "Digital-7", 20, 0xff000000, this._stage, true);

					this._livesText.Update(lives.toString(), 0xff000000, true, true);
					
					return true;
				}
			}
			else
			{
				return this.Die(true);
			}
			
			return false;
		}

		GetPos()
		{
			return this._pos;
		}
		
		Die(looseLife)
		{
			let dieAmount = 0;
			
			//Colision with a Baddy
			if (looseLife)
			{
				if (this._initDeath && this._death === null)
				{
					this._bodyBitmap = DynamicGraphics.GetBitmapFromDisplayObjectTransformed(
						this._stage,
						this._body,
						this._starRadius * 2,
						this._starRadius * 2
					);

					this._death = new SplashImage(this._bodyBitmap, this._stage);
					this._death.Init(this._body.x - this._starRadius, this._body.y - this._starRadius, 1, 3, 1, 6, 6, true, 0.01);
					
					this._body.alpha = 0;
					this._body.scaleX = 0;
					this._body.scaleY = 0;
					this._crossHair.alpha = 0;
					
					this._livesText.Clean();
					this._livesText = null;
					
					this._invincibilityCounter = 150;
					this._isHitable = false;
					this._initDeath = false;
					this._playSpawnSound = true;
					
					SoundManager.Play(Sounds.EXPLOSION);
				}
				
				if (this._death !== null)
				{
					if (this._death.Update(true))
						dieAmount++
					
					for (let i = 0; i < this._bits.length; i++)
					{
						if (this._bits[i].Die())
							dieAmount++;
					}
					
					if (dieAmount >= bitAmount + 1)
					{
						this._bodyBitmap = null;
						this._death.Clean();
						this._death = null;
						
						lives--;
						
						this._bitCenter = this._pos.clone();
						this._bitRadiusModifier = 1;
						this._bitPosModifier = 0;
						this._initBitSpeed = 3;
						this._bitSpeed = this._initBitSpeed;
						this._distanceToShootPos = 0;
						
						this.BitMovement();
						
						return true;
					}
				}
				else
				{
					return true;
				}
			}
			else
			{
				//End of level animation
				if (this._initDeath)
				{
					this._livesText.Clean();
					this._livesText = null;
					this._doDeathParticles = true;
					this._initDeath = false;
					this._body.visible = true;
				}
				
				for (let j = 0; j < this._bits.length; j++)
					this._bits[j].Die();
				
				if (this._body.scaleX !== 0)
				{
					if (this._body.scaleX > 0)
					{
						this._body.scaleX -= 0.03;
						this._body.scaleY -= 0.03;
					}
					else
					{
						if (this._doDeathParticles)
						{
							ParticleSystemMessages.Send("player-death", {
								x: this._body.x,
								y: this._body.y
							});
							
							this._doDeathParticles = false;
							this._body.scaleX = 0;
							this._body.scaleY = 0;
							
							SoundManager.Play(NumberUtils.randRange(Sounds.SPARK, Sounds.SPARK2, true));
						}
						
						return true;
					}
				}
				else
				{
					return true;
				}
			}

			return false;
		}

		AddBombs(amount)
		{
			let bitAngle;
			
			bombs += amount;
			
			for (let i = 0; i < amount; i++)
			{
				bitAngle = NumberUtils.randRange(0, 360, true);
			
				this._bits.push(new Bit(this._pos, true, this._stage));

				this._bits[this._bits.length - 1].Init(this._radius, "bomb");
				this._bits[this._bits.length - 1].SetParameters(bitAngle, this._distanceToShootPosInit);
			}
			
			this.BitMovement();
		}

		Shoot()
		{
			let displayIndex = this._stage.getChildIndex(this._body);
			
			if (this._shootBoomb)
			{
				for (let i = 0; i < this._bits.length; i++)
				{
					if (this._bits[i]._isBomb)
					{
						const pos = new Point(this._bits[i]._body.x, this._bits[i]._body.y);
						
						if (this._instantBomb)
						{
							BulletManager.Fire(BulletManager.PLAYER_BOMB, pos, this._radianAngle, bulletConcentration, displayIndex, 0);
						}
						else
						{
							BulletManager.Fire(BulletManager.PLAYER_BOMB, pos, this._radianAngle, bulletConcentration, displayIndex);
						}

						this._bits[i].Clean();
						this._bits[i] = null;
						this._bits.splice(i, 1);
						
						bombs--;
						
						this._shootBoomb = false;

						break;
					}
				}
			}
			
			if (this._distanceToShootPos <= 0 )
			{
				this._distanceToShootPos = 0;
			}

			if (this._distanceToShootPos >= this._distanceToShootPosInit)
			{
				this._distanceToShootPos = this._distanceToShootPosInit;
				
				//Fire only when bits are in position
				
				if (this._frameCounter % (fireRateBase - fireRate) === 0)
				{
					for (let i = 0; i < this._bits.length; i++)
					{
						if (!this._bits[i]._isBomb)
						{
							const pos = new Point(this._bits[i]._body.x, this._bits[i]._body.y);
							BulletManager.Fire(i + 1, pos, this._radianAngle, bulletConcentration, displayIndex);
						}
					}
				}
			}
		}

		BitMovement(arrangeBitPos = false)
		{
			this._bitPosModifier = NumberUtils.normalize(this._distanceToShootPos, 0, this._distanceToShootPosInit);
			this._bitRadiusModifier = NumberUtils.normalize(this._distanceToShootPos, this._bitIdleRadius, 0);
			this._bitSpeed = NumberUtils.map(this._distanceToShootPos, 0, this._distanceToShootPosInit, this._initBitSpeed, this._initBitSpeed * 3);
			
			this._realDistance = this._distanceToShootPosInit * this._bitPosModifier;
			this._bitCenter.x = this._pos.x + Math.cos(this._radianAngle) * this._realDistance;
			this._bitCenter.y = this._pos.y + Math.sin(this._radianAngle) * this._realDistance;

			for(let i = 0; i < this._bits.length; i++)
				this._bits[i].Update(this._bitCenter, this._bitIdleRadius * this._bitRadiusModifier, this._bitSpeed, arrangeBitPos);
		}

		Appear()
		{
			let appearAmount = 0;
			this._body.alpha = 1;
			
			if(this._playSpawnSound)
			{
				SoundManager.Play(Sounds.REGEN);
				this._playSpawnSound = false;
			}
			
			if(this._body.scaleX < 1)
			{
				this._body.scaleX += this._dieSpeed / 2;
				this._body.scaleY += this._dieSpeed / 2;
			}
			else
			{
				this._body.scaleX = 1;
				this._body.scaleY = 1;
				
				appearAmount++;
			}
			
			for(let i = 0; i < this._bits.length; i++)
			{
				if(this._bits[i].Appear())
					appearAmount++;
			}
			
			if(appearAmount >= bitAmount + 1)
			{
				this._initDeath = true;
				this._crossHair.alpha = 1;
				
				return true;
			}
			
			return false;
		}
		
		Input()
		{
			if (Gamepad.Available())
			{
				if (!Gamepad.GetLeftThumbStick().IsNeutral())
				{
					this._pos.x += speed * Gamepad.GetLeftThumbStick().GetHorizontal();
					this._pos.y += speed * Gamepad.GetLeftThumbStick().GetVertical();
				}
			}
			else
			{
				// Taking keyboard input
				if (Key.isDown(Keyboard.A) || Key.isDown(Keyboard.ARROW_LEFT))
				{
					// Left
					this._pos.x -= speed;
				}
				
				if (Key.isDown(Keyboard.D) || Key.isDown(Keyboard.ARROW_RIGHT))
				{
					// Right
					this._pos.x += speed;
				}
				
				if (Key.isDown(Keyboard.S) || Key.isDown(Keyboard.ARROW_DOWN))
				{
					// Down
					this._pos.y += speed;
				}

				if (Key.isDown(Keyboard.W) || Key.isDown(Keyboard.ARROW_UP))
				{
					// Up
					this._pos.y -= speed;
				}
			}

			// Shoot Bomb
			if (Gamepad.Available())
			{
				if(!this._isKeyDown)
				{
					if(Gamepad.GetRightDigitalShoulderButton().IsDown())
					{
						this._shootBoomb = true;
						this._isKeyDown = true;

						if (Gamepad.GetRigthThumbStick().IsNeutral())
						{
							this._instantBomb = true;
						}
						else
						{
							this._instantBomb = false;
						}
					}
				}

				if(!Gamepad.GetRightDigitalShoulderButton().IsDown())
				{
					this._shootBoomb = false;
					this._isKeyDown = false;
				}
			}
			else
			{
				if (!this._isKeyDown)
				{
					if (Key.isDown(" "))
					{
						this._shootBoomb = true;
						this._isKeyDown = true;

						if (!LetsShoot._click)
						{
							this._instantBomb = true;
						}
						else
						{
							this._instantBomb = false;
						}
					}
				}

				if (!Key.isDown(" "))
				{
					this._shootBoomb = false;
					this._isKeyDown = false;
				}
			}
			
			if (Gamepad.Available())
			{
				if(!Gamepad.GetRigthThumbStick().IsNeutral())
				{
					this._distanceToShootPos += this._bitSpeed;
				}
				else
				{
					this._distanceToShootPos -= this._bitSpeed;
				}
			}
			else
			{
				// Taking mouse input

				if (window.LetsShoot._click)
				{
					this._distanceToShootPos += this._bitSpeed;
				}
				else
				{
					this._distanceToShootPos -= this._bitSpeed;
				}
			}

			// Keeping player in screen limits
			// This probably shouldn't be in here, but this
			// is one of those things that goes side by side
			// with Input handling in a lot of games.
			if (this._pos.x < this._radius)
				this._pos.x = this._radius;

			if (this._pos.x > this._stage.stageWidth - this._radius)
				this._pos.x = this._stage.stageWidth - this._radius;

			if (this._pos.y < this._radius)
				this._pos.y = this._radius;

			if (this._pos.y > this._stage.stageHeight - this._radius)
				this._pos.y = this._stage.stageHeight - this._radius;
		}
		
		SetAttackBits()
		{
			let fillColorIndex = 0;
			let fillColors = ["red", "green", "blue"];
			let bitAngle = 360 / (bitAmount + bombs);
			
			for (let i = 0; i < bitAmount + bombs; i++)
			{
				if (i < bitAmount)
				{
					this._bits.push(new Bit(this._pos, false, this._stage));
					this._bits[this._bits.length - 1].Init(this._radius, fillColors[fillColorIndex]);
					this._bits[this._bits.length - 1].SetParameters(bitAngle * i, this._distanceToShootPosInit);

					BulletManager.Add(30, i + 1, 20 + range, bulletDamage, 9, this._radius, fillColors[fillColorIndex]);
					
					if (fillColorIndex < fillColors.length - 1)
					{
						fillColorIndex++;
					}
					else
					{
						fillColorIndex = 0;
					}
				}
				else
				{
					this._bits.push(new Bit(this._pos, true, this._stage));
					this._bits[this._bits.length - 1].Init(this._radius, "bomb");
					this._bits[this._bits.length - 1].SetParameters(bitAngle * i, this._distanceToShootPosInit);
				}
			}

			BulletManager.Add(3, BulletManager.PLAYER_BOMB, 20 + range, 1, 9, this._radius, "bomb", true);
		}
		
		InvincibleBlink()
		{
			if(this._invincibilityCounter > 0)
			{
				this._frameCounter % 3 == 0 ? this._body.visible = true : this._body.visible = false;
				this._invincibilityCounter--;
			}
			else
			{
				this._isHitable = true;
				this._body.visible = true;
			}
		}

		static SetInitParams(_speed, _range, _bitAmount, _lives, _continues, _bombs)
		{
			bitAmount = _bitAmount;
			range = _range;
			speed = _speed;
			continues = _continues;
			bombs = _bombs;
			lives = _lives;
		}

		static SetInitParams2(_fireRate, _bulletDamage, _bulletContration)
		{
			fireRate = _fireRate;
			bulletDamage = _bulletDamage;
			bulletConcentration = _bulletContration;
		}

		static SetAttackBit()
		{
			bitAmount++;
		}

		static SetRange()
		{
			range += 3;
		}

		static SetSpeed()
		{
			speed++;
		}
		
		static SetBomb()
		{
			bombs++;
		}
		
		static SetContinue()
		{
			continues++;
		}
		
		static SetFirerate()
		{
			fireRate++;
		}
		
		static SetBulletDamage()
		{
			bulletDamage += 15;
		}
		
		static GetAttackBit()
		{
			return bitAmount;
		}
		
		static GetRange()
		{
			return range;
		}
		
		static GetSpeed()
		{
			return speed;
		}
		
		static GetBomb()
		{
			return bombs;
		}
		
		static GetContinue()
		{
			return continues;
		}
		
		static GetFirerate()
		{
			return fireRate;
		}
		
		static GetBulletDamage()
		{
			return bulletDamage;
		}
	}

	Object.defineProperty(MainBody, "_bitAmount", { set: v => bitAmount = v, get: () => bitAmount });
	Object.defineProperty(MainBody, "_range", { set: v => range = v, get: () => range });
	Object.defineProperty(MainBody, "_speed", { set: v => speed = v, get: () => speed });
	Object.defineProperty(MainBody, "_bombs", { set: v => bombs = v, get: () => bombs });
	Object.defineProperty(MainBody, "_continues", { set: v => continues = v, get: () => continues });
	Object.defineProperty(MainBody, "_lives", { set: v => lives = v, get: () => lives });
	Object.defineProperty(MainBody, "_fireRate", { set: v => fireRate = v, get: () => fireRate });
	Object.defineProperty(MainBody, "_bulletDamage", { set: v => bulletDamage = v, get: () => bulletDamage });
	Object.defineProperty(MainBody, "_bulletConcentration", { set: v => bulletConcentration = v, get: () => bulletConcentration });
	Object.defineProperty(MainBody, "_freeUpgradesPassed", { set: v => freeUpgradesPassed = v, get: () => freeUpgradesPassed });

	Object.defineProperty(MainBody, "_attackBitMax", { get: () => attackBitMax });
	Object.defineProperty(MainBody, "_rangeMax", { get: () => rangeMax });
	Object.defineProperty(MainBody, "_speedMax", { get: () => speedMax });
	Object.defineProperty(MainBody, "_bombsMax", { get: () => bombsMax });
	Object.defineProperty(MainBody, "_livesMax", { get: () => livesMax });
	Object.defineProperty(MainBody, "_continuesMax", { get: () => continuesMax });
	Object.defineProperty(MainBody, "_fireRateMax", { get: () => fireRateMax });
	Object.defineProperty(MainBody, "_fireRateBase", { get: () => fireRateBase });
	Object.defineProperty(MainBody, "_bulletDamageMax", { get: () => bulletDamageMax });
	Object.defineProperty(MainBody, "_bulletConcentrationMax", { get: () => bulletConcentrationMax });

	window.MainBody = MainBody;
}