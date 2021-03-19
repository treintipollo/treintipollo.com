"use strict";

{
	class CityLogic extends Logic
	{
		constructor()
		{
			super();
			
			this._actorManager = null;
			this._initHp = 0;
			this._hp = 0;
			this._population = null;
			this._repairFeedbackArguments = null;
			this._bonusFeedbackArguments = null;

			this._wavesSurvided = 0;
			this._skipBonusScore = true;

			this._on_population_recycled = (actor) => this.onPopulationRecycled(actor);
		}
		
		get Hp()
		{
			return this._hp;
		}

		get TotalHp()
		{
			return this._initHp;
		}

		childInit(params)
		{
			this._actorManager = params[0];
			this._hp 		   = params[1];
			this._initHp       = params[1];
			
			if (params[2])
			{
				this.takeDamage();
			}
		}
		
		initComplete()
		{
			this._population = this._actorManager.setActor("CityPopulation", this._posX, this._posY + 15, 0, 1, true, this._on_population_recycled);
		}
		
		onPopulationRecycled(pop)
		{
			 if (pop.Logic)
			 {
			 	this._externalParameters["population"] = pop.Logic.ExternalParameters["population"].concat();
			 }
		}
		
		preRelease()
		{
			if (this._population && this._population.Logic)
			{
				this._externalParameters["population"] = this._population.Logic.ExternalParameters["population"].concat();
			}
		}
		
		concreteInit()
		{
			this._externalParameters["damageTaken"] 		 = false;
			this._externalParameters["domeDestroyed"]        = false;
			this._externalParameters["cityDestroyed"]        = false;
			this._externalParameters["cityAlreadyDestroyed"] = false;
			this._externalParameters["domeAlreadyDestroyed"] = false;
			this._externalParameters["populationAvailable"]  = true;
			this._externalParameters["rebuildCity"] 		 = false;
			this._externalParameters["rebuildDome"] 		 = false;
		}
		
		onCollide(opponent, deltaTime)
		{
			if (this._hp > 0)
			{
				this._externalParameters["damageTaken"] = true;
				this._hp--;
			}
			else
			{
				if (!this._externalParameters["domeAlreadyDestroyed"])
				{
					this.logicDomeDestroy();
				}
				else
				{
					if (!this._externalParameters["cityAlreadyDestroyed"])
					{
						this.logicDestroy();
					}
				}
			}
		}
		
		concreteRelease()
		{
			this._actorManager 			  = null;
			this._population 	 		  = null;
			this._repairFeedbackArguments = null;
			this._bonusFeedbackArguments  = null;
			this._on_population_recycled  = null;
		}
		
		addPopulation()
		{
			if (this._population)
			{
				this._population.Logic.add();
			}
		}
		
		removePopulation()
		{
			if (this._population)
			{
			 	this._population.Logic.remove();
			 	this._externalParameters["populationAvailable"] = this._population.Logic.isPopulationAvailable();
			}
		}
		
		takeDamage()
		{
			this._hp = 0;
			
			if (!this._externalParameters["domeAlreadyDestroyed"])
			{
				this.logicDomeDestroy();
			}
			else
			{
				this.logicDestroy();
			}
		}
		
		repairDamage()
		{
			let populationAvailable = this._population.Logic.isPopulationAvailable();
			let wipedOut			= this._population.Logic.WipedOut;
			let maxedOut			= this._population.Logic.MaxedOut;
			
			let cityRebuilt			= false;
			
			this._repairFeedbackArguments = this._actorManager.getInitParams("CityRepair");
			
			// Rebuild City
			if (wipedOut && !populationAvailable)
			{
				this._externalParameters["cityDestroyed"]        = false;
				this._externalParameters["cityAlreadyDestroyed"] = false;
				this._externalParameters["populationAvailable"]  = true;
				this._externalParameters["rebuildCity"] 		 = true;
				
				cityRebuilt = true;
				
				this._repairFeedbackArguments._logicInitParams[0] = "CITY REBUILT";
			}
			
			// Add Population if not at max already
			if (!maxedOut)
			{
				if (this._population.Logic.HalfPopulation && this._externalParameters["domeAlreadyDestroyed"])
				{
					if (!cityRebuilt)
					{
						this._repairFeedbackArguments._logicInitParams[0] = "DOME REPAIR";
					}
					
					this._externalParameters["domeAlreadyDestroyed"] 	= false;
					this._externalParameters["domeDestroyed"] 	   	 	= false;
					this._externalParameters["rebuildDome"] 		 	= true;
					this._externalParameters["changeCollisionShape"]();
					
					this._hp = this._initHp;
				}
				else
				{
					if (!cityRebuilt)
					{
						this._repairFeedbackArguments._logicInitParams[0] = "POPULATION UP";
					}
					
					this._population.Logic.add();
				}
				
				this._actorManager.setActor("CityRepair", this._posX, this._posY);
			}
			
			else
			{
				if (this._externalParameters["domeAlreadyDestroyed"])
				{
					if (!cityRebuilt)
					{
						this._repairFeedbackArguments._logicInitParams[0] = "DOME REPAIR";
					}
					
					this._externalParameters["domeAlreadyDestroyed"]   = false;
					this._externalParameters["domeDestroyed"] 	   	   = false;
					this._externalParameters["rebuildDome"] 		   = true;
					this._externalParameters["changeCollisionShape"]();
					
					this._hp = this._initHp;
					
					this._actorManager.setActor("CityRepair", this._posX, this._posY);
				}
			}
		}

		survivorBonus()
		{
			if (this._skipBonusScore)
			{
				this._skipBonusScore = false;
			}
			else if (this._population.Logic.WipedOut && this._population.Logic.Count === 0)
			{
				// City destroyed, no bonus feedback
				this._actorManager.setActor("NoCityBonus", this._posX, this._posY);
			}
			else
			{
				// Add city survival bonus and show feedback

				const populationCount = this._population.Logic.Count;

				const cityBonus = 500 * (this._wavesSurvided + 1);
				const populationBonus = populationCount * (250 * (this._wavesSurvided + 1));
				
				this._bonusFeedbackArguments = this._actorManager.getInitParams("CityBonus");
				this._bonusFeedbackArguments._logicInitParams[0] = `BONUS +${cityBonus + populationBonus}`;

				this._actorManager.setActor("CityBonus", this._posX, this._posY);

				this._wavesSurvided++;

				Nukes.scoreCounter.addScore(cityBonus);
				Nukes.scoreCounter.addScore(populationBonus);
			}
		}
		
		logicDestroy()
		{
			this._externalParameters["cityDestroyed"]        = true;
			this._externalParameters["cityAlreadyDestroyed"] = true;
			this._externalParameters["populationAvailable"]  = false;
			
			this._wavesSurvided = 0;

			if (this._population)
				this._population.Logic.removeAll();
		}
		
		logicDomeDestroy()
		{
			if (!this._externalParameters["domeAlreadyDestroyed"])
			{
				this._externalParameters["domeAlreadyDestroyed"] = true;
				this._externalParameters["domeDestroyed"] = true;
				
				this._externalParameters["changeCollisionShape"]();
			}
		}
	}

	window.CityLogic = CityLogic;
}