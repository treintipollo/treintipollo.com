"use strict";

{
	class ColorTransform extends EventDispatcher
	{
		constructor(rm = 1, gm = 1, bm = 1, am = 1)
		{
			super();
			
			this._filter = new createjs.ColorFilter(rm, gm, bm, am, 0, 0, 0, 0);
		}

		set redMultiplier(v)
		{
			if (this._filter.redMultiplier === v)
				return;

			this._filter.redMultiplier = v;

			this.dispatchEvent("change");
		}

		set greenMultiplier(v)
		{
			if (this._filter.greenMultiplier === v)
				return;

			this._filter.greenMultiplier = v;

			this.dispatchEvent("change");
		}

		set blueMultiplier(v)
		{
			if (this._filter.blueMultiplier === v)
				return;

			this._filter.blueMultiplier = v;

			this.dispatchEvent("change");
		}

		set alphaMultiplier(v)
		{
			if (this._filter.alphaMultiplier === v)
				return;
			
			this._filter.alphaMultiplier = v;

			this.dispatchEvent("change");
		}

		get redMultiplier()
		{
			return this._filter.redMultiplier;
		}

		get greenMultiplier()
		{
			return this._filter.greenMultiplier;
		}

		get blueMultiplier()
		{
			return this._filter.blueMultiplier;
		}

		get alphaMultiplier()
		{
			return this._filter.alphaMultiplier;
		}
	}

	window.ColorTransform = ColorTransform;
}