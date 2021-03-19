"use strict";

{
	class ModulePackageFactory
	{
		constructor()
		{
			this._packages = new Map();
			this._totalModuleCount = 0;
		}
		
		registerPackage(packageName, amount, logicModule = null, renderModule = null, inputModule = null, colliderModule = null, soundModule = null)
		{
			if (!this._packages.has(packageName))
			{
				const modulePackageCollection = new ModulePackageCollection(packageName, amount, logicModule, renderModule, inputModule, colliderModule, soundModule);

				this._packages.set(packageName, modulePackageCollection);
				this._totalModuleCount += amount;
			}
		}
	
		getModuleCount(packageName)
		{
			return this._packages.get(packageName).getModuleCount();
		}
		
		getTotalModuleCount()
		{
			return this._totalModuleCount;
		}
		
		getPackage(packageName)
		{
			return this._packages.get(packageName).getModule();
		}
		
		getPackageCollection(packageName)
		{
			return this._packages.get(packageName).getVector();
		}
		
		retrievePackage(moduleName)
		{
			this._packages.get(moduleName).restoreModule();
		}
		
		destroy(actorsToSave)
		{
			if (actorsToSave)
			{
				this.partialPurge(actorsToSave);
			}
			else
			{
				this.totalPurge();
			}
		}
		
		totalPurge()
		{
			for (const [key, modulePackageCollection] of this._packages.entries())
				modulePackageCollection.destroy();

			this._packages.clear();
			
			this._totalModuleCount = 0;
		}
		
		partialPurge(actorsToSave)
		{
			const toDelete = new Map();

			for (const [key, modulePackageCollection] of this._packages.entries())
			{
				let matchFound = false;
				
				for(let j = actorsToSave.length - 1; j >= 0; j--)
				{
					if (actorsToSave[j] === modulePackageCollection.getName())
					{
						matchFound = true;
						break;
					}
				}
				
				if (!matchFound)
				{
					this._totalModuleCount -= modulePackageCollection.getModuleCount();

					modulePackageCollection.destroy();
					
					toDelete.set(key, modulePackageCollection);
				}
			}

			for (const [key, modulePackageCollection] of toDelete.entries())
				this._packages.delete(key);
		}
	}

	window.ModulePackageFactory = ModulePackageFactory;
}