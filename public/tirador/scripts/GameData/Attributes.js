function Attributes() {}

Attributes.inheritsFrom( GameObject );

Attributes.prototype.init = function() {
	this.currentLevel   = 0;
	this.blockDamage    = false;

	this.updateAttributesTo(0);
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

Attributes.prototype.onHPDiminished           = function(other) {}
Attributes.prototype.onDamageBlocked          = function(other) {}
Attributes.prototype.onDamageReceived         = function(other) {}
Attributes.prototype.onLastDamageLevelReached = function(other) {}
Attributes.prototype.onAllDamageReceived      = function(other) {}

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
	}else{
		if(this.increaseLevel()){
			this.onDamageReceived(other);

			if(this.currentLevel == TopLevel.attributesGetter.getFullAttributes(this.typeId).length-1){
				this.onLastDamageLevelReached(other);
			}

		}else{
			this.blockDamage = true;
			this.onAllDamageReceived(other);
		}		
	}
}

function AttributesGetter() { this.attributesTable = {}; }

AttributesGetter.prototype.setAttributes = function (id, hp, damageReceived, damageDealtMultiplier, additionalProperties) {
	if(this.attributesTable[id] == null){
		this.attributesTable[id] = [];
	}

	this.attributesTable[id].push({hp:hp, damageReceived:damageReceived, damageDealtMultiplier:damageDealtMultiplier, additionalProperties:additionalProperties});
}

AttributesGetter.prototype.getAttributes = function (id, level) {
	if(this.attributesTable[id]){
		return this.attributesTable[id][level];	
	}

	return null;
}

AttributesGetter.prototype.getFullAttributes = function (id) {
	return this.attributesTable[id];
}