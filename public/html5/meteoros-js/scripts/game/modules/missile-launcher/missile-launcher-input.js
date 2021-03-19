"use strict";

{
	class MissileLauncherInput
	{
		constructor()
		{
			this._logic = null;
			this._logicParameters = null;
			this._minShootingHeight = 0;
		}
		
		get LogicParameters()
		{
			return this._logicParameters;
		}

		set LogicParameters(value)
		{
			this._logicParameters = value;
		}
		
		init(logic, additionalParameters = null)
		{
			this._logic = logic;
		
			this._logicParameters = {};
			this._logicParameters["activateMissile"] = false;
			this._logicParameters["invalidPos"] 	 = false;
			this._logicParameters["targetPos"] 	   	 = new Point();
			
			this._minShootingHeight = this._logic._y + additionalParameters[0];
		}
		
		initComplete()
		{

		}
		
		update(deltaTime)
		{
			if (Nukes.mouseHandler.justClicked())
			{
				this._logicParameters["targetPos"].x = Nukes.mouseHandler.xPos();
				this._logicParameters["targetPos"].y = Nukes.mouseHandler.yPos();

				if ((Nukes.mouseHandler.yPos() < this._minShootingHeight))
				{
					this._logicParameters["activateMissile"] = true;
				}
				else
				{
					this._logicParameters["invalidPos"] = true;
				}
			}
			else
			{
				this._logicParameters["activateMissile"] = false;
				this._logicParameters["invalidPos"] 	 = false;
			}
		}
		
		postRelease()
		{
			this._logic 		  = null;
			this._logicParameters = null;
		}
		
		destroy()
		{
			this.postRelease();
		}
	}

	window.MissileLauncherInput = MissileLauncherInput;
}