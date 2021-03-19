"use strict";

{
	class BombRenderer extends Renderer
	{
		constructor()
		{
			super();

			this.BOMB_RADIUS = 10;
			this.SPIKE_RADIUS_RADIUS_1 = this.BOMB_RADIUS + 3;
			this.SPIKE_RADIUS_RADIUS_2 = this.BOMB_RADIUS + 2;
			
			this._container = DynamicGraphics.GetSprite("bomb");
			this._explosionPos = new SharedPoint();
		}
		
		childInit(params)
		{
			this.BOMB_RADIUS 		   = params[0];
			this.SPIKE_RADIUS_RADIUS_1 = this.BOMB_RADIUS + params[1];
			this.SPIKE_RADIUS_RADIUS_2 = this.BOMB_RADIUS + params[2];
			
			this.draw();
		}
		
		concreteDraw()
		{

		}
		
		concreteRemoveFromStage()
		{
			if (this._logic)
			{
				this._explosionPos.x = this._logic._x;
				this._explosionPos.y = this._logic._y - 10;
				
				ParticleSystemManager.GetSystem("BombHit", this._explosionPos);
			}
		}
		
		concreteDestroy()
		{
			if (this._explosionPos)
			{
				this._explosionPos.Clean();
				this._explosionPos = null;
			}
		}
	}

	window.BombRenderer = BombRenderer;
}