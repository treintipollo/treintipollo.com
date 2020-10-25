"use strict";

{
	class Bullet
	{
		constructor(type, life, damage, speed, radius, graphicId, isBomb = false)
		{
			this._type = type;
			this._life = life;
			this._speed = speed;
			this._damage = damage;
			this._radius = radius;
			this._isBomb = isBomb;
			this._graphicId = graphicId;
			
			this._stage = null;

			this._initLife = life;

			this._isAlive = false;
			this._body = null;
			this._currentNode = null;
			this._angle = 0;
			this._size = 0;
			this._initRadius = radius;
			this._pos = null;
			this._moveVector = null;
			this._tmpValues = [];
		}

		Init(pos, angle, concentration, playerDisplayIndex, stage, life = -1)
		{
			if (!this._isAlive)
			{
				this._moveVector = new Point();
				this._isAlive = true;

				if (life === -1)
				{
					this._life = this._initLife;
				}
				else
				{
					this._life = life;
				}
				
				this._radius = this._initRadius;
				
				this._stage = stage;

				this._body = DynamicGraphics.GetSprite(this._graphicId);
				
				if(Math.random() <= 0.5)
				{
					this._angle = angle + Math.random() / concentration;
				}
				else
				{
					this._angle = angle - Math.random() / concentration;
				}
				
				this._moveVector.x = pos.x + Math.cos(this._angle);
				this._moveVector.y = pos.y + Math.sin(this._angle);
				
				this._tmpValues = VectorUtils.normalize(this._moveVector, pos, this._speed);
				this._moveVector = this._tmpValues[0];
				
				this._body.x = pos.x;
				this._body.y = pos.y;
				this._body.scaleX = 1;
				this._body.scaleY = 1;
				this._pos = pos.clone();
				
				this._currentNode = null;
				this._currentNode = Grid_Revenge.SetObjectGridPosition(this, this._currentNode, Grid_Revenge.BULLET);
				
				// This will have the Bullets added on top of player and below baddies
				this._stage.addChildAt(this._body, playerDisplayIndex + 1);
				
				if(this._isBomb)
					SoundManager.Play(Sounds.MISSILE);
				
				return true;
			}
			else
			{
				return false;
			}
		}

		Update()
		{
			if(this._isBomb)
			{
				ParticleSystemMessages.Send("bomb-follow", {
					x: this._pos.x,
					y: this._pos.y,
					size: this._radius * this._body.scaleX
				});
			}
			
			this._body.x += this._moveVector.x;
			this._body.y += this._moveVector.y;
			this._pos.x  += this._moveVector.x;
			this._pos.y  += this._moveVector.y;
			
			if (this._body.x + this._radius > 0 && this._body.x - this._radius < this._stage.stageWidth)
			{
				if (this._body.y + this._radius > 0 && this._body.y - this._radius < this._stage.stageHeight)
				{
					if (this._life > 0)
					{
						//Interpolation rules!
						this._size = NumberUtils.normalize(this._life, 0, this._initLife);
						this._body.scaleX = this._size;
						this._body.scaleY = this._size;
						this._radius = this._initRadius * this._size;
						this._life--;
						this._currentNode = Grid_Revenge.SetObjectGridPosition(this, this._currentNode, Grid_Revenge.BULLET);
					}
					else
					{
						this._isAlive = false;
					}
				}
				else
				{
					this._isAlive = false;
				}
			}
			else
			{
				this._isAlive = false;
			}
			
			if (!this._isAlive)
			{
				this.Clean();
			}
		}
		
		Clean(rutineClean = false)
		{
			if (!this._stage)
				return;

			if (this._isBomb)
			{
				BaddyManager.KillAll("AttackBitBaddy", "BombBitBaddy", "BossBaddy");
				
				ParticleSystemMessages.Send("bomb-explosion", {
					x: this._pos.x,
					y: this._pos.y
				});
				
				SoundManager.Play(Sounds.EXPLOSION);
			}
			
			if (rutineClean)
			{
				ParticleSystemMessages.Send("bullet-clean", {
					x: this._pos.x,
					y: this._pos.y,
					radius: this._radius,
					graphicId: this._graphicId
				});
			}
			
			this._stage.removeChild(this._body);
			this._stage = null;
			
			this._pos = null;

			if (this._currentNode)
				this._currentNode.RemoveObject(this, Grid_Revenge.BULLET);

			this._currentNode = null;
			
			this._body = null;
			this._moveVector = null;
			this._tmpValues = null;
		}
		
		Kill()
		{
			let currentLife = this._life;
			this._life = 0;
			
			ParticleSystemMessages.Send("bullet-kill", {
				x: this._pos.x,
				y: this._pos.y,
				radius: this._radius,
				graphicId: this._graphicId
			});
			
			return this._damage + currentLife;
		}
	}

	window.Bullet = Bullet;
}