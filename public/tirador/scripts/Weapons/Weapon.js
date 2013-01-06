function Weapon(level, user, container){
	this.user      = user;
	this.container = container;

	this.level	   		   = level;
	this.callbacks 		   = [];
	this.currentVoleyCount = 0;
	this.voleyAmounts;
	this.id;

	this.createInstructions();
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
