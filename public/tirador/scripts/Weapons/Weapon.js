function Weapon(id, name, level, user, hasInstructions){
	this.user      		 = user;
	this.level	   		 = level;
	this.hasInstructions = hasInstructions;

	this.callbacks 		   = [];
	this.currentVoleyCount = 0;
	
	this.voleyAmounts;
	this.id = id;
	this.name = name;
}

Weapon.prototype.init = function(container) {
	this.container = container;
}

Weapon.prototype.destroy = function() {}

Weapon.prototype.update = function() {}

Weapon.prototype.powerUp = function() {
	if(this.level < this.voleyAmounts.length-1){
		this.level++;
	}	
}

Weapon.prototype.powerDown = function() {
	if(this.level > 0){
		this.level--;
	}
}

Weapon.prototype.getLevel = function() {
	return this.level;
}

Weapon.prototype.getId = function() {
	return this.id;
}

Weapon.prototype.getName = function() {
	return this.name;
}
