"use strict";

{
	class CircleCollider extends Collider
	{
		constructor()
		{
			super();

			this._colliderShape = new Circle();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._colliderShape.init(additionalParameters);
		}
	}

	window.CircleCollider = CircleCollider;
}