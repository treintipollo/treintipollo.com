function BloodStream(origin) {
	this.short_1 = new ShotCharge(origin, 0, 0, 0, 0, 110);
	this.short_2 = new ShotCharge(origin, 0, 0, 0, 0, 110);
	this.short_3 = new ShotCharge(origin, 0, 0, 0, 0, 110);
	this.mid_1   = new ShotCharge(origin, 0, 0, 0, 0, 130);
	this.mid_2   = new ShotCharge(origin, 0, 0, 0, 0, 130);
	this.long_1  = new ShotCharge(origin, 0, 0, 0, 0, 200);

	//particleInterval, particleColor, particleSize, particleType, particlesInCycle
	this.short_1.init(TopLevel.container, 15, "#E01B6A", 3, "BurstParticle", 2, 200, 300);
	this.short_2.init(TopLevel.container, 15, "#E01B6A", 3, "BurstParticle", 2, 200, 300);
	this.short_3.init(TopLevel.container, 15, "#E01B6A", 3, "BurstParticle", 2, 200, 300);
	this.mid_1.init(TopLevel.container, 12, "#B51958", 3, "BurstParticle", 2, 200, 300);
	this.mid_2.init(TopLevel.container, 12, "#B51958", 3, "BurstParticle", 2, 200, 300);
	this.long_1.init(TopLevel.container, 5, "#F21616", 3, "BurstParticle", 2, 300, 500);
}

BloodStream.prototype.update = function() { }

BloodStream.prototype.on = function(startAngle, endAngle) {
	this.short_2.on(startAngle+45, endAngle+45);
	this.short_3.on(startAngle-45, endAngle-45);
	this.mid_1.on(startAngle+20, endAngle+20);
	this.mid_2.on(startAngle-20, endAngle-20);
	this.long_1.on(startAngle, endAngle);
}

BloodStream.prototype.off = function() {
	this.short_2.off();
	this.short_3.off();
	this.mid_1.off();
	this.mid_2.off();
	this.long_1.off();
}