"use strict";

{
	class CenterGenerator extends BaseGenerator
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
		}
		
		static GetVertexCount()
		{
			return 8;
		}
		
		Add(baddyAmount)
		{
			for (let i = 0; i < baddyAmount; i++)
			{
				Baddy.SetSpriteSheetAndAnimation(DynamicGraphics.GetSpriteSheet(), this._baddyStatsName + this._baddyName);

				const baddy = new this._baddyObject(this._stage, this._baddyIsGenerator, this._baddyIsHitable, this._baddyIsVisible, this._baddyHasDeathSound);

				this._baddyPool.push(baddy);
				
				baddy.SetNames(this._baddyName, this._baddyStatsName);
				baddy.SetSpecificParams(this._baddySpecificParams);
				baddy.SetMovementParams(this._baddyMaxSpeed, this._baddyRotationSpeed);
				baddy.SetDrawParams(this._baddyLineWidth, this._baddyLineColor, this._baddyFillColor);
				baddy.SetSegmentParams(this._baddySegmentSpeedRange, this._baddySegmentRotSpeed, this._baddySegmentLife);
				
				baddy.Init(
					this._center,
					this._pos,
					this._baddyRadius,
					baddy._typeVertexCount,
					this._baddyLife,
					this._target,
					this._deathSoundIndex
				);
			}
			
			this._currentMinionAmount += baddyAmount;
			this._totalMinionsGenerated += baddyAmount;
		}
	}

	window.CenterGenerator = CenterGenerator;
}