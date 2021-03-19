"use strict";

{
	class ListPopupInitialization
	{
		constructor(actorId, title, separator = ".", minSeparatorLenght = 3)
		{
			this.POPUP_GROUP_ID = "StatsPopUp";
			this.POPUP_ACTOR_ID = actorId;
			
			this._titleActorId = "";
			this._itemActorId = "";
			this._buttonActorId = "";

			this._listNames  = [];
			this._listValues = [];
			this._valueTypes = [];
			
			this._lenght 			= 0;
			this._longestListName = 0;
			
			this._nameValueSeparator	= separator;
			this._title 				= title;
			this._minSeparatorLenght 	= minSeparatorLenght + 1;
			
			this._longestListName = title.length;
		}
		
		add(fieldName, fieldValue, valueType = "")
		{
			this._listNames.push(fieldName);
			this._listValues.push(fieldValue);
			this._valueTypes.push(valueType);
			
			this._lenght = this._listNames.length;
			
			if (this._longestListName < fieldName.length)
			{
				this._longestListName = fieldName.length + this._minSeparatorLenght;
			}
		}
		
		init(guiActorManager, modulePackageFactory, initArgumentsGetter)
		{
			this._titleActorId  = "StatisticsPopupTitle" + this.POPUP_ACTOR_ID;
			this._itemActorId   = "StatisticsPopupText"  + this.POPUP_ACTOR_ID;
			this._buttonActorId = "StatisticsOkButton"   + this.POPUP_ACTOR_ID;
			
			modulePackageFactory.registerPackage("StatistisPopup_Actor"	    + this.POPUP_ACTOR_ID, 1 				, GuiListPopUpLogic, GuiPopupRenderer, null, null);
			modulePackageFactory.registerPackage("StatistisPopupText_Actor" + this.POPUP_ACTOR_ID, this._lenght + 1	, GuiTextFadeLogic , GuiTextRenderer , null, null);
			modulePackageFactory.registerPackage("StatisticsOkButton_Actor" + this.POPUP_ACTOR_ID, 1				, GuiTextFadeLogic , GuiTextRenderer , GuiTextButtonInput, null)
			
			initArgumentsGetter.register(this.POPUP_ACTOR_ID, "StatistisPopup_Actor"	 + this.POPUP_ACTOR_ID, [guiActorManager, this, 10, 10], [0xffff0000], null, null);
			initArgumentsGetter.register(this._itemActorId 	, "StatistisPopupText_Actor" + this.POPUP_ACTOR_ID, [" ", 0xff777777], ["Absender", 30, true, false, 0, false, 0, false, false], null, null);
			initArgumentsGetter.register(this._titleActorId	, "StatistisPopupText_Actor" + this.POPUP_ACTOR_ID, [this._title, 0xffff0000], ["Absender", 30, true, false, 0, false, 0, true, false], null, null);
			initArgumentsGetter.register(this._buttonActorId, "StatisticsOkButton_Actor" + this.POPUP_ACTOR_ID, ["< WHATEVER >", 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false, false], [0xff00ff00, 0xffff0000, null], null);
		}
		
		getPopupLine(lineIndex)
		{
			let currentSeparator = this._nameValueSeparator;
			let charDifference;
			
			// Adding the missing chars to compensate for the shorter name.
			if (this._listNames[lineIndex].length < this._longestListName)
			{
				charDifference = this._longestListName - this._listNames[lineIndex].length;
				
				for(let i = 0; i < charDifference + this._minSeparatorLenght; i++)
				{
					currentSeparator += this._nameValueSeparator;
				}
			}
			
			// Removing needed chars in order to fit in the value + valueType
			charDifference = String(this._listValues[lineIndex]).length + this._valueTypes[lineIndex].length;
			currentSeparator = currentSeparator.slice(0, (currentSeparator.length - charDifference) - 1);
			
			return this._listNames[lineIndex] + currentSeparator + this._listValues[lineIndex] + this._valueTypes[lineIndex];
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			this._listNames  = null;
			this._listValues = null;
			this._valueTypes = null;
		}
	}

	window.ListPopupInitialization = ListPopupInitialization;
}