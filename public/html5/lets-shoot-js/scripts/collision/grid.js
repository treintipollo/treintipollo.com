"use strict";

{
	let _nodes = null;
	let _size = null;
	let _stage = null;
	let _tmpNode = null;
	
	let _xSize = 0;
	let _ySize = 0;
	
	const PLAYER = 0;
	const BADDY = 1;
	const BULLET = 2;

	class Grid_Revenge
	{
		constructor()
		{
		}
		
		static Init(size, color, alpha, lineWidth, stage)
		{
			_nodes = [];
			_size = size;
			_stage = stage;
			
			// Node creation
			_xSize = stage.stageWidth / _size.x;
			_ySize = stage.stageHeight / _size.y;
			
			for (let i = 0; i < size.x; i++)
			{
				_nodes.push([]);
				
				for (let j = 0; j < size.y; j++)
					_nodes[i].push(new GridNode(new Point(i, j), new Point(_xSize, _ySize)));
			}
			//Node creation

			//Grid Graphics
			for (let k = 0; k < _size.x - 1; k++)
			{
				let beginVerticalPos = new Point(_nodes[k][0]._realPos.x + _xSize, _nodes[k][0]._realPos.y);
				
				const verticalLine = DynamicGraphics.GetSprite("vertical-line");

				verticalLine.x = beginVerticalPos.x;
				verticalLine.y = beginVerticalPos.y;

				stage.addChild(verticalLine);

				for (let m = 0; m < _size.y - 1; m++)
				{
					let beginHorizontalPos = new Point(_nodes[0][m]._realPos.x, _nodes[0][m]._realPos.y + _ySize);
					
					const horizontalLine = DynamicGraphics.GetSprite("horizontal-line");

					horizontalLine.x = beginHorizontalPos.x;
					horizontalLine.y = beginHorizontalPos.y;

					stage.addChild(horizontalLine);
				}
			}
			//Grid Graphics
			
			//Adding Neighbors to each node
			for (let o = 0; o < size.x; o++)
			{
				for (let f = 0; f < size.y; f++)
				{
					let startNeighborX = o - 1;
					let startNeighborY = f - 1;
					
					for (let w = 0; w < 3; w++)
					{
						for (let r = 0; r < 3; r++)
						{
							if (this.IsIndexValid(startNeighborX + w, startNeighborY + r))
							{
								if (startNeighborX + w !== o || startNeighborY + r !== f)
								{
									_nodes[o][f].AddNeighbor(_nodes[startNeighborX + w][startNeighborY + r]);
								}
								else
								{
									_nodes[o][f].AddNeighbor();
								}
							}
							else
							{
								_nodes[o][f].AddNeighbor();
							}
						}
					}
				}
			}
			
			size = null;
			stage = null;
		}
		
		static SetObjectGridPosition(object, oldNode, type)
		{
			let x, y, objectX, objectY, radius, tmpX, tmpY;
			
			switch(type)
			{
				case Grid_Revenge.PLAYER:
					objectX = object._body.x;
					objectY = object._body.y;
					radius = object._radius;
					
					x = Math.floor(object._body.x / _xSize);
					y = Math.floor(object._body.y / _ySize);
				break;
				case Grid_Revenge.BULLET:
					objectX = object._body.x;
					objectY = object._body.y;
					radius = object._radius;
					
					x = Math.floor(object._body.x / _xSize);
					y = Math.floor(object._body.y / _ySize);
				break;
				case Grid_Revenge.BADDY:
					objectX = object._center.x;
					objectY = object._center.y;
					radius =  object._radius;
					
					x = Math.floor(object._center.x / _xSize);
					y = Math.floor(object._center.y / _ySize);
				break;
			}
			
			_tmpNode = null;
			
			if (oldNode !== null)
			{
				if (oldNode._coord.x !== x || oldNode._coord.y !== y)
				{
					_nodes[oldNode._coord.x][oldNode._coord.y].RemoveObject(object, type);
					
					if (this.IsIndexValid(x, y))
					{
						_nodes[x][y].AddObject(object, type);
						_tmpNode = _nodes[x][y];
					}
					else
					{
						tmpX = -2;
						tmpY = -2;
						
						if (x === -1 || x === _size.x)
						{
							if (!(this.IsFullyOffLimits(objectX, radius, _nodes[_size.x - 1][0]._realPos.x, _xSize)))
							{
								if (x === -1)
								{
									tmpX = 0;
								}
								else if (x === _size.x)
								{
									tmpX = _size.x-1;
								}
							}
						}
						else
						{
							if (x >= 0 && x < _size.x)
							{
								tmpX = x;
							}
						}
					
						if (y === -1 || y === _size.y)
						{
							if (!(this.IsFullyOffLimits(objectY, radius, _nodes[0][_size.y - 1]._realPos.y, _ySize)))
							{
								if (y === -1)
								{
									tmpY = 0;
								}
								else if (y === _size.y)
								{
									tmpY = _size.y-1;
								}
							}
						}
						else
						{
							if (y >= 0 && y < _size.x)
							{
								tmpY = y;
							}
						}
						
						if (this.IsIndexValid(tmpX, tmpY))
						{
							_nodes[tmpX][tmpY].AddObject(object, type);
							_tmpNode = _nodes[tmpX][tmpY];
						}
					}
				}
				else
				{
					_tmpNode = oldNode;
				}
			}
			else
			{
				if (this.IsIndexValid(x, y))
				{
					_nodes[x][y].AddObject(object, type);
					_tmpNode = _nodes[x][y];
				}
				else
				{
					tmpX = -2;
					tmpY = -2;
					
					if (x === -1 || x === _size.x)
					{
						if (!(this.IsFullyOffLimits(objectX, radius, _nodes[_size.x - 1][0]._realPos.x, _xSize)))
						{
							if (x === -1)
							{
								tmpX = 0;
							}
							else if (x === _size.x)
							{
								tmpX = _size.x - 1;
							}
						}
					}
					else
					{
						if (x >= 0 && x < _size.x)
						{
							tmpX = x;
						}
					}
					
					if (y === -1 || y === _size.y)
					{
						if (!(this.IsFullyOffLimits(objectY, radius, _nodes[0][_size.y - 1]._realPos.y, _ySize)))
						{
							if (y === -1)
							{
								tmpY = 0;
							}
							else if (y === _size.y)
							{
								tmpY = _size.y - 1;
							}
						}
					}
					else
					{
						if (y >= 0 && y < _size.x)
						{
							tmpY = y;
						}
					}
					
					if (this.IsIndexValid(tmpX, tmpY))
					{
						_nodes[tmpX][tmpY].AddObject(object, type);
						_tmpNode = _nodes[tmpX][tmpY];
					}
				}
			}
			
			object = null;
			oldNode = null;
			
			return _tmpNode;
		}
		
		static GetNodeSize()
		{
			return new Point(_xSize, _ySize);
		}
		
		static IsFullyOffLimits(pos, radius, limit, spacing)
		{	
			if ((pos + radius) < _nodes[0][0]._realPos.x || (pos - radius) > limit + spacing)
			{
				return true;
			}

			return false;
		}
		
		static IsIndexValid(x, y)
		{
			if (x < 0 || x >= _size.x)
			{
				return false;
			}

			if (y < 0 || y >= _size.y)
			{
				return false;
			}
			
			return true;
		}
	}

	window.Grid_Revenge = Grid_Revenge;

	Object.defineProperty(window.Grid_Revenge, "PLAYER", { get: () => PLAYER });
	Object.defineProperty(window.Grid_Revenge, "BADDY", { get: () => BADDY });
	Object.defineProperty(window.Grid_Revenge, "BULLET", { get: () => BULLET });
}