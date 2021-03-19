"use strict";

{
	class PyramidBossCollider extends Collider
	{
		constructor()
		{
			super();
			
			this._shieldRadius = 0;
			this._parameters = null;

			this._shieldShape   = new Circle();
			this._noShieldShape = new Triangle();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._shieldRadius = additionalParameters[0][0];
			
			this._shieldShape.init(additionalParameters[0]);
			this._noShieldShape.init(additionalParameters[1]);
			
			this._parameters = this._logic.ExternalParameters;
			this._colliderShape = this._shieldShape;
		}
		
		update(deltaTime)
		{
			if (this._parameters["shielding"])
			{
				this._colliderShape = this._shieldShape;
			}
			else
			{
				this._colliderShape = this._noShieldShape;
			}
			
			this._active = this._parameters["active"];
		}
		
		concreteRelease()
		{
			this._parameters = null;
		}
		
		concretDestroy()
		{
			this._shieldShape = null;
			this._noShieldShape = null;
		}
	}

	window.PyramidBossCollider = PyramidBossCollider;
}