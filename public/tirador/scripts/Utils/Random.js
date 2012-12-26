function Random()  {}

Random.getRandomArbitary = function (min, max) {
    return Math.random() * (max - min) + min;
}

Random.getRandomInt = function (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

Random.getRandomBetweenToValues = function (value1, value2) {
	if(Math.random() >= 0.5){
		return value1;
	}

	return value2;
}

