"use strict";

{
	class MissileLauncherRenderer extends Renderer
	{
		constructor()
		{
			super();
			
			this.BODY_WIDTH = 0;
			this.BODY_HEIGHT = 0;
			this.SHOOTING_HEIGHT_LIMIT = 0;

			this._container = window.DynamicGraphics.GetSprite("missile-launcher");
			this._shootingLimit = window.DynamicGraphics.GetSprite("shooting-height");
		}
		
		childInit(params)
		{
			this.BODY_WIDTH  		   = params[0] * params[1] + params[1];
			this.BODY_HEIGHT 		   = params[2];
			this.SHOOTING_HEIGHT_LIMIT = params[3];
			
			this.draw();
		}
		
		concreteDraw()
		{
			this._shootingLimit.y = (this._stage.stageHeight - 40) + this.SHOOTING_HEIGHT_LIMIT;
			this._stage.addChild(this._shootingLimit);
		}

		concreteUpdate(deltaTime)
		{

		}

		concreteRelease()
		{
			this._stage.removeChild(this._shootingLimit);
			this._shootingLimit = null;
		}

		concreteDestroy()
		{
			
		}
	}

	window.MissileLauncherRenderer = MissileLauncherRenderer;
}