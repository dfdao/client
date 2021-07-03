/**
 * Remember, you have access these globals:
 * 1. df - Just like the df object in your console.
 * 2. ui - For interacting with the game's user interface.
 *
 * Let's log these to the console when you run your plugin!
 */
class Plugin {
    constructor() {
    }

    find() {
        const selectedPlanet = ui.getSelectedPlanet();
        let planets = df.getAllPlanets();

        let closestPlanet;
        let closestPlanetDist = 999999999999;
        //console.log(planets);
        for (let p of planets) {
            if (p.planetLevel === 0 && p.planetType == 0 && p.perlin >= 14 && p.perlin < 15 && p.location != undefined) {
                if (closestPlanet) {
                    if (df.getDistCoords(p.location.coords, selectedPlanet.location.coords) < closestPlanetDist) {
                        closestPlanet = p;
                        closestPlanetDist = df.getDistCoords(closestPlanet.location.coords, selectedPlanet.location.coords);
                    }
                } else {
                    closestPlanet = p
                    closestPlanetDist = df.getDistCoords(closestPlanet.location.coords, selectedPlanet.location.coords);
                }
            }
        }

        ui.centerPlanet(closestPlanet);
        df.terminal.current.println("https://zkga.me/game1?searchCenter=" + Math.round(closestPlanet.location.coords.x) + "," + Math.round(closestPlanet.location.coords.y));
    }

    /**
     * Called when plugin is launched with the "run" button.
     */
    async render(container) {
        const findButton = document.createElement("button");
        findButton.innerText = "find";
        findButton.style.marginBottom = "10px";
        findButton.addEventListener("click", async () => {
            this.find();
        });
        container.appendChild(findButton);
    }

    /**
     * Called when plugin modal is closed.
     */
    destroy() {}
}

/**
 * And don't forget to export it!
 */
export default Plugin;