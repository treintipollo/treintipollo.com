"use strict";

{
	class GuiTextButtonInput
	{
		constructor()
		{
			this._logic = null;
			this._logicParameters = null;
			
			this._overColor = 0;
			this._outColor = 0;
			this._onOverCallback = null;
			this._onClickCallback = null;
			
			this._pressed = false;
			this._fadeOutOnClick = false;

			this._on_over = (e) => this.onOver(e);
			this._on_out = (e) => this.onOut(e);
			this._on_down = (e) => this.onDown(e);
			this._on_up = (e) => this.onUp(e);
		}
		
		get LogicParameters()
		{
			return this._logicParameters;
		}

		set LogicParameters(value)
		{
			this._logicParameters = value;
		}
		
		init(l, additionalParameters = null)
		{
			this._logic = l;
			
			this._overColor	= additionalParameters[0];
			this._outColor  = additionalParameters[1];
			
			if (additionalParameters[2])
				this._onClickCallback = additionalParameters[2];

			this._fadeOutOnClick = !!additionalParameters[3];
			
			this._logic.ExternalParameters["CallbackData"] = additionalParameters[4];
			
			if (additionalParameters[5])
				this._onOverCallback = additionalParameters[5];
			
			this._pressed = false;
		}
		
		initComplete()
		{
			const container = this._logic.getParent().Renderer.Container;

			container.addEventListener("rollover", this._on_over);
			container.addEventListener("rollout", this._on_out);
			container.addEventListener("mousedown", this._on_down);
			container.addEventListener("pressup", this._on_up);
		}
		
		update(deltaTime)
		{
			
		}
		
		postRelease()
		{
			const container = this._logic.getParent().Renderer.Container;

			if (container.hasEventListener("rollover"))
			{
				container.removeEventListener("rollover", this._on_over);
				container.removeEventListener("rollout", this._on_out);
				container.removeEventListener("mousedown", this._on_down);
				container.removeEventListener("pressup", this._on_up);
			}
			
			this._logic 			= null;
			this._logicParameters   = null;
			this._onClickCallback   = null;
		}
		
		destroy()
		{
			this.postRelease();
		}
		
		onOver(me)
		{
			if (!this._logic._doFadeOut)
			{
				this._logic.ExternalParameters["TextColor"] = this._overColor;
				
				if (this._onOverCallback !== null)
				{
					this._onOverCallback(this._logic.ExternalParameters);
				}
			}
		}
		
		onOut(me)
		{
			if (!this._logic._doFadeOut)
			{
				this._logic.ExternalParameters["TextColor"] = this._outColor;
			}
		}
		
		onUp(me)
		{
			if (this._pressed)
			{
				if (!this._logic._doFadeIn && !this._logic._doFadeOut)
				{
					if (this._onClickCallback)
					{
						this._onClickCallback(this._logic.ExternalParameters);
					}
				}

				if (this._fadeOutOnClick)
				{
					this._logic.startFadeOut();
				}
			}
			
			this._pressed  = false;
		}
		
		onDown(me)
		{
			this._pressed  = true;
		}
	}

	window.GuiTextButtonInput = GuiTextButtonInput;
}