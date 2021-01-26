"use strict";

{
	// public
	let _totalScore = 0;
	let _globalScore = 0;
	let _baddiesDestroyed = 0;
	
	let _frame = null;
	let _meter = null;
	let _stage = null;
	let _pos = null;
	let _fullRect = null;
	let _insideRect = null;
	let _chainMeter = null;
	let _chainMeterBg = null;
	
	let _chainAmountText = null;
	let _chainText = null;
	let _scoreColor = 0;
	let _font = "";
	let _size = 0;
	let _text = "";
	
	let _fgColor = 0;
	let _bgColor = 0;
	let _borderThickness = 0;
	let _meterColor = 0;
	let _meterBgColor = 0;
	let _baseMeterSpeed = 0;
	let _meterSpeed = 0;
	let _bonusTime = 0;
	let _lastHitAmount = 0;
	
	let _currentChainCount = 0;
	let _currentScore = 0;
	
	let _isVisible = false;
	let _scoreIncrease = false;
	let _isInitialized = false;

	class ChainCounter
	{
		constructor()
		{
			
		}
		
		static Init(x, y, stage)
		{
			_pos = new Point(x, y);
			_stage = stage;
			_isVisible = false;
			_scoreIncrease = false;
			_currentChainCount = 0;
			_currentScore = 0;
			_totalScore = 0;
			_lastHitAmount = 0;
			_baseMeterSpeed = 3;
			_meterSpeed = 0;
			_isInitialized = true;
			_baddiesDestroyed = 0;
			
			_text = " HIT";
		}

		static get _totalScore()
		{
			return _totalScore;
		}

		static get _globalScore()
		{
			return _globalScore;
		}

		static set _globalScore(v)
		{
			_globalScore = v;
		}

		static get _baddiesDestroyed()
		{
			return _baddiesDestroyed;
		}
		
		static SetTextProps(font, size, color)
		{
			_font = font;
			_size = size;
			_scoreColor = color;
		}
		
		static SetFrameProps(fgColor, bgColor, meterFgColor, meterBgColor, borderThickness)
		{
			_fgColor = fgColor;
			_bgColor = bgColor;
			_borderThickness = borderThickness;
			_meterColor = meterFgColor;
			_meterBgColor = meterBgColor
		}
		
		static Create()
		{
			let tmpText = new Text(new Point(), _font, _size, _scoreColor, null, true);
			tmpText.Update(_text, _scoreColor);
			let text = tmpText.GetTextField();

			_frame = new Shape();
			_stage.addChild(_frame);

			_frame.x = _pos.x;
			_frame.y = _pos.y;
			_frame.alpha = 0;
			
			_fullRect = new Rectangle(_frame.x, _frame.y, text.width + _borderThickness * 5, (text.height * 2) + _borderThickness * 2);
			_insideRect = new Rectangle(_borderThickness, _borderThickness, text.width, _fullRect.height - _borderThickness * 2);
			_chainMeter = new Rectangle(_insideRect.width + _borderThickness * 2, _borderThickness, _borderThickness * 2, _insideRect.height);
			_chainMeterBg = new Rectangle(_insideRect.width + _borderThickness * 2, _borderThickness, _borderThickness * 2, _insideRect.height);

			_meter = new Shape();
			_stage.addChild(_meter);
			
			_meter.x = _chainMeter.x;
			_meter.y = _chainMeter.y;
			_meter.scaleY = 1;
			_meter.alpha = 0;

			this.DrawMain();
			this.DrawMeter();
			this.CreateText();

			tmpText.Clean();
			tmpText = null;
			text = null;
		}
		
		static Add(score, hitAmount)
		{
			if (_isInitialized)
			{
				_currentChainCount += hitAmount;
				_currentScore += score;
				
				if (hitAmount > _lastHitAmount)
				{
					if (hitAmount <= _baseMeterSpeed)
					{
						_meterSpeed = (_baseMeterSpeed / hitAmount) + 1;
					}
					else
					{
						_meterSpeed = 1;
					}
					
					_bonusTime = (hitAmount - 1) * 100;
				}
				
				_isVisible = true;
				_lastHitAmount = hitAmount;
				_scoreIncrease = true;
				
				const chainCount = _currentChainCount.toString();
				_text = chainCount <= 1 ? " HIT" : "HITS";

				_chainAmountText.Update(chainCount, _scoreColor, false, false, true);
				_chainText.Update(_text, _scoreColor, false, false, true);
			}
			
			_baddiesDestroyed++;

			this.dispatchEvent("change");
		}
		
		static Update()
		{
			if (_isVisible)
				this.Logic();
		}
		
		static ResetGlobalScore()
		{
			_baddiesDestroyed = 0;
			_globalScore = 0;
		}
		
		static GetBaddiesDestroyed()
		{
			return _baddiesDestroyed;
		}
		
		static Clean()
		{
			_stage.removeChild(_frame);

			_frame = null;
			_stage = null;
			_pos = null;
			_insideRect = null;
			_chainMeter = null;
			_chainMeterBg = null;
			
			_chainAmountText.Clean();
			_chainText.Clean();
			
			_chainAmountText = null;
			_chainText = null;
			
			_isInitialized = false;
			_globalScore += _totalScore;
		}
		
		static CreateText()
		{
			let textPos = new Point(_pos.x + _borderThickness, _pos.y + _borderThickness);
			
			_chainAmountText = new Text(textPos.clone(), _font, _size, _scoreColor, _stage, true);
			_chainAmountText.Update("666", _scoreColor, false, false, false);
			
			textPos.y += _chainAmountText.GetTextField().height;
			_chainText = new Text(textPos.clone(), _font, _size, _scoreColor, _stage, true);
			_chainText.Update(_text, _scoreColor, false, false, false);
			
			textPos = null;
		}
		
		static Logic()
		{
			if (!_frame)
				return;

			if (_scoreIncrease)
			{
				_chainMeter.height = _chainMeterBg.height;
				_chainMeter.y = _chainMeterBg.y;
				_meter.y = _chainMeterBg.y;
				_meter.scaleY = 1;
				_scoreIncrease = false;
			}
			
			if (_bonusTime > 0)
			{
				_bonusTime--;
			}
			else
			{
				_bonusTime = 0;
				_meterSpeed = _baseMeterSpeed;
			}
			
			if (_chainMeter.height > 0)
			{
				_chainMeter.y += _meterSpeed;
				_chainMeter.height -= _meterSpeed;

				_meter.y = _chainMeter.y;
				_meter.scaleY = NumberUtils.normalize(_chainMeter.height, 0, _chainMeterBg.height);

				_frame.alpha = 1;
				_meter.alpha = 1;

				_chainAmountText.Update(_currentChainCount.toString(), _scoreColor, false, false, true, 1);
				_chainText.Update(_text, _scoreColor, false, false, true, 1);
			}
			else
			{
				this.Reset();
			}
		}

		static DrawMain()
		{
			if (!_frame)
				return;

			_frame.uncache();

			_frame.graphics.clear();

			_frame.graphics.beginFill(_bgColor);
			_frame.graphics.rect(_fullRect.x, _fullRect.y, _fullRect.width, _fullRect.height);
			_frame.graphics.endFill();

			_frame.graphics.beginFill(_fgColor);
			_frame.graphics.rect(_insideRect.x, _insideRect.y, _insideRect.width, _insideRect.height);
			_frame.graphics.endFill();

			_frame.graphics.beginFill(_meterBgColor);
			_frame.graphics.rect(_chainMeterBg.x, _chainMeterBg.y, _chainMeterBg.width, _chainMeterBg.height);
			_frame.graphics.endFill();

			_frame.setBounds(0, 0, _fullRect.width, _fullRect.height);
			_frame.cache(0, 0, _fullRect.width, _fullRect.height);
		}

		static DrawMeter()
		{
			_meter.uncache();

			_meter.graphics.beginFill(_meterColor);
			_meter.graphics.rect(0, 0, _chainMeter.width, _chainMeter.height);
			_meter.graphics.endFill();

			_meter.setBounds(0, 0, _fullRect.width, _fullRect.height);
			_meter.cache(0, 0, _chainMeter.width, _chainMeter.height);
		}
		
		static Reset()
		{
			_isVisible = false;
			
			_frame.alpha = 0;
			_meter.alpha = 0;
			_meter.scaleY = 1;

			_meterSpeed = _baseMeterSpeed;
			
			_totalScore += _currentScore * _currentChainCount;
			_chainMeter.height = _chainMeterBg.height;
			_chainMeter.y = _chainMeterBg.y;
			
			// For the all clear bonus
			if (_currentChainCount > MainBody._maxChain)
				MainBody._maxChain = _currentChainCount;

			_currentChainCount = 0;
			_currentScore = 0;
			
			_chainAmountText.Update(_currentChainCount.toString(), _scoreColor, false, false, false);
			_chainText.Update(_text, _scoreColor, false, false, false);
		}
	}

	createjs.EventDispatcher.initialize(ChainCounter);

	window.ChainCounter = ChainCounter;
}