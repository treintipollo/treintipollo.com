"use strict";

{
	class CityObserverLogic extends Logic
	{
		constructor()
		{
			super();

			this._city = null;
			this._noPopulationCallback = null;
			this._deadCities = 0;
			this._amountOfCitiesToSave = 0;
			
			this._isExecutingRepairs = false;
			this._isAssigningBonuses = false;

			this._repairTime = 0;
			this._repairTimer = 0;
			this._nextRepairIndex = 0;

			this._cities = new Array();
		}
		
		concreteInit()
		{
			this._repairTime 		 = 0.5;
			this._repairTimer 	   	 = 0;
			this._deadCities 		 = 0;
			this._nextRepairIndex    = 0;
			this._isExecutingRepairs = true;
			this._isAssigningBonuses = true;
		}
		
		childInit(params)
		{
			this._amountOfCitiesToSave = params[0]
			this._noPopulationCallback = params[1];
		}
		
		update(deltaTime)
		{
			this._deadCities = 0;
			
			if (this._isAssigningBonuses)
			{
				// Assigning city bonuses.
				if (this._repairTimer < this._repairTime)
				{
					this._repairTimer += deltaTime;
				}
				else
				{
					this._repairTimer = 0;

					if (this._cities[this._nextRepairIndex].Active)
					{
						this._cities[this._nextRepairIndex].Logic.survivorBonus();
					}
					
					if (this._nextRepairIndex < this._cities.length - 1)
					{
						this._nextRepairIndex++;

						if (this._nextRepairIndex >= this._cities.length)
							this._nextRepairIndex = 0;
					}
					else
					{
						this._nextRepairIndex = 0;
						this._isAssigningBonuses = false;
					}
				}
			}
			else if (this._isExecutingRepairs)
			{
				// Executing city repairs.
				if (this._repairTimer < this._repairTime)
				{
					this._repairTimer += deltaTime;
				}
				else
				{
					this._repairTimer = 0;

					if (this._cities[this._nextRepairIndex].Active)
					{
						this._cities[this._nextRepairIndex].Logic.repairDamage();
					}
					
					if (this._nextRepairIndex < this._cities.length - 1)
					{
						this._nextRepairIndex++;

						if (this._nextRepairIndex >= this._cities.length)
							this._nextRepairIndex = 0;
					}
					else
					{
						this._nextRepairIndex = 0;
						this._isExecutingRepairs = false;
					}
				}
			}
			else
			{
				// Check for destroyed cities
				for (let i = 0; i < this._cities.length; i++)
				{
					if (this._cities[i].Active)
					{
						if (!this._cities[i].Logic.ExternalParameters["populationAvailable"])
						{
							this._deadCities++;
						}
						
						if (this._cities.length - this._deadCities < this._amountOfCitiesToSave)
						{
							this._parent.Active = false;
							
							if (this._noPopulationCallback)
							{
								this._noPopulationCallback();
							}

							break;
						}
					}
				}
			}
		}
		
		concreteRelease()
		{
			this._city 				 	= null
			this._noPopulationCallback 	= null;
		}
		
		concreteDestroy()
		{
			this._cities = null;
		}
		
		addCity(city)
		{
			this._cities.push(city);
		}
	}

	window.CityObserverLogic = CityObserverLogic;
}