function PlayerShipFactoryConfiguration() {}

PlayerShipFactoryConfiguration.prototype.setUp = function() {
	TopLevel.playerShipFactory.addCallbacksToAction("addInitCallback", [
		{scope:TopLevel.playerData, callback:function(obj){ 
			this.init(obj); 
		} }
	]);

	TopLevel.playerShipFactory.addCallbacksToAction("addDamageReceivedCallback", [
		{scope:TopLevel.playerData			 , callback:function(){ this.powerDownWeapon(); } },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(){ this.showFeedBack("pDown", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);
	
	TopLevel.playerShipFactory.addCallbacksToAction("addAllDamageReceivedCallback", [
		{scope:TopLevel, callback:function(){ 
			this.playerData.decreaseLives(); 
			if(!this.playerData.hasLives()){
				this.textFeedbackDisplayer.showFeedBack("gameover", -200, this.canvas.height/2 );
			}
		} },
	]);

	TopLevel.playerShipFactory.addCallbacksToAction("addInitialPositionReachedCallback", [
		{scope:TopLevel.animationActors, callback:function(ship){ 
			this.showSplash();
		}}
	]);

	TopLevel.playerShipFactory.init(function(){
		if(!TopLevel.playerData.hasLives()){
			TopLevel.resetGame();
			return true;
		}	
		return false;
	});
}
