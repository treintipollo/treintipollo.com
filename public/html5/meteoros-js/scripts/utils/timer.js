"use strict";

{
	class Timer extends EventDispatcher
	{
		constructor(delay, repeatCount = 0)
		{
			super();

			this._delay = delay;
	 	 	this._repeatCount = repeatCount;
 	 		
 	 		this._running = false;
 	 		this._currentCount = 0;
 	 		this._intervalId = -1;
		}

		reset()
		{
			clearInterval(this._intervalId);
			this._intervalId = -1;

			this._running = false;
			this._currentCount = 0;
		}

		stop()
		{
			this.reset();
		}
		
		start()
		{
			if (this._intervalId !== -1)
				return;

			this._running = true;

			this._intervalId = setInterval(() =>
			{
				if (this._repeatCount === 0)
				{
					this.dispatchEvent(TimerEvent.TIMER);
					this._currentCount++;
				}
				else
				{
					if (this._currentCount >= this._repeatCount)
					{
						clearInterval(this._intervalId);
						this._intervalId = -1;

						this._running = false;

						this.dispatchEvent(TimerEvent.TIMER);
						this.dispatchEvent(TimerEvent.TIMER_COMPLETE);

						this._currentCount = 0;
					}
					else
					{
						this.dispatchEvent(TimerEvent.TIMER);
					}

					this._currentCount++;
				}
			}, this._delay);
		}

		get currentCount()
		{
			return this._currentCount;
		}

		get running()
		{
			return this._running;
		}

		get delay()
		{
			return this._delay;
		}

		get repeatCount()
		{
			return this._repeatCount;
		}
	}

	class TimerEvent extends createjs.Event
	{
		constructor(type, bubbles, cancelable)
		{
			super(type, bubbles, cancelable);
		}

		static get TIMER()
		{
			return "timer";
		}

		static get TIMER_COMPLETE()
		{
			return "timer_complete";
		}
	}

	window.Timer = Timer;
	window.TimerEvent = TimerEvent;
}