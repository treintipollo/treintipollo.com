"use strict";

{
	let _baddyPool = null;
	let _stage = null;
	
	let _classDefinition = null;
	let _className = "";
	let _statsDefinition = null;
	let _statsName = "";
	let _baddyStatsObject = null
	let _baddyStatsName = "";
	let _statsInstance = null;
	
	let _generatorParams = null;
	let _statsSetByClass = false;
	
	let _count = 0;
	let _nulledCount = 0;
	 
	let _basicMethodCountCalls = 0;
	let _generatorMethodCountCall = 0;
	let _baddyStrengthSet = false;
	let _generatorBaddyStrengthSet = false;
	
	const BASIC_METHOD_COUNT = 3;
	const GENERATOR_METHOD_COUNT = 3;
	const SPLICE_LIMIT = 10;
	
	//
	// Baddy Parameters
	//
	let _rotationSpeed = 0;
	let _lineWidth = 0;
	let _lineColor = 0;
	let _fillColor = 0;
	let _segmentSpeedRange = 0;
	let _segmentRotSpeedRange = 0;
	let _segmentLife = 0;
	let _specificParams = null;
	let _isHitable = false;
	let _isVisible = false;
	let _isGenerator = false;
	let _life = 0;
	let _radius = 0;
	let _maxSpeed = 0;
	let _hasDeathSound = false;
	let _deathSoundIndex = 0;
	
	//
	// Generator Parameters
	//
	let _baddyStats = null;
	let _baddySpecificParams = null;
	let _baddyName = "";
	let _baddySrength = "";

	class BaddyManager
	{
		constructor()
		{
			
		}
		
		static Init(stage)
		{
			_baddyPool = [];
			_stage = stage;
			
			_isGenerator = false;
			_baddyStrengthSet = false;
			_generatorBaddyStrengthSet = false;
			_statsSetByClass = false;
			_count = 0;
			_nulledCount = 0;
			_basicMethodCountCalls = 0;
			_generatorMethodCountCall = 0;
		}
		
		static SetType(baddyName)
		{
			_className = baddyName;
			
			if ((_className.search("Generator")) !== -1)
			{
				_classDefinition = getDefinitionByName(_className);
				
				_isGenerator = true;
			}
			else
			{
				// Same deal as with the Generators, Baddy that for all intents and purposes acts like a Bullet,
				// should have the word "Bullet" spelled properly somewhere on it's class name.
				if ((_className.search("Bullet")) !== -1)
				{
					_classDefinition = getDefinitionByName(_className);
				}
				else
				{
					_classDefinition = getDefinitionByName(_className);
				}

				_isGenerator = false;
			}
			
			_basicMethodCountCalls++;
		}
		
		static SetStatsByName(statsName)
		{
			if (!_baddyStrengthSet)
			{
				_statsName = statsName;
				_statsDefinition = getDefinitionByName(_statsName);
				
				let currentBaddyParams = new _statsDefinition();

				_rotationSpeed = currentBaddyParams._rotationSpeed;
				_radius = currentBaddyParams._radius;
				_life = currentBaddyParams._life;
				_maxSpeed = currentBaddyParams._maxSpeed;
				_lineWidth = currentBaddyParams._lineWidth;
				_lineColor = currentBaddyParams._lineColor;
				_fillColor = currentBaddyParams._fillColor;
				_segmentSpeedRange = currentBaddyParams._segmentSpeedRange;
				_segmentRotSpeedRange = currentBaddyParams._segmentRotSpeedRange;
				_segmentLife = currentBaddyParams._segmentLife;
				_isHitable = currentBaddyParams._isHitable;
				_isVisible = currentBaddyParams._isVisible;
				_hasDeathSound = currentBaddyParams._hasDeathSound
				_deathSoundIndex = currentBaddyParams._deathSoundIndex;
				
				_statsInstance = currentBaddyParams;
				
				_baddyStrengthSet = true;
				_basicMethodCountCalls++;
			}
			else
			{
				this.StatsAlreadySetException();
			}
		}
		
		static SetStatsByClass(stats, statsName)
		{
			if (!_baddyStrengthSet)
			{
				_statsName = statsName;
				_statsDefinition = stats.constructor;
				_statsInstance = stats;

				_rotationSpeed = stats._rotationSpeed;
				_radius = stats._radius;
				_life = stats._life;
				_maxSpeed = stats._maxSpeed;
				_lineWidth = stats._lineWidth;
				_lineColor = stats._lineColor;
				_fillColor = stats._fillColor;
				_segmentSpeedRange = stats._segmentSpeedRange;
				_segmentRotSpeedRange = stats._segmentRotSpeedRange;
				_segmentLife = stats._segmentLife;
				_isHitable = stats._isHitable;
				_isVisible = stats._isVisible;
				_hasDeathSound = stats._hasDeathSound;
				_deathSoundIndex = stats._deathSoundIndex;
				
				_baddyStrengthSet = true;
				_statsSetByClass = true;
				_basicMethodCountCalls++;
			}
			else
			{
				this.StatsAlreadySetException();
			}
		}
		
		static SetSpecificParams(...specificParams)
		{
			if (_specificParams === null)
			{
				_specificParams = specificParams;
			
				_basicMethodCountCalls++;
			}
			else
			{
				this.SpecificParamsAlreadySetException();
			}
			
			specificParams = null;
		}
		
		static SetSpecificParamsAsArray(specificParams)
		{
			if (_specificParams === null)
			{
				_specificParams = specificParams;
			
				_basicMethodCountCalls++;
			}
			else
			{
				this.SpecificParamsAlreadySetException();
			}
			
			specificParams = null;
		}
		
		static SetGeneratorParamsByClass(stats)
		{
			if (!_isGenerator)
			{
				this.NameErrorException(_className);
			}
			else
			{
				if (_statsSetByClass)
				{
					_generatorParams = stats;
				
					stats = null;
				}
				else
				{
					throw new Error("Dude! The Generator you want to add doesn't need to get it's parameters by class!");
				}
			}
		}
		
		static SetGeneratorBaddyType(baddyName)
		{
			if (!_isGenerator)
			{
				this.NameErrorException(_className);
			}
			else
			{
				_baddyName = baddyName;
				_generatorMethodCountCall++;
			}
		}
		
		static SetGeneratorBaddyStatsByName(stats)
		{
			if (!_generatorBaddyStrengthSet)
			{
				if (!_isGenerator)
				{
					this.NameErrorException(_className);
				}
				else
				{
					_baddyStats = getDefinitionByName(stats);
					_baddyStatsObject = new _baddyStats();
					_baddyStatsName = stats;
					
					_generatorBaddyStrengthSet = true;
					_generatorMethodCountCall++;
				}
			}
			else
			{
				this.StatsAlreadySetException();
			}
		}
		
		static SetGeneratorBaddyStatsByClass(stats, statsName)
		{
			if (!_generatorBaddyStrengthSet)
			{
				if (!_isGenerator)
				{
					this.NameErrorException(_className);
				}
				else
				{
					_baddyStatsObject = stats;
					_baddyStatsName = statsName;
					
					stats = null;
					_generatorBaddyStrengthSet = true;
					_generatorMethodCountCall++;
				}
			}
			else
			{
				this.StatsAlreadySetException();
			}
		}
		
		static SetGeneratorBaddySpecificParams(...specificParams)
		{
			if (!_isGenerator)
			{
				this.NameErrorException(_className);
			}
			else
			{
				if (_baddySpecificParams === null)
				{
					_baddySpecificParams = specificParams;
				
					_generatorMethodCountCall++;
				}
				else
				{
					this.SpecificParamsAlreadySetException();
				}
			}
			
			specificParams = null;
		}
		
		static SetGeneratorBaddySpecificParamsAsArray(specificParams)
		{
			if (!_isGenerator)
			{
				this.NameErrorException(_className);
			}
			else
			{
				if (_baddySpecificParams === null)
				{
					_baddySpecificParams = specificParams;
			
					_generatorMethodCountCall++;
				}
				else
				{
					this.SpecificParamsAlreadySetException();
				}
			}
			
			specificParams = null;
		}
		
		static Add(pos, target = null, parentPos = null, returnReference = false)
		{
			this.ErrorChecking();

			const graphicsId = _statsDefinition.GetStrength(_statsName, _statsInstance) + _className;

			Baddy.SetSpriteSheetAndAnimation(DynamicGraphics.GetSpriteSheet(), graphicsId);
			
			const baddy = new _classDefinition(_stage, _isGenerator, _isHitable, _isVisible, _hasDeathSound);

			DynamicGraphics.ApplyInitArgs(baddy, graphicsId);

			_baddyPool.push(baddy);

			baddy.SetNames(_className, _statsDefinition.GetStrength(_statsName, _statsInstance));
			baddy.SetMovementParams(_maxSpeed, _rotationSpeed);
			baddy.SetDrawParams(_lineWidth, _lineColor, _fillColor);
			baddy.SetSegmentParams(_segmentSpeedRange, _segmentRotSpeedRange, _segmentLife);
			baddy.SetSpecificParams(_specificParams);
			
			// Baddies that are added directly to the Manager, Generators and random ones will not have a parent pos
			// as expected. Baddies Spawned by Generators or Baddies with a fill color will have one.
			baddy.Init(pos, parentPos, _radius, baddy._typeVertexCount, _life, target, _deathSoundIndex);
			
			if (_isGenerator)
			{
				if (!_statsSetByClass)
				{
					_statsDefinition =  getDefinitionByName(_statsName + "Generator");
					_generatorParams = new _statsDefinition();
				}
				
				// If _generatorParams is still null by now, an exception needs to be thrown.
				if (_generatorParams === null)
				{
					throw new Error("Dude! You set the stats for this Generator by class, you need to set it's initialization" +
									" parameters aswell using SetGeneratorParamsByClass(stats)");
				}

				baddy.InitGenerator(_generatorParams);
				baddy.SetBaddyType(_baddyName, _baddyStatsName);
				baddy.SetBaddyStats(_baddyStatsObject);
				baddy.SetBaddySpecificParams(_baddySpecificParams);
			}
			
			_count++;
			
			pos = null;
			target = null;
			parentPos = null;
			
			if (returnReference)
			{
				return baddy;
			}
			else
			{
				return null;
			}
		}
		
		static CleanForNextType()
		{
			_statsDefinition = null;
			_baddyStats = null;
			_baddyStatsObject = null;
			_specificParams = null;
			_generatorBaddyStrengthSet = false;
			_baddyStrengthSet = false;
			_statsSetByClass = false;
			_generatorParams = null;
			_baddySpecificParams = null;
			_generatorMethodCountCall = 0;
			_basicMethodCountCalls = 0;
			_statsInstance = null;
		}
		
		static Update()
		{
			for (let i = 0; i < _count; i++)
			{
				const baddy = _baddyPool[i];

				if (baddy !== null)
				{
					if (!baddy._timeToDie)
					{
						baddy.Update();
						
						if (baddy._isGenerator)
						{
							baddy.GeneratorUpdate();
						}
					}
					else
					{
						if (!baddy._isGenerator)
						{
							baddy.Clean();
							_baddyPool[i] = null;
							
							_nulledCount++;
						}
						else
						{
							if (baddy._isHitable)
							{
								baddy.CleanGenerator();
								_baddyPool[i] = null;
								
								_nulledCount++;
							}
							else
							{
								// Generators that can't be hit continue to update their Baddies after death, and until they are all dead.
								if (baddy._allMinionsDead)
								{
									baddy.CleanGenerator();
									_baddyPool[i] = null;
									
									_nulledCount++;
								}
								else
								{
									baddy.GeneratorUpdate();
								}
							}
						}
					}
				}
			}
			
			if (_nulledCount >= SPLICE_LIMIT)
			{
				this.SortNSpliceNulls();
			}
		}
		
		static KillAll(...skipTypes)
		{
			let i, j, k;
			let match;
			
			if (skipTypes.length !== 0)
			{
				for (i = 0; i < _count; i++)
				{
					match = false;
					
					if (_baddyPool[i] !== null)
					{
						for (j = 0; j < skipTypes.length; j++)
						{
							if (_baddyPool[i]._name === skipTypes[j].toString())
							{
								match = true;
								break;
							}
						}
						
						if (!match)
						{
							if (!_baddyPool[i]._timeToDie)
							{
								_baddyPool[i]._life = 0;
								_baddyPool[i]._doDeathSound = false;
							}
							
							if (_baddyPool[i]._isGenerator)
							{
								_baddyPool[i].KillAllChildren();
							}
						}
					}
				}
			}
			else
			{
				for (i = 0; i < _count; i++)
				{
					if (_baddyPool[i] !== null)
					{
						if (!_baddyPool[i]._timeToDie)
						{
							_baddyPool[i]._life = 0;
							_baddyPool[i]._doDeathSound = false;
						}
						
						if (_baddyPool[i]._isGenerator)
						{
							_baddyPool[i].KillAllChildren();
						}
					}
				}
			}
		}
		
		static Clean()
		{
			for (let i = 0; i < _count; i++)
			{
				if (_baddyPool[i] !== null)
				{
					if (!_baddyPool[i]._isGenerator)
					{
						_baddyPool[i].Clean();
					}
					else
					{
						_baddyPool[i].CleanGenerator();
					}
					
					_baddyPool[i] = null;
				}
			}
			
			_baddyPool = null;
			
			this.CleanForNextType();
			
			_stage = null;
			_classDefinition = null;
			_segmentSpeedRange = null;
			_segmentRotSpeedRange = null;
		}
		
		static AllDead()
		{
			return this.GetBaddyCount() <= 0 ? true : false;
		}
		
		static GetBaddyCount()
		{
			return _count - _nulledCount;
		}
		
		static SortNSpliceNulls()
		{
			// Calculate de starting index to splice.
			let startIndex = _baddyPool.length - _nulledCount;
			
			// Sort so that all null values are put together at the end of the array.
			_baddyPool.sort();
			
			// Splice them all out in one fell sweep.
			_baddyPool.splice(startIndex, _nulledCount);
			
			// Setting varibles to meaningful values after the splicing
			_count -= _nulledCount;
			_nulledCount = 0;
		}
		
		static ErrorChecking()
		{
			if (_baddyPool === null)
			{
				throw new Error("Dude! You forgot to call BaddyManager.Init(stage:Stage) before starting to Add stuff!");
			}
			
			if (_className === null)
			{
				this.NameErrorException(_className);
			}
			else
			{
				if (_basicMethodCountCalls < BASIC_METHOD_COUNT)
				{
					throw new Error("Dude! Your are missing some basic Set methods before trying to Add!");
				}
			}
			
			if (_isGenerator)
			{
				if (_generatorMethodCountCall < GENERATOR_METHOD_COUNT)
				{
					throw new Error("Dude! This is a Generator you are trying to make, you need to Set all the stuff " + 
									"regarding Generators before trying to Add it!");
				}
			}
		}
		
		static NameErrorException(className)
		{
			if (className === null)
			{
				throw new Error("Dude! You need to call BaddyManager.SetType first of all, and supply" + 
								" a valid Baddy type!");
			}
			else
			{
				throw new Error("Dude! " + className + " is not a Generator, you don't need any of the methods" + 
						       " with the word 'Generator' in them!");
			}
		}
		
		static StatsAlreadySetException()
		{
			throw new Error("Dude! You already set stats, you either do it by name or by class, but not both!");
		}
		
		static SpecificParamsAlreadySetException()
		{
			throw new Error("Dude! You already set specific params, you either do it using ...(rest) or passing" + 
					         " an array, but not both!");
		}
	}

	window.BaddyManager = BaddyManager;
}