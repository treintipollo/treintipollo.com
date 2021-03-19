"use strict";

{
	class UfoCoordinatorLogic extends FactoryLogic
	{
		constructor()
		{
			super();

			this._maxWidth = 0;
			this._spawnInterval = 0;
			this._deltaAccumulator = 0;
			this._ufoInitParams = null;
			this._cities = null;
			this._ufoActorIds = null;
			this._currentUfoId = "";
			this._deployedUfo = null;
			this._nextCityIndex = 0;
			this._probabilities = null;
			this._totalCount = 0;
			this._targetFound = false;

			this._ufoPos		 		 = new Point();
			this._availableCityIndexes 	 = new Array();
			this._deployedUfos		 	 = new Map();

			this._on_ufo_death = (actor) => this.onUfoDeath(actor);
		}
		
		concreteInit()
		{
			this._deltaAccumulator = 0;
		}
		
		initComplete()
		{
			this._cities = this._actorManager.getModulesOfType("City_Actor");
			
			for (let i = 0; i < this._cities.length; i++)
			{
				this._availableCityIndexes.push(true);
			}
		}
		
		childInit(params)
		{
			this._actorManager  = params[0];
			this._maxWidth	    = params[1];
			this._ufoActorIds	= params[2];
			this._probabilities = params[3];
			this._spawnInterval = params[4];
		}
		
		update(deltaTime)
		{
			if (this._deltaAccumulator < this._spawnInterval)
			{
				this._deltaAccumulator += deltaTime;
			}
			else
			{
				if (this.getCityToAttack(NumberUtils.randRange(0, this._cities.length - 1, true)))
				{
					this._deltaAccumulator = 0;
					
					if (this._cities[this._nextCityIndex]._logic.ExternalParameters["domeAlreadyDestroyed"])
					{
						if (this._cities[this._nextCityIndex]._logic.ExternalParameters["populationAvailable"])
						{
							if (this._probabilities.length === 1)
							{
								if (this._ufoActorIds[0] === "UfoLazor")
								{
									this._currentUfoId = "NO_ACTOR";
								}
								else
								{
									this._currentUfoId = this._ufoActorIds[0];
								}
							}
							else
							{
								do
								{
									this._currentUfoId = this._ufoActorIds[ProbabilityUtils.discreteInverseSampling(this._probabilities)];
								}
								while (this._currentUfoId === "UfoLazor")
							}
						}
						else
						{
							this._currentUfoId = "UfoLazor";
						}
					}
					else
					{
						this._currentUfoId = this._ufoActorIds[ProbabilityUtils.discreteInverseSampling(this._probabilities)];
					}
					
					if (this._currentUfoId !== "NO_ACTOR")
					{
						this._ufoInitParams = this._actorManager.getInitParams(this._currentUfoId);
						this._ufoInitParams._logicInitParams[0] = this._cities[this._nextCityIndex]._logic;
						
						this._ufoPos.x = NumberUtils.randRange(0, this._maxWidth);
						this._ufoPos.y = -this._ufoInitParams._colliderInitParams[0];
						
						this._deployedUfo = this._actorManager.setActor(this._currentUfoId, this._ufoPos.x, this._ufoPos.y, 0, 1, true, this._on_ufo_death);
					
						this.setChildDestructionCallbacks(this._deployedUfo);
						
						this._availableCityIndexes[this._nextCityIndex] = false;

						this._deployedUfos.set(this._deployedUfo, this._nextCityIndex);
					}
					else
					{
						this._availableCityIndexes[this._nextCityIndex] = true;
					}
				}
			}
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._actorManager  = null;
			this._ufoActorIds	= null;
			this._probabilities = null;
			this._cities		= null;
		}
		
		concreteDestroy()
		{
			this._ufoPos 				 = null;
			this._deployedUfo 		 	 = null;
			this._availableCityIndexes 	 = null;
			this._on_ufo_death			 = null;
			
			CollectionUtils.nullDictionary(this._deployedUfos);
		}
		
		onUfoDeath(ufo)
		{
			let cityIndex = this._deployedUfos.get(ufo);
			
			if (this._availableCityIndexes)
			{
				if (this._cities)
				{
					if (this._cities[cityIndex]._logic)
					{
						if (this._cities[cityIndex]._logic.ExternalParameters["populationAvailable"])
						{
							this._availableCityIndexes[cityIndex] = true;
						}
						else
						{
							this._availableCityIndexes[cityIndex] = false;
						}
					}
				}
			
				if (this._deployedUfos)
					this._deployedUfos.delete(ufo);
			}
		}
		
		getCityToAttack(startIndex)
		{
			this._totalCount  = 0;
			this._targetFound = false;
			
			while (!this._targetFound)
			{
				if (this._availableCityIndexes[startIndex])
				{
					if (!this._cities[startIndex]._logic.ExternalParameters["cityAlreadyDestroyed"])
					{
						this._targetFound = true;
					}
					else
					{
						this._availableCityIndexes[startIndex] = false;
						
						if (startIndex < this._availableCityIndexes.length - 1)
						{
							startIndex++;
						}
						else
						{
							startIndex = 0;
						}
						
						this._totalCount++;
						
						if (this._totalCount === this._availableCityIndexes.length)
						{
							return false;
						}
					}
				}
				else
				{
					if (startIndex < this._availableCityIndexes.length - 1)
					{
						startIndex++;
					}
					else
					{
						startIndex = 0;
					}
					
					this._totalCount++;

					if (this._totalCount === this._availableCityIndexes.length)
					{
						return false;
					}
				}
			}
			
			this._nextCityIndex = startIndex;
			
			return true;
		}
	}

	window.UfoCoordinatorLogic = UfoCoordinatorLogic;
}