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
			shape.graphics.drawCircle(x, y, radius);
			shape.graphics.endStroke();
			shape.graphics.endFill();
			
			return shape;
		}
		
		static drawCircle(container, x, y, radius, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, alpha = 1.0, lineAlpha = 1.0)
		{
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
			container.graphics.drawCircle(x, y, radius);
			container.graphics.endStroke();
			container.graphics.endFill();
		}
		
		static createRectangle(x, y, width, height, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, alpha = 1.0)
		{
			const shape = new Shape();
			
			shape.graphics.setStrokeStyle(lineThickness);
			shape.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			shape.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
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
		
		static drawRectangle(container, x, y, width, height, lineThickness = 1, lineColor = 0xffffff, fillColor = 0x000000, alpha = 1.0)
		{
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
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
				container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			
			if (fillColor)
				container.graphics.beginFill(createjs.Graphics.getRGB(fillColor, alpha));
			
			container.graphics.drawRect(x, y, width, height);
			
			if (lineColor)
				container.graphics.endStroke();
			
			if (fillColor)
				container.graphics.endFill();
		}
		
		static drawLine(container, beginPoint, endPoint, lineThickness = 1, lineColor = 0xffffff, alpha = 1.0)
		{
			container.graphics.setStrokeStyle(lineThickness);
			container.graphics.beginStroke(createjs.Graphics.getRGB(lineColor, alpha));
			container.graphics.moveTo(beginPoint.x, beginPoint.y);
			container.graphics.lineTo(endPoint.x, endPoint.y);
			container.graphics.endStroke();
		}
	}
	
	window.ShapeUtils = ShapeUtils;
}