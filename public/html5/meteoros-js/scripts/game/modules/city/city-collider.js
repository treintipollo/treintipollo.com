"use strict";

{
	class CityCollider extends Collider
	{
		constructor()
		{
			super();

			this._domeShape = new Circle();
			this._noDomeShape = new AABB();
			this._usingDomeCollider = false;

			this._change_collider = () => this.changeCollider();
		}
		
		concreteInit(additionalParameters)
		{
			this._domeShape.init(additionalParameters[0]);
			this._noDomeShape.init(additionalParameters[1])
			
			this._colliderShape 	  = this._domeShape;
			this._usingDomeCollider = true;
			
			this._logic.ExternalParameters["changeCollisionShape"] = this._change_collider;
		}
		
		concretDestroy()
		{
			this._domeShape = null;
			this._noDomeShape = null;
			this._change_collider = null;
		}
		
		changeCollider()
		{
			if (this._usingDomeCollider)
			{
				this._colliderShape = this._noDomeShape;
				this._YOffset -= 15;
				this._usingDomeCollider = false;
			}
			else
			{
				this._colliderShape = this._domeShape;
				this._YOffset = 0;
				this._usingDomeCollider = true;
			}
		}
	}

	window.CityCollider = CityCollider;
}