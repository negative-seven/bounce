onmessage = function(event) {
    let s = event.data;

    while (s.time > 1e-6) {
        let distanceToBallsCollision = (s.rightBall.position - s.leftBall.position) - 2 * s.BALLS_RADIUS;
        let ballsRelativeVelocity = s.leftBall.velocity - s.rightBall.velocity;
        let timeUntilBallsCollision;
        if (ballsRelativeVelocity >= 0) {
            timeUntilBallsCollision = distanceToBallsCollision / ballsRelativeVelocity;
        }
        else {
            // with current velocities, balls will never collide
            timeUntilBallsCollision = Infinity;
        }

        let timeUntilBallAndWallCollision;
        if (s.rightBall.velocity > 0) {
            timeUntilBallAndWallCollision = (s.WALL_X - (s.rightBall.position + s.BALLS_RADIUS)) / s.rightBall.velocity;
        }
        else {
            // with current velocity, ball will never collide with wall (moving away from it)
            timeUntilBallAndWallCollision = Infinity;
        }

        let simulatedTime = Math.min(s.time, timeUntilBallsCollision, timeUntilBallAndWallCollision);
        for (let ball of [s.leftBall, s.rightBall]) {
            ball.position += ball.velocity * simulatedTime;
        }

        if (simulatedTime == timeUntilBallsCollision) {
            let leftBallVelocity =
                (
                    (s.leftBall.mass - s.rightBall.mass) * s.leftBall.velocity
                    + 2 * s.rightBall.mass * s.rightBall.velocity
                )
                / (s.leftBall.mass + s.rightBall.mass);

            let rightBallVelocity =
                (
                    (s.rightBall.mass - s.leftBall.mass) * s.rightBall.velocity
                    + 2 * s.leftBall.mass * s.leftBall.velocity
                )
                / (s.leftBall.mass + s.rightBall.mass);

            s.leftBall.velocity = leftBallVelocity;
            s.rightBall.velocity = rightBallVelocity;

            s.collisionCount++;
        }
        else if (simulatedTime == timeUntilBallAndWallCollision) {
            s.rightBall.velocity *= -1;

            s.collisionCount++;
        }

        s.time -= simulatedTime;
    }

    postMessage(s);
}