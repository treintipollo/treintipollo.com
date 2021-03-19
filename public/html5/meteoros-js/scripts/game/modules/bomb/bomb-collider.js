"use strict";

{
	class BombColliderCircle extends Collider
	{
		constructor()
		{
			super();

			this._parameters = null;
			
			this._concreteShape = new Circle();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._parameters = this._logic.ExternalParameters;
			
			this._concreteShape.init(additionalParameters);
			this._colliderShape = this._concreteShape;
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

	window.BombColliderCircle = BombColliderCircle;
}