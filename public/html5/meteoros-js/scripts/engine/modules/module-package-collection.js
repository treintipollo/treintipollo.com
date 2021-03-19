"use strict";

{
	class ModulePackageCollection
	{
		constructor(name, amount, logicModule = null, renderModule = null, inputModule = null, colliderModule = null, soundModule = null)
		{
			this._name = "";
			this._collection = new Array(amount);
			this._nextPackageIndex = 0;
			this._activePackages = 0;
			this._modulePackage = null;
			
			for (let i = 0; i < amount; i++)
			{
				const modulePackage = new ModulePackage();
				
				if (logicModule)
					modulePackage._logic = new logicModule();
				
				if (renderModule)
					modulePackage._renderer = new renderModule();
				
				if (inputModule)
					modulePackage._input = new inputModule();
				
				if (colliderModule)
					modulePackage._collider = new colliderModule();
				
				if (soundModule)
					modulePackage._sound = new soundModule();
				
				modulePackage._active = false;
				modulePackage._name = name;
				
				this._collection[i] = modulePackage;
			}
			
			this._name = name;
		}
			
		getModule()
		{
			this._modulePackage = null;

			if (this._activePackages < this._collection.length)
			{
				if (!this._collection.some((modulePackage) => !modulePackage._active))
					return null;

				while (this._collection[this._nextPackageIndex]._active)
				{
					if (this._nextPackageIndex < this._collection.length - 1)
					{
						this._nextPackageIndex++;
					}
					else
					{
						this._nextPackageIndex = 0;
					}
				}
				
				this._modulePackage 		= this._collection[this._nextPackageIndex];
				this._modulePackage._active = true;
				
				this._activePackages++;

				if (this._activePackages >= this._collection.length)
					this._activePackages = this._collection.length;
			}
			
			return this._modulePackage;
		}
		
		restoreModule()
		{
			this._activePackages--;

			if (this._activePackages < 0)
				this._activePackages = 0;
		}

		getModuleCount()
		{
			return this._collection.length;
		}

		getName()
		{
			return this._name;
		}

		getVector()
		{
			return this._collection;
		}
		
		destroy()
		{
			for (let i = 0; i < this._collection.length; i++)
			{
				if (this._collection[i]._active)
				{
					this._collection[i].destroy();
				}

				this._collection[i] = null;
			}
			
			this._collection = null;
			this._modulePackage = null;
		}
	}

	window.ModulePackageCollection = ModulePackageCollection;
}