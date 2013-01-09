function Weapon(level, user){
	this.user      = user;
	
	this.level	   		   = level;
	this.callbacks 		   = [];
	this.currentVoleyCount = 0;
	this.voleyAmounts;
	this.id;

	this.createInstructions();
}

Weapon.prototype.init = function(container) {
	this.container = container;
}

Weapon.prototype.destroy = function() {
	ArrowKeyHandler.removeCallbacks(this.callbacks);
	DestroyUtils.destroyAllProperties(this);
}

Weapon.prototype.update = function() {}

Weapon.prototype.powerUp = function() {
	if(this.level < this.voleyAmounts.length-1){
		this.level++;
		this.createInstructions();
	}	
}

Weapon.prototype.powerDown = function() {
	if(this.level > 0){
		this.level--;
		this.createInstructions();
	}
}

Weapon.prototype.getLevel = function() {
	return this.level;
}

Weapon.prototype.getId = function() {
	return this.id;
}

Weapon.prototype.createInstructions = function() {}
