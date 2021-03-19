"use strict";

{
	class ColliderCollection
	{
		constructor(amount)
		{
			this._nextColliderIndex = 0;
			this._activeColliders   = 0;
			
			this._indexHash = new Map();
			this._collection = new Array(amount);
			
			for (var i = 0; i < amount; i++)
			{
				this._collection[i] = null;
			}
		}
		
		addCollider(collider)
		{
			if (this._activeColliders < this._collection.length)
			{
				while (this._collection[this._nextColliderIndex] !== null)
				{
					if (this._nextColliderIndex < this._collection.length - 1)
					{
						this._nextColliderIndex++;
					}
					else
					{
						this._nextColliderIndex = 0;
					}
				}
				
				this._indexHash.set(collider, this._nextColliderIndex);
				this._collection[this._nextColliderIndex] = collider;
				
				this._activeColliders++;
			}
		}
		
		removeCollider(collider)
		{
			this._collection[this._indexHash.get(collider)] = null;
			this._activeColliders--;
		}
		
		getVector()
		{
			return this._collection;
		}
		
		destroy()
		{
			CollectionUtils.nullVector(this._collection);
			CollectionUtils.nullDictionary(this._indexHash);
		}
	}

	window.ColliderCollection = ColliderCollection;
}