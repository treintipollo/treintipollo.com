"use strict";

{
	class CollectionUtils
	{
		constructor()
		{

		}
		
		static merge(obj0, obj1)
		{
			for (let p in obj1)
			{
				if (!obj0[p])
				{
					obj0[p] = obj1[p];
				}
			}
			
			return obj0;
		}

		static isDestroyable(obj)
		{
			return CollectionUtils.isFunction(obj.destroy) && CollectionUtils.isFunction(obj.isDestroyable) && obj.isDestroyable();
		}

		static nullDictionary(dic, nullContainer = true)
		{
			if (!dic)
				return;

			if (CollectionUtils.isMap(dic))
			{
				for (let [key, value] of dic.entries())
				{
					if (value && CollectionUtils.isDestroyable(value))
					{
						value.destroy();
					}
					else if (CollectionUtils.isVector(value))
					{
						CollectionUtils.nullVector(value);
					}
					else if (CollectionUtils.isMap(value))
					{
						CollectionUtils.nullDictionary(value);
					}
				}

				dic.clear();
			}
			else if (CollectionUtils.isObject(dic))
			{
				for (let key in dic)
				{
					if (dic[key] && CollectionUtils.isDestroyable(dic[key]))
					{
						dic[key].destroy();
					}
					else if (CollectionUtils.isVector(dic[key]))
					{
						CollectionUtils.nullVector(dic[key]);
					}
					else if (CollectionUtils.isMap(dic[key]))
					{
						CollectionUtils.nullDictionary(dic[key]);
					}
			
					delete dic[key];
				}
			}
		}
		
		static nullVector(vector, nullContainer = true, clearContainer = false)
		{
			if (!vector)
				return;

			for (let i = vector.length - 1; i >= 0; i--)
			{
				const item = vector[i];

				if (item && CollectionUtils.isDestroyable(item))
				{
					item.destroy();
				}
				else if (CollectionUtils.isVector(item))
				{
					CollectionUtils.nullVector(item);
				}
				else if (CollectionUtils.isMap(item))
				{
					CollectionUtils.nullDictionary(item);
				}
				
				vector[i] = null;
			}
			
			if (clearContainer)
				vector.length = 0;
		}
		
		static vectorSortNSpliceNulls(vector)
		{
			let nullCount = 0;

			for (let i = 0; i < vector.length; i++)
			{
				if (!vector[i])
					nullCount++;
			}
			
			vector.sort(CollectionUtils.isNull);
			vector.splice(vector.length - nullCount, nullCount);
		}
		
		static isNull(a, b)
		{
			if (!a)
			{
				return 1;
			}
			else if (!b)
			{
				return -1;
			}
			
			return 0;
		}
		
		static intVectorSortAndSplice(vector, invalidIndexCount)
		{
			vector.sort(isNegative);
			vector.splice(0, invalidIndexCount);
			return 0;
		}
		
		static getItemOfType(vector, type, offset = 0)
		{
			let skipCount = offset;
			
			for (let i = 0; i < vector.length; i++)
			{
				if (vector[i] === null || vector[i] === undefined)
					continue;

				if ((vector[i]).constructor === type)
				{
					if (skipCount <= 0)
					{
						return vector[i];
					}
					else
					{
						skipCount--;
					}
				}
			}
			
			return null;
		}
		
		static isNegative(a, b)
		{
			return a - b;
		}
		
		static isVector(v)
		{
			return Array.isArray(v);
		}

		static isMap(v)
		{
			return v instanceof Map;
		}

		static isObject(v)
		{
			return v instanceof Object;
		}
		
		static isFunction(v)
		{
			return typeof v === "function";
		}

		static isNumber(v)
		{
			return typeof v === "number" && !isNaN(v)
		}
	}

	window.CollectionUtils = CollectionUtils;
}