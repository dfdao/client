class Plugin {
    constructor() {
        this.timers = [];
        this.silverFromAsteroidsToRipsDuration = 5 * 60 * 1000; //milliseconds
        this.withdrawSilverTimerDuration = 5 * 60 * 1000; //milliseconds

        this.timers.push(
            setInterval(
                function () {
                    silverFromAsteroidsToRips();
                }, this.silverFromAsteroidsToRipsDuration),
            setInterval(
                function () {
                    withdrawSilverForScore();
                }, this.withdrawSilverTimerDuration)
        );

        setTimeout(function () {
            silverFromAsteroidsToRips();
            withdrawSilverForScore();
        }, 1 * 1000);
    }

    /**
     * Called when plugin is launched with the "run" button.
     */
    async render(container) {
        let label = document.createElement('label');
        label.innerHTML = 'sit back and chill';
        label.innerHTML += '<br>withdraw runs every ' + this.withdrawSilverTimerDuration/1000 + 's';
        label.innerHTML += '<br>silverToAsteroids runs every: ' + this.silverFromAsteroidsToRipsDuration/1000 + 's';
        label.innerHTML += '<br>max silverToAsteroids every run: ' + maxMoves;
        container.appendChild(label);
    }

    /**
     * Called when plugin modal is closed.
     */
    destroy() {
        for(let timer of this.timers) {
            clearInterval(timer);
        }
    }
}

let maxDistributeEnergyPercent = 75;
let maxMoves = 50;
let minSilverThreshold = 500;
let maxSilverAccumulationThresholdPercent = 1;

function isPlanet(planet) { return planet.planetType == 0; }
function isAsteroid(planet) { return planet.planetType == 1; }

function getArrivalsForPlanet(planetId) {
    return df.getAllVoyages().filter(arrival => arrival.toPlanet === planetId).filter(p => p.arrivalTime > Date.now() / 1000);
}

function hasTooMuchInbound(planet, threshold) {
    return getArrivalsForPlanet(planet.locationId).length > threshold;
}

function getDeparturesForPlanet(planetId) {
    return df.getAllVoyages().filter(voyage => voyage.fromPlanet === planetId).filter(p => p.arrivalTime > Date.now() / 1000);
}

function hasDepartures(planet) {
    return getDeparturesForPlanet(planet.locationId).length > 0;
}

function hasOutboundUnconfirmedMoves(planet) {
    return df.getUnconfirmedMoves().filter(move => move.from === planet.locationId).length !== 0
}

function withdrawSilverForScore() {
    let rips = df.getMyPlanets()
        .filter(p => p.planetType == 3)
        .filter(p => p.planetLevel > 2)
        .filter(p => p.silver > 0)
        .filter(p => p.unconfirmedWithdrawSilver === undefined)

    for (let rip of rips) {
        df.terminal.current.println("Withdrawing " + rip.silver);
        df.withdrawSilver(rip.locationId, rip.silver);
    }
}

function silverFromAsteroidsToRips() {
    let allEligibleAsteroids = df.getMyPlanets()
        .filter(p => (
            (isAsteroid(p)) &&
            !hasOutboundUnconfirmedMoves(p) &&
            (p.silver == p.silverCap || p.silver >= p.silverCap * maxSilverAccumulationThresholdPercent) &&
            p.silverCap > minSilverThreshold
        ))

    let totalSilver = 0;
    allEligibleAsteroids.forEach(p => totalSilver += p.silver);
    df.terminal.current.println("Total collectible silver - " + totalSilver);

    let moves = 0;
    for (let pLevel = 7; pLevel > 2; pLevel--) {
        let asteroidsAtLevel = allEligibleAsteroids
            .filter(asteroid => asteroid.planetLevel == pLevel)

        for (let asteroid of asteroidsAtLevel) {
            // find nearest rip
            let rip = findEligibleRip(asteroid);
            if (rip) {
                logAndMoveAllSilver(asteroid, rip);
                moves++;

                if (moves == maxMoves) {
                    df.terminal.current.println("Silver collection completed with max moves");
                    return;
                } // if we've made the max moves for this run
            } else {
                // no rip found nearby, find nearest asteroid at higher levels to accumulate silver on it.
                let higherLevelAsteroid = findEligibleAsteroid(asteroid);
                if (higherLevelAsteroid) {
                    logAndMoveAllSilver(asteroid, higherLevelAsteroid);
                    moves++;

                    if (moves == maxMoves) {
                        df.terminal.current.println("Silver collection completed with max moves");
                        return;
                    } // if we've made the max moves for this run
                } else {
                    df.terminal.current.println("Level " + asteroid.planetLevel + " asteroid with silver " + asteroid.silver + " doesn't have a silver collector nearby");
                }
            }
        }
    }
    df.terminal.current.println("Silver collection completed");
}

