function AttributesGetter() {
	this.attributesTable = {};

	this.setAttributes = function(id, hp, damageReceived, damageDealtMultiplier, additionalProperties) {
		if (this.attributesTable[id] == null) {
			this.attributesTable[id] = [];
		}

		this.attributesTable[id].push({
			hp: hp,
			damageReceived: damageReceived,
			damageDealtMultiplier: damageDealtMultiplier,
			additionalProperties: additionalProperties
		});
	};

	this.getAttributes = function(id, level) {
		if (this.attributesTable[id]) {
			return this.attributesTable[id][level];
		}

		return null;
	};

	this.getFullAttributes = function(id) {
		return this.attributesTable[id];
	};
}