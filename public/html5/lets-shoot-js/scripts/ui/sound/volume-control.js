"use strict";

{
	class VolumeControl
	{
		constructor(pos, soundTransform, stage, useTestButton = true)
		{
			this._stage = stage;
			this._pos = pos;
			this._soundTransform = soundTransform;
			this._useTestButton = useTestButton;

			this._volumeTrack = new Shape();
			this._volumeTrack.snapToPixel = true;
			this._volumeSlider = new Shape();
			this._volumeSlider.snapToPixel = true;

			this._title = null;
			this._volumeSliderObject - null;
			this._titleString = "";
			this._titleFont = "";
			this._titleSize = 0;
			this._titleColor = 0;
			this._thickness = 0;
			this._maxValue = 0;
			this._width = 0;
			this._height = 0;
			this._offSet = 0;
			this._testButton = null;
			this._testSound = 0;
		}
		
		SetTitle(string, font, size, color)
		{
			this._titleFont = font;
			this._titleSize = size;
			this._titleColor = color;
			this._titleString = string;
			
			this._title = new Text(this._pos, this._titleFont, this._titleSize, this._titleColor, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._title.Update(this._titleString, this._titleColor, false, false, false, 0);
		}
		
		SetTrack(width, height, thickness, lineColor, fillColor, offset = 20)
		{
			this._width = width;
			this._height = height;
			this._offSet = offset + 10;

			this._volumeTrack.graphics.lineStyle(thickness, lineColor);
			this._volumeTrack.graphics.beginFill(fillColor);
			this._volumeTrack.graphics.drawRect(0, 0, width, height);
			this._volumeTrack.graphics.endFill();
			this._volumeTrack.cache(-thickness, -thickness, width + thickness * 2, height + thickness * 2);
			
			this._volumeTrack.x = Math.floor(this._title.GetTextField().x + this._title._dimentions.x + this._offSet);
			this._volumeTrack.y = Math.floor(this._title.GetTextField().y + this._title._dimentions.y / 2 - height / 2);
			
			this._volumeTrack.x += 0.5;
			this._volumeTrack.y += 0.5;

			if (this._useTestButton)
			{
				let testButtonPos = new Point(this._volumeTrack.x + width + this._offSet, this._title.GetTextField().y);
				this._testButton = new Button(testButtonPos, "TEST", this._titleFont, this._titleSize, this._titleColor, this._stage);
				this._testButton.Update(1, false, false, false);
			}
		}
		
		SetSlider(radius, thickness, lineColor, fillColor)
		{
			this._thickness = thickness;
			
			this._volumeSlider.graphics.lineStyle(thickness, lineColor);
			this._volumeSlider.graphics.beginFill(fillColor);
			this._volumeSlider.graphics.drawCircle(-0.5, -0.5, radius);
			this._volumeSlider.graphics.endFill();
			
			this._volumeSlider.cache(
				-radius - thickness * 2,
				-radius - thickness * 2,
				radius * 2 + thickness * 2 + 1,
				radius * 2 + thickness * 2 + 1
			);
			
			this._volumeSlider.x = Math.floor(this._volumeTrack.x);
			this._volumeSlider.y = Math.floor(this._volumeTrack.y + this._volumeTrack.height / 2 - this._thickness / 2 - 1);
		}
		
		SetTestSound(testSoundIndex)
		{
			this._testSound = testSoundIndex;
		}
		
		Init(axis, minValue, maxValue, startValue, precision = 0)
		{
			this._stage.addChild(this._volumeTrack);
			this._stage.addChild(this._volumeSlider);
			
			let initValue;
			
			if (startValue < maxValue)
			{
				initValue = startValue;
			}
			else
			{
				initValue = maxValue;
			}
			
			this._maxValue = maxValue;
			
			this._volumeSliderObject = new SliderUI(this._stage, axis, this._volumeTrack, this._volumeSlider, minValue, maxValue, initValue, precision);
		}
		
		ReSetPosition(xDelta, yDelta)
		{
			this._volumeTrack.x += xDelta;
			this._volumeTrack.y += yDelta;
			this._volumeSlider.x = this._volumeTrack.x;
			this._volumeSlider.y = this._volumeTrack.y + this._volumeTrack.height / 2 - this._thickness / 2;
			
			this._pos.x += xDelta;
			this._pos.y += yDelta;
			
			this._volumeSliderObject.percent = this._maxValue;
		}
		
		Update(alpha)
		{
			this._title.Update(this._titleString, this._titleColor, false, false, true, alpha);
			
			this._soundTransform.volume = this._volumeSliderObject.percent;

			this._volumeSliderObject.setAlpha(alpha);
			
			if (this._testButton !== null)
			{
				this._testButton.Update(alpha, false, false, true);
				
				if (this._testButton.CheckCollision(LetsShoot._click))
				{
					if (!SoundManager.SoundPlaying(this._testSound))
					{
						SoundManager.Play(this._testSound, true);
					}
				}
			}
		}
		
		Clean()
		{
			let res = this._volumeSliderObject.currentValue;
			
			this._title.Clean();
			
			if (this._testButton !== null)
				this._testButton.Clean();

			this._volumeSliderObject.destroy();
			
			this._stage.removeChild(this._volumeTrack);
			this._stage.removeChild(this._volumeSlider);
			
			SoundManager.Stop(this._testSound);
			
			this._pos = null;
			this._title = null;
			this._volumeTrack = null;
			this._volumeSlider = null;
			this._volumeSliderObject = null;
			this._soundTransform = null;
			this._testButton = null;
			this._stage = null;
			
			return res;
		}
		
		GetDimentions()
		{
			return this._title._dimentions;
		}
		
		GetPosition()
		{
			return new Point(this._title.GetTextField().x, this._title.GetTextField().y);
		}
		
		GetFullLenght()
		{
			if (this._testButton !== null)
			{
				return this._title._dimentions.x + this._width + this._testButton.GetText()._dimentions.x + (this._offSet * 2);
			}
			else
			{
				return this._title._dimentions.x + this._width + this._offSet;
			}
		}
	}

	window.VolumeControl = VolumeControl;
}