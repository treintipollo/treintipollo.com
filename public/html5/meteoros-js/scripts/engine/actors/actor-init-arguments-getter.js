"use strict";

{
	class ActorInitArgumentsGetter
	{
		constructor()
		{
			this._initParams = new Map();
		}
		
		register(id, actorToBindId, logicParams = null, rendererParams = null, inputParams = null, colliderParams = null, soundArguments = null)
		{
			if (!this._initParams.has(id))
			{
				const actorInitArguments = new ActorInitArguments(
					actorToBindId,
					logicParams,
					rendererParams,
					inputParams,
					colliderParams,
					soundArguments
				);

				this._initParams.set(id, actorInitArguments);
			}
		}
		
		getInitParams(id)
		{
			return this._initParams.get(id);
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
			for (const [key, params] of this._initParams)
				params.destroy();

			this._initParams.clear();
		}
		
		partialPurge(actorsToSave)
		{
			const toDelete = new Map();

			for (const [key, params] of this._initParams)
			{
				let matchFound = false;
				
				for (let j = actorsToSave.length - 1; j >= 0; j--)
				{
					if (actorsToSave[j] === params._bindedActorId)
					{
						matchFound = true;
						break;
					}
				}
				
				if (!matchFound)
				{
					params.destroy();

					toDelete.set(key, params);
				}
			}

			for (const [key, params] of toDelete.entries())
				this._initParams.delete(key);
		}
	}

	window.ActorInitArgumentsGetter = ActorInitArgumentsGetter;
}