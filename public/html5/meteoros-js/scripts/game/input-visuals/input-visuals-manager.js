"use strict";

{
	let ARROW_POINTER = NaN;
	let CROSSHAIR_POINTER = NaN;

	class MousePointerInitializaer
	{
		static initAllPointers(inputVisualsManager)
		{
			ARROW_POINTER     = inputVisualsManager.add(new ArrowPointer(20, 20, 10, 20)._shape);
			CROSSHAIR_POINTER = inputVisualsManager.add(new CrossHair(12, 10, 20)._shape);
		}

		static get ARROW_POINTER()
		{
			return ARROW_POINTER;
		}

		static get CROSSHAIR_POINTER()
		{
			return CROSSHAIR_POINTER;
		}
	}

	window.MousePointerInitializaer = MousePointerInitializaer;

	class InputVisualsManager
	{
		constructor()
		{
			this._inputVisuals = [];
		}
		
		add(visual)
		{
			return this._inputVisuals.push(visual) - 1;
		}
		
		get(index)
		{
			return this._inputVisuals[index];
		}
	}

	window.InputVisualsManager = InputVisualsManager;
}