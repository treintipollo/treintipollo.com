function TextConfigurationCreator() {}

TextConfigurationCreator.prototype.create = function() {

	TopLevel.container.createTypeConfiguration("pUp", "Text").args({
		tProto: PowerUpText.prototype,
		text: "POWER UP!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#FFFF00",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("pDown", "Text").args({
		tProto: PowerUpText.prototype,
		text: "POWER DOWN",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#777777",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("shot", "Text").args({
		tProto: PowerUpText.prototype,
		text: "SHOT!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("rockets", "Text").args({
		tProto: PowerUpText.prototype,
		text: "ROCKETS!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#0000FF",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("homing", "Text").args({
		tProto: PowerUpText.prototype,
		text: "HOMING!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#00FF00",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("speed", "Text").args({
		tProto: PowerUpText.prototype,
		text: "SPEED UP!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#00FF00",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("health", "Text").args({
		tProto: PowerUpText.prototype,
		text: "HEALTH UP!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("1up", "Text").args({
		tProto: PowerUpText.prototype,
		text: "1-UP!",
		font: "Russo One",
		size: 20,
		fill: "#FFFFFF",
		stroke: "#777777",
		lineWidth: 1,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("warning", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "WARNING!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("watchout", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "WATCH OUT!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});


	TopLevel.container.createTypeConfiguration("boom", "Text").layer(-1).args({
		introSpeed: 0.5,
		tProto: WarningText.prototype,
		text: "BOOM! :D",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("nice", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "NICE!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#0000FF",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("ready", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "READY?",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("victory", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "VICTORY!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("complete", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "COMPLETE!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("gameover", "Text").layer(-1).args({
		introSpeed: 0.7,
		tProto: WarningText.prototype,
		text: "DEAD MEAT",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("space", "Text").args({
		tProto: GameText.prototype,
		text: "Once upon",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#777777",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("shooting", "Text").args({
		tProto: GameText.prototype,
		text: "a time...",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#777777",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("adventure", "Text").args({
		tProto: GameText.prototype,
		text: "IN SPACE!",
		font: "Russo One",
		size: 60,
		fill: "#FFFFFF",
		stroke: "#777777",
		lineWidth: 3,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("controls_1", "Text").args({
		tProto: GameText.prototype,
		text: 'Press "A" to Shoot',
		font: "Russo One",
		size: 30,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 2,
		align: "center",
		baseline: "middle"
	});


	TopLevel.container.createTypeConfiguration("controls_2", "Text").args({
		tProto: GameText.prototype,
		text: 'Press "← ↑ → ↓" to Move',
		font: "Russo One",
		size: 30,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 2,
		align: "center",
		baseline: "middle"
	});

	TopLevel.container.createTypeConfiguration("playerMarker", "Text").args({
		tProto: GameText.prototype,
		text: "⬆",
		font: "Russo One",
		size: 50,
		fill: "#FFFFFF",
		stroke: "#FF0000",
		lineWidth: 2,
		align: "center",
		baseline: "middle"
	});
};