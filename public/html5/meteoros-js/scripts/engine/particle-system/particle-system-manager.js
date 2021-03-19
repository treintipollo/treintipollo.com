"use strict";

{
	let _systemPool = null;
	let _currentPool = null;
	
	let _nextSystemIndexes = null;
	let _nextIndex = 0;
	let _activeSystemCount = 0;
	let _currentSystemTypeTotal = 0;
	
	let _particleAssetSizes = null;
	let _particleGraphicsRanges = null;

	class ParticleSystemManager
	{
		constructor()
		{

		}
		
		static Init(stage, canvas)
		{
			ParticleSystemManager._canvas = canvas;
			ParticleSystemManager._context = canvas.getContext("2d");

			ParticleSystemManager._stageWidth  = stage.stageWidth;
			ParticleSystemManager._stageHeight = stage.stageHeight;

			_systemPool = new Map();
			
			_nextSystemIndexes = {};
			_activeSystemCount = 0;
		}
		
		static SetParticleAssetSizes(particleSizes)
		{
			_particleAssetSizes = new Array();

			const root = particleSizes.children[0];

			for (const particle of root.children)
			{
				const id = parseInt(particle.getAttribute("id"));
				const size = particle.getAttribute("size");

				_particleAssetSizes[id] = StringUtils.toPoint(size);
			}
		}
		
		static AddParticleAsset(asset, sizeIndex)
		{
			if (!ParticleSystemManager._particleGraphics)
			{
				ParticleSystemManager._particleGraphics = new Array();
				_particleGraphicsRanges = new Array();
			}
			
			let x = 0;
			let y = 0;
			let width = _particleAssetSizes[sizeIndex].x;
			let height = _particleAssetSizes[sizeIndex].y;

			let totalTiles = (asset.width / width) * (asset.height / height);
			
			let particleIndexRange = new Point();
			
			particleIndexRange.x = ParticleSystemManager._particleGraphics.length;
			particleIndexRange.y = particleIndexRange.x + totalTiles;
			
			for (let i = 0; i < totalTiles; i++)
			{
				x = Math.floor(i % (asset.width / width)) * width;
				y = Math.floor(Math.floor(i / (asset.width / width))) * height;
				
				const offscreenCanvas = new OffscreenCanvas(width, height);
				const offscreenContext = offscreenCanvas.getContext("2d");

				offscreenContext.drawImage(asset, x, y, width, height, 0, 0, width, height);

				ParticleSystemManager._particleGraphics.push(offscreenCanvas);
			}
			
			_particleGraphicsRanges.push(particleIndexRange);
		}
		
		static AddSystem(id, systemClass, particleClass, particleAmount, systemAmount)
		{
			if (!_systemPool.has(id))
			{
				_systemPool.set(id, new Array(systemAmount));
				_nextSystemIndexes[id] = 0;
			}
			
			const pool = _systemPool.get(id);

			for (let i = 0; i < systemAmount; i++)
				pool[i] = new systemClass(particleClass, particleAmount);
		}
		
		static GetSystem(id, pos, getController = false, deadCallback = null)
		{
			const systemInitArguments = ParticleSystemInitializationManager.getArguments(id);
		
			if (systemInitArguments)
			{
				_currentPool 			= _systemPool.get(systemInitArguments._id);
				_nextIndex 				= _nextSystemIndexes[systemInitArguments._id];
				_currentSystemTypeTotal = 0;
				
				while (!_currentPool[_nextIndex]._recycle)
				{
					if (_nextIndex < _currentPool.length - 1)
					{
						_nextIndex++;
					}
					else
					{
						_nextIndex = 0;
					}
					
					_currentSystemTypeTotal++;

					if (_currentSystemTypeTotal >= _currentPool.length - 1)
					{
						break;
					}
				}
				
				_nextSystemIndexes[systemInitArguments._id] = _nextIndex;
				_activeSystemCount++;
				
				return _currentPool[_nextIndex].InitBase(systemInitArguments, pos, getController, deadCallback, _particleGraphicsRanges);
			}
		
			return null;
		}
		
		static Update(deltaTime = 1, stop = false)
		{
			if (!stop)
			{
				const w = ParticleSystemManager._canvas.width;
				const h = ParticleSystemManager._canvas.height;

				ParticleSystemManager._context.setTransform(1, 0, 0, 1, 0, 0);
				ParticleSystemManager._context.clearRect(0, 0, w, h);
				
				for (let [key, pool] of _systemPool.entries())
				{
					for (let i = pool.length - 1; i >= 0; i--)
					{
						if (i < pool.length)
						{
							if (!pool[i]._recycle)
							{
								pool[i].Update(deltaTime);
							}
						}
					}
				}
			}
		}
		
		static SystemDead()
		{
			_activeSystemCount--;
		}
		
		static SystemsActive()
		{
			if (_activeSystemCount > 0)
			{
				return true;
			}
			
			return false;
		}
		
		static ClearSystems(systems)
		{
			if (systems)
			{
				for (const systemId of systems)
				{
					const systemInitArguments = ParticleSystemInitializationManager.getArguments(systemId);

					for (let [key, pool] of _systemPool.entries())
					{
						if (key !== systemInitArguments._id)
							continue;

						for (let i = pool.length - 1; i >= 0; i--)
						{
							if (i < pool.length)
							{
								pool[i].interrupt();
							}
						}
					}
				}
			}
			else
			{
				for (let [key, pool] of _systemPool.entries())
				{
					for (let i = pool.length - 1; i >= 0; i--)
					{
						if (i < pool.length)
						{
							pool[i].interrupt();
						}
					}
				}
			}
		}

		static Reset()
		{
			for (let [key, pool] of _systemPool.entries())
			{
				for (let i = pool.length - 1; i >= 0; i--)
				{
					if (i < pool.length)
					{
						pool[i].interrupt();
					}
				}
			}
			
			ParticleSystemManager._context.clearRect(
				0,
				0,
				ParticleSystemManager._canvas.width,
				ParticleSystemManager._canvas.height
			);
		}
	}

	ParticleSystemManager.FRAME_TIME = 0;
	ParticleSystemManager.REAL_TIME  = 1;
	
	ParticleSystemManager._stageWidth = 0;
	ParticleSystemManager._stageHeight = 0;
	ParticleSystemManager._particleGraphics = null;

	ParticleSystemManager._canvas = null;
	ParticleSystemManager._context = null;

	window.ParticleSystemManager = ParticleSystemManager;
}