function StateMachine(executePreviousUpdate, scope){
	this.states = [];
	this.scope = scope;
	this.executePreviousUpdate = executePreviousUpdate;
	this.currentStateId = -1;
	this.lastStateId    = -1;
}

StateMachine.prototype.add = function(init, update, complete) {
	var state = {init:init, update:update, complete:complete};
	return this.states.push(state)-1;		
}

StateMachine.prototype.set = function(stateId, args) {
	if(this.currentStateId != -1 && this.states[this.currentStateId].complete){
		this.states[this.currentStateId].complete.apply(this.scope, args);
	}

	if(this.currentStateId != -1 && this.states[this.currentStateId].update){
		this.lastStateId = this.currentStateId;
	}

	this.currentStateId = stateId;

	if(this.states[this.currentStateId].init){
		this.states[this.currentStateId].init.apply(this.scope, args);
	}
}

StateMachine.prototype.get = function(stateId) {
	return this.states[stateId];
}

StateMachine.prototype.isCurrentState = function(stateId) {
	return this.currentStateId == stateId;;
}

StateMachine.prototype.update = function() {
	if(this.states[this.currentStateId].update){
		if(arguments.length == 0){
			this.states[this.currentStateId].update.call(this.scope);
		}else{
			this.states[this.currentStateId].update.apply(this.scope, arguments);
		}
	}else{
		if(this.executePreviousUpdate){
			if(arguments.length == 0){
				this.states[this.lastStateId].update.call(this.scope);
			}else{
				this.states[this.lastStateId].update.apply(this.scope, arguments);
			}
		}
	}
}

StateMachine.prototype.destroy = function() {
	this.states.length  = 0;
	this.states 	    = null;
	this.scope			= null;
	this.currentStateId = -1;
	this.lastStateId    = -1;
}