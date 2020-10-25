"use strict";

{
	let _stage = null;
	let _maxAmount = 0;
	let _maxTypeAmount = 0;
	let _currentCount = 0;
	let _bulletTypePool = null;
	let _currentBulletIndex = null;
	let _activeIndex = null;
	let _inactiveIndexCount = null;
	
	const SPLICE_LIMIT = 100;
	
	const PLAYER_BOMB = 0;

	class BulletManager
	{
		constructor()
		{

		}

		static Init(stage, maxBulletAmount, maxTypeAmount)
		{
			_stage = stage;
			_maxAmount = maxBulletAmount;
			_maxTypeAmount = maxTypeAmount;
			_currentCount = 0;

			_bulletTypePool = [];
			_currentBulletIndex = [];
			_activeIndex = [];
			_inactiveIndexCount = [];
			
			for (let i = 0; i < _maxTypeAmount; i++)
			{
				_bulletTypePool.push([]);
				_currentBulletIndex.push(0);
			}
		}

		static Add(count, type, life, damage, speed, radius, graphicId, isBomb = false)
		{
			if (_currentCount + count < _maxAmount)
			{
				_currentCount += count;
			}
			else
			{
				throw new Error(" Dude! Maximun amount of bullets surpassed. Add more when initializing the manager.");
			}
			
			for (let i = 0; i < count; i++)
				_bulletTypePool[type].push(new Bullet(type, life, damage, speed, radius, graphicId, isBomb));
		}

		static Fire(type, pos, angle, concentration, playerDisplayIndex, life = -1)
		{
			if (!_bulletTypePool[type][_currentBulletIndex[type]]._isAlive)
			{
				_bulletTypePool[type][_currentBulletIndex[type]].Init(pos, angle, concentration, playerDisplayIndex, _stage, life);
			}
			
			if (_currentBulletIndex[type] < _bulletTypePool[type].length - 1)
			{
				_currentBulletIndex[type]++;
			}
			else
			{
				_currentBulletIndex[type] = 0;
			}
		}

		static Update()
		{
			for (let i = 0; i < _maxTypeAmount; i++)
			{
				const length = _bulletTypePool[i].length;

				for (let j = 0; j < length; j++)
				{
					const bullet = _bulletTypePool[i][j];

					if(bullet._isAlive)
						bullet.Update();
				}
			}
		}

		static Clean(rutineClean = false)
		{
			for(let i = 0; i < _maxTypeAmount; i++)
			{
				for(let j = 0; j < _bulletTypePool[i].length; j++)
				{
					if(_bulletTypePool[i][j]._isAlive)
						_bulletTypePool[i][j].Clean(rutineClean);
				}
			}
			
			_bulletTypePool = null;
			_currentBulletIndex = null;
		}

		static GetTypePool(type)
		{
			return _bulletTypePool[type];
		}
	}

	window.BulletManager = BulletManager;

	Object.defineProperty(BulletManager, "PLAYER_BOMB", { get: () => PLAYER_BOMB });
}