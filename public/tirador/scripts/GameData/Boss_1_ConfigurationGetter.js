$(function(){
  var Boss_1_ConfigurationGetter = {

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
		p1:{angle:270 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_2"},
		p2:{angle:220 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_1"},
		p3:{angle:320 * (Math.PI/180), active:false, helperName:"Boss_1_Helper_1"}
	}],
	//rightAngle, leftAngle
	angledBeamProps_1:[ 65, 115 ], 
	
	//Sniper Shot/Spred properties
	sniperProps_1:{ 
		spreadDelay:300,
		spreads:[ 
				  [{size:10, speed:200, type:"Fireball", angleOffset:0},
				   {size:10, speed:200, type:"Fireball", angleOffset:10},
				   {size:10, speed:200, type:"Fireball", angleOffset:20},
				   {size:10, speed:200, type:"Fireball", angleOffset:-10},
				   {size:10, speed:200, type:"Fireball", angleOffset:-20}],
				  
				  [{size:10, speed:200, type:"Fireball", angleOffset:0},
				   {size:10, speed:200, type:"Fireball", angleOffset:10},
				   {size:10, speed:200, type:"Fireball", angleOffset:-10}],
				  
				  [{size:10, speed:200, type:"Fireball", angleOffset:0}] 
				]
	}, 

	sniperProps_2:{ 
		spreadDelay:350,
		spreads:[ 
				  [{size:5, speed:200, type:"Fireball", angleOffset:0},
				   {size:5, speed:200, type:"Fireball", angleOffset:5},
				   {size:5, speed:200, type:"Fireball", angleOffset:-5}],
				  
				  [{size:5, speed:200, type:"Fireball", angleOffset:0},
				   {size:5, speed:200, type:"Fireball", angleOffset:7},
				   {size:5, speed:200, type:"Fireball", angleOffset:-7}],
				]
	}, 
	
	//Parameters for the "blood" particle system that triggers when a tentacle is destroyed.
	tentacleBloodProps_1:{radius:140, range:45, pInterval:1, pColor:"#FF0000", pSize:3, pType:"BurstParticle_Blood", pInCycle:1 },
	//Parameters for the shots fired by the "Multi Eye"
	multiShotProps_1: {chargeRadii:30, 
					   chargeColor:"#FFFFFF", 
					   chargeParticleSize:2, 
					   shotColor:"#FF0000", 
					   formationTime:0.5, 
					   shotRadius:30, 
					   shotSpeed:350, 
					   shotCount:10, 
					   shotDelay:500
					  },

	//Parameters for clone generator attack, and the clones generated
	cloneAttackProps_1:{cloneWaveDelay:2000,
						cloneWaveAmount:5,
						cloneWaves:
						[ 
							 [ 
							   {name:"CloneShip", endAngle:270, endDistance:120, speed:50  , advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:200, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] },
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:270, endDistance:120, speed:80  , advanceTime:8, color:"#f94395", exhaustColor:['#f94395','#f94395','#f94395'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:270, endDistance:120, speed:50  , advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] } 
							 ],
							 [
							   {name:"CloneShip", endAngle:300, endDistance:120, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:240, endDistance:120, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:200, endDistance:150, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] } 
							 ],
							 [
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] } 
							 ],
							 [
							   {name:"CloneShip", endAngle:240, endDistance:120, speed:80  , advanceTime:8, color:"#f94395", exhaustColor:['#f94395','#f94395','#f94395'] }
							 ],
							 [
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] } 
							 ],
							 [
							   {name:"CloneShip", endAngle:240, endDistance:120, speed:50, advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] }
							 ],
							 [ 
							   {name:"CloneShip", endAngle:300, endDistance:120, speed:50  , advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:240, endDistance:120, speed:50  , advanceTime:10, color:"#44b7fa", exhaustColor:['#44b7fa','#44b7fa','#44b7fa'] },
							   {name:"CloneShip", endAngle:200, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] },
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:200, endDistance:150, speed:80  , advanceTime:8, color:"#f94395", exhaustColor:['#f94395','#f94395','#f94395'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:340, endDistance:150, speed:80  , advanceTime:8, color:"#f94395", exhaustColor:['#f94395','#f94395','#f94395'] } 
							 ],
							 [ 
							   {name:"CloneShip", endAngle:200, endDistance:150, speed:-100, advanceTime:10, color:"#88fa44", exhaustColor:['#88fa44','#88fa44','#88fa44'] } 
							 ]
						]	
					   },

	//Multi-eye relative positions and scale
	multiEyeProps_1:[
		{xOffset:Math.cos( ( (72) * 1 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 1 )*(Math.PI/180) )*0.6, scale:0.4},
		{xOffset:Math.cos( ( (72) * 3 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 3 )*(Math.PI/180) )*0.6, scale:0.2},
		{xOffset:Math.cos( ( (72) * 5 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 5 )*(Math.PI/180) )*0.6, scale:0.3},
		{xOffset:Math.cos( ( (72) * 2 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 2 )*(Math.PI/180) )*0.6, scale:0.25},
		{xOffset:Math.cos( ( (72) * 4 )*(Math.PI/180) )*0.6 , yOffset:Math.sin( ( (72) * 4 )*(Math.PI/180) )*0.6, scale:0.35},
	],

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

  	configurations : {},

  	addConfiguration: function(name, configuration) {
      	this.configurations[name] = configuration;
    },

    getConfiguration: function(scope, name){
    	var conf = this.configurations[name];

    	conf.ROUND_EYE 		    = this.ROUND_EYE;
		conf.SNAKE_EYE          = this.SNAKE_EYE;
		conf.INSECT_EYE         = this.INSECT_EYE;
		conf.ROUND_EYE_STRAIGHT = this.ROUND_EYE_STRAIGHT;
		conf.INSECT_EYE_ANGLED  = this.INSECT_EYE_ANGLED;
		conf.SNAKE_EYE_SNIPER   = this.SNAKE_EYE_SNIPER;
		conf.MULTI_EYE   		= this.MULTI_EYE;
		conf.CLONE_EYE   		= this.CLONE_EYE;
		conf.INSECT_EYE_FOLLOW  = this.INSECT_EYE_FOLLOW;

		conf.RANDOM_MIX_UP_EYE_CYCLE = this.RANDOM_MIX_UP_EYE_CYCLE;
		conf.RANDOM_EYE_CYCLE 	     = this.RANDOM_EYE_CYCLE;

		conf.TENTACLE_IDLE_MOTION 	    = this.TENTACLE_IDLE_MOTION;
		conf.TENTACLE_OSCILATION_MOTION = this.TENTACLE_OSCILATION_MOTION;

		conf.SHAKE_MOTION          = this.SHAKE_MOTION;
		conf.AIM_MOTION            = this.AIM_MOTION;
		conf.IDLE_MOTION           = this.IDLE_MOTION;
		conf.DEATH_1_MOTION        = this.DEATH_1_MOTION;
		conf.DEATH_2_MOTION        = this.DEATH_2_MOTION;
		conf.INIT_DEATH_MOTION     = this.INIT_DEATH_MOTION;
		conf.TENTACLE_DESTROYED    = this.TENTACLE_DESTROYED;
		conf.BIG_DAMAGED 		   = this.BIG_DAMAGED;
		conf.LIGHT_DAMAGED 	       = this.LIGHT_DAMAGED;
		conf.HELPER_INITIAL_MOTION = this.HELPER_INITIAL_MOTION;
		
		return conf; 	
    },

    createConfigurations: function(){
    	
    	//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_A", {
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
    		abilities:[{eyeTypes:[this.INSECT_EYE], 
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},
						  
					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE],  
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},

					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE,this.INSECT_EYE],  
					   deathMotion:this.DEATH_1_MOTION,
					   cycleMode:this.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}],

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

    	this.addConfiguration("Boss_1_B", {
    		bodyProps:[50, 40, true],

    		tentacleProps:[
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:45 , side:true , type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:45 , side:false, type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:135, side:true , type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:135, side:false, type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:225, side:true , type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:225, side:false, type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:315, side:true , type:"Tentacle" },
    			{width:30, height:30, segments:18, distance:-28, length:11, range:60, frequency:0.2, angle:315, side:false, type:"Tentacle" }
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.SNAKE_EYE], 
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},
						  
					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE],  
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true},

					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE,this.INSECT_EYE],  
					   deathMotion:this.DEATH_1_MOTION,
					   cycleMode:this.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}],
			   
			beamProps 		   :this.beamProps_1,
			straightBeamProps  :this.straightBeamProps_1,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_1,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_C", {
    		bodyProps:[50, 40, true],

    		tentacleProps:[
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:25 , side:false, type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:155, side:true , type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:205, side:false, type:"LongTentacle" },
    			{width:30, height:30, segments:20, distance:-28, length:20, range:30, frequency:0.25, angle:335, side:true , type:"LongTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.SNAKE_EYE_SNIPER], 
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:1,
					   tentacleOscillationMin:-20,
					   tentacleOscillationmax:20,
					   generateTentacles:true},
						  
					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE],  
					   deathMotion:this.DEATH_1_MOTION, 
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:3,
					   tentacleOscillationMin:-40,
					   tentacleOscillationmax:40,
					   generateTentacles:true},

					   {eyeTypes:[this.ROUND_EYE,this.SNAKE_EYE,this.INSECT_EYE],  
					   deathMotion:this.DEATH_1_MOTION,
					   cycleMode:this.RANDOM_MIX_UP_EYE_CYCLE, 
					   blinkTime:1000,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:2,
					   tentacleOscillationMin:-60,
					   tentacleOscillationmax:60,
					   generateTentacles:true}],
			   
			beamProps 		   :this.beamProps_1,
			straightBeamProps  :this.straightBeamProps_1,
			twinBeam1Props 	   :this.twinBeam1Props_1,
			twinBeam2Props 	   :this.twinBeam2Props_1,
			backUpProps 	   :this.backUpProps_1,
			angledBeamProps    :this.angledBeamProps_1, 
			sniperProps 	   :this.sniperProps_1,
			multiShotProps     :this.multiShotProps_1,
			cloneProps         :this.cloneAttackProps_1,

			tentacleBloodProps :this.tentacleBloodProps_1
    	});

		//----------------------------------------------------------------------------
		//----------------------------------------------------------------------------

    	this.addConfiguration("Boss_1_Helper_1", {
    		bodyProps:[25, 20, false], 

    		tentacleProps:[
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:45 , side:true , type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:135, side:false, type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:225, side:true , type:"BabyTentacle" },
    			{width:10, height:10, segments:13, distance:-20, length:4, range:15, frequency:0.4, angle:315, side:false, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.ROUND_EYE_STRAIGHT,this.INSECT_EYE_ANGLED], 
					   deathMotion:this.DEATH_2_MOTION,
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2500,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}],

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

    	this.addConfiguration("Boss_1_Helper_2", {
    		bodyProps:[25, 20, false],
 
    		tentacleProps:[
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:90 , side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:225, side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:15, distance:-20, length:4, range:12, frequency:0.5, angle:315, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.SNAKE_EYE_SNIPER],  
					   deathMotion:this.DEATH_2_MOTION,
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2500,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_IDLE_MOTION,
					   generateTentacles:true}],

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

		this.addConfiguration("Boss_1_Helper_3", {
    		bodyProps:[25, 20, false],
 
    		tentacleProps:[
    			{width:10, height:10, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:0   , side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72  , side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*2, side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*3, side:true, type:"BabyTentacle" },
    			{width:10, height:10, segments:10, distance:-20, length:4, range:22, frequency:0.2, angle:72*4, side:true, type:"BabyTentacle" },
    		],

    		multiEyeProps  :this.multiEyeProps_1,
			cloneEyeProps  :this.cloneEyeProps_1,

    		abilities:[{eyeTypes:[this.INSECT_EYE_FOLLOW, this.ROUND_EYE],  
					   deathMotion:this.DEATH_2_MOTION,
					   cycleMode:this.RANDOM_EYE_CYCLE, 
					   blinkTime:2500,
					   recoverFromKnockTime:4,
					   tentacleMotion:this.TENTACLE_OSCILATION_MOTION,
					   tentacleOscillationTime:2,
					   tentacleOscillationMin:-360,
					   tentacleOscillationmax:360,
					   generateTentacles:true}],

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
     }
  }

  window.Boss_1_ConfigurationGetter = Boss_1_ConfigurationGetter;
});