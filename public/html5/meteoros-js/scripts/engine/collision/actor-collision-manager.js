"use sctrict";

{
	class ActorCollisionManager
	{
		constructor(modulePackageFactory)
		{
			this._groups 		   = [];
			this._pairDescription  = new Map();
			this._collisionMethods = new CollisionMethods();
			this._modulePackageFactory = modulePackageFactory;
			this._groupInfo = null;
		}
		
		addPair(first, second)
		{
			if (!this._pairDescription.has(first))
				this._pairDescription.set(first, { groupIndexes: [], groupAmount: 0, priority: 0 });
			
			if (!this._pairDescription.has(second))
				this._pairDescription.set(second, { groupIndexes: [], groupAmount: 0, priority: 1 });
			
			this._pairDescription.get(first)["groupIndexes"].push(this._groups.length);
			this._pairDescription.get(second)["groupIndexes"].push(this._groups.length);
			
			this._pairDescription.get(first)["groupAmount"]++;
			this._pairDescription.get(second)["groupAmount"]++;
			
			this._groups.push(new CollisionGroup(this._modulePackageFactory.getModuleCount(second)));
		}
		
		addActor(actor)
		{
			this._groupInfo = this._pairDescription.get(actor.Modules._name);
			
			if (this._groupInfo)
			{
				for (let i = 0; i < this._groupInfo.groupAmount; i++)
				{
					this._groups[this._groupInfo.groupIndexes[i]].addCollider(actor.Collider, this._groupInfo.priority);
				}
			}
			
			this._groupInfo = null;
		}
		
		removeActor(actor)
		{
			this._groupInfo = this._pairDescription.get(actor.Modules._name);
			
			if (this._groupInfo)
			{
				for (let i = 0; i < this._groupInfo.groupAmount; i++)
				{
					this._groups[this._groupInfo.groupIndexes[i]].removeCollider(actor.Collider, this._groupInfo.priority);
				}
			}
			
			this._groupInfo = null;
		}
		
		checkCollisions(name, collider, deltaTime)
		{
			const groupInfo = this._pairDescription.get(name);

			if (groupInfo)
			{
				if (groupInfo.priority === 0)
				{
					for (let i = 0; i < groupInfo.groupAmount; i++)
						this._groups[groupInfo.groupIndexes[i]].checkCollisions(collider, this._collisionMethods, deltaTime);
				}
			}
		}
		
		destroy()
		{
			for (const [name, description] of this._pairDescription)
				description["groupIndexes"] = null;

			this._pairDescription.clear();
			
			for (let i = 0; i < this._groups.length; i++)
			{
				this._groups[i].destroy();
				this._groups[i] = null;
			}

			this._groups.length = 0;
			
			this._collisionMethods.clean();
			
			this._groupInfo = null;
		}
	}

	window.ActorCollisionManager = ActorCollisionManager;
}