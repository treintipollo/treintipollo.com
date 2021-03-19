"use strict";

{
	class GuiListPopUpLogic extends GuiComponentContainerLogic
	{
		constructor()
		{
			super();

			this._initialization = null;
			
			this._buttonActor = null;
			this._titleActor = null;
			this._listActor = null;
			this._actorInitParams = null;
			
			this._sidePadding = 0;
			this._heightPadding = 0;

			this._on_button_click = (data) => this.onButtonClick(data);
		}
		
		childInit(params)
		{
			this._guiActorManager = params[0];
			this._initialization  = params[1];
			this._sidePadding     = params[2];
			this._heightPadding   = params[3];
		}
		
		initComplete()
		{
			super.initComplete();
			
			this._alpha = 0;
			
			let totalHeight = this._heightPadding;
			
			// Adding Title
			this._titleActor = this._guiActorManager.add(this._initialization.POPUP_GROUP_ID, this._initialization._titleActorId, this._posX + this._sidePadding, this._posY + totalHeight);
			this._titleActor.Renderer.bringToFront();

			totalHeight += this._titleActor.Renderer.Height + this._heightPadding;
			
			// Adding Items
			for(let i = 0; i < this._initialization._lenght; i++)
			{
				this._actorInitParams = this._guiActorManager.getInitParams(this._initialization._itemActorId);
				this._actorInitParams._logicInitParams[0] = this._initialization.getPopupLine(i);
				
				this._listActor = this._guiActorManager.add(this._initialization.POPUP_GROUP_ID, this._initialization._itemActorId, this._posX + this._sidePadding, this._posY + totalHeight);
				
				this._listActor.Renderer.bringToFront();
				totalHeight += this._listActor.Renderer.Height + this._heightPadding;
				
				this.addComponent(this._listActor);
			}

			// Centering Title if necessary
			if (this._listActor.Renderer.Width > this._titleActor.Renderer.Width)
			{
				this._titleActor.Logic._x = this._listActor.Renderer.Container.x + this._listActor.Renderer.Width / 2;
				this._titleActor.Logic._x -= this._titleActor.Renderer.Width / 2;
			}

			this.addComponent(this._titleActor);
			
			// Adding Exit Button
			this._actorInitParams = this._guiActorManager.getInitParams(this._initialization._buttonActorId);
			this._actorInitParams._inputInitParams[2] = this._on_button_click;
			
			this._buttonActor  = this._guiActorManager.add(this._initialization.POPUP_GROUP_ID, this._initialization._buttonActorId, this._posX + this._sidePadding, this._posY + totalHeight);
			totalHeight += this._buttonActor.Renderer.Height + this._heightPadding;
			
			// Centering Exit button if necessary
			if (this._listActor.Renderer.Width > this._buttonActor.Renderer.Width)
			{
				this._buttonActor.Logic._x = this._listActor.Renderer.Container.x + this._listActor.Renderer.Width / 2;
				this._buttonActor.Logic._x -= this._buttonActor.Renderer.Width / 2;
			}
			
			this.addComponent(this._buttonActor);
			
			this._externalParameters["Height"] = totalHeight;
			this._externalParameters["Width"]  = this._sidePadding * 2 + this._listActor.Renderer.Width;
			
			this._listActor = null;
			this._titleActor = null;
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._initialization 	= null;
			this._listActor 		= null;
			this._actorInitParams 	= null;
			this._buttonActor     	= null;
			this._titleActor		= null;
		}

		concreteDestroy()
		{
			this._on_button_click 	= null;
		}
		
		fadeIn(deltaTime)
		{
			if (this._alpha < 1)
			{
				this._alpha += deltaTime;
			}
			else
			{
				this._alpha = 1
				this._doFadeIn = false;
			}
			
			return false;
		}
		
		fadeOut(deltaTime)
		{
			if (this._alpha > 0)
			{
				this._alpha -= deltaTime;
			}
			else
			{
				this._alpha   = 0;
				this._doFadeOut = false;
				this._parent.Active = false;
			}
			
			return false;
		}
		
		onButtonClick(data)
		{
			this.startFadeOut();
		}
	}

	window.GuiListPopUpLogic = GuiListPopUpLogic;
}