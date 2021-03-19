"use strict";

{
	class CitiesDestroyed
	{
		constructor()
		{
			this._fullFilled = null;
			this._cityObserver = null;
			this._cityModules = null;
			this._amountOfCitiesToSave = 0;
		}
		
		set FullFilledCallback(value)
		{
			this._fullFilled = value;
		}
		
		setInitArguments(args)
		{
			this._amountOfCitiesToSave = args[0];
		}
		
		init(args)
		{

		}
		
		release()
		{
			this._cityObserver = null;
			this._cityModules  = null;
		}
		
		setUpVisual(modulePackageFactory, initParametersGetter)
		{
			modulePackageFactory.registerPackage("CityObserver_Actor", 1, CityObserverLogic, null, null, null);
			initParametersGetter.register("CityObserver", "CityObserver_Actor", [this._amountOfCitiesToSave, this._fullFilled], null, null, null);
		}
		
		addVisual(actorManager)
		{
			this._cityObserver = actorManager.setActor("CityObserver", 0, 0, 0, 1, true);
			
			this._cityModules = actorManager.getModulesOfType("City_Actor");
			
			for (let i = 0; i < this._cityModules.length; i++)
			{
				if (this._cityModules[i]._active)
				{
					this._cityObserver.Logic.addCity(this._cityModules[i]._logic.getParent());
				}
			}
		}
		
		getDescription()
		{
			let cityAmount;
			
			if (this._amountOfCitiesToSave > 1)
			{
				cityAmount = " CITIES";
			}
			else
			{
				cityAmount = " CITY";
			}
			
			return "SAVE " + this._amountOfCitiesToSave + cityAmount;
		}
	}

	window.CitiesDestroyed = CitiesDestroyed;
}