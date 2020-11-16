$(function(){
  var Boss_1_ConfigurationGetter = {

  	ids: {
		ROUND_EYE 		   : 0,
		SNAKE_EYE          : 1,
		INSECT_EYE         : 2,
		ROUND_EYE_STRAIGHT : 3,
		INSECT_EYE_ANGLED  : 4,
		SNAKE_EYE_SNIPER   : 5,
		MULTI_EYE   	   : 6,
		CLONE_EYE		   : 7,
		INSECT_EYE_FOLLOW  : 8,

		RANDOM_MIX_UP_EYE_CYCLE : 0,
		RANDOM_EYE_CYCLE 	    : 1,
	  
		TENTACLE_IDLE_MOTION 	  : 0,
		TENTACLE_OSCILATION_MOTION: 1,

		SHAKE_MOTION          : 0,
		AIM_MOTION            : 1,
		IDLE_MOTION           : 2,
		DEATH_1_MOTION        : 3,
		DEATH_2_MOTION        : 4,
		INIT_DEATH_MOTION     : 5,
		TENTACLE_DESTROYED    : 6,
		BIG_DAMAGED 		  : 7,
		LIGHT_DAMAGED 	      : 8,
		HELPER_INITIAL_MOTION : 9,
  	},

	//chargeRadius, chargeColor, chargeParticleSize, burstColor1, burstColor2, burstParticleSize, burst1ParticlesInCycle, beam1ParticlesInCycle, beam2ParticlesInCycle, beam1ParticlesLife, beam2ParticlesLife, beamParticleSize			   
	beamProps_1:[120, "#FFFFFF", 7, "#FF0000", "#FFFF00", 4, 1, 2, 2, 30, 15, 5],
	beamProps_2:[60,  "#FFFFFF", 4, "#11D3ED", "#E045F5", 2, 1, 2, 2, 20, 10, 5],
	
	//size, pieces, shotTime, shotDelay
	straightBeamProps_1:[ 10, 22, 1500, 400 ],
	straightBeamProps_2:[ 10, 35, 1000, 400 ],
	
	//size, pieces, shotTime, shotDelay, angleOffset
	twinBeam1Props_1:[10, 22, 2000, 400, 15 ],
	twinBeam2Props_1:[10, 22, 2000, 400, -15],
	
	//helperAmount, helperRadius
	backUpProps_1:[ 3, 200, {
		p1:{angle:270 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_2"},
		p2:{angle:220 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Beam_1"},
		p3:{angle:320 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Beam_1"}
	}],

	backUpProps_2:[ 2, 200, {
		p1:{angle:300 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_1"},
		p2:{angle:240 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_1"},
	}],

	backUpProps_3:[ 2, 200, {
		p1:{angle:300 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Multi_1"},
		p2:{angle:240 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Multi_2"},
	}],

	backUpProps_4:[ 2, 200, {
		// p1:{angle:270 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_1"},
		p1:{angle:300 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_2"},
		p2:{angle:240 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_Sniper_2"},
	}],

	//rightAngle, leftAngle
	angledBeamProps_1:[ 65, 115 ], 
	
	//Types of shots the sniper attack.
	sniperShotTypes : {
		BIG_FIREBALL       : {size:10, speed:200, type:"Fireball", angleOffset:0},
		FAST_BIG_FIREBALL  : {size:10, speed:350, type:"Fireball", angleOffset:0},
		SMALL_FIREBALL     : {size:5,  speed:200, type:"Fireball", angleOffset:0},
		FAST_SMALL_FIREBALL: {size:5,  speed:300, type:"Fireball", angleOffset:0}
	},

	//This is used by the boss to get the proper shot from the ids from the objects like sniperProps_1 right below this.
  	getShot: function(t){
		//If the clone type already exists, I return that.
		if(this.sniperShotTypes[t]){
			return this.sniperShotTypes[t];
		}

		//Otherwise I go ahead and create it.
		var shotData = t.split("_#_");
		var shot =  jQuery.extend(true, {}, this.sniperShotTypes[shotData[0]]);

		shot.angleOffset = parseInt(shotData[1]);
		
		//Here I cache the shot data for later.
		this.sniperShotTypes[t] = shot;

		return this.sniperShotTypes[t];
	},

	//Sniper Shot/Spread properties
	sniperProps_1:{ 
		spreads:[ 
			{
				spreadDelay:300,
				spreadInfo:[
					["BIG_FIREBALL_#_5"  ,
					 "BIG_FIREBALL_#_-5"],

					["BIG_FIREBALL_#_0"  ,
					 "BIG_FIREBALL_#_10" ,
					 "BIG_FIREBALL_#_-10"],
					  
					["BIG_FIREBALL_#_15" ,
					 "BIG_FIREBALL_#_5"  ,
					 "BIG_FIREBALL_#_-15",
					 "BIG_FIREBALL_#_-5" ] 
				]
			},
			{
				spreadDelay:100,
				spreadInfo:[
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"]
				]
			}
		]
	}, 

	sniperProps_2:{ 
		spreads:[ 
			{
				spreadDelay:200,
				spreadInfo:[
					["FAST_SMALL_FIREBALL_#_15",
					 "FAST_SMALL_FIREBALL_#_-15"],

					["FAST_SMALL_FIREBALL_#_15",
					 "FAST_SMALL_FIREBALL_#_-15"],

					["FAST_SMALL_FIREBALL_#_15",
					 "FAST_SMALL_FIREBALL_#_-15"],

					["FAST_SMALL_FIREBALL_#_15",
					 "FAST_SMALL_FIREBALL_#_-15"],

					["FAST_SMALL_FIREBALL_#_15",
					 "FAST_SMALL_FIREBALL_#_-15"],

					["FAST_BIG_FIREBALL_#_5"] ,
					["FAST_BIG_FIREBALL_#_0"] ,
					["FAST_BIG_FIREBALL_#_-5"],
					["FAST_BIG_FIREBALL_#_5"] ,
					["FAST_BIG_FIREBALL_#_0"] ,
					["FAST_BIG_FIREBALL_#_-5"],
					["FAST_BIG_FIREBALL_#_5"] ,
					["FAST_BIG_FIREBALL_#_0"] ,
					["FAST_BIG_FIREBALL_#_-5"]  
				]
			},
			{
				spreadDelay:150,
				spreadInfo:[
					["FAST_SMALL_FIREBALL_#_10"],
					["FAST_SMALL_FIREBALL_#_10"],
					["FAST_SMALL_FIREBALL_#_10"],

					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],
					["FAST_BIG_FIREBALL_#_0"],

					["FAST_SMALL_FIREBALL_#_-10"],
					["FAST_SMALL_FIREBALL_#_-10"],
					["FAST_SMALL_FIREBALL_#_-10"]
				]
			}
		]
	},

	sniperProps_3:{ 
		spreads:[ 
			{
				spreadDelay:300,
				spreadInfo:[
					["BIG_FIREBALL_#_20",
					 "BIG_FIREBALL_#_-20"],

					["BIG_FIREBALL_#_15",
					 "BIG_FIREBALL_#_-15"],

					["BIG_FIREBALL_#_20",
					 "BIG_FIREBALL_#_-20"],

					["BIG_FIREBALL_#_15",
					 "BIG_FIREBALL_#_-15"],

					["BIG_FIREBALL_#_20",
					 "BIG_FIREBALL_#_-20"],

					["BIG_FIREBALL_#_15",
					 "BIG_FIREBALL_#_-15"],

					 ["FAST_SMALL_FIREBALL_#_15",
					  "FAST_SMALL_FIREBALL_#_-15",
					  "FAST_SMALL_FIREBALL_#_10",
					  "FAST_SMALL_FIREBALL_#_-10"],

					 ["FAST_SMALL_FIREBALL_#_15",
					  "FAST_SMALL_FIREBALL_#_-15",
					  "FAST_SMALL_FIREBALL_#_10",
					  "FAST_SMALL_FIREBALL_#_-10"],

					 ["FAST_SMALL_FIREBALL_#_15",
					  "FAST_SMALL_FIREBALL_#_-15",
					  "FAST_SMALL_FIREBALL_#_10",
					  "FAST_SMALL_FIREBALL_#_-10"],

					 ["FAST_SMALL_FIREBALL_#_15",
					  "FAST_SMALL_FIREBALL_#_-15",
					  "FAST_SMALL_FIREBALL_#_10",
					  "FAST_SMALL_FIREBALL_#_-10"],

					 ["FAST_SMALL_FIREBALL_#_-2",
					 "FAST_SMALL_FIREBALL_#_2"],

					 ["FAST_SMALL_FIREBALL_#_-2",
					 "FAST_SMALL_FIREBALL_#_2"]
				]
			}
		]
	},

	sniperProps_Helper_1:{ 
		spreads:[ 
			{
				spreadDelay:350,
				spreadInfo:[
				  	["SMALL_FIREBALL_#_0" ,
				     "SMALL_FIREBALL_#_5" ,
				     "SMALL_FIREBALL_#_-5"],
				  
				  	["SMALL_FIREBALL_#_0" ,
				   	 "SMALL_FIREBALL_#_7" ,
				     "SMALL_FIREBALL_#_-7"]
			    ]
			}
		]
	},

	sniperProps_Helper_2:{ 
		spreads:[ 
			{
				spreadDelay:100,
				spreadInfo:[
				  	["FAST_SMALL_FIREBALL_#_30"],
				  	["FAST_SMALL_FIREBALL_#_25"],
				  	["FAST_SMALL_FIREBALL_#_20"],
				  	["FAST_SMALL_FIREBALL_#_15"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-15"]
			    ]
			},
			{
				spreadDelay:100,
				spreadInfo:[
					["FAST_SMALL_FIREBALL_#_-30"],
				  	["FAST_SMALL_FIREBALL_#_-25"],
				  	["FAST_SMALL_FIREBALL_#_-20"],
				  	["FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_15"]
				]
			}
		]
	},

	sniperProps_SubBoss_1:{ 
		spreads:[ 
			{
				spreadDelay:100,
				spreadInfo:[
				  	["FAST_SMALL_FIREBALL_#_30"],
				  	["FAST_SMALL_FIREBALL_#_25"],
				  	["FAST_SMALL_FIREBALL_#_20"],
				  	["FAST_SMALL_FIREBALL_#_15"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-15"]
			    ]
			},
			{
				spreadDelay:100,
				spreadInfo:[
					["FAST_SMALL_FIREBALL_#_-30"],
				  	["FAST_SMALL_FIREBALL_#_-25"],
				  	["FAST_SMALL_FIREBALL_#_-20"],
				  	["FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_15"]
				]
			},
			{
				spreadDelay:200,
				spreadInfo:[
					["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  
				  	["FAST_SMALL_FIREBALL_#_30"],
				  	["FAST_SMALL_FIREBALL_#_25"],
				  	["FAST_SMALL_FIREBALL_#_20"],
				  	["FAST_SMALL_FIREBALL_#_15"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-15"],

				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_0", "FAST_SMALL_FIREBALL_#_15", "FAST_SMALL_FIREBALL_#_-15"],

				  	["FAST_SMALL_FIREBALL_#_-30"],
				  	["FAST_SMALL_FIREBALL_#_-25"],
				  	["FAST_SMALL_FIREBALL_#_-20"],
				  	["FAST_SMALL_FIREBALL_#_-15"],
				  	["FAST_SMALL_FIREBALL_#_-10"],
				  	["FAST_SMALL_FIREBALL_#_-5"],
				  	["FAST_SMALL_FIREBALL_#_0"],
				  	["FAST_SMALL_FIREBALL_#_5"],
				  	["FAST_SMALL_FIREBALL_#_10"],
				  	["FAST_SMALL_FIREBALL_#_15"]
				]
			}
		]
	},
	
	// Types of clones for the clone attack
	cloneTypes : {
  		BLUE_CLONE  : {name:"CloneShip", endAngle:0, endDistance:0, speed:50  , advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa']},  		
  		GREEN_CLONE : {name:"CloneShip", endAngle:0, endDistance:0, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44']},
  		RED_CLONE   : {name:"CloneShip", endAngle:0, endDistance:0, speed:80  , advanceTime:8 , color:"#f94395", exhaustColor:['#f94395','#f94395','#f94395']}
  	},

  	//This is used by the boss to get the proper clone from the ids from the objects like cloneAttackProps_1 right below this.
  	getClone: function(t){
		//If the clone type already exists, I return that.
		if(this.cloneTypes[t]){
			return this.cloneTypes[t];
		}

		//Otherwise I go ahead and create it.
		var cloneData = t.split("_#_");
		var clone =  jQuery.extend(true, {}, this.cloneTypes[cloneData[0]]);

		var cloneAngleAndDistance = cloneData[1].split("_");

		clone.endAngle    = cloneAngleAndDistance[0];
		clone.endDistance = cloneAngleAndDistance[1];

		//Here I cache the clone data for later.
		this.cloneTypes[t] = clone;

		return this.cloneTypes[t];
	},

	//Parameters for clone generator attack, and clone formations
	cloneAttackProps_1:{cloneWaveDelay:2200,
						cloneWaveAmount:5,

						cloneWaves:
						[ 	 //Big Group
							 ["BLUE_CLONE_#_270_120" ,
							  "GREEN_CLONE_#_200_150",
							  "GREEN_CLONE_#_340_150"],
							
							 //Sigles
							 [ "GREEN_CLONE_#_340_150"  ],
							 [ "RED_CLONE_#_270_120"    ],
							 [ "GREEN_CLONE_#_340_150"  ],
							 [ "BLUE_CLONE_#_270_120"   ],
							 
							 //Big Group
							 ["BLUE_CLONE_#_300_120",
							  "BLUE_CLONE_#_240_120",
							  "BLUE_CLONE_#_200_150",
							  "BLUE_CLONE_#_340_150"],
							 
							 //Singles
							 [ "BLUE_CLONE_#_340_150" ],
							 [ "RED_CLONE_#_240_120"  ],
							 [ "BLUE_CLONE_#_340_150" ],
							 [ "BLUE_CLONE_#_240_120" ],
							 
							 //Big Group
							 ["BLUE_CLONE_#_300_120" ,
							  "BLUE_CLONE_#_240_120" ,
							  "GREEN_CLONE_#_200_150",
							  "GREEN_CLONE_#_340_150"],

							 //Singles
							 [ "GREEN_CLONE_#_340_150" ],
							 [ "RED_CLONE_#_200_150"   ],
							 [ "RED_CLONE_#_340_150"   ],
							 [ "GREEN_CLONE_#_200_150" ]
						]
	},

	//Clone-eye relative positions and scale
	cloneEyeProps_1:[
		{xOffset:-0.4, yOffset:-0.5, scale:0.3},
		{xOffset:0.4 , yOffset:-0.5, scale:0.3},

		{xOffset:-0.5, yOffset:0, scale:0.45},
		{xOffset:0.5 , yOffset:0, scale:0.45},
		
		{xOffset:-0.4, yOffset:0.5, scale:0.3},
		{xOffset:0.4 , yOffset:0.5, scale:0.3},

		{xOffset:0, yOffset:-0.75, scale:0.2},
		{xOffset:0, yOffset:0.75, scale:0.2},				
	],

	//Parameters for the shots fired by the "Multi Eye"
	multiShotProps_1: {chargeRadii:30, 
					   chargeColor:"#FFFFFF", 
					   chargeParticleSize:2, 
					   shotColor:"#FF0000", 
					   formationTime:0.5, 
					   shotRadius:30, 
					   shotSpeed:350, 
					   shotCount:10, 
					   shotDelay:500,
					   rotationSpeed:20
	},
	
	multiShotProps_2: {chargeRadii:30, 
					   chargeColor:"#FFFFFF", 
					   chargeParticleSize:2, 
					   shotColor:"#F280A3", 
					   formationTime:0.5, 
					   shotRadius:15, 
					   shotSpeed:280, 
					   shotCount:3, 
					   shotDelay:700,
					   rotationSpeed:20
	},

	multiShotProps_3: {chargeRadii:30, 
					   chargeColor:"#FFFFFF", 
					   chargeParticleSize:2, 
					   shotColor:"#80D0F2", 
					   formationTime:0.5, 
					   shotRadius:15, 
					   shotSpeed:280, 
					   shotCount:3, 
					   shotDelay:700,
					   rotationSpeed:20
	},

	multiShotProps_4: {chargeRadii:30, 
					   chargeColor:"#FFFFFF", 
					   chargeParticleSize:2, 
					   shotColor:"#FFFF00", 
					   formationTime:0.5, 
					   shotRadius:20, 
					   shotSpeed:300, 
					   shotCount:5, 
					   shotDelay:600,
					   rotationSpeed:10
	},

	//Multi-eye relative positions and scale
	multiEyeProps_1:[
		{xOffset:Math.cos( ( (72) * 1 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 1 )*(Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (72) * 3 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 3 )*(Math.PI/180) )*0.6, scale:0.2},
		{xOffset:Math.cos( ( (72) * 5 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 5 )*(Math.PI/180) )*0.6, scale:0.3},
		{xOffset:Math.cos( ( (72) * 2 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 2 )*(Math.PI/180) )*0.6, scale:0.25},
		{xOffset:Math.cos( ( (72) * 4 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 4 )*(Math.PI/180) )*0.6, scale:0.35}
	],

	multiEyeProps_2:[
		{xOffset:Math.cos( ( (270) )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (270) )*(Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (150) )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (150) )*(Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (30)  )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (30 ) )*(Math.PI/180) )*0.6, scale:0.4}
	],

	multiEyeProps_3:[
		{xOffset:Math.cos( ( (90)  )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (90)  )*( Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (210) )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (210) )*(Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (330) )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (330) )*(Math.PI/180) )*0.6, scale:0.4}	
	],

	multiEyeProps_4:[
		{xOffset:Math.cos( ( (0)   )*(Math.PI/180) )*0.7 , yOffset:Math.sin( ( (0)   )*(Math.PI/180) )*0.7, scale:0.2},
		{xOffset:Math.cos( ( (90)  )*(Math.PI/180) )*0.5 , yOffset:Math.sin( ( (90)  )*(Math.PI/180) )*0.5, scale:0.3},
		{xOffset:Math.cos( ( (180) )*(Math.PI/180) )*0.7 , yOffset:Math.sin( ( (180) )*(Math.PI/180) )*0.7, scale:0.2},
		{xOffset:Math.cos( ( (270) )*(Math.PI/180) )*0.5 , yOffset:Math.sin( ( (270) )*(Math.PI/180) )*0.5, scale:0.3}	
	],

	followProps_1: {speed:6},
  	followProps_2: {speed:5},
  	followProps_3: {speed:4},

	//Parameters for the "blood" particle system that triggers when a tentacle is destroyed.
	tentacleBloodProps_1:{radius:140, range:45, pInterval:1, pColor:"#FF0000", pSize:3, pType:"BurstParticle_Blood", pInCycle:1 },


  	configurations : {},

  	addConfiguration: function(name, configuration) {
  		for(var k in this.ids){
			configuration[k] = this.ids[k];    		
    	}

    	configuration["getCloneType"] = FuntionUtils.bindScope(this, this.getClone);
    	configuration["getShotType"]  = FuntionUtils.bindScope(this, this.getShot);

      	this.configurations[name] = configuration;
    },

    getConfiguration: function(name){
		return this.configurations[name]; 	
    },

    createConfigurations: function(){
    	
    	//No Tentacles.
    	//Single eye each health bar.
    	//No Helpers.
    	//Sniper + Beam.
    	//Own Sniper Spread Pattern.

    	this.addConfiguration("Boss_1_A", {
    		//size, eyeHeight, isBoss
    		bodyProps:[50, 40, true],

    		//Tentacle propesties
    		tentacleProps:[],

    		//Complex eye types that need configuration
			multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,
    		
    		//Level and abilities
    		abilities:[{eyeTypes:[this.ids.SNAKE_EYE_SNIPER], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:false},
						  
					   {eyeTypes:[this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:false},

					   {eyeTypes:[this.ids.ROUND_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:false}
			],

			//Attack properties
			beamProps 		 :this.beamProps_1,
			straightBeamProps:this.straightBeamProps_1,
			twinBeam1Props 	 :this.twinBeam1Props_1,
			twinBeam2Props 	 :this.twinBeam2Props_1,
			backUpProps 	 :this.backUpProps_1,
			angledBeamProps  :this.angledBeamProps_1, 
			sniperProps 	 :this.sniperProps_1,
			multiShotProps   :this.multiShotProps_1,	
			cloneProps       :this.cloneAttackProps_1,		

			//Misc properties
			tentacleBloodProps:this.tentacleBloodProps_1
    	});

    	//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		//Tentacles. 8 Way tentacle pattern. Low HP tentacles (WeakTentacle) 
    	//Multiple eyes each health bar, after first real HP lost. No Switching between blinks.
    	//No Helpers.
    	//Sniper + Beam + Twin.
    	//Own Sniper Spread Pattern.

    	this.addConfiguration("Boss_1_B", {
    		//size, eyeHeight, isBoss
    		bodyProps:[50, 40, true],

    		//Tentacle propesties
    		tentacleProps:[
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:0  , side:true , type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:45 , side:false, type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:90 , side:true , type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:135, side:false, type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:180, side:true , type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:230, side:false, type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:270, side:true , type:"WeakTentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:315, side:false, type:"WeakTentacle" }
    		],

    		//Complex eye types that need configuration
			multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,
    		
    		//Level and abilities
    		abilities:[{eyeTypes:[this.ids.SNAKE_EYE_SNIPER], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:false},
					   
					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE, this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			//Attack properties
			beamProps 		 :this.beamProps_1,
			straightBeamProps:this.straightBeamProps_1,
			twinBeam1Props 	 :this.twinBeam1Props_1,
			twinBeam2Props 	 :this.twinBeam2Props_1,
			backUpProps 	 :this.backUpProps_1,
			angledBeamProps  :this.angledBeamProps_1, 
			sniperProps 	 :this.sniperProps_2,
			multiShotProps   :this.multiShotProps_1,	
			cloneProps       :this.cloneAttackProps_1,		

			//Misc properties
			tentacleBloodProps:this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		//Tentacles from the beggining. 4 way, pairs tentacle pattern. Low HP tentacles (WeakTentacle) 
		//Rotating tentacles (-360, 360). After first damage.
    	//Multiple eyes each health bar. Switching between blinks.
    	//1 Helper.
    		//Snipe. Own Sniper pattern.
    		//Own helper position
    	//Sniper + Beam + Twin + Back Up.
    	//Own sniper pattern.

    	this.addConfiguration("Boss_1_C", {
    		bodyProps:[50, 40, true],

    		tentacleProps:[
    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:45 , side:true , type:"WeakTentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:45 , side:false, type:"WeakTentacle" },

    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:135, side:true , type:"WeakTentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:135, side:false, type:"WeakTentacle" },

    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:225, side:true , type:"WeakTentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:225, side:false, type:"WeakTentacle" },

    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:315, side:true , type:"WeakTentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:11, range:40, frequency:0.2, angle:315, side:false, type:"WeakTentacle" }
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.SNAKE_EYE_SNIPER], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},
						  
					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:900,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:20,
					   tentacleOscillationMin:-360,
					   tentacleOscillationmax:360,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:900,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:18,
					   tentacleOscillationMin:-360,
					   tentacleOscillationmax:360,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE, this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:15,
					   tentacleOscillationMin:-360,
					   tentacleOscillationmax:360,
					   generateTentacles:true}
			],
			   
			beamProps 		   :this.beamProps_1,
			straightBeamProps  :this.straightBeamProps_1,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_2,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_3,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		//Long tentacles. 4 way pattern. Lots of HP
		//Increasing ascillation
    	//Multiple eyes each health bar. Switching between blinks.
    	//2 Helper.
    		//Multi Shot (3 Eyes).
    		//Own helper position
    	//Beam + Twin + Multi (5 Eyes) + Back Up.

    	this.addConfiguration("Boss_1_D", {
    		bodyProps:[50, 40, true],

    		tentacleProps:[
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:25 , side:false, type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:155, side:true , type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:205, side:false, type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:335, side:true , type:"LongTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:1,
					   tentacleOscillationMin:-20,
					   tentacleOscillationmax:20,
					   generateTentacles:true},
						
					   {eyeTypes:[this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:800,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:3,
					   tentacleOscillationMin:-40,
					   tentacleOscillationmax:40,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.MULTI_EYE, this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:3,
					   tentacleOscillationMin:-60,
					   tentacleOscillationmax:60,
					   generateTentacles:true}
			],
			   
			beamProps 		   :this.beamProps_1,
			straightBeamProps  :this.straightBeamProps_1,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_3,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_1,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		//Original
		//Tentacles. 8 Way tentacle pattern. Rotating
    	//Multiple eyes each health bar. Switching between blinks.
    	//3 Helpers.
    		//2 Straight+Angle
    		//1 Sniper
    			//Own Pattern
    	//Beam + Twin + Back Up
    	
    	this.addConfiguration("Boss_1_E", {
    		//size, eyeHeight, isBoss
    		bodyProps:[50, 40, true],

    		//Tentacle propesties
    		tentacleProps:[
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:0  , side:true , type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:45 , side:false, type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:90 , side:true , type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:135, side:false, type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:180, side:true , type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:230, side:false, type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:10, range:20, frequency:0.2, angle:270, side:true , type:"Tentacle" },
    			{width:30, height:30, segments:20, distance:-30, length:8 , range:10, frequency:0.3, angle:315, side:false, type:"Tentacle" }
    		],

    		//Complex eye types that need configuration
			multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,
    		
    		//Level and abilities
    		abilities:[{eyeTypes:[this.ids.ROUND_EYE], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:20,
					   tentacleOscillationMin:-20,
					   tentacleOscillationmax:20,
					   generateTentacles:false},
						  
					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE, this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:20,
					   tentacleOscillationMin:-70,
					   tentacleOscillationmax:70,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:20,
					   tentacleOscillationMin:-100,
					   tentacleOscillationmax:100,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.ROUND_EYE, this.ids.SNAKE_EYE, this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:20,
					   tentacleOscillationMin:-180,
					   tentacleOscillationmax:180,
					   generateTentacles:true}
			],

			//Attack properties
			beamProps 		 :this.beamProps_1,
			straightBeamProps:this.straightBeamProps_1,
			twinBeam1Props 	 :this.twinBeam1Props_1,
			twinBeam2Props 	 :this.twinBeam2Props_1,
			backUpProps 	 :this.backUpProps_1,
			angledBeamProps  :this.angledBeamProps_1, 
			sniperProps 	 :this.sniperProps_1,
			multiShotProps   :this.multiShotProps_1,	
			cloneProps       :this.cloneAttackProps_1,		

			//Misc properties
			tentacleBloodProps:this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		//Tentacles. 4 Way tentacle pattern. 4 set of 3. 1 Long, 2, short.
    	//Multiple eyes each health bar. Switching between blinks.
    	//2 Helpers.
    		//2 Sniper
    			//Own Pattern
    	//Clone + BackUp + Multi
    	
    	this.addConfiguration("Boss_1_F", {
    		//size, eyeHeight, isBoss
    		bodyProps:[50, 40, true],

    		//Tentacle propesties
    		tentacleProps:[

    			{width:35, height:35, segments:18, distance:-25, length:10, range:30, frequency:0.2 , angle:5, side:true , type:"Tentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:10, range:30, frequency:0.2 , angle:-5, side:false, type:"Tentacle" },
    			
    			{width:35, height:35, segments:18, distance:-25, length:10, range:30, frequency:0.2, angle:185, side:true , type:"Tentacle" },
    			{width:35, height:35, segments:18, distance:-25, length:10, range:30, frequency:0.2, angle:175, side:false, type:"Tentacle" },

    			{width:30, height:30, segments:18, distance:-28, length:18, range:45, frequency:0.15,  angle:0, side:true, type:"LongTentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:18, range:45, frequency:0.15, angle:180, side:true , type:"LongTentacle" },

    			{width:30, height:30, segments:18, distance:-28, length:18, range:45, frequency:0.15,  angle:0, side:false, type:"LongTentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:18, range:45, frequency:0.15, angle:180, side:false, type:"LongTentacle" },
    		],

    		//Complex eye types that need configuration
			multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,
    		
    		//Level and abilities
    		abilities:[{eyeTypes:[this.ids.MULTI_EYE], 
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:5,
					   tentacleOscillationMin:-10,
					   tentacleOscillationmax:10,
					   generateTentacles:true},
						  
					   {eyeTypes:[this.ids.INSECT_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION, 
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:5,
					   tentacleOscillationMin:-20,
					   tentacleOscillationmax:20,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.CLONE_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:5,
					   tentacleOscillationMin:-30,
					   tentacleOscillationmax:30,
					   generateTentacles:true},

					   {eyeTypes:[this.ids.CLONE_EYE],  
					   deathMotion:this.ids.DEATH_1_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:5,
					   tentacleOscillationMin:-50,
					   tentacleOscillationmax:50,
					   generateTentacles:true}
			],

			//Attack properties
			beamProps 		 :this.beamProps_1,
			straightBeamProps:this.straightBeamProps_1,
			twinBeam1Props 	 :this.twinBeam1Props_1,
			twinBeam2Props 	 :this.twinBeam2Props_1,
			backUpProps 	 :this.backUpProps_4,
			
			angledBeamProps  :this.angledBeamProps_1, 
			sniperProps 	 :this.sniperProps_1,
			multiShotProps   :this.multiShotProps_1,

			//Reotcar esto	
			cloneProps       :this.cloneAttackProps_1,		

			//Misc properties
			tentacleBloodProps:this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_Beam_1", {
    		bodyProps:[25, 20, false], 

    		tentacleProps:[
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:45 , side:true , type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:135, side:false, type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:225, side:true , type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:315, side:false, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.ROUND_EYE_STRAIGHT,this.ids.INSECT_EYE_ANGLED], 
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:2500,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_2,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_Sniper_1", {
    		bodyProps:[25, 20, false],
 
    		tentacleProps:[
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:90 , side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:225, side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:315, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_Helper_1,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});
		
		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_Sniper_2", {
    		bodyProps:[25, 20, false],
 
    		tentacleProps:[
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:90 , side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:225, side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:315, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_Helper_2,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_Multi_1", {
    		bodyProps:[30, 25, false], 

    		tentacleProps:[
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:45 , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:135, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:225, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:315, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_2,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.MULTI_EYE], 
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_2,
			multiShotProps     :this.multiShotProps_2,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});		
		
		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_Multi_2", {
    		bodyProps:[30, 25, false], 

    		tentacleProps:[
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:45 , side:false, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:135, side:false, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:225, side:false, type:"BabyTentacle" },
    			{width:20, height:20, segments:13, distance:-18, length:4, range:15, frequency:0.2, angle:315, side:false, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_3,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.MULTI_EYE], 
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_2,
			multiShotProps     :this.multiShotProps_3,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

		this.addConfiguration("SubBoss_1", {
    		bodyProps:[35, 40, true],
 
    		tentacleProps:[
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:0   , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72  , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*2, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*3, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*4, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ids.INSECT_EYE_FOLLOW, this.ids.ROUND_EYE],  
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1500,
					   recoverFromKnockTime:10,
					   tentacleMotion:this.ids.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:2,
					   tentacleOscillationMin:-360,
					   tentacleOscillationmax:360,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_2,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			followProps		   :this.followProps_3,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		this.addConfiguration("SubBoss_2", {
    		bodyProps:[35, 40, true],
 
    		tentacleProps:[
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:0   , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72  , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*2, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*3, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*4, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_4,
			multiShotProps :this.multiShotProps_4,
			
			cloneEyeProps  :this.cloneEyeProps_1,
			cloneProps     :this.cloneAttackProps_1,

    		abilities:[{eyeTypes:[this.ids.INSECT_EYE_FOLLOW, this.ids.MULTI_EYE],  
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1500,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_2,
			followProps		   :this.followProps_2,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		this.addConfiguration("SubBoss_3", {
    		bodyProps:[35, 40, true],
 
    		tentacleProps:[
    			{width:20, height:20, segments:15, distance:-23, length:7 , range:15, frequency:0.2, angle:45 , side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:15, distance:-23, length:7 , range:15, frequency:0.2, angle:135, side:false, type:"BabyTentacle" },
    			{width:20, height:20, segments:15, distance:-23, length:7 , range:15, frequency:0.2, angle:210, side:true, type:"BabyTentacle" },
    			{width:20, height:20, segments:15, distance:-23, length:7 , range:15, frequency:0.2, angle:315, side:false, type:"BabyTentacle" }
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			multiShotProps :this.multiShotProps_1,
			
			cloneEyeProps  :this.cloneEyeProps_1,
			cloneProps     :this.cloneAttackProps_1,

    		abilities:[{eyeTypes:[this.ids.INSECT_EYE_FOLLOW, this.ids.SNAKE_EYE_SNIPER, this.ids.SNAKE_EYE_SNIPER],  
					   deathMotion:this.ids.DEATH_2_MOTION,
					   cycleMode:this.ids.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.ids.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}
			],

			beamProps 		   :this.beamProps_2,
			straightBeamProps  :this.straightBeamProps_2,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_SubBoss_1,
			followProps		   :this.followProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});
     }
  }

  window.Boss_1_ConfigurationGetter = Boss_1_ConfigurationGetter;
});