function Attributes() {}

Attributes.inheritsFrom( GameObject );

Attributes.prototype.init = function() {
	this.currentLevel   = 0;
	this.blockDamage    = false;

	this.updateAttributesTo(0);
}

Attributes.prototype.addHpDeminishedCallback      = function(scope, callback, removeOnComplete) { this.addCallback("onHpDeminishedDelegate"     , scope, callback, removeOnComplete); }
Attributes.prototype.addDamageReceivedCallback    = function(scope, callback, removeOnComplete) { this.addCallback("onDamageReceivedDelegate"   , scope, callback, removeOnComplete); }
Attributes.prototype.addAllDamageReceivedCallback = function(scope, callback, removeOnComplete) { this.addCallback("onAllDamageReceivedDelegate", scope, callback, removeOnComplete); }

Attributes.prototype.removeAllCallbacks = function() {
	GameObject.prototype.removeAllCallbacks.call(this);

	this.destroyCallbacks("onDamageReceivedDelegate");
	this.destroyCallbacks("onAllDamageReceivedDelegate");
	this.destroyCallbacks("onHpDeminishedDelegate");
}

Attributes.prototype.updateAttributesToLastLevel = function() {
	this.updateAttributesTo(TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1);
}

Attributes.prototype.updateAttributesToMaxLevel = function() {
	this.updateAttributesTo(0);
	this.onDamageRecovered();
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
		
		if(this.currentLevel > 0){			
			this.currentHp = difference;	
		}
	}
	
	this.onDamageRecovered();
}

Attributes.prototype.depleteHP = function(amount) {	
	this.currentHp -= amount;
	
	if(this.currentHp > 0){
		this.onHPDiminished();
		this.executeCallbacks("onHpDeminishedDelegate");
	}else{
		if(this.increaseLevel()){
			if(this.currentLevel == TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1){
				this.onLastDamageLevelReached();
			}
		}else{
			this.blockDamage = true;
			this.onAllDamageReceived();			
			this.executeCallbacks("onAllDamageReceivedDelegate");
		}		
	}
}

Attributes.prototype.getTotalHp = function() {
	var fullAttributes = TopLevel.attributesGetter.getFullAttributes(this.typeId);
	var totalHp = 0;

	for(var i=0; i<fullAttributes.length; i++){
		totalHp += fullAttributes[i].hp;		
	}

	return totalHp;
}

Attributes.prototype.getCurrentHp = function() {
	var fullAttributes = TopLevel.attributesGetter.getFullAttributes(this.typeId);
	
	var currentHp = this.currentHp;
	var level     = this.currentLevel + 1;

	for(var i=level; i<fullAttributes.length; i++){
		currentHp += fullAttributes[i].hp;		
	}

	return currentHp;
}

Attributes.prototype.onHPDiminished           		 = function(other) {}
Attributes.prototype.onDamageBlocked          		 = function(other) {}
Attributes.prototype.onDamageReceived         		 = function(other) {}
Attributes.prototype.onDamageRecovered        		 = function(other) {}
Attributes.prototype.onDamageRecoveredOutOfLastLevel = function(other) {}
Attributes.prototype.onLastDamageLevelReached 		 = function(other) {}
Attributes.prototype.onAllDamageReceived      		 = function(other) {}

Attributes.prototype.onCollide = function(other) {
	var fullAttributes = TopLevel.attributesGetter.getFullAttributes(other.typeId);

	if(!fullAttributes){
		return;
	}

	if(this.currentLevel >= fullAttributes.length-1 && this.currentHp < 0){
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
			
			this.executeCallbacks("onAllDamageReceivedDelegate", other);
		}		
	}
}