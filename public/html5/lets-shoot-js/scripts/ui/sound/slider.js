"use strict";

{
	class SliderUI extends EventDispatcher
	{
		constructor($stage, $axis, $track, $slider, $lowVal, $highVal, $startVal = 0, $precision = 0)
		{
			super();

			this._stage = $stage;
			this._axis = $axis;
			this._track = $track;
			this._slider = $slider;
			this._lowVal = $lowVal;
			this._highVal = $highVal;
			this._startVal = $startVal;
			this._precision = $precision;
			
			this._track.alpha = 0;
			this._slider.alpha = 0;
			
			this._changeProp = (this._axis == "x") ? "width" : "height";
			this._range = (this._lowVal <= 0) ? (Math.abs(this._lowVal) + this._highVal) : (this._highVal - this._lowVal);
			this._timer = new Timer(10);
			
			if (this._startVal < this._lowVal) this._startVal = this._lowVal;
			if (this._startVal > this._highVal) this._startVal = this._highVal;
			
			this._handleMD = (e) => this.handleMouseDown(e);
			this._handleMU = (e) => this.handleMouseUp(e);
			this._updateInfo = (e) => this.updateInfo(e);

			this.manageRestingPosition(this._startVal);
			this.initEvents();
		}
		
		initEvents()
		{
			this._slider.buttonMode = true;

			this._slider.addEventListener("mousedown", this._handleMD);
			this._slider.addEventListener("pressup", this._handleMU);
			this._timer.addEventListener(TimerEvent.TIMER, this._updateInfo);
		}
		
		manageRestingPosition($val)
		{
			if ($val < 0)
			{
				this._percent = (Math.abs(this._lowVal + Math.abs($val)) / this._range);
			}
			else
			{
				this._percent = (Math.abs(this._lowVal - $val) / this._range);
			}
			
			this._currentVal = this.roundToPrecision((this._lowVal + (this._range * this._percent)), this._precision);
			
			if (this._axis == "x")
			{
				this._slider[this._axis] = (this._track[this._axis] + (this._percent * this._track[this._changeProp]));
			}
			else
			{
				this._slider[this._axis] = (this._track[this._axis] - (this._percent * this._track[this._changeProp]));
			}
		}
		
		enable()
		{
			this.initEvents();
			
			this.dispatchEvent(new SliderUIEvent(SliderUIEvent.ON_ENABLED, this._percent, this._currentVal, this._slider, this._track));
		}
		
		disable()
		{
			this._slider.buttonMode = false;
			
			this._slider.removeEventListener("mousedown", this._handleMD);
			this._slider.removeEventListener("pressup", this._handleMU);
			this._timer.removeEventListener(TimerEvent.TIMER, this._updateInfo);
			
			this.dispatchEvent(new SliderUIEvent(SliderUIEvent.ON_DISABLED, this._percent, this._currentVal, this._slider, this._track));
		}
		
		destroy()
		{
			this.disable();

			this._timer = null;
			this._stage = null;
			this._track = null;
			this._slider = null;
		}
		
		handleMouseDown($evt)
		{
			this.dispatchEvent(new SliderUIEvent(SliderUIEvent.ON_PRESS, this._percent, this._currentVal, this._slider, this._track));
			
			if (this._axis == "x")
			{
				this._slider.startDrag(false, new Rectangle(this._track.x, this._slider.y, this._track.width, 0));
			}
			else
			{
				this._slider.startDrag(false, new Rectangle(this._slider.x, this._track.y, 0, -this._track.height));
			}
			
			this._timer.start();
			this._stage.addEventListener("pressup", this._handleMU, false, 0, true);
		}
		
		handleMouseUp($evt)
		{
			this.dispatchEvent(new SliderUIEvent(SliderUIEvent.ON_RELEASE, this._percent, this._currentVal, this._slider, this._track));
			
			this._slider.stopDrag();
			this._timer.reset();
			
			this.manageRestingPosition(this._currentVal);
			
			this._stage.removeEventListener("pressup", this._handleMU);
		}
		
		updateInfo($evt)
		{
			this._percent = Math.abs((this._slider[this._axis] - this._track[this._axis]) / this._track[this._changeProp]);
			this._currentVal = this.roundToPrecision((this._lowVal + (this._range * this._percent)), this._precision);

			this.dispatchEvent(new SliderUIEvent(SliderUIEvent.ON_UPDATE, this._percent, this._currentVal, this._slider, this._track));
		}

		get percent()
		{
		    return this._percent;
		}
		
		set percent($val)
		{
		    this._percent = $val;
		    
		    this.manageRestingPosition(this._percent);
		}
		
		get currentValue()
		{
		    return this._currentVal;
		}
		
		set currentValue($val)
		{
		    this._currentVal = $val;
		    
		    this.manageRestingPosition(this._currentVal);
		}
		
		setAlpha(alpha)
		{
			this._track.alpha = alpha;
			this._slider.alpha = alpha;
		}

		roundToPrecision($num, $precision = 0)
		{
			let decimalPlaces = Math.pow(10, $precision);

			return (Math.round(decimalPlaces * $num) / decimalPlaces);
		}
	}

	class SliderUIEvent extends createjs.Event
	{
		constructor($type, $percent, $currentValue, $slider, $track, $bubbles = false, $cancelable = false)
		{
			super($type, $bubbles, $cancelable);
			
			this.percent = $percent;
			this.currentValue = $currentValue;
			this.slider = $slider;
			this.track = $track;
		}

		clone()
		{
			return new SliderUIEvent(type, this.percent, this.currentValue, this.slider, this.track, bubbles, cancelable);
		}

		static get ON_UPDATE()
		{
			return "on_update";
		}

		static get ON_PRESS()
		{
			return "on_press";
		}

		static get ON_RELEASE()
		{
			return "on_release";
		}

		static get ON_ENABLED()
		{
			return "on_enabled";
		}

		static get ON_DISABLED()
		{
			return "on_disabled";
		}
	}

	window.SliderUI = SliderUI;
	window.SliderUIEvent = SliderUIEvent;
}