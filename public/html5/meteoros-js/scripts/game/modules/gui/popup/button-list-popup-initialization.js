"use strict";

{
	const POPUP_GROUP_ID = "ButtonListPopUp";
	const POPUP_ACTOR_ID = "ButtonList";

	class ButtonListPopupInitialization
	{
		constructor(t)
		{
			this._listNames = [];
			this._lenght    = 0;
			this._title 	= t;
			
			this._titleActorId = "";
			this._buttonActorId = "";
		}

		get POPUP_GROUP_ID()
		{
			return POPUP_GROUP_ID;
		}

		get POPUP_ACTOR_ID()
		{
			return POPUP_ACTOR_ID;
		}
		
		add(buttonName)
		{
			this._listNames.push(buttonName);
			this._lenght = this._listNames.length;
		}
		
		init(guiActorManager, modulePackageFactory, initArgumentsGetter, onButtonClick)
		{
			this._titleActorId  = "ButtonListPopupTitle";
			this._buttonActorId = "ListButton";
			
			modulePackageFactory.registerPackage("ButtonListPopup_Actor", 1, GuiButtonListLogic, GuiPopupRenderer, null, null);
			modulePackageFactory.registerPackage("Title_Actor", 1, GuiTextFadeLogic, GuiTextRenderer, null, null);
			modulePackageFactory.registerPackage("Button_Actor", this._lenght, GuiTextFadeLogic, GuiTextRenderer, GuiTextButtonInput, null);
			
			initArgumentsGetter.register(POPUP_ACTOR_ID, "ButtonListPopup_Actor", [guiActorManager, this, 10, 10, onButtonClick], [0xffff0000], null, null);
			initArgumentsGetter.register(this._titleActorId, "Title_Actor", [this._title, 0xffff0000], ["Absender", 30, true, false, 0, false, 0, true, false], null, null);
			initArgumentsGetter.register(this._buttonActorId, "Button_Actor", [" ", 0xff000000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false, false], [0xffffffff, 0xff000000, null, false, null], null);
		}
		
		getButtonText(index)
		{
			return this._listNames[index];
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			
		}
	}

	window.ButtonListPopupInitialization = ButtonListPopupInitialization;
}