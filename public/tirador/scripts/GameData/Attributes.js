function Attributes() {}

Attributes.inheritsFrom( GameObject );

Attributes.prototype.init = function() {
	this.currentLevel   = 0;
	this.blockDamage    = false;

	this.updateAttributesTo(0);
}

Attributes.prototype.addHpDeminishedCallback      = function(scope, callback) { this.addCallback("onHpDeminishedDelegate"     , scope, callback); }
Attributes.prototype.addDamageReceivedCallback    = function(scope, callback) { this.addCallback("onDamageReceivedDelegate"   , scope, callback); }
Attributes.prototype.addAllDamageReceivedCallback = function(scope, callback) { this.addCallback("onAllDamageReceivedDelegate", scope, callback); }

Attributes.prototype.removeAllCallbacks = function() {
	GameObject.prototype.removeAllCallbacks.call(this);

	this.destroyCallbacks("onDamageReceivedDelegate");
	this.destroyCallbacks("onAllDamageReceivedDelegate");
	this.destroyCallbacks("onHpDeminishedDelegate");
}

Attributes.prototype.updateAttributesTo = function(level) {
	this.currentLevel = level;

	var level = TopLevel.attributesGetter.getAttributes(this.typeId, this.currentLevel);

	if(!level) return;

	this.currentHpMax          = level.hp;
	this.currentHp      	   = level.hp;
	this.damageReceived 	   = level.damageReceived;
	this.damageDealtMultiplier = level.damageDealtMultiplier;

	if(level.additionalProperties){
		for(var ap in level.additionalProperties) {
			this[ap] = level.additionalProperties[ap];
		}	
	}	
}

Attributes.prototype.increaseLevel = function() {
	if(this.currentLevel < TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1){
		this.currentLevel++;
		this.updateAttributesTo(this.currentLevel);
		return true;
	}

	return false;
}

Attributes.prototype.recoverHP = function(amount) {	
	this.currentHp += amount;

	if(this.currentHp > this.currentHpMax){
		var difference = this.currentHp - this.currentHpMax;
		
		if(this.currentLevel == TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1){
			this.onDamageRecoveredOutOfLastLevel();
		}

		if(this.currentLevel > 0){
			this.currentLevel--;	
		}

		this.updateAttributesTo(this.currentLevel);
		this.currentHp = difference;
	}
	
	this.onDamageRecovered();
}

Attributes.prototype.onHPDiminished           		 = function(other) {}
Attributes.prototype.onDamageBlocked          		 = function(other) {}
Attributes.prototype.onDamageReceived         		 = function(other) {}
Attributes.prototype.onDamageRecovered        		 = function(other) {}
Attributes.prototype.onDamageRecoveredOutOfLastLevel = function(other) {}
Attributes.prototype.onLastDamageLevelReached 		 = function(other) {}
Attributes.prototype.onAllDamageReceived      		 = function(other) {}

Attributes.prototype.onCollide = function(other) {
	if(!TopLevel.attributesGetter.getFullAttributes(other.typeId)){
		return;
	}

	if(this.blockDamage){ 
		this.onDamageBlocked(other); 
		return;
	}

	this.currentHp -= this.damageReceived * other.damageDealtMultiplier;
	
	if(this.currentHp > 0){
		this.onHPDiminished(other);
		
		this.executeCallbacks("onHpDeminishedDelegate", other);

	}else{
		if(this.increaseLevel()){
			this.onDamageReceived(other);

			if(this.currentLevel == TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1){
				this.onLastDamageLevelReached(other);
			}

			this.executeCallbacks("onDamageReceivedDelegate", other);

		}else{
			this.blockDamage = true;
			this.onAllDamageReceived(other);
			
			this.executeCallbacks("onAllDamageReceivedDelegate", other)
		}		
	}
}