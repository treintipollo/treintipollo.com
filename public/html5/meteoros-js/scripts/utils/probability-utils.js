"use strict";

{
	class ProbabilityUtils
	{
		static getCummulativeProbabilities(probabilities, result)
		{
			result.push(probabilities[0]);
			
			for (var i = 1; i < probabilities.length; i++)
			{
				result.push(result[i - 1] + probabilities[i]);
			}
		}
		
		static discreteInverseSampling(set)
		{
			var x = Math.random();
			var cum = 0;
			var idx = -1;
			
			do
			{
				idx++;
				cum += set[idx];
			} while (cum < x);
			
			return idx;
		}
	}

	window.ProbabilityUtils = ProbabilityUtils;
}