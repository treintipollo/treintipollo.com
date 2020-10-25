"use strict";

{
	class Rocket
	{
		constructor(x, y, angle, speed, life)
		{
			this._pos = null;
			this._dir = null;
			this._angle = 0;
			this._life = 0;
			this._maxLife = 0;
			this._speed = 0;
			this._mainColor = 0;
			this._secondaryColor = 0;
			this._frameCounter = 0;
			
			this._pos = new Point(x, y);
			this._dir = new Point();
			
			this._life = life;
			this._maxLife = this._life;
			this._angle = angle;
			this._speed = speed;
			
			this._dir.x = Math.cos(this._angle);
			this._dir.y = Math.sin(this._angle);
			
			let r = NumberUtils.randRange(0, 255, true);
			let g = NumberUtils.randRange(0, 255, true);
			let b = NumberUtils.randRange(0, 255, true);
			this._mainColor = 0xFF << 24 | r << 16 | g << 8 | b;
			
			r = NumberUtils.randRange(0, 255, true);
			g = NumberUtils.randRange(0, 255, true);
			b = NumberUtils.randRange(0, 255, true);
			this._secondaryColor = 0xFF << 24 | r << 16 | g << 8 | b;
			
			this._frameCounter = 0;
		}
		
		Update()
		{
			ParticleSystemMessages.Send("rocket-move", {
				x: this._pos.x,
				y: this._pos.y,
				mainColor: this._mainColor,
				secondaryColor: this._secondaryColor,
			});

			
			this._pos.x += this._dir.x * this._speed;
			this._pos.y += this._dir.y * this._speed;
			
			this._life--;
			this._frameCounter++;
			
			return this._life;
		}
		
		Clean()
		{
			ParticleSystemMessages.Send("rocket-explosion", {
				x: this._pos.x,
				y: this._pos.y,
				mainColor: this._mainColor,
				secondaryColor: this._secondaryColor,
			});

			SoundManager.Play(NumberUtils.randRange(Sounds.ROCKET_BLOW, Sounds.ROCKET_BLOW6, true));
			
			this._pos = null;
			this._dir = null;
		}
	}

	window.Rocket = Rocket;
}