"use strict";

{
	class RandomFillColor extends BaddyParameters
	{
		constructor()
		{
			super();
			
			this._rotationSpeed = 2;
			this._radius = 20;
			this._life = 200;
			this._maxSpeed = 6;
		
			this._lineWidth = 3;
			this._lineColor = 0xffffffff;
			
			let randomNumber = Math.random();
			
			if (randomNumber <= 0.5)
			{
				this._fillColor = 0xff00ff00;
			}
			else if (randomNumber > 0.5 && randomNumber <= 0.8)
			{
				this._fillColor = 0xffffff00;
			}
			else
			{
				if (DifficultySelect._difficulty == DifficultySelect.HARD)
				{
					this._fillColor = 0xffff0000;
				}
				else
				{
					this._fillColor = 0xffff6a03;
				}
			}
			
			this._segmentSpeedRange = new Point(1, 5);
			this._segmentRotSpeedRange = new Point(10, 15);
			this._segmentLife = 10;
		
			this._isHitable = true;
			this._isVisible = true;
			
			this._hasDeathSound = true;
			this._deathSoundIndex = -1;
		}

		static GetStrength(parametersName, instance)
		{
			if (instance._fillColor === 0xff00ff00)
			{
				return ("Weak" + parametersName).trim();
			}
			else if (instance._fillColor === 0xffffff00)
			{
				return ("Strong" + parametersName).trim();
			}
			else if (instance._fillColor === 0xffff0000)
			{
				return ("Invinsible" + parametersName).trim();
			}
			else if (instance._fillColor === 0xffff6a03)
			{
				return ("Fast" + parametersName).trim();
			}
		}
	}

	window.RandomFillColor = RandomFillColor;
}