"use strict";

{
	class FactoryLogic extends Logic
	{
		constructor()
		{
			super();

			this._onChildDestroyed = [];
			this._actorManager = null;
		}
		
		AddchildDestructionCallback(callback)
		{
			this._onChildDestroyed.push(callback);
		}
		
		setChildDestructionCallbacks(child)
		{
			if (this._onChildDestroyed && child)
			{
				for (let i = 0; i < this._onChildDestroyed.length; i++)
				{
					child.RecycleCallbackChain.add(this._onChildDestroyed[i]);
				}
			}
		}
		
		concreteRelease()
		{
			CollectionUtils.nullVector(this._onChildDestroyed);
		}
	}

	window.FactoryLogic = FactoryLogic;
}