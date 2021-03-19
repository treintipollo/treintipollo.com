"use strict";

{
	class ActorInitArguments
	{
		constructor(bindedActor, logicParams, rendererParams, inputInitParams, colliderParams, soundParams)
		{
			this._bindedActorId 	 = bindedActor;
			this._logicInitParams 	 = logicParams;
			this._rendererInitParams = rendererParams;
			this._inputInitParams	 = inputInitParams;
			this._colliderInitParams = colliderParams;
			this._soundInitParams	 = soundParams;
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			CollectionUtils.nullVector(this._logicInitParams);
			CollectionUtils.nullVector(this._rendererInitParams);
			CollectionUtils.nullVector(this._inputInitParams);
			CollectionUtils.nullVector(this._colliderInitParams);
			CollectionUtils.nullVector(this._soundInitParams);
		}
	}

	window.ActorInitArguments = ActorInitArguments;
}