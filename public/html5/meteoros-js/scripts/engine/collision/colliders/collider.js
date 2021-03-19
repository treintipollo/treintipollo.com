"use strict";

{
	const AABB_BOX = "AABB_BOX";
	const CIRCLE   = "CIRCLE";
	const TRIANGLE = "TRIANGLE";
	
	class Collider
	{
		constructor()
		{
			this._onCollide = null;
			this._colliderShape = null;
			this._logic = null;
			
			this._XOffset = 0;
			this._YOffset = 0;
			
			this._active = false;
		}

		static get AABB_BOX()
		{
			return AABB_BOX;
		}

		static get CIRCLE()
		{
			return CIRCLE;
		}

		static get TRIANGLE()
		{
			return TRIANGLE;
		}
		
		get Logic()
		{
			return this._logic;
		}
		
		get Shape()
		{
			return this._colliderShape;
		}
		
		get _x()
		{
			return this._logic._x + this._XOffset;
		}
		
		get _y()
		{ 
			return this._logic._y + this._YOffset;
		}
		
		get Active()
		{ 
			return this._active;
		}
		
		init(logic, additionalParameters = null)
		{
			this._logic 	= logic;
			this._onCollide = (opponentLogic, deltaTime) => logic.onCollide(opponentLogic, deltaTime);
			this._XOffset 	= 0;
			this._YOffset 	= 0;
			this._active  	= true;
			
			this.concreteInit(additionalParameters);
		}
		
		update(deltaTime)
		{

		}
		
		initComplete()
		{

		}
		
		postRelease()
		{
			this._onCollide = null;
			this._logic 	= null;
			
			this.concreteRelease();
		}
		
		destroy()
		{
			this.postRelease();
			this.concretDestroy();
			
			this._colliderShape = null;
		}
		
		concreteInit(additionalParameters = null)
		{

		}

		concreteRelease()
		{

		}

		concretDestroy()
		{

		}
	}

	window.Collider = Collider;
}