"use strict";

{
	// Redefinitions for easier porting
	window.Bitmap = createjs.Bitmap;
	window.Sprite = createjs.Sprite;
	window.Shape = createjs.Shape;
	window.Point = createjs.Point;
	window.Rectangle = createjs.Rectangle;
	window.ColorMatrixFilter = createjs.ColorMatrixFilter;
	window.Matrix = createjs.Matrix2D;
	window.Container = createjs.Container;
	window.EventDispatcher = createjs.EventDispatcher;

	// Missing properties for easier porting
	Object.defineProperty(createjs.StageGL.prototype, "stageWidth",
	{
		get: () => document.getElementById("canvas").width
	});

	Object.defineProperty(createjs.StageGL.prototype, "stageHeight",
	{
		get: () => document.getElementById("canvas").height
	});

	Object.defineProperty(createjs.Stage.prototype, "stageWidth",
	{
		get: () => document.getElementById("canvas").width
	});

	Object.defineProperty(createjs.Stage.prototype, "stageHeight",
	{
		get: () => document.getElementById("canvas").height
	});

	Object.defineProperty(createjs.DisplayObject.prototype, "_transform", { value: null,  writable: true });
	Object.defineProperty(createjs.DisplayObject.prototype, "transform",
	{
		get: function()
		{
			if (!this._transform)
				this._transform = new Transform(this);

			return this._transform;
		},

		set : function(v)
		{
			this._transform = v;
		}
	});

	Object.defineProperty(createjs.Shape.prototype, "width",
	{
		get: function()
		{
			if (this.cacheCanvas)
				return this.cacheCanvas.width;

			const r = this.getBounds();

			if (r)
				return r.width;

			throw new Error("missing cache canvas");
		}
	});

	Object.defineProperty(createjs.Shape.prototype, "height",
	{
		get: function()
		{
			if (this.cacheCanvas)
				return this.cacheCanvas.height;

			const r = this.getBounds();

			if (r)
				return r.height;

			throw new Error("missing cache canvas");
		}
	});

	const canvas = window.OffscreenCanvas ? new OffscreenCanvas(1, 1) : document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const context = canvas.getContext("2d");

	const element = document.createElement("div");
	element.style.position = "absolute";
	element.style.visibility = "hidden";
	element.style.top = 0;
	element.style.left = 0;
	document.body.appendChild(element);

	const measureTextAndCache = function()
	{
		this.uncache();
		
		context.font = this.font;

		element.style.font = this.font;
		element.textContent = this.text;
		element.style.lineHeight = "1";

		const rect = element.getBoundingClientRect();
		
		this._metrics = {};

		const width = context.measureText(this.text).width;
		const height = rect.height;

		this._metrics._width_ = width;
		this._metrics._height_ = height;
	    
	    this.cache(0, 0, this._metrics._width_, this._metrics._height_);

	    this.dispatchEvent("cacheText");
	}

	Object.defineProperty(createjs.Text.prototype, "_lastText", { value: "", writable: true });
	Object.defineProperty(createjs.Text.prototype, "_lastColor", { value: "", writable: true });
	Object.defineProperty(createjs.Text.prototype, "_metrics", { value: null, writable: true });

	Object.defineProperty(createjs.Text.prototype, "width",
	{
		get: function()
		{
			if (this._lastText !== this.text || this._lastColor !== this.color)
				measureTextAndCache.call(this);

			this._lastText = this.text;
			this._lastColor = this.color;

			return this._metrics._width_;
		}
	});

	Object.defineProperty(createjs.Text.prototype, "height",
	{
		get: function()
		{
			if (this._lastText !== this.text || this._lastColor !== this.color)
				measureTextAndCache.call(this);

			this._lastText = this.text;
			this._lastColor = this.color;

			return this._metrics._height_;
		}
	});

	Object.defineProperty(createjs.Shape.prototype, "_on_press_move", { value: null, writable: true });

	createjs.Shape.prototype.startDrag = function startDrag(locked, rect)
	{
		if (this._on_press_move)
			return;

		this._on_press_move = (e) =>
		{
			e.target.x = e.stageX;
		    e.target.y = e.stageY;

		    if (rect)
		    {
		    	if (e.target.x < rect.x)
					e.target.x = rect.x;

				if (e.target.y < rect.y)
					e.target.y = rect.y;

				if (e.target.x >= rect.x + rect.width)
					e.target.x = rect.x + rect.width;

				if (e.target.y >= rect.y + rect.height)
					e.target.y = rect.y + rect.height;
		    }
		};

		this.on("pressmove", this._on_press_move);
	}

	createjs.Shape.prototype.stopDrag = function stopDrag()
	{
		if (this._on_press_move)
			this.off("pressmove", this._on_press_move);

		this._on_press_move = null;
	}

	createjs.Graphics.prototype.lineStyle = function lineStyle(thickness = 0, color = 0xff000000)
	{
		this.setStrokeStyle(thickness, "round", "miter", 3, false);
		this.beginStroke(createjs.Graphics.getRGBA(color));
	}

	const oldBeginFill = createjs.Graphics.prototype.beginFill;

	createjs.Graphics.prototype.beginFill = function beginFill(color)
	{
		if (typeof color === "number")
		{
			return oldBeginFill.call(this, createjs.Graphics.getRGBA(color));
		}
		else if (typeof color === "string")
		{
			return oldBeginFill.call(this, color);
		}
	}

	createjs.Graphics.getRGBA = (color) =>
	{
		const a = NumberUtils.normalize(color >> 24 & 0xFF, 0, 0xFF);
		const r = color >> 16 & 0xFF;
		const g = color >> 8 & 0xFF;
		const b = color & 0xFF;

		return `rgba(${r},${g},${b},${a})`;
	}

	createjs.Point.prototype.normalize = function(thickness)
	{
		const norm = Math.sqrt(this.x * this.x + this.y * this.y);
		
		this.x = this.x / norm * thickness;
		this.y = this.y / norm * thickness;
	}

	window.getDefinitionByName = function getDefinitionByName(name)
	{
		return window[name];
	}

	createjs.StageGL.prototype._fetchWebGLContext = function (canvas, options)
	{
		let gl;

		try
		{
			gl = canvas.getContext("webgl2", options);
		}
		catch (e)
		{
			// don't do anything in catch, null check will handle it
		}

		if (!gl)
		{
			try
			{
				gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
			}
			catch (e)
			{
				// don't do anything in catch, null check will handle it
			}
		}

		if (!gl)
		{
			const msg = "Could not initialize WebGL";
			
			console.error? console.error(msg) : console.log(msg);
		}
		else
		{
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		}

		return gl;
	};

	createjs.StageGL.isWebGLActive = function (context)
	{
		if (context)
		{
			if (context instanceof WebGLRenderingContext && typeof WebGLRenderingContext !== "undefined")
				return true;

			if (context instanceof WebGL2RenderingContext && typeof WebGL2RenderingContext !== "undefined")
				return true;
		}

		return false;
	};
}