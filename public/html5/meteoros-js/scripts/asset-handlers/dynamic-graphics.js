"use strict"

{
	const FACTORY_SPIKES		  	= 3;
	const CRACKED_DOME_SPIKES		= 9;
	const CRACK_DEVIATION_ANGLE 	= 30;
	const LEAF_DEVIATION_ANGLE  	= 45;
	const DOME_START_ANGLE   		= Math.PI;
	const DOME_END_ANGLE     		= 0;

	const BOTTOM_CITY_BASE_LENGTH 		= 150;
	const BOTTOM_CITY_BASE_HEIGTH 		= 10;
	const TALL_BUILDING_DOME_DISTANCE 	= Math.floor(BOTTOM_CITY_BASE_HEIGTH * 2);
	const TOP_CITY_BASE_LENGTH	    	= Math.floor(BOTTOM_CITY_BASE_LENGTH - 15);
	const TOP_CITY_BASE_HEIGTH	    	= Math.floor(BOTTOM_CITY_BASE_HEIGTH);
	const MAIN_BUILDING_LENGTH	    	= Math.floor(TOP_CITY_BASE_LENGTH / 6);
	const MAIN_BUILDING_HEIGHT	    	= Math.floor(TOP_CITY_BASE_LENGTH / 2 - TALL_BUILDING_DOME_DISTANCE);
	const CRACK_LENGTH 			    	= Math.floor((TOP_CITY_BASE_LENGTH / 2) / 5);

	const DOME_OFFSET = new Point(0, -BOTTOM_CITY_BASE_HEIGTH);
	const CRACK_ANGLE_DIFFERENCE = DOME_START_ANGLE - DOME_END_ANGLE;
	const CRACK_ANGLE_STEP 		 = CRACK_ANGLE_DIFFERENCE / CRACKED_DOME_SPIKES;
	
	let CURRENT_CRACK_LOCATIONS = null;

    class DynamicGraphics
	{
		constructor()
		{
			
		}
		
		Init(stage)
		{
			const spriteSheetBuilder = new createjs.SpriteSheetBuilder();

			_AddFrame("bases", spriteSheetBuilder, _CreateShape(Bases));
			_AddFrame("dome", spriteSheetBuilder, _CreateShape(Dome));

			_AddFrame("destroyed-dome-0", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-1", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-2", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-3", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-4", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-5", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-6", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-7", spriteSheetBuilder, _CreateShape(DestroyedDome));
			_AddFrame("destroyed-dome-8", spriteSheetBuilder, _CreateShape(DestroyedDome));

			_AddFrame("city-center-0", spriteSheetBuilder, _CreateShape(ShortMainBuilding));
			_AddFrame("city-center-1", spriteSheetBuilder, _CreateShape(HighMainBuilding));

			_AddFrame("city-left-0", spriteSheetBuilder, _CreateShape(LeftSmallBuildings));
			_AddFrame("city-left-1", spriteSheetBuilder, _CreateShape(LeftFactory));
			_AddFrame("city-left-2", spriteSheetBuilder, _CreateShape(LeftTree));
			_AddFrame("city-left-3", spriteSheetBuilder, _CreateShape(LeftShortBuilding));
			
			_AddFrame("city-right-0", spriteSheetBuilder, _CreateShape(RightSmallBuildings));
			_AddFrame("city-right-1", spriteSheetBuilder, _CreateShape(RightFactory));
			_AddFrame("city-right-2", spriteSheetBuilder, _CreateShape(RightTree));
			_AddFrame("city-right-3", spriteSheetBuilder, _CreateShape(RightShortBuilding));
			
			_AddDomeCrackFrames("cracks-0", spriteSheetBuilder);
			_AddDomeCrackFrames("cracks-1", spriteSheetBuilder);
			_AddDomeCrackFrames("cracks-2", spriteSheetBuilder);
			_AddDomeCrackFrames("cracks-3", spriteSheetBuilder);
			_AddDomeCrackFrames("cracks-4", spriteSheetBuilder);

			_AddFrame("arrow-pointer", spriteSheetBuilder, _CreateShape(ArrowPointer));
			_AddFrame("cross-hair", spriteSheetBuilder, _CreateShape(CrossHair));

			_AddFrame("crown-icon", spriteSheetBuilder, _CreateShape(CrownIcon));
			_AddFrame("guy-icon", spriteSheetBuilder, _CreateShape(GuyIcon, 0x81A8F0));
			_AddFrame("guy-mutant-icon", spriteSheetBuilder, _CreateShape(GuyIcon, 0x06C406));
			_AddFrame("gal-icon", spriteSheetBuilder, _CreateShape(GalIcon, 0xF081D4));
			_AddFrame("gal-mutant-icon", spriteSheetBuilder, _CreateShape(GalIcon, 0x06C406));

			_AddFrame("missile", spriteSheetBuilder, _CreateShape(Missile));
			_AddFrame("missile-launcher", spriteSheetBuilder, _CreateShape(MissileLauncher));
			_AddFrame("shooting-height", spriteSheetBuilder, _CreateShape(ShootingHeight));

			// Regular meteor set
			_AddMeteorFramesSet("meteor", spriteSheetBuilder, 20, 6, 3, 0xffffff);

			// Small HP meteor sets
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 20, 5, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 15, 5, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 10, 5, 2, 0xffff00);
			 
			// Large HP meteor sets
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 50, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 48, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 45, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 42, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 38, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 35, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 32, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 30, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 28, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 25, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 22, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 20, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 18, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 15, 8, 2, 0xffff00);
			_AddMeteorFramesSet("meteor-hp", spriteSheetBuilder, 12, 8, 2, 0xffff00);

			// Meteor parabolic set
			_AddMeteorFramesSet("meteor", spriteSheetBuilder, 10, 5, 2, 0xffffff);

			// Meteor split parabolic set
			_AddMeteorFramesSet("meteor", spriteSheetBuilder, 20, 8, 7, 0x5891ed);

			// Meteor split straight set
			_AddMeteorFramesSet("meteor", spriteSheetBuilder, 20, 8, 7, 0xE64C77);

			// Meteor chunck set
			_AddMeteorFramesSet("meteor", spriteSheetBuilder, 10, 6, 3, 0xffffff);

			// Bomb
			_AddFrame("bomb", spriteSheetBuilder, _CreateShape(Bomb));

			// Ufos
			_AddFrame("ufo-3-5-0x00ff00-no-shield", spriteSheetBuilder, _CreateShape(UfoNoShield, 3, 5, 0x00ff00));
			_AddFrame("ufo-3-5-0x00ff00-shield", spriteSheetBuilder, _CreateShape(UfoShield, 3, 5, 0x00ff00));

			_AddFrame("ufo-3-5-0xffff00-no-shield", spriteSheetBuilder, _CreateShape(UfoNoShield, 3, 5, 0xffff00));
			_AddFrame("ufo-3-5-0xffff00-shield", spriteSheetBuilder, _CreateShape(UfoShield, 3, 5, 0xffff00));

			_AddFrame("ufo-3-5-0x00ffff-no-shield", spriteSheetBuilder, _CreateShape(UfoNoShield, 3, 5, 0x00ffff));
			_AddFrame("ufo-3-5-0x00ffff-shield", spriteSheetBuilder, _CreateShape(UfoShield, 3, 5, 0x00ffff));

			_AddFrame("ufo-3-5-0xff0000-no-shield", spriteSheetBuilder, _CreateShape(UfoNoShield, 3, 5, 0xff0000));
			_AddFrame("ufo-3-5-0xff0000-shield", spriteSheetBuilder, _CreateShape(UfoShield, 3, 5, 0xff0000));

			this._spriteSheet = spriteSheetBuilder.build();
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
			const sprite = new Sprite(this._spriteSheet, name).set({ snapToPixel: true });

			sprite.stop();

			const rect = sprite.getTransformedBounds();
			sprite.cache(rect.x, rect.y, rect.width * 2, rect.height * 2);

			return sprite;
		}

		GetMeteorSprite(id, r, vc, vo, c)
		{
			const i = NumberUtils.randRange(0, 8, true);
			const color = (c).toString(16).padStart(6, "0");

			return this.GetSprite(`${id}-${i}-${r}-${vc}-${vo}-0x${color}`);
		}

		GetUfoSprite(pieces, pieceRadius, c, shield)
		{
			const s = shield ? "shield" : "no-shield";
			const color = (c).toString(16).padStart(6, "0");

			return this.GetSprite(`ufo-${pieces}-${pieceRadius}-0x${color}-${s}`);
		}

		GetDestroyedDomeSprite(i)
		{
			return this.GetSprite(`destroyed-dome-${i}`);
		}
	}

	const ls = [];
	const ts = [];
	const rs = [];
	const bs = [];

	function _AddBoundingRect(shape, rect)
	{
		ls.push(rect.x);
		ts.push(rect.y);
		rs.push(rect.x + rect.width);
		bs.push(rect.y + rect.height);
	}

	function _AddBoundingPoint(shape, x, y)
	{
		ls.push(x);
		ts.push(y);
		rs.push(x);
		bs.push(y);
	}

	function _DrawRectangle(shape, x, y, w, h, lw, lc, fc)
	{
		ShapeUtils.drawRectangle(shape, x, y, w, h, lw, lc, fc);

		ls.push(x);
		ts.push(y);
		
		rs.push(x + w);
		bs.push(y + h);
	}

	function _DrawCircle(shape, radius, x, y, lineThickness, color, fillAlpha, lineAlpha)
	{
		if (!lineThickness)
			lineThickness = 1;

		ShapeUtils.drawCircle(shape, radius, x, y, lineThickness, color, 0x000000, fillAlpha, lineAlpha);

		ls.push(x - radius - lineThickness);
		ts.push(y - radius - lineThickness);
		
		rs.push(x + radius + lineThickness);
		bs.push(y + radius + lineThickness);
	}

	function _DrawLine(shape, begin, end, lineThickness, color, smooth = false)
	{
		ShapeUtils.drawLine(shape, begin, end, lineThickness, color, 1.0, smooth);
		
		const l = Math.min(begin.x, end.x);
		const t = Math.min(begin.y, end.y);

		if (!lineThickness)
			lineThickness = 1;

		ls.push(l - lineThickness);
		ts.push(t - lineThickness);

		rs.push(l + (Math.max(begin.x, end.x) - l) + lineThickness);
		bs.push(t + (Math.max(begin.y, end.y) - t) + lineThickness);
	}

	function _DrawArc(shape, center, startAngle, endAngle, radius, lineThickness, color)
	{
		ShapeUtils.drawArc(shape, center, startAngle, endAngle, radius, 1, lineThickness, color);

		ls.push(center.x - Math.abs(radius));
		ts.push(center.y - Math.abs(radius));
		
		rs.push(center.x + Math.abs(radius));
		bs.push(center.y + Math.abs(radius));
	}

	function _DrawPath(shape, vertexes, lineThickness, color, alpha, fillColor, fillAlpha)
	{
		ShapeUtils.drawPath(shape, vertexes, lineThickness, color, alpha, fillColor, fillAlpha);

		for (const vertex of vertexes)
		{
			ls.push(vertex.x);
			ts.push(vertex.y);
			rs.push(vertex.x);
			bs.push(vertex.y);
		}
	}

	function _GetLatestRectangle()
	{
		const l = Math.min(...ls);
		const t = Math.min(...ts);
		const r = Math.max(...rs);
		const b = Math.max(...bs);

		return { x: l, y: t, width: r - l, height: b - t };
	}

	function _SetBounds(shape)
	{
		const r = _GetLatestRectangle();
		
		// ShapeUtils.drawRectangleEx(shape, r.x, r.y, r.width, r.height, 1, 0xff0000);
		
		shape.setBounds(r.x, r.y, r.width, r.height);
		shape.boundsSet = true;

		ls.length = 0;
		ts.length = 0;
		rs.length = 0;
		bs.length = 0;

		return r;
	}

	function _AddMeteorFramesSet(type, spriteSheetBuilder, radius, vertexCount, vertexOffset, c)
	{
		const color = (c).toString(16).padStart(6, "0").toLowerCase();

		for (let i = 0; i <= 8; i++)
		{
			const id = `${type}-${i}-${radius}-${vertexCount}-${vertexOffset}-0x${color}`;

			_AddFrame(id, spriteSheetBuilder, _CreateShape(Meteor, radius, vertexCount, vertexOffset, c));
		}
	}

	function _AddFrame(id, spriteSheetBuilder, shape)
	{
		// Default bounding size
		if (!shape.boundsSet)
			_SetBounds(shape);

		spriteSheetBuilder.addAnimation(id, [spriteSheetBuilder.addFrame(shape)]);
	}

	function _AddDomeCrackFrames(id, spriteSheetBuilder)
	{
		CURRENT_CRACK_LOCATIONS = [];

		for (let i = 1; i < CRACKED_DOME_SPIKES; i++)
		{
			CURRENT_CRACK_LOCATIONS[i] = new Point();
			CURRENT_CRACK_LOCATIONS[i].x = DOME_OFFSET.x + Math.cos(DOME_START_ANGLE + (CRACK_ANGLE_STEP * i)) * TOP_CITY_BASE_LENGTH / 2;
			CURRENT_CRACK_LOCATIONS[i].y = DOME_OFFSET.y + Math.sin(DOME_START_ANGLE + (CRACK_ANGLE_STEP * i)) * TOP_CITY_BASE_LENGTH / 2;
		}

		const shape1 = _CreateShape(Cracks);
		_AddBoundingRect(shape1, _SetBounds(shape1));

		const shape2 = Cracks(shape1.clone(true));
		_AddBoundingRect(shape2, _SetBounds(shape2));

		const shape3 = Cracks(shape2.clone(true));
		_SetBounds(shape3);

		_AddFrame(`${id}-0`, spriteSheetBuilder, shape1);
		_AddFrame(`${id}-1`, spriteSheetBuilder, shape2);
		_AddFrame(`${id}-2`, spriteSheetBuilder, shape3);
	}

	function _CreateShape(f, ...args)
	{
		const shape = new Shape();

		f(shape, ...args);

		return shape;
	}

	function Dome(shape)
	{
		_DrawArc(
			shape,
			DOME_OFFSET,
			DOME_START_ANGLE,
			DOME_END_ANGLE,
			TOP_CITY_BASE_LENGTH / 2
		);
	}

	function DestroyedDome(shape)
	{
		const CRACKED_LOCATIONS = [];
		const CRACKED_DOME_SPIKES = 9;
		const CRACK_ANGLE_STEP = CRACK_ANGLE_DIFFERENCE / CRACKED_DOME_SPIKES;

		for (let i = 1; i < CRACKED_DOME_SPIKES; i++)
		{
			CRACKED_LOCATIONS[i] = new Point();
			CRACKED_LOCATIONS[i].x = DOME_OFFSET.x + Math.cos(DOME_START_ANGLE + (CRACK_ANGLE_STEP * i)) * TOP_CITY_BASE_LENGTH / 2;
			CRACKED_LOCATIONS[i].y = DOME_OFFSET.y + Math.sin(DOME_START_ANGLE + (CRACK_ANGLE_STEP * i)) * TOP_CITY_BASE_LENGTH / 2;
		}
		
		const FIRST_CRACK_POINT = CRACKED_LOCATIONS[1].clone();
		const LAST_CRACK_POINT  = CRACKED_LOCATIONS[CRACKED_DOME_SPIKES - 1].clone();

		// Cracked Dome Edges
		let currentStartDomeAngle = TrigUtils.calcAngleAtan2(DOME_OFFSET.x, DOME_OFFSET.y, FIRST_CRACK_POINT.x, FIRST_CRACK_POINT.y);
		ShapeUtils.drawArc(shape, DOME_OFFSET, DOME_START_ANGLE, Math.PI + currentStartDomeAngle, TOP_CITY_BASE_LENGTH / 2, 1);
		
		currentStartDomeAngle = TrigUtils.calcAngleAtan2(DOME_OFFSET.x, DOME_OFFSET.y, LAST_CRACK_POINT.x, LAST_CRACK_POINT.y);
		ShapeUtils.drawArc(shape, DOME_OFFSET, currentStartDomeAngle - Math.PI, 0, TOP_CITY_BASE_LENGTH / 2, 1);
		
		// Cracked Dome Middle
		let domeLenght = LAST_CRACK_POINT.x - FIRST_CRACK_POINT.x;
		let vertexDistance = domeLenght / CRACKED_DOME_SPIKES;
		
		let vertexes = [];
		let randomness = vertexDistance / NumberUtils.randRange(8, 10, true);
		
		for (let i = 0; i < CRACKED_DOME_SPIKES; i++)
		{
			vertexes.push(new Point());
			
			vertexes[vertexes.length - 1].x = FIRST_CRACK_POINT.x + (vertexDistance*(i + 1)) + NumberUtils.randRange(-randomness, randomness, true);
			
			if (i % 2 === 0)
			{
				vertexes[vertexes.length - 1].y = FIRST_CRACK_POINT.y + BOTTOM_CITY_BASE_HEIGTH + NumberUtils.randRange(-randomness, randomness, true);
			}
			else
			{
				vertexes[vertexes.length - 1].y = FIRST_CRACK_POINT.y - BOTTOM_CITY_BASE_HEIGTH + NumberUtils.randRange(-randomness, randomness, true);
			}
		}
		
		vertexes.unshift(FIRST_CRACK_POINT);
		vertexes.push(LAST_CRACK_POINT);
		
		_AddBoundingPoint(shape, DOME_OFFSET.x - (TOP_CITY_BASE_LENGTH / 2), DOME_OFFSET.y);
		_AddBoundingPoint(shape, DOME_OFFSET.x + (TOP_CITY_BASE_LENGTH / 2), DOME_OFFSET.y);

		_DrawLine(shape, vertexes[0], vertexes[1]);
		
		for (let i = 1; i < vertexes.length - 1; i++)
			_DrawLine(shape, vertexes[i], vertexes[i + 1]);
	}

	function Cracks(shape)
	{
		for (let i = 1; i < CURRENT_CRACK_LOCATIONS.length; i++)
		{
			// Main Crack
			let crackRandomAngle = (NumberUtils.randRange(0, CRACK_DEVIATION_ANGLE, true) * NumberUtils.RADIAN_UNIT);
			crackRandomAngle = NumberUtils.randPair(crackRandomAngle, -crackRandomAngle, 0.5);
			
			let currentCrackAngle = TrigUtils.calcAngleAtan2(DOME_OFFSET.x, DOME_OFFSET.y, CURRENT_CRACK_LOCATIONS[i].x, CURRENT_CRACK_LOCATIONS[i].y);
			currentCrackAngle += crackRandomAngle;
			
			let crackEndPoint = new Point();
			
			crackEndPoint.x = CURRENT_CRACK_LOCATIONS[i].x + Math.cos(currentCrackAngle) * CRACK_LENGTH;
			crackEndPoint.y = CURRENT_CRACK_LOCATIONS[i].y + Math.sin(currentCrackAngle) * CRACK_LENGTH;

			if (crackEndPoint.y < -TOP_CITY_BASE_HEIGTH - BOTTOM_CITY_BASE_HEIGTH)
			{
				_DrawLine(shape, CURRENT_CRACK_LOCATIONS[i], crackEndPoint);
			}
			
			// Leaf Crack
			// 40% chance of getting a leaf crack
			let leafCrackEndPoint = null;
			
			if (Math.random() < 0.3)
			{
				crackRandomAngle =  LEAF_DEVIATION_ANGLE * NumberUtils.RADIAN_UNIT;
				crackRandomAngle = NumberUtils.randPair(crackRandomAngle, -crackRandomAngle, 0.5);
				
				let leafCrackEndPoint = new Point();
				leafCrackEndPoint.x = CURRENT_CRACK_LOCATIONS[i].x + Math.cos(currentCrackAngle + crackRandomAngle) * CRACK_LENGTH;
				leafCrackEndPoint.y = CURRENT_CRACK_LOCATIONS[i].y + Math.sin(currentCrackAngle + crackRandomAngle) * CRACK_LENGTH;

				if (leafCrackEndPoint.y < -TOP_CITY_BASE_HEIGTH - BOTTOM_CITY_BASE_HEIGTH)
				{
					_DrawLine(shape, CURRENT_CRACK_LOCATIONS[i], leafCrackEndPoint);
				}
			}
			
			// Setting next crack starting point
			
			if (Math.random() < 0.5)
			{
				CURRENT_CRACK_LOCATIONS[i].x = crackEndPoint.x;
				CURRENT_CRACK_LOCATIONS[i].y = crackEndPoint.y;
			}
			else
			{
				if (leafCrackEndPoint)
				{
					CURRENT_CRACK_LOCATIONS[i].x = leafCrackEndPoint.x;
					CURRENT_CRACK_LOCATIONS[i].y = leafCrackEndPoint.y;
				}
				else
				{
					CURRENT_CRACK_LOCATIONS[i].x = crackEndPoint.x;
					CURRENT_CRACK_LOCATIONS[i].y = crackEndPoint.y;
				}
			}
		}

		return shape;
	}

	function Bases(shape)
	{
		_DrawRectangle(
			shape,
			-BOTTOM_CITY_BASE_LENGTH / 2,
			-BOTTOM_CITY_BASE_HEIGTH,
			BOTTOM_CITY_BASE_LENGTH,
			BOTTOM_CITY_BASE_HEIGTH
		);

		_DrawRectangle(
			shape,
			-TOP_CITY_BASE_LENGTH / 2,
			-TOP_CITY_BASE_HEIGTH - BOTTOM_CITY_BASE_HEIGTH,
			TOP_CITY_BASE_LENGTH,
			TOP_CITY_BASE_HEIGTH
		);
		
		_DrawRectangle(
			shape,
			-BOTTOM_CITY_BASE_LENGTH / 2,
			1,
			BOTTOM_CITY_BASE_LENGTH,
			BOTTOM_CITY_BASE_HEIGTH * 4,
			1,
			0x000000,
			0x000000
		);
	}

	function ShortMainBuilding(shape)
	{
		_DrawRectangle(
			shape,
			-MAIN_BUILDING_LENGTH / 2,
			-BOTTOM_CITY_BASE_HEIGTH * 2 - MAIN_BUILDING_HEIGHT,
			MAIN_BUILDING_LENGTH,
			MAIN_BUILDING_HEIGHT,
			1,
			0xffffff,
			0x000000,
			1.0
		);
	}
	
	function HighMainBuilding(shape)
	{
		ShortMainBuilding(shape);
		
		_DrawRectangle(
			shape,
			-MAIN_BUILDING_LENGTH / 4,
			-MAIN_BUILDING_HEIGHT - (BOTTOM_CITY_BASE_HEIGTH * 2) - TALL_BUILDING_DOME_DISTANCE / 4,
			(MAIN_BUILDING_LENGTH / 2) + 1,
			TALL_BUILDING_DOME_DISTANCE / 4,
			1,
			0xffffff,
			0x000000,
			1.0
		);
	}
	
	function LeftSmallBuildings(shape)
	{
		_DrawRectangle(
			shape,
			-(MAIN_BUILDING_LENGTH / 2 + MAIN_BUILDING_LENGTH),
			-BOTTOM_CITY_BASE_HEIGTH * 2 - (MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3)),
			MAIN_BUILDING_LENGTH,
			(MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3))
		);
		
		_DrawRectangle(
			shape,
			-(MAIN_BUILDING_LENGTH / 2 + MAIN_BUILDING_LENGTH * 2),
			-BOTTOM_CITY_BASE_HEIGTH * 2 - (MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3) * 2),
			MAIN_BUILDING_LENGTH,
			(MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3) * 2)
		);
	}

	function LeftShortBuilding(shape)
	{
		let xOffset = (MAIN_BUILDING_LENGTH / 2) + (MAIN_BUILDING_LENGTH * 2);
		let yOffset = BOTTOM_CITY_BASE_HEIGTH * 2;
		
		_DrawRectangle(
			shape,
			-xOffset,
			-yOffset - MAIN_BUILDING_HEIGHT / 2,
			(MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4),
			MAIN_BUILDING_HEIGHT / 2
		);

		return new Point(xOffset, yOffset);
	}

	function LeftFactory(shape)
	{
		let offSet = LeftShortBuilding(shape, false);
		
		offSet.x -= ((MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4)) / 2;
		offSet.y += MAIN_BUILDING_HEIGHT / 2 + TALL_BUILDING_DOME_DISTANCE / 4;
		
		_DrawRectangle(
			shape,
			-offSet.x,
			-offSet.y,
			((MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4)) / 2,
			TALL_BUILDING_DOME_DISTANCE / 4
		);
		
		offSet.x -= ((MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4)) / 2 - (MAIN_BUILDING_LENGTH / 4) * 2;
		
		_DrawRectangle(
			shape,
			-offSet.x,
			-offSet.y - (TALL_BUILDING_DOME_DISTANCE / 4) * 3,
			TALL_BUILDING_DOME_DISTANCE / 4,
			(TALL_BUILDING_DOME_DISTANCE / 4) * 3
		);
	}
	
	function LeftTree(shape)
	{
		_DrawRectangle(
			shape,
			-(MAIN_BUILDING_LENGTH + MAIN_BUILDING_LENGTH / 4),
			-BOTTOM_CITY_BASE_HEIGTH * 2 - TALL_BUILDING_DOME_DISTANCE,
			TALL_BUILDING_DOME_DISTANCE / 3,
			TALL_BUILDING_DOME_DISTANCE
		);
		
		_DrawCircle(
			shape,
			TOP_CITY_BASE_LENGTH / 15,
			-(MAIN_BUILDING_LENGTH + MAIN_BUILDING_LENGTH / 4 - TALL_BUILDING_DOME_DISTANCE / 5),
			-(BOTTOM_CITY_BASE_HEIGTH * 2 + TALL_BUILDING_DOME_DISTANCE)
		);
		
		_DrawRectangle(
			shape,
			-(MAIN_BUILDING_LENGTH * 2 + MAIN_BUILDING_LENGTH / 4),
			-BOTTOM_CITY_BASE_HEIGTH * 2 - TALL_BUILDING_DOME_DISTANCE,
			TALL_BUILDING_DOME_DISTANCE / 3,
			TALL_BUILDING_DOME_DISTANCE
		);
		
		_DrawCircle(
			shape,
			TOP_CITY_BASE_LENGTH / 15,
			-(MAIN_BUILDING_LENGTH * 2 + MAIN_BUILDING_LENGTH / 4 - TALL_BUILDING_DOME_DISTANCE / 5),
			-(BOTTOM_CITY_BASE_HEIGTH * 2 + TALL_BUILDING_DOME_DISTANCE)
		);
	}

	function RightSmallBuildings(shape)
	{
		_DrawRectangle(
			shape,
			MAIN_BUILDING_LENGTH / 2,
			-BOTTOM_CITY_BASE_HEIGTH * 2 - (MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3)),
			MAIN_BUILDING_LENGTH,
			(MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3))
		);
		
		_DrawRectangle(
			shape,
			MAIN_BUILDING_LENGTH / 2 + MAIN_BUILDING_LENGTH,
			-BOTTOM_CITY_BASE_HEIGTH * 2 - (MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3) * 2),
			MAIN_BUILDING_LENGTH,
			(MAIN_BUILDING_HEIGHT - (MAIN_BUILDING_HEIGHT / 3) * 2)
		);
	}

	function RightShortBuilding(shape)
	{
		let xOffset = (MAIN_BUILDING_LENGTH / 2) + (MAIN_BUILDING_LENGTH / 4);
		let yOffset = -BOTTOM_CITY_BASE_HEIGTH * 2;
		
		_DrawRectangle(
			shape,
			xOffset,
			yOffset - MAIN_BUILDING_HEIGHT / 2,
			(MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4),
			MAIN_BUILDING_HEIGHT / 2
		);

		return new Point(xOffset, yOffset);
	}
	
	function RightFactory(shape)
	{
		let offSet = RightShortBuilding(shape);
		
		let beginPoint = new Point();
		let endPoint = new Point();
		let segmentLength = ((MAIN_BUILDING_LENGTH * 2) - (MAIN_BUILDING_LENGTH / 4)) / FACTORY_SPIKES;
		
		for (let i = 0; i < FACTORY_SPIKES; i++)
		{
			beginPoint.x = offSet.x + (segmentLength * i);
			beginPoint.y = offSet.y - MAIN_BUILDING_HEIGHT / 2;

			endPoint.x = offSet.x + (segmentLength * i);
			endPoint.y = beginPoint.y - segmentLength;

			_DrawLine(shape, beginPoint, endPoint);
			
			beginPoint.x = offSet.x + (segmentLength * (i + 1));
			beginPoint.y = offSet.y - MAIN_BUILDING_HEIGHT / 2;
			
			_DrawLine(shape, beginPoint, endPoint);
		}
	}
	
	function RightTree(shape)
	{
		_DrawRectangle(
			shape,
			MAIN_BUILDING_LENGTH,
			-BOTTOM_CITY_BASE_HEIGTH * 2 - TALL_BUILDING_DOME_DISTANCE,
			TALL_BUILDING_DOME_DISTANCE / 3,
			TALL_BUILDING_DOME_DISTANCE
		);

		_DrawCircle(
			shape,
			TOP_CITY_BASE_LENGTH / 15,
			MAIN_BUILDING_LENGTH + TALL_BUILDING_DOME_DISTANCE / 5,
			-(BOTTOM_CITY_BASE_HEIGTH * 2 + TALL_BUILDING_DOME_DISTANCE)
		);
		
		_DrawRectangle(
			shape,
			MAIN_BUILDING_LENGTH * 2,
			-BOTTOM_CITY_BASE_HEIGTH * 2 - TALL_BUILDING_DOME_DISTANCE,
			TALL_BUILDING_DOME_DISTANCE / 3,
			TALL_BUILDING_DOME_DISTANCE
		);

		_DrawCircle(
			shape,
			TOP_CITY_BASE_LENGTH / 15,
			(MAIN_BUILDING_LENGTH * 2) + TALL_BUILDING_DOME_DISTANCE / 5,
			-(BOTTOM_CITY_BASE_HEIGTH * 2 + TALL_BUILDING_DOME_DISTANCE)
		);
	}

	function Missile(shape)
	{
		const MISSILE_BODY_WIDTH = 10;
		const MISSILE_BODY_HEIGHT = 25;

		// Draw Body
		{
			_DrawRectangle(shape, -MISSILE_BODY_WIDTH / 2, -MISSILE_BODY_HEIGHT / 2, MISSILE_BODY_WIDTH, MISSILE_BODY_HEIGHT);
			_DrawRectangle(shape, -MISSILE_BODY_WIDTH / 4, +MISSILE_BODY_HEIGHT / 2, MISSILE_BODY_WIDTH / 2, MISSILE_BODY_HEIGHT / 10);
		}
		
		// Draw Tip
		{
			let beginPoint = new Point();
			let endPoint   = new Point();
			
			beginPoint.x = -MISSILE_BODY_WIDTH / 2;
			beginPoint.y = -MISSILE_BODY_HEIGHT / 2;
			endPoint.x 	 = 0;
			endPoint.y 	 = -MISSILE_BODY_HEIGHT;
			
			_DrawLine(shape, beginPoint, endPoint);
			
			beginPoint.x = 0;
			beginPoint.y = -MISSILE_BODY_HEIGHT;
			
			endPoint.x = MISSILE_BODY_WIDTH / 2;
			endPoint.y = -MISSILE_BODY_HEIGHT / 2;
			
			_DrawLine(shape, beginPoint, endPoint);
		}
		
		// Draw Wings
		{
			let beginPoint = new Point();
			let endPoint   = new Point();
			
			// LEFT WING
			beginPoint.x = shape.x - MISSILE_BODY_WIDTH / 2;
			beginPoint.y = 0;
			endPoint.x 	 = beginPoint.x - MISSILE_BODY_WIDTH / 2;
			endPoint.y 	 = beginPoint.y + MISSILE_BODY_HEIGHT / 2;
			
			_DrawLine(shape, beginPoint, endPoint);
			
			beginPoint.x = endPoint.x;
			beginPoint.y = endPoint.y;
			
			endPoint.x = MISSILE_BODY_WIDTH / 2;
			endPoint.y = endPoint.y;
			
			_DrawLine(shape, beginPoint, endPoint);
			
			// RIGHT WING
			beginPoint.x = MISSILE_BODY_WIDTH / 2;
			beginPoint.y = 0;
			endPoint.x = beginPoint.x + MISSILE_BODY_WIDTH / 2;
			endPoint.y = beginPoint.y + MISSILE_BODY_HEIGHT / 2;
			
			_DrawLine(shape, beginPoint, endPoint);
			
			beginPoint.x = endPoint.x;
			beginPoint.y = endPoint.y;
			
			endPoint.x = -MISSILE_BODY_WIDTH / 2;
			endPoint.y = endPoint.y;
			
			_DrawLine(shape, beginPoint, endPoint);
		}
	}

	function Meteor(shape, radius, vertexCount, vertexOffset, color)
	{
		const stepAngle = (360 / vertexCount) * NumberUtils.TO_RADIAN;

		const points = [];

		for(var i = 0; i < vertexCount; i++)
		{
			const p = new Point();

			p.x = Math.cos(stepAngle * i) * radius + NumberUtils.randRange(-vertexOffset, vertexOffset, true);
			p.y = Math.sin(stepAngle * i) * radius + NumberUtils.randRange(-vertexOffset, vertexOffset, true);

			points.push(p);
		}
		
		_DrawPath(shape, points, 1, color);
	}

	function MissileLauncher(shape)
	{
		const BODY_WIDTH  = 5 * 10 + 10;
		const BODY_HEIGHT = 30;
		
		_DrawRectangle(
			shape,
			-BODY_WIDTH / 2,
			-BODY_HEIGHT / 2,
			BODY_WIDTH,
			BODY_HEIGHT
		);
	}

	function ShootingHeight(shape)
	{
		const BODY_WIDTH  = 5 * 10 + 10;
		const BODY_HEIGHT = 30;
		
		_DrawLine(
			shape,
			new Point(0, 0),
			new Point(1000, 0),
			2,
			0xff0000
		);
	}

	function ArrowPointer(shape)
	{
		const headWidth = 20;
		const headHeight = 20;
		const bodyWidth = 10;
		const bodyHeight = 20;

		const path = new Array();
		
		const offsetX = 20;
		const offsetY = 20;

		path.push(new Point(0 + offsetX, 0 + offsetY));
		path.push(new Point(headWidth / 2 + offsetX, headHeight + offsetY));
		path.push(new Point(-headWidth / 2 + offsetX, headHeight + offsetY));
		
		_DrawRectangle(
			shape,
			-bodyWidth / 2 + offsetX,
			headHeight + offsetY,
			bodyWidth,
			bodyHeight,
			2,
			0xffffff,
			0x000000
		);

		_DrawPath(shape, path, 2, 0xffffff, 1, 0, 1);
	}

	function CrossHair(shape)
	{
		const spacing = 12;
		const pieceWidth = 10;
		const pieceHeight = 20;

		const path = new Array();
		
		const offsetX = 50;
		const offsetY = 50;

		//Top Piece
		path.push(new Point(0, -spacing));
		path.push(new Point(-pieceWidth / 2, -pieceHeight - spacing));
		path.push(new Point(pieceWidth / 2, -pieceHeight - spacing));
		
		for (const p of path)
		{
			p.x += offsetX;
			p.y += offsetY;
		}

		_DrawPath(shape, path, 2);
		CollectionUtils.nullVector(path, false, true);
		
		//Bottom Piece
		path.push(new Point(0, spacing));
		path.push(new Point(-pieceWidth / 2, pieceHeight + spacing));
		path.push(new Point(pieceWidth / 2, pieceHeight + spacing));
		
		for (const p of path)
		{
			p.x += offsetX;
			p.y += offsetY;
		}

		_DrawPath(shape, path, 2);
		CollectionUtils.nullVector(path, false, true);
		
		//Right Piece
		path.push(new Point(spacing, 0));
		path.push(new Point(pieceHeight+spacing, -pieceWidth / 2));
		path.push(new Point(pieceHeight+spacing, +pieceWidth / 2));
		
		for (const p of path)
		{
			p.x += offsetX;
			p.y += offsetY;
		}

		_DrawPath(shape, path, 2);
		CollectionUtils.nullVector(path, false, true);
		
		//Left Piece
		path.push(new Point(-spacing, 0));
		path.push(new Point(-pieceHeight-spacing, -pieceWidth / 2));
		path.push(new Point(-pieceHeight-spacing, +pieceWidth / 2));
		
		for (const p of path)
		{
			p.x += offsetX;
			p.y += offsetY;
		}

		_DrawPath(shape, path, 2);
	}

	function CrownIcon(shape)
	{
		const TOP_WIDTH 	= 30;
		const LOW_WIDTH 	= 20;
		const HEIGHT 		= 20;
		const SPIKE_COUNT  	= 2;
		const SPIKE_HEIGHT 	= 5;
		const COLOR		 	= 0xFFE8E523;
		
		let spikeDivisions = (2 * SPIKE_COUNT)+ 2;
		let spikeStep 	   = TOP_WIDTH / spikeDivisions;
		let currentWidth   = spikeStep;
		
		const path = [];

		path.push(new Point(-LOW_WIDTH / 2, HEIGHT / 2));
		path.push(new Point(-TOP_WIDTH / 2, -HEIGHT / 2));
		
		for (let i = 0; i < spikeDivisions; i++)
		{
			if(i % 2 == 0)
			{
				path.push(new Point(-TOP_WIDTH / 2 + currentWidth, -HEIGHT / 2 + SPIKE_HEIGHT));
			}
			else
			{
				path.push(new Point(-TOP_WIDTH / 2 + currentWidth, -HEIGHT / 2));
			}
			
			currentWidth += spikeStep;
		}
		
		path.push(new Point(TOP_WIDTH / 2, -HEIGHT / 2));
		path.push(new Point(LOW_WIDTH / 2, HEIGHT / 2));

		_DrawPath(shape, path, 2, 0xffffff, 1, COLOR, 1);
	}

	function GuyIcon(shape, color)
	{
		const GENDER_SYMBOL_RADIUS = 5;
		const pos = 0;

		let guyEndPoint = new Point();

		guyEndPoint = TrigUtils.posAroundPoint(pos, 0, -45, GENDER_SYMBOL_RADIUS * 2.4, guyEndPoint);
		_DrawLine(shape, new Point(pos, 0), guyEndPoint, GENDER_SYMBOL_RADIUS * 0.4, color);
		
		guyEndPoint.x += GENDER_SYMBOL_RADIUS * 0.04;
		
		_DrawLine(shape, guyEndPoint, new Point(guyEndPoint.x + 0, guyEndPoint.y + GENDER_SYMBOL_RADIUS * 0.8), GENDER_SYMBOL_RADIUS * 0.4, color, true);
		_DrawLine(shape, guyEndPoint, new Point(guyEndPoint.x - GENDER_SYMBOL_RADIUS * 0.8, guyEndPoint.y + 0), GENDER_SYMBOL_RADIUS * 0.4, color, true);

		_DrawCircle(shape, GENDER_SYMBOL_RADIUS, pos, 0, GENDER_SYMBOL_RADIUS * 0.4, color);
	}
	
	function GalIcon(shape, color)
	{
		const GENDER_SYMBOL_RADIUS = 5;
		const pos = 0;

		_DrawCircle(shape, GENDER_SYMBOL_RADIUS, pos, 0, GENDER_SYMBOL_RADIUS * 0.4, color);
		
		_DrawLine(shape,
			new Point(pos, GENDER_SYMBOL_RADIUS),
			new Point(pos, GENDER_SYMBOL_RADIUS * 2.4),
			GENDER_SYMBOL_RADIUS * 0.4,
			color
		);

		_DrawLine(shape,
			new Point(pos - GENDER_SYMBOL_RADIUS * 0.6, GENDER_SYMBOL_RADIUS * 1.8),
			new Point(pos + GENDER_SYMBOL_RADIUS * 0.6, GENDER_SYMBOL_RADIUS * 1.8),
			GENDER_SYMBOL_RADIUS * 0.4,
			color
		);
	}

	function Bomb(shape)
	{
		const BOMB_RADIUS = 10;
		const SPIKE_RADIUS_RADIUS_1 = BOMB_RADIUS + 3;
		const SPIKE_RADIUS_RADIUS_2 = BOMB_RADIUS + 2;

		_DrawLine(shape, new Point(-SPIKE_RADIUS_RADIUS_1, 0), new Point(SPIKE_RADIUS_RADIUS_1, 0));
		_DrawLine(shape, new Point(0, -SPIKE_RADIUS_RADIUS_1), new Point(0, SPIKE_RADIUS_RADIUS_1));
		_DrawLine(shape, new Point(-SPIKE_RADIUS_RADIUS_2, -SPIKE_RADIUS_RADIUS_2), new Point(SPIKE_RADIUS_RADIUS_2, SPIKE_RADIUS_RADIUS_2));
		_DrawLine(shape, new Point(-SPIKE_RADIUS_RADIUS_2, SPIKE_RADIUS_RADIUS_2), new Point(SPIKE_RADIUS_RADIUS_2, -SPIKE_RADIUS_RADIUS_2));

		_DrawCircle(shape, BOMB_RADIUS, 0, 0);
	}

	function UfoNoShield(shape, pieces, pieceRadius, color)
	{
		const pieceSpacing = pieceRadius * 4;
		const length = pieceSpacing * pieces;

		for (let i = 0; i < pieces; i++)
		{
			const x = pieceSpacing * i - length / 2 + pieceRadius * 2;
			const y = pieceRadius;

			_DrawCircle(shape, pieceRadius, x, y, 1, color)
		}

		_DrawArc(shape, new Point(), (pieceRadius / 2) * NumberUtils.TO_RADIAN, Math.PI - (pieceRadius / 2) * NumberUtils.TO_RADIAN, -length / 2 + pieceRadius, 1, color);

		_DrawRectangle(shape, -length / 2, -pieceRadius, length, pieceRadius * 2, 1, color);
	}

	function UfoShield(shape, pieces, pieceRadius, color)
	{
		UfoNoShield(shape, pieces, pieceRadius, color);

		const pieceSpacing = pieceRadius * 4;
		const length = pieceSpacing * pieces;

		_DrawCircle(
			shape,
			length / 2 + pieceRadius,
			0,
			-pieceRadius / 2,
			2,
			0x0000ff,
			0,
			1.0
		);
	}

	window.DynamicGraphics = new DynamicGraphics();
}