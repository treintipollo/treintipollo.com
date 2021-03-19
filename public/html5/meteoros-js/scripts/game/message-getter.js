"use strict";

{
	const SPLASH   =  "Splash";
	const INTRO    =  "Intro";
	const SUCCESS  =  "Success";
	const FAILURE  =  "Failure";
	const VICTORY  =  "Victory";
	const GAMEOVER =  "GameOver";

	class MessageGetter
	{
		constructor(messages)
		{
			this._messageGroups = new Map();
			
			let groupName = "";
			let m = "";

			const root = messages.children[0];

			for (const group of root.children)
			{
				groupName = group.getAttribute("id");
				
				this._messageGroups.set(groupName, new Array());
				
				for (const message of group.children)
				{
					m = message.getAttribute("text");

					this._messageGroups.get(groupName).push(m);
				}
			}
		}

		static get SPLASH()
		{
			return SPLASH;
		}

		static get INTRO()
		{
			return INTRO;
		}

		static get SUCCESS()
		{
			return SUCCESS;
		}

		static get FAILURE()
		{
			return FAILURE;
		}

		static get VICTORY()
		{
			return VICTORY;
		}

		static get GAMEOVER()
		{
			return GAMEOVER;
		}

		getGroup(id)
		{
			const messageAmount = this._messageGroups.get(id).length;
			const message = this._messageGroups.get(id)[NumberUtils.randRange(0, messageAmount - 1, true)];
			
			return message.toUpperCase();
		}
		
		getGroupIndex(id, index)
		{
			const message = this._messageGroups.get(id)[index];
			
			return message.toUpperCase();
		}
	}

	window.MessageGetter = MessageGetter;
}