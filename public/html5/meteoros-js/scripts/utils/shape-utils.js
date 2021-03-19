"use strict";

{
	class ShapeUtils
	{
		constructor()
		{

		}

		static createCircle(radius, x, y, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, lineAlpha = 1.0, fillAlpha = 1.0)
		{
			const shape = new Shape();

			shape.graphics.setStrokeStyle(lineThickness);
			shape.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, lineAlpha));
			shape.graphics.beginFill(createjs.Graphics.getRGB(fillColor, fillAlpha));
			shape.graphics.drawCircle(Math.floor(x), Math.floor(y), Math.floor(radius));
			shape.graphics.endStroke();
			shape.graphics.endFill();
			
			return shape;
		}
		
		static drawCircle(container, radius, x, y, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, alpha = 1.0, lineAlpha = 1.0)
		{
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, lineAlpha));
			container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
			container.graphics.drawCircle(Math.floor(x), Math.floor(y), Math.floor(radius));
			container.graphics.endFill();
			container.graphics.endStroke();
		}
		
		static createRectangle(x, y, width, height, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, lineAlpha = 1.0, fillAlpha = 1.0)
		{
			const shape = new Shape();
			
			shape.graphics.setStrokeStyle(lineThickness);
			shape.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, lineAlpha));
			shape.graphics.beginFill(createjs.Graphics.getRGB(fillColor, fillAlpha));
			shape.graphics.drawRect(x, y, width, height);
			shape.graphics.endStroke();
			shape.graphics.endFill();
			
			return shape;
		}

		static createRectangleEx(x, y, width, height, lineThickness = 1, lineColor = null, fillColor = null, alpha = 1.0)
		{
			const shape = new Shape();
			
			shape.graphics.setStrokeStyle(lineThickness);

			if (lineColor)
				shape.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			
			if (fillColor)
				shape.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
			
			shape.graphics.drawRect(x, y, width, height);
			
			if (lineColor)
				shape.graphics.endStroke();
			
			if (fillColor)
				shape.graphics.endFill();
			
			return shape;
		}
		
		static drawRectangle(container, x, y, width, height, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, lineAlpha = 1.0, fillAlpha = 1.0, smooth = false)
		{
			if (smooth)
			{
				x = x;
				y = y;
				width = width;
				height = height;
			}
			else
			{
				x = Math.floor(x) + 0.5;
				y = Math.floor(y) + 0.5;
				width = Math.floor(width);
				height = Math.floor(height);
			}

			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, lineAlpha));
			container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, fillAlpha));
			container.graphics.drawRect(x, y, width, height);
			container.graphics.endStroke();
			container.graphics.endFill();
		}

		static drawRectangleEx(container, x, y, width, height, lineThickness = 1, lineColor = null, fillColor = null, alpha = 1.0, clear = false)
		{
			if (clear)
				container.graphics.clear();
			
			container.graphics.setStrokeStyle(lineThickness);

			if (lineColor)
			{
				container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			}
			else
			{
				container.graphics.beginStroke(createjs.Graphics.getRGB(0, 0));
			}
			
			if (fillColor)
			{
				container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
			}
			else
			{
				container.graphics.beginFill(createjs.Graphics.getRGB(0, 0));
			}
			
			container.graphics.drawRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(width), Math.floor(height));
			
			if (lineColor)
				container.graphics.endStroke();
			
			if (fillColor)
				container.graphics.endFill();
		}
		
		static drawLine(container, beginPoint, endPoint, lineThickness = 1, lineColor = 0xffffff, alpha = 1.0, smooth = false)
		{
			let bx, by;
			let ex, ey;

			if (smooth)
			{
				bx = beginPoint.x;
				by = beginPoint.y;
				ex = endPoint.x;
				ey = endPoint.y;
			}
			else
			{
				bx = Math.floor(beginPoint.x);
				by = Math.floor(beginPoint.y);
				ex = Math.floor(endPoint.x);
				ey = Math.floor(endPoint.y);
			}
			
			container.graphics.setStrokeStyle(lineThickness, "round", "miter", 3, false);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.moveTo(bx, by);
			container.graphics.lineTo(ex, ey);
			container.graphics.endStroke();
		}

		static drawLineXY(container, bX, bY, eX, eY, lineThickness = 1, lineColor = 0xffffff, alpha = 1.0, smooth = false)
		{
			let bx, by;
			let ex, ey;

			if (smooth)
			{
				bx = bX;
				by = bY;
				ex = eX;
				ey = eY;
			}
			else
			{
				bx = Math.floor(bX);
				by = Math.floor(bY);
				ex = Math.floor(eX);
				ey = Math.floor(eY);
			}

			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.moveTo(bx, by);
			container.graphics.lineTo(ex, ey);
			container.graphics.endStroke();
		}

		static drawPath(container, path, lineThickness = 1, lineColor = 0xffffff, alpha = 1.0, fillColor = 0, fillAlpha = 0)
		{
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.beginFill(createjs.Graphics.getRGB(fillColor), fillAlpha);
			
			container.graphics.moveTo(Math.floor(path[0].x) + 0.5, Math.floor(path[0].y) + 0.5);
			
			for (let i = 1; i < path.length; i++)
			{
				container.graphics.lineTo(Math.floor(path[i].x) + 0.5, Math.floor(path[i].y) + 0.5);
			}

			container.graphics.lineTo(Math.floor(path[0].x) + 0.5, Math.floor(path[0].y) + 0.5);

			container.graphics.endStroke();
		}

		static drawArc(container, center, startAngle, endAngle, radius, direction = 1, lineThickness = 1, lineColor = 0xffffff, alpha = 1.0)
		{
			let difference = Math.abs(endAngle - startAngle);
			let divisions  = Math.floor(difference / (Math.PI / 4)) + 1;
			
			let span = direction * difference / (2 * divisions);
			let controlRadius = radius / Math.cos(span);
			
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			
			container.graphics.moveTo(center.x + (Math.cos(startAngle) * radius), center.y + Math.sin(startAngle) * radius);
			
			for (let i = 0; i < divisions; ++i)
			{
				endAngle    = startAngle + span;
				startAngle  = endAngle + span;
				
				let controlPoint = new Point(center.x + Math.cos(endAngle) * controlRadius, center.y + Math.sin(endAngle) * controlRadius);
				let anchorPoint = new Point(center.x + Math.cos(startAngle) * radius, center.y + Math.sin(startAngle) * radius);
				
				container.graphics.curveTo(
					controlPoint.x,
					controlPoint.y,
					anchorPoint.x,
					anchorPoint.y
				);
			}

			container.graphics.endStroke();
		}
	}
	
	window.ShapeUtils = ShapeUtils;
}