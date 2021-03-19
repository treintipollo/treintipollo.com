"use strict";

{
	class GuiComponentContainerLogic extends GuiComponentLogic
	{
		constructor()
		{
			super();

			this._guiActorManager = null;
			this._components = [];
			this._offsets    = [];
			
			this._externalParameters["Height"] = 0;
			this._externalParameters["Width"]  = 0;
		}
		
		addComponent(c)
		{
			this._components.push(c);
			
			this._offsets.push(new Point(this._posX - c.Logic._x, this._posY - c.Logic._y));
		}
		
		get _x()
		{
			return this._posX;
		}
		
		get _y()
		{
			return this._posY;
		}

		set _x(value)
		{
			this._posX = value;
			
			for (let i = 0; i < this._components.length; i++)
			{
				this._components[i].Logic._x = this._posX + Math.abs(this._offsets[i].x);
			}
		}
		
		set _y(value)
		{
			this._posY = value;
			
			for (let i = 0; i < this._components.length; i++)
			{
				this._components[i].Logic._y = this._posY + Math.abs(this._offsets[i].y);
			}
		}
		
		startFadeOut()
		{
			super.startFadeOut();
			
			for (let i = 0; i < this._components.length; i++)
			{
				this._components[i].Logic.startFadeOut();
			}
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._guiActorManager = null;
			
			CollectionUtils.nullVector(this._components, false, true);
			CollectionUtils.nullVector(this._offsets, false, true);
		}
		
		concreteDestroy()
		{
			this._components = null;
			this._offsets = null;
		}
	}

	window.GuiComponentContainerLogic = GuiComponentContainerLogic;
}