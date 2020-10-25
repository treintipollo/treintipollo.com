"use strict";

{
	class GridNode
	{
		constructor(coord, size)
		{
			this._coord = coord.clone();
			this._size = size.clone();
			this._realPos = new Point(this._coord.x * size.x, this._coord.y * size.y);
			this._center = new Point(this._realPos.x + this._size.x / 2, this._realPos.y + this._size.y / 2);
			this._baddyPool = [];
			this._bulletPool = [];
			this._neighbors = [];
			
			this._player = null;
		}
		
		AddObject(object, type)
		{
			switch (type)
			{
				case Grid_Revenge.PLAYER:
					this._player = object;
					break;
				case Grid_Revenge.BULLET:
					this._bulletPool.push(object);
					break;
				case Grid_Revenge.BADDY:
					this._baddyPool.push(object);
					break;
			}
		}
		
		RemoveObject(object, type)
		{
			switch (type)
			{
				case Grid_Revenge.PLAYER:
					this._player = null;
					break;
				case Grid_Revenge.BULLET:
					this._bulletPool.splice(this._bulletPool.indexOf(object), 1);
					break;
				case Grid_Revenge.BADDY:
					this._baddyPool.splice(this._baddyPool.indexOf(object), 1);
					break;
			}
		}
		
		AddNeighbor(neighbor = null)
		{
			this._neighbors.push(neighbor);
		}
	}

	window.GridNode = GridNode;
}