"use strict";

{
	class GuiButtonListLogic extends GuiComponentContainerLogic
	{
		
		constructor()
		{
			super();
			
			this._initialization = null;
			
			this._buttonActor = null;
			this._titleActor = null;
			this._actorInitParams = null;
			this._onButtonCallback = null;
			
			this._sidePadding = 0;
			this._heightPadding = 0;
			this._longestWidth = 0;

			this._on_button_click = (data) => this.onButtonClick(data);
		}
		
		childInit(params)
		{
			this._guiActorManager  = params[0];
			this._initialization   = params[1];
			this._sidePadding      = params[2] + 3;
			this._heightPadding    = params[3] + 5;
			this._onButtonCallback = params[4];
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
			this._longestWidth = this._titleActor.Renderer.Width + this._sidePadding;
			
			// Adding Buttons
			for (let i = 0; i < this._initialization._lenght; i++)
			{
				this._actorInitParams = this._guiActorManager.getInitParams(this._initialization._buttonActorId);
				this._actorInitParams._logicInitParams[0] = this._initialization.getButtonText(i);
				this._actorInitParams._inputInitParams[2] = this._on_button_click;
				this._actorInitParams._inputInitParams[4] = { buttonName: this._actorInitParams._logicInitParams[0] };
				
				this._buttonActor = this._guiActorManager.add(this._initialization.POPUP_GROUP_ID, this._initialization._buttonActorId, this._posX + this._sidePadding, this._posY + totalHeight);
				
				this._buttonActor.Renderer.bringToFront();
				totalHeight += this._buttonActor.Renderer.Height + this._heightPadding;
				
				this.addComponent(this._buttonActor);
				
				if (this._longestWidth < this._buttonActor.Renderer.Width)
				{
					this._longestWidth = this._buttonActor.Renderer.Width + this._sidePadding;
				}
			}
			
			// Centering Title if necessary
			let diff;
			
			if (this._titleActor.Renderer.Width < this._longestWidth)
			{
				diff = this._longestWidth - this._titleActor.Renderer.Width;
				this._titleActor.Logic._x += diff / 2;
			}
			
			this.addComponent(this._titleActor);
			
			// Center the rest of the buttons if needed
			for (let i = 0; i < this._initialization._lenght; i++)
			{
				this._buttonActor = this._components[i];
				
				if (this._buttonActor.Renderer.Width < this._longestWidth)
				{
					diff = this._longestWidth - this._buttonActor.Renderer.Width;
					this._buttonActor.Logic._x += diff / 2;
					
					this._offsets[i].x = this._posX - this._buttonActor.Logic._x;
					this._offsets[i].y = this._posY - this._buttonActor.Logic._y;
				}
			}
			
			this._externalParameters["Height"] = totalHeight;
			this._externalParameters["Width"]  = this._sidePadding * 2 + this._longestWidth;
			
			this._titleActor  = null;
			this._buttonActor = null;
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._initialization  = null;
			this._actorInitParams = null;
			this._buttonActor     = null;
			this._titleActor 	  = null;
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
			this._onButtonCallback(data);
		}
	}

	window.GuiButtonListLogic = GuiButtonListLogic;
}