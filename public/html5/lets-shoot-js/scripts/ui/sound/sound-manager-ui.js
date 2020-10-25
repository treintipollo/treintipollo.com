"use strict";

{
	const BlinkSpeed = 0.017 * 3;

	let StartValue = null;

	class SoundManagerGui
	{
		constructor(x, y, bgColor, fgColor, borderThickness, stage)
		{
			this._pos = new Point(x, y);
			this._stage = stage;
			
			this._bgColor = bgColor;
			this._fgColor = fgColor;
			this._borderThickness = borderThickness;
			
			this._borderColor = 0;
			this._longestWidth = 0;
			this._totalHeight = 0;
			this._borderColor = 0;
			
			this._sliderTitle = [];
			this._track = [];
			this._knob = [];
			this._offset = [];
			this._sliderProperties = [];
			this._testSound = [];

			this._frame = null;
			this._frameBorder = null;
			this._title = null;
			this._titlePos = null;
			this._titleText = "";
			this._titleFont = "";
			this._titleColor = 0;
			this._slider = null;
		}
		
		SetGuiTitle(title, font, size, color)
		{
			this._titleText = title;
			this._titleFont = font;
			this._titleColor = color;
			this._titlePos = this._pos.clone();
			
			this._title = new Text(this._titlePos, this._titleFont, size, this._titleColor, this._stage, true);
			this._title.Update(this._titleText, this._titleColor, false, false, false, 1);
		}
		
		AddSliderTitle(title, font, size, color)
		{
			this._sliderTitle.push([title, font, size, color]);
		}
		
		SetSliderTrack(width, height, thickness, lineColor, fillColor)
		{
			this._track.push([width, height, thickness, lineColor, fillColor]);
			this._offset.push(this._borderThickness * 2);
		}
		
		SetSliderKnob(radius, thickness, lineColor, fillColor)
		{
			this._knob.push([radius, thickness, lineColor, fillColor]);
		}
		
		SetSliderProperties(axis, minValue, maxValue, startValue, precision = 0)
		{
			this._sliderProperties.push([axis, minValue, maxValue, startValue, precision]);
		}
		
		SetSliderSound(testSoundIndex, soundTransform)
		{
			this._testSound.push([testSoundIndex, soundTransform]);
		}
		
		Init()
		{
			this._slider = [];
			
			this._totalHeight += this._title._dimentions.y;
			
			for (let i = 0; i < this._sliderTitle.length; i++)
			{
				if (i === 0)
				{
					this._slider[i] = new VolumeControl(new Point(this._pos.x, this._titlePos.y + this._title._dimentions.y + this._offset[i]), this._testSound[i][1], this._stage);
				}
				else
				{
					let pos = new Point(this._slider[i - 1].GetPosition().x, this._slider[i - 1].GetPosition().y + this._slider[i - 1].GetDimentions().y + this._offset[i]);
					this._slider[i] = new VolumeControl(pos, this._testSound[i][1], this._stage);
				}
				  
				this._slider[i].SetTitle(this._sliderTitle[i][0], this._sliderTitle[i][1], this._sliderTitle[i][2], this._sliderTitle[i][3]);
				this._slider[i].SetTrack(this._track[i][0], this._track[i][1], this._track[i][2], this._track[i][3], this._track[i][4], this._offset[i]);
				this._slider[i].SetSlider(this._knob[i][0], this._knob[i][1], this._knob[i][2], this._knob[i][3]);
				this._slider[i].SetTestSound(this._testSound[i][0]);
				
				let startValue;
				
				if (StartValue !== null)
				{
					startValue = StartValue[i];
				}
				else
				{
					startValue = this._sliderProperties[i][3];
				}
				
				this._slider[i].Init(this._sliderProperties[i][0], this._sliderProperties[i][1], this._sliderProperties[i][2], startValue, this._sliderProperties[i][4]);
				
				this._longestWidth < this._slider[i].GetFullLenght() ? this._longestWidth = this._slider[i].GetFullLenght() : this._longestWidth = this._longestWidth;
				this._totalHeight += this._slider[i].GetDimentions().y + this._offset[i];
			}

			this._longestWidth += 15;

			this._titlePos.x -= (this._title._dimentions.x - this._longestWidth) / 2;
			this._titlePos.y += this._borderThickness;

			this.CreateFrame();
		}
		
		Update(alpha)
		{
			for (let i = 0; i < this._sliderTitle.length; i++)
				this._slider[i].Update(alpha);
			
			this._title.Update(this._titleText, this._titleColor, false, false, true, alpha);
			
			this.UpdateFrame(alpha);
		}
		
		Clean()
		{
			StartValue = [];
			
			for (let j = 0; j < this._testSound.length; j++)
				SoundManager.Stop(this._testSound[j][0]);
			
			this._title.Clean();
			
			if (this._frame !== null)
			{
				this._stage.removeChild(this._frame);
				
				this._frame = null;
			}

			if (this._frameBorder !== null)
			{
				this._stage.removeChild(this._frameBorder);
				
				this._frameBorder = null;
			}
			
			for (let i = 0; i < this._slider.length; i++)
			{
				StartValue.push(this._slider[i].Clean());
				this._slider[i] = null;
			}

			this._slider = null;
			this._stage = null;
			this._pos = null;
			this._sliderTitle = null;
			this._track = null;
			this._knob = null;
			this._sliderProperties = null;
			this._offset = null;
			this._testSound = null;
			this._title = null;
		}
		
		UpdateFrame(alpha)
		{
			this._borderColor += BlinkSpeed;
			this._frameBorder.alpha = (Math.sin(this._borderColor) + 1) / 2;
			
			this._frame.alpha = alpha;

			// this._borderColor += BlinkSpeed;
			
			// let bgR = (this._bgColor >> 16) & 0xFF;
			// let bgG = (this._bgColor >> 8) & 0xFF;
			// let bgB = (this._bgColor) & 0xFF;
			
			// let sin = Math.sin(this._borderColor);
			
			// let newA = 255;
			// let newR = Math.abs(sin * bgR);
			// let newG = Math.abs(sin * bgG);
			// let newB = Math.abs(sin * bgB);
			 
			// let color = newA << 24 | newR << 16 | newG << 8 | newB;
			
			// let bgColor = createjs.Graphics.getRGB(color);
			// let fgColor = createjs.Graphics.getRGB(this._fgColor);

			// this._frame.uncache();
			// this._frame.graphics.clear();
			// this._frame.graphics.beginFill(bgColor);
			// this._frame.graphics.rect(0, 0, this._longestWidth, this._totalHeight + this._borderThickness * 2);
			// this._frame.graphics.beginFill(fgColor);
			// this._frame.graphics.rect(this._innerFrame.x, this._innerFrame.y, this._innerFrame.width, this._innerFrame.height);
			// this._frame.cache(0, 0, this._longestWidth, this._totalHeight + this._borderThickness * 2);
			
			// this._frame.alpha = alpha;
		}
		
		CreateFrame()
		{
			const width = Math.floor(this._longestWidth + this._borderThickness * 4);
			const height = Math.floor(this._totalHeight + this._borderThickness * 2);
			
			this._frame = new Shape();
			
			this._frame.snapToPixel = true;
			this._frame.x = Math.floor(this._pos.x - (width - this._longestWidth) / 2);
			this._frame.y = Math.floor(this._pos.y);
			this._frame.alpha = 0;

			this._frameBorder = new Shape();
			this._frameBorder.snapToPixel = true;
			this._frameBorder.x = Math.floor(this._pos.x - (width - this._longestWidth) / 2);
			this._frameBorder.y = Math.floor(this._pos.y);
			this._frameBorder.alpha = 0;
			
			this._stage.addChildAt(this._frame, this._stage.numChildren - (this._sliderTitle.length * 4) - 1);
			this._stage.addChildAt(this._frameBorder, this._stage.numChildren - (this._sliderTitle.length * 4) - 1);

			const bgColor = createjs.Graphics.getRGB(this._bgColor);
			const fgColor = createjs.Graphics.getRGB(this._fgColor);
			const border = Math.floor(this._borderThickness);

			const w = Math.floor(this._longestWidth);

			this._frame.graphics.clear();
			this._frame.graphics.beginFill(fgColor);
			this._frame.graphics.rect(0, 0, w, height);
			this._frame.cache(0, 0, w, height);
			
			this._frameBorder.graphics.clear();
			this._frameBorder.graphics.beginFill(bgColor);
			this._frameBorder.graphics.rect(0, 0, w, border);
			this._frameBorder.graphics.rect(0, 0, border, height);
			this._frameBorder.graphics.rect(w - border, 0, border, height);
			this._frameBorder.graphics.rect(0, height - border, w, border);
			this._frameBorder.cache(0, 0, w, height);
		}
	}

	window.SoundManagerGui = SoundManagerGui;
}