"use strict";

{
	const NONE   		= 0;
	const MALE   		= 1;
	const FEMALE 		= 2;
	const MALE_MUTANT   = 3;
	const FEMALE_MUTANT = 4;

	class CityPopulationLogic extends Logic
	{
		constructor()
		{
			super();
			
			this._maxPopulation = 0;
			this._population = null;
			this._order = false;
			this._wipedOut = false;

			this._externalParameters["population"] = null;
			this._externalParameters["populationChanged"] = false;
		}
		
		static get NONE()
		{
			return NONE;
		}

		static get MALE()
		{
			return MALE;
		}

		static get FEMALE()
		{
			return FEMALE;
		}

		static get MALE_MUTANT()
		{
			return MALE_MUTANT;
		}

		static get FEMALE_MUTANT()
		{
			return FEMALE_MUTANT;
		}

		get Count()
		{
			let ret = 0;

			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				if (this._population[i] !== NONE)
					ret++;
			}
			
			return ret;
		}

		get WipedOut()
		{
			return this._wipedOut;
		}
		
		get MaxedOut()
		{
			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				if (this._population[i] === NONE)
				{
					return false;
				}
			}
			
			return true;
		}
		
		get HalfPopulation()
		{
			var minAmount = 0;
			
			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				if (this._population[i] !== NONE)
				{
					minAmount++;
				}
			}
			
			
			return (minAmount >= this._maxPopulation / 2);
		}
		
		childInit(params)
		{
			this._maxPopulation = params[0];
			this._population    = new Array(this._maxPopulation);
			this._wipedOut	  = false;
			
			this._order = NumberUtils.randBoolean();
			
			for (let i = 0; i < this._maxPopulation; i++)
			{
				if (this._order)
				{
					if (i % 2 === 0)
					{
						this._population[i] = MALE;
					}
					else
					{
						this._population[i] = FEMALE;
					}
				}
				else
				{
					if (i % 2 === 0)
					{
						this._population[i] = FEMALE;
					}
					else
					{
						this._population[i] = MALE;
					}
				}
			} 
			
			this._externalParameters["population"] 		= this._population;
			this._externalParameters["populationChanged"] = true;
		}
		
		concreteRelease()
		{
			this._population = null;
		}
		
		add()
		{
			for (let i = 0; i < this._maxPopulation; i++)
			{
				if (this._population[i] === 0)
				{
					if (this._wipedOut)
					{
						this._population[i] = NumberUtils.randRange(MALE, FEMALE_MUTANT, true);
					}
					else
					{
						this._population[i] = NumberUtils.randRange(MALE, FEMALE, true);
					}
					
					this._externalParameters["populationChanged"] = true;
					
					return;
				}
			}
		}
		
		remove()
		{
			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				if (this._population[i] !== NONE)
				{
					this._population[i] = NONE;
					this._externalParameters["populationChanged"] = true;
					return;
				}
			}
		}
		
		removeAll()
		{
			this._wipedOut = true;
			
			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				this._population[i] = NONE;
				this._externalParameters["populationChanged"] = true;
			}
		}
		
		isPopulationAvailable()
		{
			for (let i = this._maxPopulation - 1; i >= 0; i--)
			{
				if (this._population[i] !== NONE)
				{
					return true;
				}
			}
			
			return false;
		}
	}

	window.CityPopulationLogic = CityPopulationLogic;
}