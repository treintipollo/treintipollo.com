"use strict";

{
	const Event = GameEvent;

	class EnduranceEpilogue extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);

			this._on_gui_animations_complete = () => this.onGuiAnimationsComplete();
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			this._modulePackageGetter.registerPackage("EpilogueTitle_Actor", 6, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("EpilogueBody_Actor", 1, GuiTextScaleLogic, GuiExtendedTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("EpilogueTextButton_Actor", 1, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._modulePackageGetter.registerPackage("PopulationIcon_Actor", 4, GuiScaleFade, PopulationIconRenderer, null, null);
			
			// Setting up Initialization Parameters for each actor.
			this._initParamsGetter.register("Title", "EpilogueTitle_Actor" , ["EPILOGUE", 0xffff0000], ["Absender", 80, true, false, 0, false, 0, true], null, null);
			
			let guiExtendedTextRendererInitialization = new GuiExtendedTextRendererInitialization();
			guiExtendedTextRendererInitialization.setTextAlign("center");

			let textIndex = 0;
			
			if (parseFloat(interStateConnection["TotalPopulation"]) >= 75)
			{
				textIndex = 0;
			}
			else if (parseFloat(interStateConnection["TotalPopulation"]) > 35 && parseFloat(interStateConnection["TotalPopulation"]) < 75)
			{
				textIndex = 1;
			}
			else if (parseFloat(interStateConnection["TotalPopulation"]) <= 35)
			{
				textIndex = 2;
			}
			
			let lostPop = (String(interStateConnection["TotalPopulationLost"])) + "%";
			let remainingPop = ((100 - parseFloat(interStateConnection["TotalPopulationLost"])).toFixed(2)).padStart(5, "0") + "%";

			this._initParamsGetter.register(
				"Body",
				"EpilogueBody_Actor",
				["AND THUS, HAVING LOST " + lostPop + " OF ITS POPULATION," + "\n\n" + "HUMANITY " + this._messageGetter.getGroupIndex("Epilogue", textIndex) + " THE ALIEN INVASION." + "\n\n" + " THE END.", 0xff777777],
				["Absender", 20, true, false, 0, false, 0, false, true, guiExtendedTextRendererInitialization],
				null,
				null
			);
			
			this._initParamsGetter.register("TheEnd", "EpilogueTextButton_Actor", ["< THE END >", 0xffff0000], ["Absender", 40, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, null, true], null);
			this._initParamsGetter.register("FinalPopulationTitle", "EpilogueTitle_Actor", ["REMAINING " + remainingPop + " POPULATION", 0xffff0000], ["Absender", 20, true, false, 0, false, 0, true], null, null);
			
			this._initParamsGetter.register("MaleIcon"  , "PopulationIcon_Actor", null, [20, PopulationIconRenderer.MALE_ICON_INDEX]  , null, null);
			this._initParamsGetter.register("FemaleIcon", "PopulationIcon_Actor", null, [20, PopulationIconRenderer.FEMALE_ICON_INDEX], null, null);
			this._initParamsGetter.register("MaleMutantIcon", "PopulationIcon_Actor", null, [20, PopulationIconRenderer.MALE_MUTANT_ICON_INDEX], null, null);
			this._initParamsGetter.register("FemaleMutantIcon", "PopulationIcon_Actor", null, [20, PopulationIconRenderer.FEMALE_MUTANT_ICON_INDEX], null, null);
			
			this._initParamsGetter.register("MalePopulation%",   "EpilogueTitle_Actor", [interStateConnection["MaleSurvivors"].padStart(5, "0") + "%", 0xff81A8F0], ["Absender", 20, true, false, 0, false, 0, false, true], null, null);
			this._initParamsGetter.register("FemalePopulation%", "EpilogueTitle_Actor", [interStateConnection["FemaleSurvivors"].padStart(5, "0") + "%", 0xffF081D4], ["Absender", 20, true, false, 0, false, 0, false, true], null, null);
			this._initParamsGetter.register("MaleMutantPopulation%", "EpilogueTitle_Actor", [interStateConnection["MaleMutantSurvivors"].padStart(5, "0") + "%", 0xff06C406], ["Absender", 20, true, false, 0, false, 0, false, true], null, null);
			this._initParamsGetter.register("FemaleMutantPopulation%", "EpilogueTitle_Actor", [interStateConnection["FemaleMutantSurvivors"].padStart(5, "0") + "%", 0xff06C406], ["Absender", 20, true, false, 0, false, 0, false, true], null, null);

			this._actorManager.init();
			
			const halfW = this._stage.stageWidth / 2;
			const halfH = this._stage.stageHeight / 2;

			// Adding GUI Actors to the GUIActorManager.
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_gui_animations_complete);
			this._guiActorManager.add("Main", "Title" , halfW, halfH - 225);
			this._guiActorManager.add("Main", "Body"  , halfW, halfH - 70);
			this._guiActorManager.add("Main", "TheEnd", halfW, halfH + 250);
			
			this._guiActorManager.add("Main", "FinalPopulationTitle"  , halfW, halfH + 50);
			
			this._guiActorManager.add("Main", "MaleIcon"		, halfW - 210 - 17, halfH + 120);
			this._guiActorManager.add("Main", "FemaleIcon"		, halfW - 60  - 17, halfH + 120);
			this._guiActorManager.add("Main", "MaleMutantIcon"	, halfW + 90  - 17, halfH + 120);
			this._guiActorManager.add("Main", "FemaleMutantIcon", halfW + 240 - 17, halfH + 120);

			this._guiActorManager.add("Main", "MalePopulation%"		   , halfW - 210 - 17, halfH + 185);
			this._guiActorManager.add("Main", "FemalePopulation%"	   , halfW - 60  - 17, halfH + 185);
			this._guiActorManager.add("Main", "MaleMutantPopulation%"  , halfW + 90  - 17, halfH + 185);
			this._guiActorManager.add("Main", "FemaleMutantPopulation%", halfW + 240 - 17, halfH + 185);
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				this.dispatchEvent(new Event(Nukes.EPILOGUE_SPLASH));
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._actorManager.release();
			this._guiActorManager.destroy();
		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
	}

	window.EnduranceEpilogue = EnduranceEpilogue;
}