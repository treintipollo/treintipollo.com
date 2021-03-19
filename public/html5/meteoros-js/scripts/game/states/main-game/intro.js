"use strict";

{
	const Event = GameEvent;

	class Intro extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);

			this._on_start_count_down_complete = () => this.onStartCountDownComplete();
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._pauseHandler.pause();

			this._modulePackageGetter.registerPackage("CountDown_Actor", 1, GuiTextCountDownLogic, GuiTextRenderer, null, null);
			this._initParamsGetter.register("StartCountDown", "CountDown_Actor",
				[
					" ",
					0,
					["< READY? >", "< GET SET >", "< " + this._messageGetter.getGroup(MessageGetter.INTRO) + " >"],
					[0xffff0000, 0xffffff00, 0xff00ff00], 0.5
				],
				[
					"Absender",
					50,
					true,
					false,
					0,
					false,
					0,
					false,
					true
				],
				null,
				null
			);
			
			this._actorManager.init();
			
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_start_count_down_complete);
			this._guiActorManager.add("CountDown", "StartCountDown", this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 100);
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
		}
		
		onStartCountDownComplete()
		{
			this._owner.getInterStateData()["PreviousSubState"] = SubMainGame.INTRO_STATE;
			this._owner.dispatchEvent(new Event(State.MAIN_STATE));
		}
	}

	window.Intro = Intro;
}