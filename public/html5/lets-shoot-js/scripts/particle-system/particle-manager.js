"use strict";

{
	const tempArrayView = new Int32Array(new ArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4));

	let _particles = null;
	let _totalParticles = 0;
	let _standardParticle = null;
	let _context = null;
	let _processInitPos = null;

	class ParticleManager
	{
		constructor()
		{

		}

		static Init(context)
		{
			_particles = [];
			_standardParticle = new StandardParticleParams();
			_context = context;
			_totalParticles = 0;
		}

		static get _totalParticles()
		{
			return _totalParticles;
		}

		static get _processInitPos()
		{
			return _processInitPos;
		}

		static set _processInitPos(v)
		{
			_processInitPos = v;
		}
		
		static SetGenericProperties(x, y, rotation, width, height, color, lifeRange, amount)
		{
			_standardParticle.Init(x, y, rotation, width, height, color, lifeRange, amount);
		}

		static SetInterpolationOptions(colorInterpolation, sizeInterpolation, interpolationColor, interpolationSize)
		{
			if (colorInterpolation)
			{
				_standardParticle._useColorInterpolation = true;
				_standardParticle._interpolationColor = interpolationColor;
			}

			if (sizeInterpolation)
			{
				_standardParticle._useSizeInterpolation = true;
				_standardParticle._interpolationSize = interpolationSize;
			}
		}
		
		static Spawn(specificProps, definitionName, visible)
		{
			// Particles will be drawn in the main canvas
			const processedPos = _processInitPos(_standardParticle._x, _standardParticle._y);

			const amount = _standardParticle._amount;
			const width = _standardParticle._width;
			const height = _standardParticle._height;

			const px = processedPos.x;
			const py = processedPos.y;

			const cw = _context.canvas.width;
			const ch = _context.canvas.height;
			
			// Don't create particles that are not visible from the start
			if (!visible)
			{
				_standardParticle._useColorInterpolation = false;
				_standardParticle._useSizeInterpolation = false;
				_processInitPos = null;
				return;
			}

			// Do not create particles that are outside the screen
			if (((px < -width || px > cw) || (py < -height || py > ch)))
			{
				_standardParticle._useColorInterpolation = false;
				_standardParticle._useSizeInterpolation = false;
				_processInitPos = null;
				return;
			}

			const rot = _standardParticle._rotation;
			const color = _standardParticle._color;
			const life = _standardParticle._life;
			
			const colorInterpolation = _standardParticle._useColorInterpolation;
			const interpolationColor = _standardParticle._interpolationColor;

			const sizeInterpolation = _standardParticle._useSizeInterpolation;
			const interpolationSize = _standardParticle._interpolationSize;

			for (let j = 0; j < amount; j++)
			{
				_totalParticles++;

				const particle = new definitionName(px, py, rot, width, height, color, life, visible);

				// Initialize specific properties for each particle
				particle.InitSpecific(specificProps);
				
				// Set Interpolation color for each particle. This comment should be redundant for anyone that is not a shit head.
				if (colorInterpolation)
					particle.SetInterpolationColor(interpolationColor);

				// Same as above
				if (sizeInterpolation)
					particle.SetInterpolationSize(interpolationSize);
				
				_particles.push(particle);
			}
			
			_standardParticle._useColorInterpolation = false;
			_standardParticle._useSizeInterpolation = false;
			_processInitPos = null;
		}

		static Update()
		{
			// Do any of this shit only if there is in fact some kind of particle
			if (_totalParticles <= 0)
				return;

			_context.clearRect(0, 0, _context.canvas.width, _context.canvas.height);

			for (let j = 0; j < _particles.length; j++)
			{
				const particle = _particles[j];

				if (!particle)
					continue;

				if (particle._enable)
				{
					if (particle._visible)
					{
						particle.Update();

						if (particle._enable && particle._visible)
						{
							_context.fillStyle = particle._color;

							tempArrayView[0] = particle._rect.x;
							tempArrayView[1] = particle._rect.y;
							tempArrayView[2] = particle._rect.width;
							tempArrayView[3] = particle._rect.height;

							_context.fillRect(
								tempArrayView[0],
								tempArrayView[1],
								tempArrayView[2],
								tempArrayView[3]
							);
						}
						else
						{
							_particles.splice(j, 1);
							j--;

							_totalParticles--;
						}
					}
				}
				else
				{
					_particles.splice(j, 1);
					j--;

					_totalParticles--;
				}
			}
		}
		
		static Reset()
		{
			for (let i = 0; i < _particles.length; i++)
				_particles[i].Die();
			
			_standardParticle.Clean();
			
			_context = null;
			_particles = null;
			_standardParticle = null;
		}
	}

	self.ParticleManager = ParticleManager;

	class StandardParticleParams
	{
		constructor()
		{
			this._x = 0;
			this._y = 0;
			this._rotation = 0;
			this._width = 0;
			this._height = 0;
			this._color = 0;
			this._amount = 0;
			this._interpolationColor = 0;
			this._interpolationSize = null;
			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;
			this._life = null;
			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;
		}

		Init(x, y, rotation, width, height, color, life, amount)
		{
			this._x = x;
			this._y = y;
			this._rotation = rotation;
			this._width = width;
			this._height = height;
			this._color = color;
			this._amount = amount;
			this._life = life;
		}
		
		Clean()
		{
			this._interpolationSize = null;
			this._life = null;
		}
	}
}