"use strict";

{
	class MeteorHPCollider extends Collider
	{
		constructor()
		{
			super();

			this._radi = null;
			this._currentRadiusIndex = 0;
			this._concreteShape = new Circle();
			this._on_hit = () => this.onHit();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._concreteShape.init(additionalParameters);
			this._colliderShape = this._concreteShape;
			
			this._radi = additionalParameters;
			
			this._currentRadiusIndex = 0;
			
			this._logic.ExternalParameters["colliderHit"] = this._on_hit;
		}
		
		onHit()
		{
			this._currentRadiusIndex++;
			this._concreteShape._radius = this._radi[this._currentRadiusIndex];
			
			return this._concreteShape._radius;
		}

		concretDestroy()
		{
			this._on_hit = null;
		}
	}

	window.MeteorHPCollider = MeteorHPCollider;
}