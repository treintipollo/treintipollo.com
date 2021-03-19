"use strict";

{
	let lastX = NaN;
	let lastY = NaN;
	let lastRot = NaN;
	
	class Renderer
	{
		constructor()
		{
			this._redraw = false;
			this._dirtyGraphics = true;
			
			this._container = null;
			this._stage = null;
			this._logic = null;
		}
		
		init(x, y, redraw, stage, rotation, scale)
		{
			this._redraw = redraw;
			
			this.concreteInit();
			
			this._container.x = x;
			this._container.y = y;
			this._stage 	  = stage;
			
			this._container.rotation = rotation;
			this._container.scaleX   = scale;
			this._container.scaleY   = scale;
			this._container.scaleZ   = scale;
		}
		
		get Container()
		{
			return this._container;
		}

		get Width()
		{
			return this._container.width;
		}

		get Height()
		{
			return this._container.height;
		}
		
		initComplete()
		{

		}

		childInit(params)
		{

		}
		
		setLogic(l)
		{
			this._logic = l;
		}
		
		bringToFront()
		{
			this._stage.setChildIndex(this._container, this._stage.numChildren - 1);
		}
		
		sendBack()
		{
			this._stage.setChildIndex(this._container, 1);
		}
		
		update(deltaTime)
		{
			this._container.x 	   	 = this._logic._x;
			this._container.y 	   	 = this._logic._y;
			this._container.rotation = this._logic.Rotation;
			this._container.scaleX   = this._logic.ScaleX;
			this._container.scaleY   = this._logic.ScaleY;
			this._container.scaleZ   = this._logic.ScaleZ;
			this._container.alpha    = this._logic.Alpha;

			this.concreteUpdate(deltaTime);
		}
		
		addToStage()
		{
			if (!(this._stage.contains(this._container)))
			{
				this._stage.addChild(this._container);
			}
			
			this.concreteAddAddToStage();
		}
		
		removeFromStage()
		{
			if (this._container && this._container.parent && this._container.parent.contains(this._container))
			{
				this._container.parent.removeChild(this._container);
			}
			
			this.concreteRemoveFromStage();
		}
		
		postRelease()
		{
			this.removeFromStage();
			
			if (this._container)
			{
				this._container.x = 0;
				this._container.y = 0;
				
				this._container.rotation = 0;
				this._container.scaleX   = 1;
				this._container.scaleY   = 1;
				this._container.scaleZ   = 1;
			}
			
			this.concreteRelease();
			
			this._logic = null;
			this._stage = null;
		}
		
		destroy()
		{
			this.postRelease();
			
			this._container = null;
			this._dirtyGraphics = false;
			
			this.concreteDestroy();
		}
		
		concreteInit()
		{

		}

		concreteRelease()
		{

		}

		concreteAddAddToStage()
		{

		}

		concreteRemoveFromStage()
		{

		}

		concreteUpdate(deltaTime)
		{

		}

		concreteDestroy()
		{

		}
		
		draw(initCall = true)
		{
			lastX   = this._container.x;
			lastY   = this._container.y;
			lastRot = this._container.rotation;
			
			this._container.x 	     = 0;
			this._container.y 	     = 0;
			this._container.rotation = 0;
			
			if (initCall)
			{
				if (this._redraw && this._dirtyGraphics)
				{
					this.concreteDraw();
					this._dirtyGraphics = false;
				}
			}
			else
			{
				this.concreteDraw();
			}
			
			this._container.x 	     = lastX;
			this._container.y 	     = lastY;
			this._container.rotation = lastRot;
		}

		concreteDraw()
		{

		}
	}

	window.Renderer = Renderer;
}