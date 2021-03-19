"use strict";

{
	class BoxCollider extends Collider
	{
		constructor()
		{
			super();

			this._colliderShape = new AABB();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._colliderShape.init(additionalParameters);
		}
	}

	window.BoxCollider = BoxCollider;
}