"use strict";

{
	const TO_TELEPORT_MOTION = "TELEPORT_MOTION";
	const TO_SCROLL_MOTION = "SCROLL_MOTION";
	const TO_DAMAGE_MOTION = "DAMAGE_MOTION";

	const Event = GameEvent;

	class PyramidBossLogic extends UfoBaseLogic
	{
		constructor()
		{
			super();
			
			this._cities = null;
			this._maxMovesBeforeAttack = 0;
			this._maxHP = 0;
			this._initialization = null;
			this._damageTimer = 0;
			this._continuosHitCounter = 0;
			this._hitCounter = 0;

			this._attackStateMachine = new StateManager(this);
			this._attacks = new Array();
			
			this._attacks.push(this._attackStateMachine.add(new LaserAttack(TopLevel.stage  , this)));
			this._attacks.push(this._attackStateMachine.add(new BombAttack(TopLevel.stage   , this)));
			this._attacks.push(this._attackStateMachine.add(new MeteorAttack(TopLevel.stage , this)));
			
			this._mationStateMachine = new StateManager(this);
			
			this.TELEPORT_STATE = this._mationStateMachine.add(new PyramidTeleport(TopLevel.stage, this));
			this.SCROLL_STATE   = this._mationStateMachine.add(new PyramidScroll(TopLevel.stage, this));
			this.DAMAGED_STATE  = this._mationStateMachine.add(new PyramidDamage(TopLevel.stage, this));
			
			this._movements = new Array();
			this._movements.push(TO_TELEPORT_MOTION);
			this._movements.push(TO_SCROLL_MOTION);
			
			this._mationStateMachine.wireStates(this.TELEPORT_STATE, TO_SCROLL_MOTION  , this.SCROLL_STATE  );
			this._mationStateMachine.wireStates(this.TELEPORT_STATE, TO_TELEPORT_MOTION, this.TELEPORT_STATE);
			this._mationStateMachine.wireStates(this.SCROLL_STATE  , TO_TELEPORT_MOTION, this.TELEPORT_STATE);
			this._mationStateMachine.wireStates(this.SCROLL_STATE  , TO_SCROLL_MOTION  , this.SCROLL_STATE  );
			
			this._mationStateMachine.wireStates(this.TELEPORT_STATE, TO_DAMAGE_MOTION   , this.DAMAGED_STATE );
			this._mationStateMachine.wireStates(this.SCROLL_STATE  , TO_DAMAGE_MOTION   , this.DAMAGED_STATE );
			this._mationStateMachine.wireStates(this.DAMAGED_STATE , TO_SCROLL_MOTION   , this.SCROLL_STATE  );
			this._mationStateMachine.wireStates(this.DAMAGED_STATE , TO_TELEPORT_MOTION , this.TELEPORT_STATE);
			
			this._mationStateMachine.setCurrent();
			
			this._showHitFeedback = false;
		}

		static get TO_TELEPORT_MOTION()
		{
			return TO_TELEPORT_MOTION;
		};

		static get TO_SCROLL_MOTION()
		{
			return TO_SCROLL_MOTION;
		};

		static get TO_DAMAGE_MOTION()
		{
			return TO_DAMAGE_MOTION;
		};
		
		concreteInit()
		{
			this._continuosHitCounter	 = 0;
			this._hitCounter			 = 0;
			this._externalParameters["active"] = true;
		}
		
		initComplete()
		{
			
		}
		
		childInit(params)
		{
			this.baseInit(params[0]);
			
			this._initialization 	   = params[0];
			this._maxMovesBeforeAttack = this._moves;
			this._maxHP				   = this._hp;
			this._cities 			   = this._actorManager.getModulesOfType("City_Actor");
		}
		
		update(deltaTime)
		{
			if (!this._startDeathMotion)
			{
				this._mationStateMachine.update(deltaTime);
				this._attackStateMachine.update(deltaTime);
			}
			
			if (this._continuosHitCounter > 0)
			{
				if (this._damageTimer < this._initialization._damageTime)
				{
					this._damageTimer += deltaTime;
				}
				else
				{
					this._continuosHitCounter = 0;
				}
			}
			
			if (this._parent.Active)
			{
				this.baseUpdate(deltaTime);
				
				this._posY += deltaTime + Math.sin(this._oscillator);
			}
		}
		
		concreteRelease()
		{
			this.baseRelease();
			
			this._initialization = null;
			this._cities 		 = null;
		}
		
		concreteDestroy()
		{
			this.baseDestroy();
			
			this._mationStateMachine.clean();
			this._attackStateMachine.clean();
			
			this._mationStateMachine = null;
			this._attackStateMachine = null;
			
			this._attacks   = null;
			this._movements = null;
		}
		
		onCollide(opponent, deltaTime)
		{
			super.onCollide(opponent, deltaTime);
			
			if (!this._externalParameters["shielding"] && !this._startDeathMotion)
			{
				this._hp++;
				
				if (this._continuosHitCounter < this._initialization._hitsBeforeDamage)
				{
					this._damageTimer = 0;
					this._continuosHitCounter++;
				}
				else
				{
					this._hp--;

					if (this._hp <= 0)
					{
						this.startDeathAnim();
					}
					
					
					this._continuosHitCounter = 0;
					this._mationStateMachine.getCurrentStateInstance().dispatchEvent(new Event(TO_DAMAGE_MOTION));
					this._attackStateMachine.setCurrent(StateManager.STOP_STATE);
					
					this._externalParameters["showDamage"](this._hp, this._maxHP);
				}
			}
			
			if (this._startDeathMotion)
			{
				this._attackStateMachine.setCurrent(StateManager.STOP_STATE);
			}
		}
	}

	window.PyramidBossLogic = PyramidBossLogic;
}