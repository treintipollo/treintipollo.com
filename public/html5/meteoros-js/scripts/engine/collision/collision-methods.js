"use strict";

{
	class CollisionMethods
	{
		constructor()
		{
			this._collider1Circle = null;
			this._collider2Circle = null;
			this._collider1AABB = null;
			this._collider2AABB = null;
			this._collider1Triangle = null;
			this._collider2Triangle = null;
			
			this._deltaX = 0;
			this._deltaY = 0;
			this._addedRadius = 0;
			this._angle = 0;
			this._aabbRadius = 0;
			this._cornerX = 0;
			this._cornerY = 0;

			// Triangle Vertex Deltas
			this._deltaTX1 = 0;
			this._deltaTY1 = 0;
			this._deltaTX2 = 0;
			this._deltaTY2 = 0;
			this._deltaTX3 = 0;
			this._deltaTY3 = 0;
			
			// Triangle squared distances
			this._t1Sq = 0;
			this._t2Sq = 0;
			this._t3Sq = 0;
			
			// Triangle Edges
			this._edgeX1 = 0;
			this._edgeY1 = 0;
			this._edgeX2 = 0;
			this._edgeY2 = 0;
			this._edgeX3 = 0;
			this._edgeY3 = 0;
			
			// Triangle Vertexes
			this._tCoordX1 = 0;
			this._tCoordY1 = 0;
			this._tCoordX2 = 0;
			this._tCoordY2 = 0;
			this._tCoordX3 = 0;
			this._tCoordY3 = 0;
			
			// Misc
			this._radiusSqr = 0;

			this._methods = new Map();
			
			// Circle Vs. ...
			this._methods[ Collider.CIRCLE + Collider.CIRCLE   ] = (collider1, collider2) => this.circleVsCircle(collider1, collider2);
			this._methods[ Collider.CIRCLE + Collider.AABB_BOX ] = (collider1, collider2) => this.circleVsAABB(collider1, collider2);
			this._methods[ Collider.CIRCLE + Collider.TRIANGLE ] = (collider1, collider2) => this.circleVsTriangle(collider1, collider2);
			
			// AABB Vs. ...
			this._methods[ Collider.AABB_BOX + Collider.CIRCLE   ] = (collider1, collider2) => this.AABBVsCircle(collider1, collider2);
			this._methods[ Collider.AABB_BOX + Collider.AABB_BOX ] = (collider1, collider2) => this.AABBVsAABB(collider1, collider2);
			
			// Triangle Vs. ...
			this._methods[ Collider.TRIANGLE + Collider.CIRCLE ] = (collider1, collider2) => this.triangleVsCircle(collider1, collider2);
		}
		
		destroy()
		{
			this._methods.clear();
			this._methods = null;
		}
		
		clean()
		{
			this._collider1Circle = null;
			this._collider2Circle = null;
			this._collider1AABB   = null;
			this._collider2AABB   = null;
			this._collider1Triangle = null;
			this._collider2Triangle = null;
		}
		
		circleVsCircle(collider1, collider2)
		{
			this._collider1Circle = collider1.Shape;
			this._collider2Circle = collider2.Shape;
			
			this._deltaX      = collider1._x - collider2._x;
			this._deltaY      = collider1._y - collider2._y;
			this._addedRadius = this._collider1Circle._radius + this._collider2Circle._radius;
			
			if ((this._deltaX * this._deltaX) + (this._deltaY * this._deltaY) <= this._addedRadius * this._addedRadius)
			{
				return true;
			}
			
			return false;
		}
		
		circleVsAABB(collider1, collider2)
		{
			this._collider1Circle = collider1.Shape;
			this._collider2AABB   = collider2.Shape;
			
			if (this._collider2AABB.isPointInside(collider1._x, collider1._y, collider2._x, collider2._y))
			{
				return true;
			}
			
			this._deltaX = collider1._x - collider2._x;
			this._deltaY = collider1._y - collider2._y;
			
			this._angle = Math.atan2(this._deltaY, this._deltaX);
			
			if (this._angle < 0)
			{
				this._angle += 2.0 * Math.PI;
			}
			
			this._aabbRadius = this._collider2AABB.getRadius(this._angle);
			this._addedRadius = this._collider1Circle._radius + this._aabbRadius;
			
			if ((this._deltaX * this._deltaX) + (this._deltaY * this._deltaY) <= this._addedRadius * this._addedRadius)
			{
				return true;
			}
			
			this._cornerX = (this._angle > 3.0 * Math.PI/2.0 || this._angle < Math.PI / 2.0) ? collider2._x + this._collider2AABB._halfWidth : collider2._x - this._collider2AABB._halfWidth;
			this._cornerY = (this._angle >= 0 && this._angle <= Math.PI ) ? collider2._y + this._collider2AABB._halfHeight : collider2._y - this._collider2AABB._halfHeight;
			
			if (this._collider1Circle.isPointInside(collider1._x, collider1._y, this._cornerX, this._cornerY ))
			{
				return true;
			}
			
			return false;
		}
		
		AABBVsCircle(collider1, collider2)
		{
			this._collider1AABB   = collider1.Shape;
			this._collider2Circle = collider2.Shape;
			
			if (this._collider1AABB.isPointInside(collider1._x, collider1._y, collider2._x, collider2._y))
			{
				return true;
			}
			
			this._deltaX = collider1._x - collider2._x;
			this._deltaY = collider1._y - collider2._y;
			
			this._angle = Math.atan2(this._deltaY, this._deltaX);
			
			if (this._angle < 0)
			{
				this._angle += 2.0 * Math.PI;
			}
			
			this._aabbRadius = this._collider1AABB.getRadius(this._angle);
			this._addedRadius = this._collider2Circle._radius + this._aabbRadius;
			
			if ((this._deltaX * this._deltaX) + (this._deltaY * this._deltaY) <= this._addedRadius * this._addedRadius)
			{
				return true;
			}
			
			this._cornerX = (this._angle > 3.0 * Math.PI/2.0 || this._angle < Math.PI / 2.0) ? collider1._x + this._collider1AABB._halfWidth : collider1._x - this._collider1AABB._halfWidth;
			this._cornerY = (this._angle >= 0 && this._angle <= Math.PI ) ? collider1._y + this._collider1AABB._halfHeight : collider1._y - this._collider1AABB._halfHeight;
			
			if (this._collider2Circle.isPointInside(collider2._x, collider2._y, this._cornerX, this._cornerY ))
			{
				return true;
			}
			
			return false;
		}
		
		AABBVsAABB(collider1, collider2)
		{
			this._collider1AABB = collider1.Shape;
			this._collider2AABB = collider2.Shape;
			
			if (Math.abs(collider1._x - collider2._x) > this._collider1AABB._halfWidth + this._collider2AABB._halfWidth)
			{
				return false;
			}
			
			if (Math.abs(collider1._y - collider2._y) > this._collider1AABB._halfHeight + this._collider2AABB._halfHeight)
			{
				return false;
			}
			
			return true;
		}
		
		circleVsTriangle(collider1, collider2)
		{
			this._collider1Circle   = collider1.Shape;
			this._collider2Triangle = collider2.Shape;
			
			this._tCoordX1 = collider2._x + this._collider2Triangle._x1;
			this._tCoordY1 = collider2._y + this._collider2Triangle._y1;
			this._tCoordX2 = collider2._x + this._collider2Triangle._x2;
			this._tCoordY2 = collider2._y + this._collider2Triangle._y2;
			this._tCoordX3 = collider2._x + this._collider2Triangle._x3;
			this._tCoordY3 = collider2._y + this._collider2Triangle._y3;
			
			// TEST 1: Vertex within circle
			this._deltaTX1 = collider1._x - this._tCoordX1;
			this._deltaTY1 = collider1._y - this._tCoordY1;
			
			this._radiusSqr = this._collider1Circle._radius * this._collider1Circle._radius;
			this._t1Sq      = this._deltaTX1 * this._deltaTX1 + this._deltaTY1 * this._deltaTY1;
			
			if (this._t1Sq <= this._radiusSqr)
				return true;
			
			this._deltaTX2 = collider1._x - this._tCoordX2;
			this._deltaTY2 = collider1._y - this._tCoordY2;
			this._t2Sq = this._deltaTX2 * this._deltaTX2 + this._deltaTY2 * this._deltaTY2;
			
			if (this._t2Sq <= this._radiusSqr)
				return true;
			
			this._deltaTX3 = collider1._x - this._tCoordX3;
			this._deltaTY3 = collider1._y - this._tCoordY3;
			this._t3Sq 	 = this._deltaTX3 * this._deltaTX3 + this._deltaTY3 * this._deltaTY3;
			
			if (this._t3Sq <= this._radiusSqr)
				return true;
				
			// TEST 2: Circle centre within triangle
			// NOTE: This works for clockwise ordered vertices!
		
			// Calculate this._edges
			this._edgeX1 = this._collider2Triangle._x2 - this._collider2Triangle._x1;
			this._edgeY1 = this._collider2Triangle._y2 - this._collider2Triangle._y1;
			
			this._edgeX2 = this._collider2Triangle._x3 - this._collider2Triangle._x2;
			this._edgeY2 = this._collider2Triangle._y3 - this._collider2Triangle._y2;
			
			this._edgeX3 = this._collider2Triangle._x1 - this._collider2Triangle._x3;
			this._edgeY3 = this._collider2Triangle._y1 - this._collider2Triangle._y3;
			
			if ((this._edgeY1 * this._deltaTX1 - this._edgeX1 * this._deltaTY1 >= 0) && (this._edgeY2 * this._deltaTX2 - this._edgeX2 * this._deltaTY2 >= 0) && (this._edgeY3 * this._deltaTX3 - this._edgeX3 * this._deltaTY3 >= 0))
				return true;
			
			// TEST 3: Circle intersects this._edge
			// Get the dot product...
			let k = this._edgeX1 * this._deltaTX1 + this._edgeY1 * this._deltaTY1;
			
			if (k > 0)
			{
				// squared len & squared k
				let len = this._edgeX1 * this._edgeX1 + this._edgeY1 * this._edgeY1;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t1Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// Second this._edge
			// Get the dot product...
			k = this._edgeX2 * this._deltaTX2 + this._edgeY2 * this._deltaTY2;
			
			if (k > 0)
			{
				// squared len & squared k
				let len = this._edgeX2 * this._edgeX2 + this._edgeY2 * this._edgeY2;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t2Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// Third this._edge
			// Get the dot product...
			k = this._edgeX3 * this._deltaTX3 + this._edgeY3 * this._deltaTY3;
			
			if (k > 0)
			{
				// squared len & squared k
				let len = this._edgeX3 * this._edgeX3 + this._edgeY3 * this._edgeY3;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t3Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// No Collision
			return false;
		}
		
		triangleVsCircle(collider1, collider2)
		{
			this._collider1Triangle = collider1.Shape;
			this._collider2Circle   = collider2.Shape;
			
			this._tCoordX1 = collider1._x + this._collider1Triangle._x1;
			this._tCoordY1 = collider1._y + this._collider1Triangle._y1;
			this._tCoordX2 = collider1._x + this._collider1Triangle._x2;
			this._tCoordY2 = collider1._y + this._collider1Triangle._y2;
			this._tCoordX3 = collider1._x + this._collider1Triangle._x3;
			this._tCoordY3 = collider1._y + this._collider1Triangle._y3;
			
			// TEST 1: Vertex within circle
			this._deltaTX1 = collider2._x - this._tCoordX1;
			this._deltaTY1 = collider2._y - this._tCoordY1;
			
			this._radiusSqr = this._collider2Circle._radius * this._collider2Circle._radius;
			this._t1Sq      = this._deltaTX1 * this._deltaTX1 + this._deltaTY1 * this._deltaTY1;
			
			if (this._t1Sq <= this._radiusSqr)
				return true;
			
			this._deltaTX2 = collider2._x - this._tCoordX2;
			this._deltaTY2 = collider2._y - this._tCoordY2;
			this._t2Sq 	 = this._deltaTX2 * this._deltaTX2 + this._deltaTY2 * this._deltaTY2;
			
			if (this._t2Sq <= this._radiusSqr)
				return true;
			
			this._deltaTX3 = collider2._x - this._tCoordX3;
			this._deltaTY3 = collider2._y - this._tCoordY3;
			this._t3Sq 	 = this._deltaTX3 * this._deltaTX3 + this._deltaTY3 * this._deltaTY3;
			
			if (this._t3Sq <= this._radiusSqr)
				return true;
			
			// TEST 2: Circle centre within triangle
			// NOTE: This works for clockwise ordered vertices!
			
			// Calculate this._edges
			this._edgeX1 = this._collider2Triangle._x2 - this._collider2Triangle._x1;
			this._edgeY1 = this._collider2Triangle._y2 - this._collider2Triangle._y1;
			
			this._edgeX2 = this._collider2Triangle._x3 - this._collider2Triangle._x2;
			this._edgeY2 = this._collider2Triangle._y3 - this._collider2Triangle._y2;
			
			this._edgeX3 = this._collider2Triangle._x1 - this._collider2Triangle._x3;
			this._edgeY3 = this._collider2Triangle._y1 - this._collider2Triangle._y3;
			
			if ((this._edgeY1 * this._deltaTX1 - this._edgeX1 * this._deltaTY1 >= 0) && (this._edgeY2 * this._deltaTX2 - this._edgeX2*this._deltaTY2 >= 0) && (this._edgeY3 * this._deltaTX3 - this._edgeX3 * this._deltaTY3 >= 0))
				return true;
			
			// TEST 3: Circle intersects edge
			// Get the dot product...
			let k = this._edgeX1 * this._deltaTX1 + this._edgeY1 * this._deltaTY1;
			
			if (k > 0)
			{
				// squared len & squared k
				let len = this._edgeX1 * this._edgeX1 + this._edgeY1 * this._edgeY1;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t1Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// Second edge
			// Get the dot product...
			k = this._edgeX2 * this._deltaTX2 + this._edgeY2 * this._deltaTY2;
			
			if (k > 0)
			{
				// squared len & squared k
				len = this._edgeX2 * this._edgeX2 + this._edgeY2 * this._edgeY2;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t2Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// Third edge
			// Get the dot product...
			k = this._edgeX3 * this._deltaTX3 + this._edgeY3 * this._deltaTY3;
			
			if (k > 0)
			{
				// squared len & squared k
				len = this._edgeX3 * this._edgeX3 + this._edgeY3 * this._edgeY3;
				k = k * k / len;
				
				// squared test
				if (k < len)
				{
					if (this._t3Sq - k <= this._radiusSqr)
						return true;
				}
			}
			
			// No Collision
			return false;
		}
	}

	window.CollisionMethods = CollisionMethods;
}