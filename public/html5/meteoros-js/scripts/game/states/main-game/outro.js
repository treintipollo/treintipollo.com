"use strict";

{
	const Event = GameEvent;

	class Outro extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._endMessageInitParams = null;
			this._endMessageId = "";
			this._failTimer = null;

			this._on_end_message_complete = () => this.onEndMessageComplete();
			this._on_time_up = (te) => this.onTimeUp(te);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._modulePackageGetter.registerPackage("EndMessage_Actor", 1, GuiTextRotateLogic, GuiTextRenderer, null, null);
			this._initParamsGetter.register("EndMessageWin", "EndMessage_Actor", [null, null, "< " + this._messageGetter.getGroup(MessageGetter.SUCCESS) + " >", 0xff00ff00], ["Absender", 70, true, true, 0xff777777, false, 0, true, true], null, null);
			this._initParamsGetter.register("EndMessageFail", "EndMessage_Actor", [null, null, "< " + this._messageGetter.getGroup(MessageGetter.FAILURE) + " >", 0xffff0000], ["Absender", 70, true, true, 0xff777777, false, 0, true, true], null, null);
			
			this._actorManager.init();
			
			if (this._owner.getInterStateData()["Victory"])
			{
				this._endMessageId = "EndMessageWin";
			}
			else
			{
				this._endMessageId = "EndMessageFail";
			}
			
			this._failTimer = new Timer(500);
			this._failTimer.addEventListener(TimerEvent.TIMER, this._on_time_up, false, 0, true);
			this._failTimer.start();
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._endMessageInitParams = null;
			this._failTimer = null;
		}
		
		onEndMessageComplete()
		{
			this._owner.getInterStateData()["PreviousSubState"] = SubMainGame.OUTRO_STATE;
			this._owner.dispatchEvent(new Event(State.MAIN_STATE));
		}
		
		onTimeUp(te)
		{
			this._pauseHandler.pause();
			
			this._failTimer.removeEventListener(TimerEvent.TIMER, this._on_time_up);
			this._failTimer.stop();
			this._failTimer = null;
			
			this._endMessageInitParams = this._initParamsGetter.getInitParams(this._endMessageId);
			
			this._endMessageInitParams._logicInitParams[0] = this._on_end_message_complete;
			
			this._guiActorManager.SetAllgroupsDeadCallback(null);
			this._guiActorManager.add("EndMessage", this._endMessageId, this._stage.stageWidth / 2, this._stage.stageHeight / 2);
		}
	}

	window.Outro = Outro;
}