"use strict";

{
	class MissileColliderCircle extends Collider
	{
		constructor()
		{
			super();
			
			this._offsetRadius = 0;
			
			this._concreteShape = new Circle();
			this._offSetPoint	  = new Point();
		}
		
		concreteInit(additionalParameters = null)
		{
			this._concreteShape.init(additionalParameters);
			this._offsetRadius = additionalParameters[1];
			
			this._colliderShape = this._concreteShape;
		}
		
		update(deltaTime)
		{
			this._offSetPoint = TrigUtils.posAroundPoint(0, 0, (this._logic.Rotation - 90) * NumberUtils.TO_RADIAN, this._offsetRadius, this._offSetPoint);
			
			this._XOffset = this._offSetPoint.x;
			this._YOffset = this._offSetPoint.y;
		}
		
		concretDestroy()
		{
			this._concreteShape = null;
		}
	}

	window.MissileColliderCircle = MissileColliderCircle;
}