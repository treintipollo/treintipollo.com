"use strict";

{
	class UfoRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._pieces = 0;
			this._pieceRadius = 0;
			this._pieceSpacing = 0;
			this._length = 0;
			this._isShowingShield = false;
			this._color = 0x000000;
			this._parameters = null;

			this._container = new Sprite();
			this._domeCenter = new Point();
		}
		
		concreteInit()
		{
			this._isShowingShield = false;
		}
		
		initComplete()
		{
			this._parameters = this._logic.ExternalParameters;
			
			this.draw();
		}
		
		childInit(params)
		{
			this._pieces 	  = params[0];
			this._pieceRadius = params[1];
			this._color		  = params[2];

			this._pieceSpacing = this._pieceRadius * 4;
			this._length = this._pieceSpacing * this._pieces;
		}
		
		concreteUpdate(deltaTime)
		{
			if (this._parameters["shielding"])
			{
				if (!this._isShowingShield)
				{
					this._isShowingShield = true;

					this.draw(false);
				}
			}
			else
			{
				if (this._isShowingShield)
				{
					this._isShowingShield = false;

					this.draw(false);
				}
			}
		}
		
		concreteDraw()
		{
			const parent = this._container.parent;

			if (parent)
			{
				const index = parent.getChildIndex(this._container);
				const sprite = DynamicGraphics.GetUfoSprite(this._pieces, this._pieceRadius, this._color, this._isShowingShield);
				
				parent.removeChild(this._container);
				parent.addChildAt(sprite, index);
				
				this._container = sprite;
			}
			else
			{
				this._container = DynamicGraphics.GetUfoSprite(this._pieces, this._pieceRadius, this._color, this._isShowingShield);
			}
		}
		
		concreteRelease()
		{
			this._parameters = null;
		}
		
		concreteDestroy()
		{
			this._domeCenter = null;
		}
	}

	window.UfoRenderer = UfoRenderer;
}