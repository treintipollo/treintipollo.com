"use strict";

{
	class ScoreCounter
	{
		constructor()
		{
			this._score = 0;
			this._longestCombo = 0;
			
			this._combo = 0;
			this._comboTimer = null;
			this._hideTimer = null;
			
			this._pauseHandler = null;
			this._scoreActor = null;
			this._comboActor = null;
			this._externalParams = null;
			this._factoryActors = null;

			this._on_combo_timer_complete = (te) => this.onComboTimerComplete(te);
			this._on_score = (actor) => this.onScore(actor);
			this._on_hide_timer_complete = (te) => this.onHideTimerComplete(te);
		}
		
		init(args)
		{
			this._score		   = 0;
			this._combo 	   = 0;
			this._longestCombo = 0;
			this._comboTimer   = new Timer(2000, 1);
			this._hideTimer	   = new Timer(3000, 1);
			
			this._pauseHandler = args[0];

			this._hideTimer.addEventListener(TimerEvent.TIMER, this._on_hide_timer_complete, false, 0, true);
		}
		
		release()
		{
			if (this._comboTimer !== null)
			{
				this._comboTimer.reset();
				
				if (this._comboTimer.hasEventListener(TimerEvent.TIMER))
				{
					this._comboTimer.removeEventListener(TimerEvent.TIMER, this._on_combo_timer_complete);
				}
			}

			if (this._hideTimer !== null)
			{
				this._hideTimer.reset();
				
				if (this._hideTimer.hasEventListener(TimerEvent.TIMER))
				{
					this._hideTimer.removeEventListener(TimerEvent.TIMER, this._on_hide_timer_complete);
				}
			}
			
			if (this._combo > 1)
			{
				this._score += this._combo * this._combo * 10;
			}
			
			if (this._combo > this._longestCombo)
			{
				this._longestCombo = this._combo;
			}
			
			CollectionUtils.nullVector(this._factoryActors);
			
			this._pauseHandler  = null;
			this._scoreActor    = null;
			this._comboActor	  = null;
			this._comboTimer	  = null;
		}
		
		setUpVisual(modulePackageFactory, initParametersGetter)
		{
			modulePackageFactory.registerPackage("ScoreCountVisuals_Actor", 2, GuiTextScaleLogic, GuiTextRenderer, null, null);
			initParametersGetter.register("Visual", "ScoreCountVisuals_Actor", ["X", 0x777777], ["Absender", 20, true, false, 0, false, 0, false], null, null);
		}
		
		addVisual(actorManager)
		{
			if (this._scoreActor === null && this._comboActor === null)
			{
				const stage = actorManager.Stage;

				this._scoreActor = actorManager.setActor("Visual", stage.stageWidth / 2, 0);
				this._comboActor = actorManager.setActor("Visual", stage.stageWidth / 2, 0);
				
				this._scoreActor.Logic._y = this._scoreActor.Renderer.getTextDimentions().y / 2;
				this._comboActor.Logic._y = this._scoreActor.Logic._y + this._comboActor.Renderer.getTextDimentions().y;
				
				this._scoreActor.Renderer.sendBack();
				this._comboActor.Renderer.sendBack();
				
				this._scoreActor.Logic.ExternalParameters["Text"] = "SCORE:" + "00000000";
				
				this._comboActor.Renderer.Container.visible = false;

				this._factoryActors = actorManager.getActors(FactoryLogic);
				
				for(let i = 0; i < this._factoryActors.length; i++)
				{
					this._factoryActors[i].Logic.AddchildDestructionCallback(this._on_score);
				}
			}
		}
		
		onScore(actor)
		{
			if (actor.Logic)
			{
				this._externalParams = actor.Logic.ExternalParameters;
				
				if (this._externalParams["MissileHit"] === true || this._externalParams["Hit"] === true)
				{
					if (this._combo === 0)
					{
						this._comboTimer.addEventListener(TimerEvent.TIMER, this._on_combo_timer_complete, false, 0, true);
						this._comboTimer.start();
					}
					else
					{
						this._comboTimer.reset();
						this._comboTimer.start();
					}
					
					this._score += 50;
					this._combo++;
					
					if (this._combo > 1)
					{
						if (this._comboActor.Logic !== null)
						{
							this._comboActor.Renderer.Container.visible = true;
							this._comboActor.Logic.ExternalParameters["Text"] = "X" + StringUtils.zeroPad(this._combo, 3);
						}
					}
					
					if (this._scoreActor.Logic !== null)
					{
						this._scoreActor.Logic.ExternalParameters["Text"] = "SCORE:" + StringUtils.zeroPad(this._score, 8);
					}
				}
			}
		}
		
		onComboTimerComplete(te)
		{
			if (this._pauseHandler.isPaused() === PauseUtils.NO_PAUSE)
			{
				this._comboTimer.removeEventListener(TimerEvent.TIMER, this._on_combo_timer_complete);
				
				if (this._combo > 1)
				{
					this._score += this._combo * this._combo * 10;
					this._comboActor.Logic.ExternalParameters["Text"] = "+" + this._combo * this._combo * 10;

					this._hideTimer.reset();
					this._hideTimer.start();
				}
				
				if (this._combo > this._longestCombo)
				{
					this._longestCombo = this._combo;
				}
				
				this._scoreActor.Logic.ExternalParameters["Text"] = "SCORE:" + StringUtils.zeroPad(this._score, 8);
				
				this._combo = 0;
			}
			else
			{
				this._comboTimer.reset();
				this._comboTimer.start();
			}
		}

		onHideTimerComplete(te)
		{
			if (this._pauseHandler.isPaused() === PauseUtils.NO_PAUSE)
			{
				if (this._combo === 0)
				{
					this._comboActor.Renderer.Container.visible = false;
				}
				else
				{
					this._hideTimer.reset();
					this._hideTimer.start();
				}
			}
			else
			{
				this._hideTimer.reset();
				this._hideTimer.start();
			}
		}

		addScore(score)
		{
			this._score += score;

			if (this._scoreActor)
				this._scoreActor.Logic.ExternalParameters["Text"] = "SCORE:" + StringUtils.zeroPad(this._score, 8);
		}
	}

	window.ScoreCounter = ScoreCounter;
}