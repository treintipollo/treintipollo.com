"use strict";

{
	class CityPopulationRenderer extends Renderer
	{
		constructor()
		{
			super();

			this.GENDER_SYMBOL_RADIUS = 0;

			this._parameters = null;
			
			this._container = new Container();
		}
		
		initComplete()
		{
			this._parameters = this._logic.ExternalParameters;
			
			this.draw();
		}
		
		concreteUpdate(deltaTime)
		{
			if (this._parameters["populationChanged"])
			{
				this.draw(false);
				this._parameters["populationChanged"] = false;
			}
		}
		
		childInit(params)
		{
			this.GENDER_SYMBOL_RADIUS = params[0];
		}

		concreteDraw()
		{
			this._container.removeAllChildren();

			for(let i = 0; i < this._parameters["population"].length; i++)
			{
				if (this._parameters["population"][i] === CityPopulationLogic.MALE)
				{
					const icon = window.DynamicGraphics.GetSprite("guy-icon");
					
					icon.x = (i * this.GENDER_SYMBOL_RADIUS * 4) - this.GENDER_SYMBOL_RADIUS * 6;
					this._container.addChild(icon);
				}
				else if (this._parameters["population"][i] === CityPopulationLogic.FEMALE)
				{
					const icon = window.DynamicGraphics.GetSprite("gal-icon")

					icon.x = (i * this.GENDER_SYMBOL_RADIUS * 4) - this.GENDER_SYMBOL_RADIUS * 6;
					this._container.addChild(icon);
				}
				else if (this._parameters["population"][i] === CityPopulationLogic.MALE_MUTANT)
				{
					const icon = window.DynamicGraphics.GetSprite("guy-mutant-icon")

					icon.x = (i * this.GENDER_SYMBOL_RADIUS * 4) - this.GENDER_SYMBOL_RADIUS * 6;
					this._container.addChild(icon);
				}
				else if (this._parameters["population"][i] === CityPopulationLogic.FEMALE_MUTANT)
				{
					const icon = window.DynamicGraphics.GetSprite("gal-mutant-icon")

					icon.x = (i * this.GENDER_SYMBOL_RADIUS * 4) - this.GENDER_SYMBOL_RADIUS * 6;
					this._container.addChild(icon);
				}
			}
			
			this._parameters["populationChanged"] = false;
		}
		
		concreteRelease()
		{
			this._parameters = null;
		}
	}

	window.CityPopulationRenderer = CityPopulationRenderer;
}