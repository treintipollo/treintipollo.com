function DestroyUtils() {

}

DestroyUtils.destroyAllProperties = function(obj) {
	for(var name in obj) {
		if(obj.hasOwnProperty(name)){
			delete obj[name];
		}
	}
}