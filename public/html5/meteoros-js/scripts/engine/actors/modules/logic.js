"use strict";

{
	class Logic
	{
		constructor()
		{
			this._posX = 0;
			this._posY = 0;
			this._rotation = 0;
			this._scaleX = 1;
			this._scaleY = 1;
			this._scaleZ = 1;
			this._alpha = 1;
			
			this._externalParameters = {};
			this._parent = null;
			this._input = null;
		}
		
		get _x()
		{
			return this._posX;
		}

		get _y()
		{
			return this._posY;
		}

		get Rotation()
		{
			return this._rotation;
		}

		get ScaleX()
		{
			return this._scaleX;
		}

		get ScaleY()
		{
			return this._scaleY;
		}

		get ScaleZ()
		{
			return this._scaleZ;
		}

		get Alpha()
		{
			return this._alpha;
		}

		get ExternalParameters()
		{
			return this._externalParameters;
		}

		set _x(value)
		{
			this._posX = value;
		}

		set _y(value)
		{
			this._posY = value;
		}

		set Rotation(value)
		{
			this._rotation = value;
		}

		set ScaleX(value)
		{
			this._scaleX = value;
		}

		set ScaleY(value)
		{
			this._scaleY = value;
		}

		set ScaleZ(value)
		{
			this._scaleZ = value;
		}

		set Alpha(value)
		{
			this._alpha = value;
		}

		set ExternalParameters(value)
		{
			this._externalParameters = value;
		}

		init(x, y, rotation, scale)
		{
			this._posX 	   = x;
			this._posY 	   = y;
			this._rotation = rotation;
			this._scaleX   = scale;
			this._scaleY   = scale;
			this._scaleZ   = scale;
			this._alpha	   = 1;
			
			this.concreteInit();
		}
		
		setParent(parent)
		{
			this._parent = parent;
		}
		
		getParent()
		{
			return this._parent;
		}
		
		setInputHandler(input)
		{
			this._input = input;
		}
		
		postRelease()
		{
			this._parent = null;

			this.concreteRelease();
		}
		
		preRelease()
		{
			
		}
		
		destroy()
		{
			this.postRelease();
			
			CollectionUtils.nullDictionary(this._externalParameters);
			
			this.concreteDestroy();
		}
		
		onCollide(opponent, deltaTime)
		{

		}

		initComplete()
		{

		}

		childInit(params)
		{

		}

		update(deltaTime)
		{

		}
		
		concreteInit()
		{

		}

		concreteRelease()
		{

		}

		concreteDestroy()
		{

		}
	}

	window.Logic = Logic;
}