function logAndMoveAllSilver(sourcePlanet, targetPlanet) {
    let silverToBeSent = Math.floor(Math.min(sourcePlanet.silver, targetPlanet.silverCap));
    let energyNeeded = Math.ceil(df.getEnergyNeededForMove(sourcePlanet.locationId, targetPlanet.locationId, 1) * 1.005);

    df.terminal.current.println("Sending " + silverToBeSent +
        " silver from level " + sourcePlanet.planetLevel +
        "to level " + targetPlanet.planetLevel + " by using energy " + energyNeeded);
    df.move(sourcePlanet.locationId, targetPlanet.locationId, energyNeeded, silverToBeSent);
}

function getPlanetsInRange(fromPlanet, toPlanets, sendingPercent) {
    const maxDist = df.getMaxMoveDist(fromPlanet.locationId, sendingPercent);
    return toPlanets.filter(toPlanet => df.getDist(fromPlanet.locationId, toPlanet.locationId) < maxDist)
}

function findEligibleRip(planet) {
    let eligibleRips = df.getMyPlanets()
        .filter(p => (
            p.planetType == 3 && // rips
            ui.isOwnedByMe(p) && // owned
            !hasTooMuchInbound(p, 5) &&
            p.planetLevel > 2 &&
            //Math.abs(p.planetLevel - planet.planetLevel) <= 2 && // rip & asteroid <= 2 level diff
            p.silverCap > minSilverThreshold // min silver cap
        ));

    let inRangeEligibleRips = getPlanetsInRange(planet, eligibleRips, maxDistributeEnergyPercent);

    inRangeEligibleRips.sort((r1, r2) => {
        if (r1.planetLevel > r2.planetLevel) {
            return -1;
        } else if (r1.planetLevel == r2.planetLevel) {
            let r1Dist = df.getDist(planet.locationId, r1.locationId);
            let r2Dist = df.getDist(planet.locationId, r2.locationId);
            if (r1Dist < r2Dist) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    });

    return inRangeEligibleRips[0];
}

function findEligibleAsteroid(planet) {
    let eligibleAsteroids = df.getMyPlanets()
        .filter(p => (
            p.planetType == 1 && // asteroids
            ui.isOwnedByMe(p) && // owned
            !hasTooMuchInbound(p,1) &&
            p.planetLevel > planet.planetLevel &&
            p.silverCap > minSilverThreshold // min silver cap
        ));

    let inRangeEligibleAsteroids = getPlanetsInRange(planet, eligibleAsteroids, maxDistributeEnergyPercent);

    inRangeEligibleAsteroids.sort((r1, r2) => {
        if (r1.planetLevel > r2.planetLevel) {
            return -1;
        } else if (r1.planetLevel == r2.planetLevel) {
            let r1Dist = df.getDist(planet.locationId, r1.locationId);
            let r2Dist = df.getDist(planet.locationId, r2.locationId);
            if (r1Dist < r2Dist) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    });

    return inRangeEligibleAsteroids[0];
}


/**
 * And don't forget to export it!
 */
export default Plugin;