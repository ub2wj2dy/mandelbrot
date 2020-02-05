(() => {
	// Set up Canvas
	const canvas = document.getElementById('main-canvas');
	const precision = 1;
	const maxIterations = 1000;

	const {width, height} = document.body.getBoundingClientRect();
	canvas.width = width * precision;
	canvas.height = height * precision;
	const ctx = canvas.getContext('2d');

	function color(itter){
		if(itter <= 0){
			return '#000';
		}
		return `hsl(238, 100%, ${Math.pow(itter, 0.1)*100}%)`
	}

	// Start drawing
	function itters(x,y) {
		let realComponentOfResult = x;
		let imaginaryComponentOfResult = y;
		// Set max number of iterations
		for (let i = 0; i < maxIterations; i++) {
			const tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;
			const tempImaginaryComponent = 2.0 * realComponentOfResult * imaginaryComponentOfResult + y;
			realComponentOfResult = tempRealComponent;
			imaginaryComponentOfResult = tempImaginaryComponent;
			// Return a number as a percentage
			if (realComponentOfResult*realComponentOfResult + imaginaryComponentOfResult * imaginaryComponentOfResult > 4) {
				return (i / maxIterations);
			}
		}
		// Return -1 if in set
		return 1;
	}

	const execTimerName = "Execution Timer";
	console.time(execTimerName);
	// Set appearance settings
	const magnificationFactor = precision * 400;
	const panX = precision * width/(2 * magnificationFactor);
	const panY = precision * height/(2 * magnificationFactor);
	for (let x = 0; x < width * precision; x++) {
		for (let y = 0; y < height * precision; y++) {
			const itter = itters(x / magnificationFactor - panX, y / magnificationFactor - panY);
			ctx.fillStyle = color(itter);
			ctx.fillRect(x, y, 1, 1);
		}
	}
	console.timeEnd(execTimerName);
})();
