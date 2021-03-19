"use strict";

{
	class ActorCollection
	{
		constructor(actorClass, amount)
		{
			this._nextActorIndex = 0;
			this._activeActors   = 0;
			this._collection 	= [];
			this._actorClass 	= actorClass;
			
			this._actor = null;
			this._lastTimestamp = 0;
			this._actorIndex = 0;
			
			this.addActors(amount);
		}
		
		addActors(amount)
		{
			for (let i = 0; i < amount; i++)
			{
				this._collection.push(new this._actorClass());
			}
		}
		
		actorAvailable()
		{
			return this._activeActors < this._collection.length;
		}
		
		getActor()
		{
			this._actor = null;
			
			if (this._activeActors < this._collection.length)
			{
				if (!this._collection.some((actor) => actor.ManagerIndex === -1))
					return null;

				if (!this._collection[this._nextActorIndex])
					this._nextActorIndex = 0;

				while (this._collection[this._nextActorIndex].ManagerIndex !== -1)
				{
					if (this._nextActorIndex < this._collection.length - 1)
					{
						this._nextActorIndex++;
					}
					else
					{
						this._nextActorIndex = 0;
					}
				}
				
				this._actor = this._collection[this._nextActorIndex];
				this._actor.ManagerIndex = this._nextActorIndex;
				this._actor.TimeStamp = UIDGenerator.getUID();
				
				this._activeActors++;

				if (this._activeActors >= this._collection.length)
					this._activeActors = this._collection.length;
			}
			
			return this._actor;
		}
		
		getLastActorOfType(id)
		{
			this._lastTimestamp = 0;
			
			for (let i = 0; i < this._collection.length; i++)
			{
				this._actor = this._collection[i];
				
				if (this._actor.Active && this._actor.Modules._name === id)
				{
					if (this._lastTimestamp === 0)
					{
						this._lastTimestamp = this._actor.TimeStamp;
						this._actorIndex = i;
					}
					else
					{
						if (this._lastTimestamp < this._actor.TimeStamp)
						{
							this._lastTimestamp = this._actor.TimeStamp;
							this._actorIndex = i;
						}
					}
				}
			}
			
			return this._collection[this._actorIndex];
		}
		
		getVector()
		{
			return this._collection;
		}
		
		restoreActor()
		{
			this._activeActors--;

			if (this._activeActors < 0)
				this._activeActors = 0;
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
			
			this._actor = null;
		}
		
		totalPurge()
		{
			for (let i = this._collection.length - 1; i >= 0; i--)
			{
				if (this._collection[i].Active)
				{
					this._collection[i].release();
				}

				this._collection[i] = null;
			}
			
			this._collection = null;
		}
		
		partialPurge(actorsToSave)
		{
			for (let i = this._collection.length - 1; i >= 0; i--)
			{
				let matchFound = false;
				
				if (this._collection[i].Active)
				{
					for (let j = actorsToSave.length - 1; j >= 0; j--)
					{
						if (actorsToSave[j] === this._collection[i].Modules._name)
						{
							matchFound = true;
							break;
						}
					}
					
					if (!matchFound)
					{
						this._collection[i].release();
						this._collection[i] = null;
					}
				}
				else
				{
					this._collection[i].release();
					this._collection[i] = null;
				}
			}
			
			CollectionUtils.vectorSortNSpliceNulls(this._collection);
			this._nextActorIndex = this._collection.length;
			this._activeActors   = this._collection.length;
		}
	}

	window.ActorCollection = ActorCollection;
}