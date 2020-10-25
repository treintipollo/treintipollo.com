"use strict"

{
    class DynamicGraphics
	{
		constructor()
		{
			
		}

		GetColorUint(r = 1, g = 1, b = 1, a = 1)
		{
			return (0xFF * a << 24) | ((0xFF * r) << 16) | ((0xFF * g) << 8) | (0xFF * b);
		}
		
		Init(stage)
		{
			const baddyData = new Map([
				// Generators
				["WeakBaseGenerator", { stats: Weak, type: BaseGenerator, overrides: { "Radius" : Weak.GetRadius() * 2 } }],
				["StrongBaseGenerator", { stats: Strong, type: BaseGenerator, overrides: { "Radius" : Strong.GetRadius() * 2 } }],
				["FastBaseGenerator", { stats: Fast, type: BaseGenerator, overrides: { "Radius" : Fast.GetRadius() * 2 } }],
				["InvinsibleBaseGenerator", { stats: Invinsible, type: BaseGenerator, overrides: { "Radius" : Invinsible.GetRadius() * 2 } }],

				["WeakFillGenerator", { stats: Weak, type: FillGenerator, overrides: { "Radius" : Weak.GetRadius() * 2 } }],
				["StrongFillGenerator", { stats: Strong, type: FillGenerator, overrides: { "Radius" : Strong.GetRadius() * 2 } }],
				["FastFillGenerator", { stats: Fast, type: FillGenerator, overrides: { "Radius" : Fast.GetRadius() * 2 } }],
				["InvinsibleFillGenerator", { stats: Invinsible, type: FillGenerator, overrides: { "Radius" : Invinsible.GetRadius() * 2 } }],

				["WeakCenterGenerator", { stats: Weak, type: CenterGenerator, overrides: { "Radius" : Weak.GetRadius() * 2 } }],
				["StrongCenterGenerator", { stats: Strong, type: CenterGenerator, overrides: { "Radius" : Strong.GetRadius() * 2 } }],
				["FastCenterGenerator", { stats: Fast, type: CenterGenerator, overrides: { "Radius" : Fast.GetRadius() * 2 } }],
				["InvinsibleCenterGenerator", { stats: Invinsible, type: CenterGenerator, overrides: { "Radius" : Invinsible.GetRadius() * 2 } }],

				// Baddies
				["WeakRammingBaddy", { stats: Weak, type: RammingBaddy, overrides: {} }],
				["StrongRammingBaddy", { stats: Strong, type: RammingBaddy, overrides: {} }],
				["FastRammingBaddy", { stats: Fast, type: RammingBaddy, overrides: {} }],
				["InvinsibleRammingBaddy", { stats: Invinsible, type: RammingBaddy, overrides: {} }],
				
				["WeakRandomFillColorRammingBaddy", { stats: Weak, type: RammingBaddy, overrides: { "FillColor" : Weak.GetLineColor() } }],
				["StrongRandomFillColorRammingBaddy", { stats: Strong, type: RammingBaddy, overrides: { "FillColor" : Strong.GetLineColor() } }],
				["FastRandomFillColorRammingBaddy", { stats: Fast, type: RammingBaddy, overrides: { "FillColor" : Fast.GetLineColor() } }],
				["InvinsibleRandomFillColorRammingBaddy", { stats: Invinsible, type: RammingBaddy, overrides: { "FillColor" : Invinsible.GetLineColor() } }],

				["WeakBouncingBaddy", { stats: Weak, type: BouncingBaddy, overrides: {} }],
				["StrongBouncingBaddy", { stats: Strong, type: BouncingBaddy, overrides: {} }],
				["FastBouncingBaddy", { stats: Fast, type: BouncingBaddy, overrides: {} }],
				["InvinsibleBouncingBaddy", { stats: Invinsible, type: BouncingBaddy, overrides: {} }],
				
				["WeakRandomFillColorBouncingBaddy", { stats: Weak, type: BouncingBaddy, overrides: { "FillColor" : Weak.GetLineColor() } }],
				["StrongRandomFillColorBouncingBaddy", { stats: Strong, type: BouncingBaddy, overrides: { "FillColor" : Strong.GetLineColor() } }],
				["FastRandomFillColorBouncingBaddy", { stats: Fast, type: BouncingBaddy, overrides: { "FillColor" : Fast.GetLineColor() } }],
				["InvinsibleRandomFillColorBouncingBaddy", { stats: Invinsible, type: BouncingBaddy, overrides: { "FillColor" : Invinsible.GetLineColor() } }],

				["WeakExplodingBaddy", { stats: Weak, type: ExplodingBaddy, overrides: {} }],
				["StrongExplodingBaddy", { stats: Strong, type: ExplodingBaddy, overrides: {} }],
				["FastExplodingBaddy", { stats: Fast, type: ExplodingBaddy, overrides: {} }],
				["InvinsibleExplodingBaddy", { stats: Invinsible, type: ExplodingBaddy, overrides: {} }],
				
				["WeakRandomFillColorExplodingBaddy", { stats: Weak, type: ExplodingBaddy, overrides: { "FillColor" : Weak.GetLineColor() } }],
				["StrongRandomFillColorExplodingBaddy", { stats: Strong, type: ExplodingBaddy, overrides: { "FillColor" : Strong.GetLineColor() } }],
				["FastRandomFillColorExplodingBaddy", { stats: Fast, type: ExplodingBaddy, overrides: { "FillColor" : Fast.GetLineColor() } }],
				["InvinsibleRandomFillColorExplodingBaddy", { stats: Invinsible, type: ExplodingBaddy, overrides: { "FillColor" : Invinsible.GetLineColor() } }],

				["WeakSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides: {} }],
				["StrongSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides: {} }],
				["FastSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides: {} }],
				["InvinsibleSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides: {} }],
				
				["WeakRandomFillColorSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides: { "FillColor" : Weak.GetLineColor() } }],
				["StrongRandomFillColorSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides: { "FillColor" : Strong.GetLineColor() } }],
				["FastRandomFillColorSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides: { "FillColor" : Fast.GetLineColor() } }],
				["InvinsibleRandomFillColorSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides: { "FillColor" : Invinsible.GetLineColor() } }],

				// Misc. baddies
				["WeakSnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["StrongSnakeBodyPartSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["FastSnakeBodyPartSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["InvinsibleSnakeBodyPartSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2, "FillColor" : 0xff000000 } }],

				["WeakRandomFillColorSnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["StrongRandomFillColorSnakeBodyPartSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["FastRandomFillColorSnakeBodyPartSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 2, "FillColor" : 0xff000000 } }],
				["InvinsibleRandomFillColorSnakeBodyPartSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2, "FillColor" : 0xff000000 } }],

				// Spawned on baddy death
				["WeakSpawnedByBaddyRammingBaddy", { stats: Weak, type: RammingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongSpawnedByBaddyRammingBaddy", { stats: Strong, type: RammingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastSpawnedByBaddyRammingBaddy", { stats: Fast, type: RammingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleSpawnedByBaddyRammingBaddy", { stats: Invinsible, type: RammingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakRandomFillColorSpawnedByBaddyRammingBaddy", { stats: Weak, type: RammingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongRandomFillColorSpawnedByBaddyRammingBaddy", { stats: Strong, type: RammingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastRandomFillColorSpawnedByBaddyRammingBaddy", { stats: Fast, type: RammingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleRandomFillColorSpawnedByBaddyRammingBaddy", { stats: Invinsible, type: RammingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakSpawnedByBaddyBouncingBaddy", { stats: Weak, type: BouncingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongSpawnedByBaddyBouncingBaddy", { stats: Strong, type: BouncingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastSpawnedByBaddyBouncingBaddy", { stats: Fast, type: BouncingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleSpawnedByBaddyBouncingBaddy", { stats: Invinsible, type: BouncingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakRandomFillColorSpawnedByBaddyBouncingBaddy", { stats: Weak, type: BouncingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongRandomFillColorSpawnedByBaddyBouncingBaddy", { stats: Strong, type: BouncingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastRandomFillColorSpawnedByBaddyBouncingBaddy", { stats: Fast, type: BouncingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleRandomFillColorSpawnedByBaddyBouncingBaddy", { stats: Invinsible, type: BouncingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakSpawnedByBaddyExplodingBaddy", { stats: Weak, type: ExplodingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongSpawnedByBaddyExplodingBaddy", { stats: Strong, type: ExplodingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastSpawnedByBaddyExplodingBaddy", { stats: Fast, type: ExplodingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleSpawnedByBaddyExplodingBaddy", { stats: Invinsible, type: ExplodingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakRandomFillColorSpawnedByBaddyExplodingBaddy", { stats: Weak, type: ExplodingBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongRandomFillColorSpawnedByBaddyExplodingBaddy", { stats: Strong, type: ExplodingBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastRandomFillColorSpawnedByBaddyExplodingBaddy", { stats: Fast, type: ExplodingBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleRandomFillColorSpawnedByBaddyExplodingBaddy", { stats: Invinsible, type: ExplodingBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakSpawnedByBaddySnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongSpawnedByBaddySnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastSpawnedByBaddySnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleSpawnedByBaddySnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakRandomFillColorSpawnedByBaddySnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 2 } }],
				["StrongRandomFillColorSpawnedByBaddySnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 2 } }],
				["FastRandomFillColorSpawnedByBaddySnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 2 } }],
				["InvinsibleRandomFillColorSpawnedByBaddySnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 2 } }],

				["WeakSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["StrongSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["FastSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["InvinsibleSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 4, "FillColor" : 0xff000000 } }],

				["WeakRandomFillColorSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["StrongRandomFillColorSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Strong, type: SnakeBaddy, overrides : { "Radius" : Strong.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["FastRandomFillColorSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Fast, type: SnakeBaddy, overrides : { "Radius" : Fast.GetRadius() / 4, "FillColor" : 0xff000000 } }],
				["InvinsibleRandomFillColorSpawnedByBaddySnakeBodyPartSnakeBaddy", { stats: Invinsible, type: SnakeBaddy, overrides : { "Radius" : Invinsible.GetRadius() / 4, "FillColor" : 0xff000000 } }],

				// Ancillary boss baddies
				["BossBulletStraightBullet", { stats: BossBullet, type: StraightBullet, overrides : { } }],
				["BossBulletShotgunBullet", { stats: BossBullet, type: ShotgunBullet, overrides : { } }],
				["BossBulletExplodingBullet", { stats: BossBullet, type: ExplodingBullet, overrides : { } }],
				["BombBossBulletExplodingBullet", { stats: BossBullet, type: ExplodingBullet, overrides : { "Radius" : 23, "LineWidth": 3 } }],
				["BossBulletSpiralBullet", { stats: BossBullet, type: SpiralBullet, overrides : { } }],
				["BossBulletSnakeBullet", { stats: BossBullet, type: SnakeBullet, overrides : { } }],
				["BossSnakeTrailSnakeBaddy", { stats: BossBullet, type: SnakeBullet, overrides : { "Radius" : 23, "LineWidth": 3 } }],
				["SnakeBulletTrailSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2 } }],
				["SnakeBulletTrailSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2 } }],
				["SnakeBulletTrailSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2 } }],
				["SnakeBulletTrailSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2 } }],
				["SnakeBulletTrailSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2 } }],

				// Death attack baddies
				["RamBossSmithereenStraightBullet", { stats: BossBullet, type: StraightBullet, overrides : { "FillColor" : 0xff000000, "LineColor" : this.GetColorUint(0.1, 0.9, 0.5, 1) } }],
				["BounceBossSmithereenShotgunBullet", { stats: BossBullet, type: ShotgunBullet, overrides : { "FillColor" : 0xff000000, "LineColor" : this.GetColorUint(0.1, 0.5, 0.8, 1) } }],
				["ExplodeBossSmithereenSpiralBullet", { stats: BossBullet, type: SpiralBullet, overrides : { "FillColor" : 0xff000000, "LineColor" : this.GetColorUint(0.7, 0.7, 0.1, 1) } }],
				["SnakeBossChunkSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "LineColor" : this.GetColorUint(0.5, 0.5, 0.5, 1) } }],
				["SnakeBossChunkSnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : Weak.GetRadius() / 2, "LineColor" : this.GetColorUint(0.5, 0.5, 0.5, 1) } }],
				["BigBossBossChunkSnakeBaddy", { stats: BossBullet, type: SnakeBaddy, overrides : { "LineColor" : this.GetColorUint(0.7, 0.0, 1.0, 1), "FillColor": 0xff000000 } }],
				["BigBossBossChunkSnakeBodyPartSnakeBaddy", { stats: Weak, type: SnakeBaddy, overrides : { "Radius" : BossBullet.GetRadius() / 2, "LineColor" : this.GetColorUint(0.7, 0.0, 1.0, 1) } }],

				// Big boss ancillary baddies
				["AttackBitAttackBitBaddy", { stats: Weak, type: AttackBitBaddy, overrides : { "LineColor" : 0xffffffff, "FillColor": 0xff000000 } }],
				["WeakBombBitBombBitBaddy", { stats: Weak, type: BombBitBaddy, overrides : { "LineColor" : 0xffffffff, "FillColor": Weak.GetLineColor() } }],
				["StrongBombBitBombBitBaddy", { stats: Strong, type: BombBitBaddy, overrides : { "LineColor" : 0xffffffff, "FillColor": Strong.GetLineColor() } }],
				["FastBombBitBombBitBaddy", { stats: Fast, type: BombBitBaddy, overrides : { "LineColor" : 0xffffffff, "FillColor": Fast.GetLineColor() } }],
				["InvinsibleBombBitBombBitBaddy", { stats: Invinsible, type: BombBitBaddy, overrides : { "LineColor" : 0xffffffff, "FillColor": Invinsible.GetLineColor() } }],
				["BossWeakBulletStraightBullet", { stats: BossBullet, type: StraightBullet, overrides : { "LineColor" : 0xffffffff, "FillColor": 0xff000000 } }],
				["BossPowerBulletStraightBullet", { stats: Weak, type: StraightBullet, overrides : { "Radius" : 23, "LineColor" : 0xffffffff, "FillColor": 0xff000000 } }],

			]);
			
			const spriteSheetBuilder = new createjs.SpriteSheetBuilder();

			// Add frames for the parts of player

			const playerShape = DrawPlayer(5, 30, 1, "#FFFFFFFF", "#AE00FFFF");
			const crossHairShape = DrawCrossHair();
			const redBit = DrawBit("#FF0000");
			const greenBit = DrawBit("#00FF00");
			const blueBit = DrawBit("#0000FF");
			const bombBit = DrawBit("#000000");

			const PLAYER_FRAME = spriteSheetBuilder.addFrame(playerShape);
			const CROSS_HAIR_FRAME = spriteSheetBuilder.addFrame(crossHairShape);
			const RED_BIT_FRAME = spriteSheetBuilder.addFrame(redBit);
			const GREEN_BIT_FRAME = spriteSheetBuilder.addFrame(greenBit);
			const BLUE_BIT_FRAME = spriteSheetBuilder.addFrame(blueBit);
			const BOMB_BIT_FRAME = spriteSheetBuilder.addFrame(bombBit);

			spriteSheetBuilder.addAnimation("player", [PLAYER_FRAME]);
			spriteSheetBuilder.addAnimation("cross-hair", [CROSS_HAIR_FRAME]);
			spriteSheetBuilder.addAnimation("red", [RED_BIT_FRAME]);
			spriteSheetBuilder.addAnimation("green", [GREEN_BIT_FRAME]);
			spriteSheetBuilder.addAnimation("blue", [BLUE_BIT_FRAME]);
			spriteSheetBuilder.addAnimation("bomb", [BOMB_BIT_FRAME]);

			this._segmentLengths = new Map();

			// Add frames for the parts of baddies
			for (const [name, data] of baddyData.entries())
			{
				const vertexAmount = data.overrides["VertexCount"] || data.type.GetVertexCount();
				const radius = data.overrides["Radius"] || data.stats.GetRadius();
				const lineThickness = data.overrides["LineWidth"] || data.stats.GetLineWidth();
				const lineColor = data.overrides["LineColor"] || data.stats.GetLineColor();
				const fillColor = data.overrides["FillColor"] || data.stats.GetFillColor();

				// Main body
				const baddyShape = DrawBaddy(vertexAmount, radius, lineThickness, lineColor, fillColor);
				let frame = spriteSheetBuilder.addFrame(baddyShape);
				spriteSheetBuilder.addAnimation(`${name}`, [frame]);

				const angle = (360 / vertexAmount) * (Math.PI / 180);
				const p1 = new Point(Math.cos(0) * radius, Math.sin(0) * radius);
				const p2 = new Point(Math.cos(angle) * radius, Math.sin(angle) * radius);
				const d = VectorUtils.distance(p1, p2);

				// Segment
				const segmentShape = DrawBaddySegment(d, lineColor, lineThickness);
				frame = spriteSheetBuilder.addFrame(segmentShape);
				spriteSheetBuilder.addAnimation(`${name}Segment`, [frame]);

				this._segmentLengths.set(`${name}Segment`, d);
			}

			// Add frames for grid lines

			const verticalLineShape = DrawVerticalLine(0x151EC4, 0.4, 2, stage);
			const horizontalLineShape = DrawHorizontalLine(0x151EC4, 0.4, 2, stage);

			const VERTICAL_LINE = spriteSheetBuilder.addFrame(verticalLineShape);
			const HORIZONTAL_LINE = spriteSheetBuilder.addFrame(horizontalLineShape);

			spriteSheetBuilder.addAnimation("vertical-line", [VERTICAL_LINE]);
			spriteSheetBuilder.addAnimation("horizontal-line", [HORIZONTAL_LINE]);

			// Add frames for the warning signs

			const verticalWarningShape = DrawVerticalWarning(0xffff0000, 15, stage);
			const horizontalWarningShape = DrawHorizontalWarning(0xffff0000, 15, stage);

			const VERTICAL_WARNING = spriteSheetBuilder.addFrame(verticalWarningShape);
			const HORIZONTAL_WARNING = spriteSheetBuilder.addFrame(horizontalWarningShape);

			spriteSheetBuilder.addAnimation("vertical-warning", [VERTICAL_WARNING]);
			spriteSheetBuilder.addAnimation("horizontal-warning", [HORIZONTAL_WARNING]);

			// Add frames for the boss

			const angle = (360 / 5) * (Math.PI / 180);
			const p1 = new Point(Math.cos(0) * 70, Math.sin(0) * 70);
			const p2 = new Point(Math.cos(angle) * 70, Math.sin(angle) * 70);
			const d = VectorUtils.distance(p1, p2);

			const bossShape = DrawBoss(5, 70, 3, 0xffffffff, 0xff000000);
			const bossSegmentShape = DrawBaddySegment(d, 0xffffffff, 3);

			const BOSS_FRAME = spriteSheetBuilder.addFrame(bossShape);
			const BOSS_SEGMENT_FRAME = spriteSheetBuilder.addFrame(bossSegmentShape);

			spriteSheetBuilder.addAnimation("BossBossBaddy", [BOSS_FRAME]);
			spriteSheetBuilder.addAnimation("BossBossBaddySegment", [BOSS_SEGMENT_FRAME]);

			this._segmentLengths.set("BossBossBaddySegment", d);

			this._spriteSheet = spriteSheetBuilder.build();

			this._initArgs = new Map();

			this._initArgs.set("player", { regX: 30, regY: 30, snapToPixel: true });
			this._initArgs.set("cross-hair", { regX: 32, regY: 32, snapToPixel: true });
			this._initArgs.set("red", { regX: 12, regY: 12, snapToPixel: true });
			this._initArgs.set("green", { regX: 12, regY: 12, snapToPixel: true });
			this._initArgs.set("blue", { regX: 12, regY: 12, snapToPixel: true });
			this._initArgs.set("bomb", { regX: 12, regY: 12, snapToPixel: true });
			this._initArgs.set("BossBossBaddy", { regX: 70, regY: 70, snapToPixel: true });
		}

		IsReady()
		{
			return Promise.all(Array.from(document.fonts.values()).map((ff) => ff.loaded));
		}

		GetSpriteSheet()
		{
			return this._spriteSheet;
		}

		GetSprite(name)
		{
			let initArgs = this._initArgs.get(name);

			if (!initArgs)
				initArgs = { snapToPixel: true };

			const sprite = new Sprite(this._spriteSheet, name).set(initArgs);

			sprite.stop();

			const rect = sprite.getTransformedBounds();
			sprite.cache(rect.x, rect.y, rect.width * 2, rect.height * 2);

			return sprite;
		}

		ApplyInitArgs(sprite, name)
		{
			let initArgs = this._initArgs.get(name);

			if (!initArgs)
				initArgs = { snapToPixel: true };

			sprite.set(initArgs)
		}
		
		GetBitmapFromDisplayObject(displayObject, width, height, offsetX = 0, offsetY = 0, drawfunc = null)
		{
			const canvas = new OffscreenCanvas(width, height);
			const context = canvas.getContext("2d");
			
			context.save();

			if (drawfunc)
				drawfunc(canvas, context);

			context.translate(offsetX, offsetY);
			displayObject.draw(context, true);
			context.restore();

			return new Bitmap(canvas).set({ snapToPixel: true });
		}

		GetBitmapFromDisplayObjectTransformed(stage, displayObject, width, height)
		{
			const container = new Container();
			
			container.x = displayObject.x;
			container.y = displayObject.y;

			displayObject.x = displayObject.regX;
			displayObject.y = displayObject.regY;
			
			container.addChild(displayObject);
			container.cache(0, 0, width, height);
			
			const canvas = new OffscreenCanvas(width, height);
			const context = canvas.getContext("2d");

			context.drawImage(container.cacheCanvas, 0, 0);
			
			container.removeChild(displayObject);
			stage.addChild(displayObject);
			
			displayObject.x = container.x;
			displayObject.y = container.y;

			return new Bitmap(canvas);
		}

		GetSegmentLength(name)
		{
			return this._segmentLengths.get(name);
		}
	}

    window.DynamicGraphics = new DynamicGraphics();
}

function DrawBit(color)
{
	const radius = 12;
	const lineThickness = 1;

	const shape = new Shape();
	
	shape.graphics.clear()
		.beginStroke("white")
		.beginFill(color)
		.drawCircle(radius + lineThickness, radius + lineThickness, radius);
	
	shape.setBounds(0, 0, (radius * 2) + lineThickness, (radius * 2) + lineThickness);

	return shape;
}

function DrawCrossHair()
{
	const radius = 30;
	const lineThickness = 2;
	const color = 0xff0000;

	const shape = ShapeUtils.createCircle(radius, radius + lineThickness, radius + lineThickness, lineThickness, color, 0x000000, 1, 0);

	// Horizontal line
	let begin = new Point(0, radius);
	let end = new Point((radius * 2), radius);

	begin.x += lineThickness;
	begin.y += lineThickness;

	end.x += lineThickness;
	end.y += lineThickness;

	ShapeUtils.drawLine(shape, begin, end, lineThickness, color);
	
	// Vertical line
	begin = new Point(radius, 0);
	end = new Point(radius, (radius *  2), radius);

	begin.x += lineThickness;
	begin.y += lineThickness;

	end.x += lineThickness;
	end.y += lineThickness;

	ShapeUtils.drawLine(shape, begin, end, lineThickness, color);

	shape.setBounds(0, 0, radius * 2 + lineThickness, radius * 2 + lineThickness);

	return shape;
}

function DrawPlayer(vertexAmount, radius, lineThickness, lineColor, fillColor)
{
	const startRadius = radius;
	const vertexes = [];
	const innerVertexes = [];
	const starAngle = (360 / vertexAmount) * (Math.PI / 180);
	
	const shape = new Shape();

	for(let i = 0; i < vertexAmount; i++)
	{
		const tmpX = Math.cos(starAngle * i) * radius;
		const tmpY = Math.sin(starAngle * i) * radius;
		
		vertexes.push(new Point(tmpX, tmpY));
	}

	shape.graphics.setStrokeStyle(lineThickness);
	shape.graphics.beginStroke(lineColor);
	shape.graphics.beginFill(fillColor);
	
	for (let i = 0; i < vertexAmount; i++)
	{
		const size = startRadius;

		shape.graphics.moveTo(vertexes[i].x + size, vertexes[i].y + size);
		
		if (i === vertexAmount - 2)
		{
			shape.graphics.lineTo(vertexes[0].x + size, vertexes[0].y + size);
		}
		else if (i === vertexAmount - 1)
		{
			shape.graphics.lineTo(vertexes[1].x + size, vertexes[1].y + size);
		}
		else
		{
			shape.graphics.lineTo(vertexes[i + 2].x + size, vertexes[i + 2].y + size);
		}
	}
	
	shape.graphics.endStroke();
	shape.graphics.endFill();
	
	radius = (radius / Math.sin(126 * (Math.PI / 180)))*(Math.sin(18 * (Math.PI / 180)));
	
	for (let i = 0; i < vertexAmount; i++)
	{
		const tmpX = Math.cos((starAngle * i) + (starAngle / 2)) * radius;
		const tmpY = Math.sin((starAngle * i) + (starAngle / 2)) * radius;
		
		innerVertexes.push(new Point(tmpX, tmpY));
	}
	
	const size = startRadius;

	shape.graphics.setStrokeStyle(lineThickness);
	shape.graphics.beginStroke(lineColor);
	shape.graphics.beginFill(fillColor);
	shape.graphics.moveTo(innerVertexes[0].x + size, innerVertexes[0].y + size);
	
	for (let i = 0; i < vertexAmount; i++)
	{
		if (i !== vertexAmount - 1)
		{
			shape.graphics.lineTo(innerVertexes[i + 1].x + size, innerVertexes[i + 1].y + size);
		}
		else
		{
			shape.graphics.lineTo(innerVertexes[0].x + size, innerVertexes[0].y + size);
		}
	}
	
	shape.graphics.endStroke();
	shape.graphics.endFill();

	shape.setBounds(0, 0, startRadius * 2, startRadius * 2);

	return shape;
}

function DrawBaddy(vertexCount, radius, lineWidth, lineColor, fillColor)
{
	const vertexes = [];
	const shapeAngle = (360 / vertexCount) * (Math.PI / 180);

	for (let i = 0; i < vertexCount; i++)
	{
		const tmpX = Math.cos(shapeAngle * i) * radius;
		const tmpY = Math.sin(shapeAngle * i) * radius;
		
		vertexes.push(new Point(tmpX, tmpY));
	}

	const shape = new Shape();

	shape.graphics.lineStyle(lineWidth, lineColor);
	shape.graphics.beginFill(fillColor);
	
	// Moving the pen to the first vertex
	shape.graphics.moveTo(vertexes[0].x + radius, vertexes[0].y + radius);
	
	for (let i = 0; i < vertexCount; i++)
	{
		// Last vertex is drawn slightly different, that is why we have this IF statement
		if (i !== vertexCount - 1)
		{
			// Drawing from current vertex to next vertex
			shape.graphics.lineTo(vertexes[i + 1].x + radius, vertexes[i + 1].y + radius);
		}
		else
		{
			// Drawing from last vertex to first vertex to complete the shape
			shape.graphics.lineTo(vertexes[0].x + radius, vertexes[0].y + radius);
		}
	}

	shape.graphics.endFill();
	shape.graphics.endStroke();

	const margin = 8;

	shape.setBounds(-margin, -margin, (radius * 2) + (margin *  2), (radius * 2) + (margin *  2));
	shape.cache(-margin, -margin, (radius * 2) + (margin *  2), (radius * 2) + (margin *  2));

	return shape;
}

function DrawBaddySegment(lineLength, lineColor, lineWidth)
{
	const shape = new Shape();

	shape.graphics.clear();
	shape.graphics.lineStyle(lineWidth, lineColor);

	shape.graphics.moveTo(0, lineWidth);
	shape.graphics.lineTo(lineLength, lineWidth);
	shape.graphics.endStroke();

	shape.setBounds(0, 0, lineLength, lineWidth);
	shape.cache(0, 0, lineLength, lineWidth);

	return shape;
}

function DrawVerticalLine(color, alpha, lineWidth, stage)
{
	const shape = new Shape();

	ShapeUtils.drawLine(shape, new Point(0, 0), new Point(0, stage.stageHeight), lineWidth, color, alpha);

	shape.setBounds(0, 0, lineWidth, stage.stageHeight);
	shape.cache(0, 0, lineWidth, stage.stageHeight);

	return shape;
}

function DrawHorizontalLine(color, alpha, lineWidth, stage)
{
	const shape = new Shape();

	ShapeUtils.drawLine(shape, new Point(0, 0), new Point(stage.stageWidth, 0), lineWidth, color, alpha);

	shape.setBounds(0, 0, stage.stageWidth, lineWidth);
	shape.cache(0, 0, stage.stageWidth, lineWidth);

	return shape;
}

function DrawVerticalWarning(color, width, stage)
{
	const shape = ShapeUtils.createRectangle(0, 0, width, stage.stageHeight, 1, color, color);

	shape.setBounds(0, 0, width, stage.stageHeight);
	shape.cache(0, 0, width, stage.stageHeight);

	return shape;
}

function DrawHorizontalWarning(color, width, stage)
{
	const shape = ShapeUtils.createRectangle(0, 0, stage.stageWidth, width, 1, color, color);

	shape.setBounds(0, 0, stage.stageWidth, width);
	shape.cache(0, 0, stage.stageWidth, width);

	return shape;
}

function DrawBoss(vertexAmount, radius, lineThickness, lineColor, fillColor)
{
	const startRadius = radius;
	const vertexes = [];
	const innerVertexes = [];
	const starAngle = (360 / vertexAmount) * (Math.PI / 180);
	const size = startRadius;

	for (let i = 0; i < vertexAmount; i++)
	{
		const tmpX = Math.cos(starAngle * i) * radius;
		const tmpY = Math.sin(starAngle * i) * radius;
		
		vertexes.push(new Point(tmpX, tmpY));
	}

	const shape = new Shape();

	shape.graphics.lineStyle(lineThickness, lineColor);
	shape.graphics.beginFill(fillColor);
	
	for (let i = 0; i < vertexAmount; i++)
	{
		shape.graphics.moveTo(vertexes[i].x + size, vertexes[i].y + size);
		
		if (i === vertexAmount - 2)
		{
			shape.graphics.lineTo(vertexes[0].x + size, vertexes[0].y + size);
		}
		else if (i === vertexAmount - 1)
		{
			shape.graphics.lineTo(vertexes[1].x + size, vertexes[1].y + size);
		}
		else
		{
			shape.graphics.lineTo(vertexes[i + 2].x + size, vertexes[i + 2].y + size);
		}
	}

	shape.graphics.endFill();
	
	// From here on, comes the drawing of the inner shape that is formed when drawing a pentagram.
	// I do it this way because Flash's drawing Api doesn't like coloring non-convex polygons,
	// and because I need the radius of the inner shape.
	radius = (radius / Math.sin(126 * (Math.PI / 180))) * (Math.sin(18 * (Math.PI / 180)));
	
	let tmpX, tmpY;
	
	for (let i = 0; i < vertexAmount; i++)
	{
		tmpX = Math.cos((starAngle * i) + (starAngle / 2)) * radius;
		tmpY = Math.sin((starAngle * i) + (starAngle / 2)) * radius;
		
		innerVertexes.push(new Point(tmpX, tmpY));
	}
	
	shape.graphics.lineStyle(lineThickness, lineColor);
	shape.graphics.beginFill(fillColor);
	shape.graphics.moveTo(innerVertexes[0].x + size, innerVertexes[0].y + size);
	
	for (let i = 0; i < vertexAmount; i++)
	{
		if (i !== vertexAmount - 1)
		{
			shape.graphics.lineTo(innerVertexes[i + 1].x + size, innerVertexes[i + 1].y + size);
		}
		else
		{
			shape.graphics.lineTo(innerVertexes[0].x + size, innerVertexes[0].y + size);
		}
	}

	shape.graphics.endFill();

	shape.setBounds(0, 0, startRadius * 2, startRadius * 2);

	return shape;
}