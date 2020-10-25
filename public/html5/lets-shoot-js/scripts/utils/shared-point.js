"use strict";

{
	const ARRAY_BUFFER = self.SharedArrayBuffer || self.ArrayBuffer;

	class SharedPoint
	{
		constructor(...args)
		{
			this._data = null;
			
			if (args[0] instanceof ARRAY_BUFFER)
			{
				this._data = args[0];
				this._dataView = new Float32Array(this._data);
			}
			else
			{
				this._data = new ARRAY_BUFFER(Float32Array.BYTES_PER_ELEMENT * 2);
				this._dataView = new Float32Array(this._data);

				this.x = args[0] ? args[0] : 0;
				this.y = args[1] ? args[1] : 0;
			}
		}

		get x()
		{
			return this._dataView[0];
		}

		set x(v)
		{
			this._dataView[0] = v;
		}

		get y()
		{
			return this._dataView[1];
		}

		set y(v)
		{
			this._dataView[1] = v;
		}

		get buffer()
		{
			return this._data;
		}

		Clean()
		{
			this._dataView[0] = NaN;
			this._dataView[1] = NaN;

			this._dataView = null;
			this._data = null;
		}

		IsAlive()
		{
			if (!this._dataView)
				return false;

			return !(isNaN(this._dataView[0]) && isNaN(this._dataView[1]));
		}
	}

	self.SharedPoint = SharedPoint;
}