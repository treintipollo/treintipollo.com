"use strict";

{
	class UfoColliderCircle extends Collider
	{
		
		constructor()
		{
			super();

			this._parameters = null;
			this._shieldRadius = 0;
			this._noShieldRadius = 0;

			this._concreteShape = new Circle();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._shieldRadius   = additionalParameters[0];
			this._noShieldRadius = additionalParameters[1];
			this._parameters     = this._logic.ExternalParameters;
			
			this._concreteShape.init(additionalParameters);
			this._colliderShape = this._concreteShape;
		}
		
		update(deltaTime)
		{
			if (this._parameters["shielding"])
			{
				this._concreteShape._radius = this._shieldRadius;
			}
			else
			{
				this._concreteShape._radius = this._noShieldRadius;
			}
			
			this._active = this._parameters["active"];
		}
		
		concreteRelease()
		{
			this._parameters = null;
		}
		
		concretDestroy()
		{
			this._concreteShape = null;
		}
	}

	window.UfoColliderCircle = UfoColliderCircle;
}