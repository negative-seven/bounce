class Simulation {
	FLOOR_Y = 100;
	WALL_X = 700;
	LEFT_BALL_START_X = 200;
	LEFT_BALL_START_VELOCITY = 80;
	RIGHT_BALL_START_X = 300;
	BALLS_RADIUS = 20;

	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

        if (!window.Worker) {
            alert('Twoja przeglądarka nie wspiera funkcjonalności Web Worker. Strona nie będzie działać poprawnie.');
        } else {
            this.worker = new Worker('static/js/simulation_worker.js');
        }
	}

	run(framerate) {
		this.reset();

		let updateIntervalInMilliseconds = Math.round(1000 / framerate); // note: setInterval converts the interval to an integer anyway
		this.updateInterval = updateIntervalInMilliseconds / 1000;
		setInterval(() => this.update(), updateIntervalInMilliseconds);

		this.worker.onmessage = (e) => { this.updateWithWorkerData(e); }
	}

	reset() {
		this.leftBall = {
			position: this.LEFT_BALL_START_X,
			velocity: this.LEFT_BALL_START_VELOCITY,
			mass: parseInt(document.getElementById('massRatio').value),
			color: document.getElementById('leftBallColor').value,
		}
		this.rightBall = {
			position: this.RIGHT_BALL_START_X,
			velocity: 0,
			mass: 1,
			color: document.getElementById('rightBallColor').value,
		}
		this.collisionCount = 0;
	}

	update() {
		this.worker.postMessage({
			'time': this.updateInterval,
			'leftBall': this.leftBall,
			'rightBall': this.rightBall,
			'collisionCount': this.collisionCount,
			'WALL_X': this.WALL_X,
			'BALLS_RADIUS': this.BALLS_RADIUS,
		});
	}

	updateWithWorkerData(event) {
		this.leftBall = event.data.leftBall;
		this.rightBall = event.data.rightBall;
		this.collisionCount = event.data.collisionCount;

		this.context.fillStyle = 'white';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (let ball of [this.leftBall, this.rightBall]) {
			this.context.fillStyle = ball.color;
			this.context.beginPath();
			this.context.arc(ball.position, this.FLOOR_Y - this.BALLS_RADIUS, this.BALLS_RADIUS, 0, Math.PI * 2);
			this.context.fill();
		}

		this.context.fillStyle = 'black';
		this.context.fillRect(0, this.FLOOR_Y, this.canvas.width, this.canvas.height - this.FLOOR_Y);
		this.context.fillRect(this.WALL_X, 0, this.canvas.width - this.WALL_X, this.canvas.height);

		document.getElementById('collisionCount').innerHTML = this.collisionCount;
	}
}
