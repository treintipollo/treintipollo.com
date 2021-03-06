"use strict";

{
	createjs.Point.prototype.IsAlive = function()
	{
		return true;
	}

	const WorkerStub = function() { };

	WorkerStub.prototype.onmessage = (e) =>
	{
		switch (e.data.name)
		{
			case "init":
			{
				ParticleSystemManager.Init(e.data.canvas.getContext("2d"));

				break;
			}
			case "splash-text":
			{
				const pos = new SharedPoint(e.data.args.pointBuffer);
				
				const width = e.data.args.width;
				const height = e.data.args.height;
				const color = e.data.args.color;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, -1, null);
				ParticleSystemManager.SetParticleGenericProps(width, height, 0, color, new Point(1, 10), 3);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 3), 1, new Point(0,5), new Point(0.03, 0.01));
				ParticleSystemManager.SetParticleType("FireWorks");

				break;
			}
			case "player-death":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(20, 20, 0, 0xffae00ff, new Point(20, 80), 60);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");
				
				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, 0xffae00ff, new Point(20, 40), 60);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(2, 8));
				ParticleSystemManager.SetParticleType("Radial");
				
				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(5, 5, 0, 0xffae00ff, new Point(10, 20), 60);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(2, 5));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "bomb-follow":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const size = e.data.args.size;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, 0xffff0000, new Point(5, 10), 5);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(size * 5, pos);
				ParticleSystemManager.SetParticleType("SpiralJunction");
				
				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, 0xff00ff00, new Point(5, 10), 5);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(size * 10, pos);
				ParticleSystemManager.SetParticleType("SpiralJunction");
				
				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, 0xff0000ff, new Point(5, 10), 5);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(size * 15, pos);
				ParticleSystemManager.SetParticleType("SpiralJunction");

				break;
			}
			case "bomb-explosion":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);

				ParticleSystemManager.Add(new CircleArea(100));
				ParticleSystemManager.SetSystemGenericProps(pos, 10, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, 0xffff0000, new Point(20, 80), 20);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");
				
				ParticleSystemManager.Add(new CircleArea(60));
				ParticleSystemManager.SetSystemGenericProps(pos, 15, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, 0xff00ff00, new Point(20, 40), 20);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 5));
				ParticleSystemManager.SetParticleType("Radial");
				
				ParticleSystemManager.Add(new CircleArea(20));
				ParticleSystemManager.SetSystemGenericProps(pos, 20, null);
				ParticleSystemManager.SetParticleGenericProps(5, 5, 0, 0xff0000ff, new Point(10, 20), 20);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(10, 20));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "bullet-clean":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const radius = e.data.args.radius;
				const graphicId = e.data.args.graphicId;

				let fillColor;

				if (graphicId === "red")
					fillColor = 0xffff0000;

				if (graphicId === "green")
					fillColor = 0xff00ff00;

				if (graphicId === "blue")
					fillColor = 0xff0000ff;

				ParticleSystemManager.Add(new MinRadius(radius, false));
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(5, 5, 0, fillColor, new Point(1, 20), 5);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "bullet-kill":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const radius = e.data.args.radius;
				const graphicId = e.data.args.graphicId;

				let fillColor;

				if (graphicId === "red")
					fillColor = 0xffff0000;

				if (graphicId === "green")
					fillColor = 0xff00ff00;

				if (graphicId === "blue")
					fillColor = 0xff0000ff;

				ParticleSystemManager.Add(new MinRadius(radius, false));
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(2, 2, 0, fillColor, new Point(30, 40), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, false, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "shooting-star":
			{
				const pos = new SharedPoint(e.data.args.pointBuffer);
				const color = e.data.args.color;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, -1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, color, new Point(1, 10), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "rocket-move":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const mainColor = e.data.args.mainColor;
				const secondaryColor = e.data.args.secondaryColor;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, mainColor, new Point(10, 15), 7);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, secondaryColor, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "rocket-explosion":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const mainColor = e.data.args.mainColor;
				const secondaryColor = e.data.args.secondaryColor;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, mainColor, new Point(20, 80), 40);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, secondaryColor, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "generator-regen":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(5, 5, 0, color, new Point(10, 20), 5);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(radius, new Point(1, 5));
				ParticleSystemManager.SetParticleType("Junction");

				break;
			}
			case "boss-invinsible":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, 0xff0000ff, new Point(1, 20), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffff0000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 5), radius);
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "boss-1":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new CircleArea(radius));
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, color, new Point(1, 50), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 5));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "boss-2":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new CircleArea(radius));
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, color, new Point(1, 50), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 5));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "boss-3":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(10, 10, 0, color, new Point(1, 20), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(1, 5), radius);
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "big-boss-1":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;
				const radius = e.data.args.radius;

				ParticleSystemManager.Add(new Base_System());
				ParticleSystemManager.SetSystemGenericProps(pos, 1, null);
				ParticleSystemManager.SetParticleGenericProps(12, 12, 0, color, new Point(1, 20), 10);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xffffffff, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(radius * 4, new Point(1, 5));
				ParticleSystemManager.SetParticleType("Junction");

				break;
			}
			case "attack-bit":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;

				ParticleSystemManager.Add(new CircleArea(50));
				ParticleSystemManager.SetSystemGenericProps(pos, 10, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, 0xff000000, new Point(20, 80), 20);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, color, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
			case "bomb-bit":
			{
				const pos = new Point(e.data.args.x, e.data.args.y);
				const color = e.data.args.color;

				ParticleSystemManager.Add(new CircleArea(50));
				ParticleSystemManager.SetSystemGenericProps(pos, 10, null);
				ParticleSystemManager.SetParticleGenericProps(7, 7, 0, color, new Point(20, 80), 20);
				ParticleSystemManager.SetParticleInterpolationOptions(true, true, 0xff000000, new Point(1, 1));
				ParticleSystemManager.SetParticleSpecificProps(new Point(5, 10));
				ParticleSystemManager.SetParticleType("Radial");

				break;
			}
		}
	}

	WorkerStub.prototype.postMessage = function(data)
	{
		this.onmessage({ data: data });
	}

	window.WorkerStub = WorkerStub;
}