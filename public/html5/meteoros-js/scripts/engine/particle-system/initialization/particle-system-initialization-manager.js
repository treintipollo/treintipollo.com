"use strict";

{
	let initializationArguments = undefined;

	class ParticleSystemInitializationManager
	{
		static init()
		{
			initializationArguments = new Map();
		}
		
		static register(id, systemId, systemBasicArguments, particleBasicArguments, systemAdditionalArguments = null, particleAdditionalArguments = null)
		{
			initializationArguments.set(id, new ParticleSystemInitializationArguments(systemId, systemBasicArguments, particleBasicArguments, systemAdditionalArguments, particleAdditionalArguments));
		}
		
		static getArguments(id)
		{
			if (initializationArguments.has(id))
			{
				return initializationArguments.get(id);
			}
			
			return null;
		}
		
		static destroy()
		{
			for (let [key, initArguments] of initializationArguments.entries())
				initArguments.destroy();

			initializationArguments.clear();
			initializationArguments = null;
		}
	}

	window.ParticleSystemInitializationManager = ParticleSystemInitializationManager;
}