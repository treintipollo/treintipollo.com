"use strict"

{
	let _systems = null;
	let _systemsInfo = null;
	
	class ParticleSystemManager
	{
		constructor()
		{
			
		}

		static Init(context)
		{
			_systems = [];
			_systemsInfo = [];
			
			ParticleManager.Init(context);
		}

		static Add(system)
		{
			_systems.push(system);
			_systemsInfo.push(new SystemInfo());
		}

		static SetParticleGenericProps(width, height, rotation, color, lifeRange, amount)
		{
			const index = _systems.length - 1;
			const si = _systemsInfo[index];
			const sys = _systems[index];

			si._width = width;
			si._height = height;
			si._rotation = rotation;
			si._color = color;
			si._particleLife = lifeRange;
			si._amount = amount;
			si._processInitPos = sys.ProcessInitPos.bind(sys);
		}

		static SetParticleSpecificProps(...properties)
		{
			_systemsInfo[_systems.length - 1]._specificProps = properties;
		}
		
		static SetParticleInterpolationOptions(colorInterpolation, sizeInterpolation, interpolationColor, interpolationSize)
		{
			const si = _systemsInfo[_systems.length - 1];

			si._useColorInterpolation = colorInterpolation;
			si._useSizeInterpolation = sizeInterpolation;
			si._interpolationColor = interpolationColor;
			si._interpolationSize = interpolationSize;
		}

		static SetParticleType(name)
		{
			_systemsInfo[_systems.length - 1]._name = name;
		}

		static SetSystemGenericProps(pos, systemLife, workingTime)
		{
			const sys = _systems[_systems.length - 1];

			sys._systemLife = systemLife;
			sys._maxLife = systemLife;
			sys._parentPos = pos;
			
			if (workingTime)
			{
				sys._emitTime = workingTime;
				sys._onTimeInit = workingTime.x;
				sys._offTimeInit = workingTime.y;
			}
		}
		
		static Update(stop = false)
		{
			if (stop)
				return ParticleManager._totalParticles > 0;

			for (let i = _systems.length - 1; i >= 0; i--)
			{
				const sys = _systems[i];
				const si = _systemsInfo[i];

				if (!sys)
					continue;

				if (sys.CheckLife() && sys._parentPos.IsAlive())
				{
					ParticleManager.SetGenericProperties(
						sys._parentPos.x,
						sys._parentPos.y,
						si._rotation,
						si._width,
						si._height,
						si._color,
						si._particleLife,
						si._amount
					);

					ParticleManager.SetInterpolationOptions(
						si._useColorInterpolation,
						si._useSizeInterpolation,
						si._interpolationColor,
						si._interpolationSize
					);
					
					ParticleManager._processInitPos = si._processInitPos;
					
					// This checks if a system can alter it's emission time and performs accordingly
					if (sys._emitTime)
					{
						ParticleManager.Spawn(si._specificProps, self[si._name], sys.Emit());
					}
					else
					{
						ParticleManager.Spawn(si._specificProps, self[si._name], true);
					}
				}
				else
				{
					// If a system's life is depleted or owner is nulled, remove system from the manager.
					sys.Clean();
					si.Clean();
					
					_systems.splice(i, 1);
					_systemsInfo.splice(i, 1);
				}
			}
			
			ParticleManager.Update();

			return ParticleManager._totalParticles > 0;
		}
		
		static Reset()
		{
			for (let i = 0; i < _systems.length; i++)
				_systems[i].Clean();

			for (let i = 0; i < _systemsInfo.length; i++)
				_systemsInfo[i].Clean();

			_systems.length = 0;
			_systemsInfo.length = 0;
			
			_systems = null;
			_systemsInfo = null;
			
			ParticleManager.Reset();
		}
	}

	self.ParticleSystemManager = ParticleSystemManager;

	class SystemInfo
	{
		constructor()
		{
			this._width = 0;
			this._height = 0;
			this._color = 0;
			this._amount = 0;
			this._interpolationColor = 0;
			this._interpolationSize = null;
			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;
			this._particleLife = null;
			this._systemLife = 0;
			this._name = "";
			this._specificProps = null;
			this._processInitPos = null;
			this._rotation = 0;

			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;
			this._specificProps = [];
		}
		
		Clean()
		{
			this._interpolationSize = null;
			this._particleLife = null;
			this._specificProps = null;
			this._processInitPos = null;
		}
	}
}