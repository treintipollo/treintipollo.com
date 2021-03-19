"use strict";
{
	class ParticleSystemInitializationArguments
	{
		constructor(id, systemBasicArguments, particleBasicArguments, systemAdditionalArguments = null, particleAdditionalArguments = null)
		{
			this._id 		 	= id;
			this._systemLife  	= systemBasicArguments[0];
			this._lifeType 	 	= systemBasicArguments[1];
			
			this._systemProps   = systemAdditionalArguments;
			this._particleProps = particleAdditionalArguments;
			
			this._width 	   	= particleBasicArguments[0];
			this._height    	= particleBasicArguments[1];
			this._rotation  	= particleBasicArguments[2];
			this._color	   		= particleBasicArguments[3];
			this._lifeRange 	= particleBasicArguments[4];
			
			this._waitTimeSec 	       = particleBasicArguments[5]  !== null ? particleBasicArguments[5]  : 1;
			this._particlesPerFrame    = particleBasicArguments[6]  !== null ? particleBasicArguments[6]  : 1;
			this._graphicsRange 	   = particleBasicArguments[7]  !== null ? particleBasicArguments[7]  : -1;
			this._interpolationColor   = particleBasicArguments[8]  !== null ? particleBasicArguments[8]  : NaN;
			this._interpolationSize    = particleBasicArguments[9]  !== null ? particleBasicArguments[9]  : null;
			this._particleLifeModifier = particleBasicArguments[10] !== null ? particleBasicArguments[10] : 1;
		}
		
		destroy()
		{
			this._systemProps = null;
			this._lifeRange = null;
			this._interpolationSize = null;
			this._particleProps = null;
		}
	}

	window.ParticleSystemInitializationArguments = ParticleSystemInitializationArguments;
}