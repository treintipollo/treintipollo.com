"use strict";

{
	class Actor
	{
		constructor()
		{
			this._timeStamp 	 = 0;
			this._modulePackage  = null;
			this._lastModuleName = "";
			
			this._input 	= null;
			this._logic 	= null;
			this._renderer 	= null;
			this._collider 	= null;
			this._sound 	= null;

			this._isActive 	    	= false;
			this._managerIndex    	= -1;
			this._recycleCallback 	= new CallbackChain();
		}
		
		get Active()
		{
			return this._isActive;
		}

		get Logic()
		{
			return this._logic;
		}

		get Renderer()
		{
			return this._renderer;
		}
		
		get Input()
		{
			return this._input;
		}
		
		get Collider()
		{
			return this._collider;
		}
		
		get Modules()
		{
			return this._modulePackage;
		}
		
		get ManagerIndex()
		{
			return this._managerIndex;
		}

		get TimeStamp()
		{
			return this._timeStamp;
		}
		
		get RecycleCallbackChain()
		{
			return this._recycleCallback;
		}
		
		set Active(value)
		{
			this._isActive = value;
		}

		set Logic(value)
		{
			this._logic = value;
		}

		set Renderer(value)
		{
			this._renderer = value;
		}

		set Input(value)
		{
			this._input = value;
		}

		set Collider(value)
		{
			this._collider = value;
		}

		set Modules(value)
		{
			this._modulePackage = value;
		}

		set ManagerIndex(value)
		{
			this._managerIndex = value;
		}

		set TimeStamp(value)
		{
			this._timeStamp = value;
		}

		init(modulePackage, recycleCallback)
		{
			this._modulePackage = modulePackage;
			this._logic 		= modulePackage._logic;
			this._renderer 	    = modulePackage._renderer;
			this._input         = modulePackage._input;
			this._collider	    = modulePackage._collider;
			this._sound		    = modulePackage._sound;
			
			this._recycleCallback.add(recycleCallback);

			if (this._logic)
			{
				this._logic.setParent(this);
				this._logic.setInputHandler(this._input);
			}
			
			if (this._renderer)
			{
				this._renderer.setLogic(this._logic);
				this._renderer.addToStage();
			}
		
			this._isActive = true;
		}
		
		initComplete()
		{
			if (this._logic)
				this._logic.initComplete();
			
			if (this._renderer)
				this._renderer.initComplete();
			
			if (this._input)
				this._input.initComplete();
			
			if (this._collider)
				this._collider.initComplete();
			
			if (this._sound)
				this._sound.initComplete();
		}
		
		update(modulePackageFactory, collisionManager, actors, deltaTime)
		{
			if (this._managerIndex !== -1)
			{
				if (this._isActive && this._modulePackage._active)
				{
					// Update Components
					if (this._input)
						this._input.update(deltaTime);

					if (this._logic)
						this._logic.update(deltaTime);
					
					if (this._collider)
					{
						this._collider.update(deltaTime);
						collisionManager.checkCollisions(this._modulePackage._name, this._collider, deltaTime);
					}
					
					if (this._renderer)
						this._renderer.update(deltaTime);
				}
				else
				{
					this._lastModuleName = this._modulePackage._name;
					
					// Removing from Collision Manager.
					if (this._collider)
						collisionManager.removeActor(this);
					
					// Updating which actors and modules are valid.
					modulePackageFactory.retrievePackage(this._lastModuleName);
					
					actors.restoreActor();
					
					// Cleaning Actor for next use.
					this.release();
				}
			}
		}
		
		release()
		{
			if (this._logic)
				this._logic.preRelease();
			
			if (!this._recycleCallback.isEmpty())
				this._recycleCallback.exec(this);
			
			this._recycleCallback.destroy();
			
			if (this._renderer)
				this._renderer.postRelease();

			if (this._input)
				this._input.postRelease()

			if (this._collider)
				this._collider.postRelease();
			
			if (this._logic)
				this._logic.postRelease();
			
			if (this._sound)
				this._sound.postRelease();
			
			this._managerIndex 		 = -1;
			this._timeStamp			 = -1;
			this._isActive			 = false;
			
			if (this._modulePackage)
				this._modulePackage._active = false;
			
			this._modulePackage	= null;
			this._logic 		= null;
			this._renderer 	    = null;
			this._input         = null;
			this._collider      = null;
			this._sound			= null;
		}
	}

	window.Actor = Actor;
}