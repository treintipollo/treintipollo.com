"use strict";

{
	class ModulePackage
	{
		constructor()
		{
			this._active = false;
			this._name = "";
			
			this._logic = null;
			this._renderer = null;
			this._input = null;
			this._collider = null;
			this._sound = null;
		}

		destroy()
		{
			if (this._renderer)
				this._renderer.destroy();
			
			if (this._input)
				this._input.destroy();
			
			if (this._collider)
				this._collider.destroy();
			
			if (this._sound)
				this._sound.destroy();
			
			if (this._logic)
				this._logic.destroy();
			
			this._logic 	= null;
			this._renderer 	= null;
			this._input 	= null;
			this._collider 	= null;
			this._sound	 	= null;
		}
	}

	window.ModulePackage = ModulePackage;
}