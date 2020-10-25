"use strict";

(function ()
{
	try
	{
		// Test classes, let statement and new.target work
		class TestClass
		{
			constructor()
			{
				this._target = new.target;
			}
			
			getTarget()
			{
				return this._target;
			}
		};
		
		let testClass = new TestClass();
		
		if (testClass.getTarget() !== TestClass)
			return;
		
		// Test const works
		const testConst = 77;
		if (testConst !== 77)
			return;
		
		// Test generators, default parameters and for-of
		function* testGenerator(p = 77)
		{
			yield p;
		};
		
		for (let p of testGenerator())
		{
			if (p !== 77)
				return;
		}
		
		// Test spread operator works
		if ([...[1,2,3]][1] !== 2)
			return;
		
		// Test template literals
		if (`${1+2}` !== "3")
			return;
		
		// Test arrow functions
		if ((() => 77)() !== 77)
			return;
		
		// Test async functions
		if (!((async function test() {})() instanceof Promise))
			return;

		window.es6_js_support = true;
	}
	catch (error)
	{
		window.es6_js_support = false;
	}
})();