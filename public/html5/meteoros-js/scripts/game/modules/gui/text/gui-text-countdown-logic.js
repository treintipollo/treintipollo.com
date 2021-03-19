"use strict";

{
	class GuiTextCountDownLogic extends GuiTextLogic
	{
		constructor()
		{
			super();

			this._textCollection = null;
			this._colorCollection = null;
			
			this._time = 0;
			this._timer = 0;
			this._index = 0;
			this._acc = 0;
		}
		
		childInit(params)
		{
			super.childInit(params);
			
			this._textCollection  = CollectionUtils.getItemOfType(params, Array);
			this._colorCollection = CollectionUtils.getItemOfType(params, Array, 1);
			this._time			  = CollectionUtils.getItemOfType(params, Number);
			
			this._timer	= 0;
			this._index	= 0;
			this._acc	= 0;
		}
		
		fadeIn(deltaTime)
		{
			this._externalParameters["Text"]      = this._textCollection[this._index];
			this._externalParameters["TextColor"] = this._colorCollection[this._index];
			
			this.startFadeOut();
			
			return false;
		}
		
		fadeOut(deltaTime)
		{
			if (this._timer < this._time)
			{
				this._timer += deltaTime;
			}
			else
			{
				if (this._scaleX < 4)
				{
					const accSquare = this._acc * this._acc;

					this._acc	 += deltaTime * 10;
					this._scaleX += deltaTime * (accSquare);
					this._scaleY += deltaTime * (accSquare);
					this._alpha  -= deltaTime * (accSquare);
				}
				else
				{
					this._index++;
					
					if (this._index < this._textCollection.length)
					{
						this._externalParameters["Text"]      = this._textCollection[this._index];
						this._externalParameters["TextColor"] = this._colorCollection[this._index];
						
						this._scaleX = 1;
						this._scaleY = 1;
						this._timer  = 0;
						this._alpha  = 1;
						this._acc	 = 0;
					}
					else
					{
						this._doFadeOut = false;
						this._parent.Active = false;
					}
				}
			}
			
			return false;
		}
		
		concreteRelease()
		{
			this._textCollection  = null;
			this._colorCollection = null;
		}
	}

	window.GuiTextCountDownLogic = GuiTextCountDownLogic;
}