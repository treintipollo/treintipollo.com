"use strict";

{
	class CollisionGroup
	{
		constructor(toCheckAgainsAmount)
		{
			this._firstType = "";
			this._secondType = "";
			this._currentOpponent = null;
			
			this._colliderCollection = new ColliderCollection(toCheckAgainsAmount);
			this._toCheckAgainst = this._colliderCollection.getVector();
		}
		
		addCollider(collider, priority)
		{
			if (priority === 1)
			{
				this._colliderCollection.addCollider(collider);
			}
		}
		
		removeCollider(collider, priority)
		{
			if (priority === 1)
			{
				this._colliderCollection.removeCollider(collider);
			}
		}
		
		checkCollisions(collider, collisionResolver, deltaTime)
		{
			if (collider.Active)
			{
				for(var i = this._toCheckAgainst.length - 1; i >= 0; i--)
				{
					this._firstType = collider.Shape.Type;
					this._currentOpponent = this._toCheckAgainst[i];
					
					if (this._currentOpponent !== null)
					{
						if (this._currentOpponent.Active)
						{
							this._secondType = this._currentOpponent.Shape.Type;
							
							if (collisionResolver._methods[this._firstType + this._secondType](collider, this._currentOpponent))
							{
								collider.Logic.onCollide(this._currentOpponent.Logic, deltaTime);
								this._currentOpponent.Logic.onCollide(collider.Logic, deltaTime);
							}
						}
					}
				}
			}
		}
		
		destroy()
		{
			this._colliderCollection.destroy();
			
			this._toCheckAgainst 	= null;
			this._currentOpponent = null;
		}
	}

	window.CollisionGroup = CollisionGroup;
}