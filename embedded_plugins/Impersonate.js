 /**
 * Hi there!
 *
 * Looks like you've found the Dark Forest plugins system.
 * Read through this script to learn how to write plugins!
 *
 * Most importantly, you have access these globals:
 * 1. df - Just like the df object in your console.
 * 2. ui - For interacting with the game's user interface.
 *
 * Let's log these to the console when you run your plugin!
 */
console.log(df, ui);
/**
 * Plugins are just TypeScript (or modern JavaScript, if you prefer), so you can use imports, too!
 */
// @ts-ignore
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
/**
 * A plugin is a Class with render and destroy methods.
 * Other than that, you are free to do whatever, so be careful!
 */
class Plugin {
    /**
     * A constructor can be used to keep track of information.
     */
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 150;
    }
    /**
     * A plugin's render function is called once.
     * Here, you can insert custom html into a game modal.
     * You render any sort of UI that makes sense for the plugin!
     */
     async render(div) {
      div.style.width = '400px';

      let label = document.createElement('label');
      label.innerText = 'who will be impersonating you?';
      let input = document.createElement('input');
      input.type = 'text';
      input.style.color = 'green';
 
      let button = document.createElement('button');
      //button.style.width = '100%';
      button.style.marginBottom = '10px';
      button.innerHTML = 'impersonate Me!';
      button.onclick = () => {
        console.log(`${input.value}`)
      };
 
     div.appendChild(label);
     div.appendChild(input);
     div.appendChild(button);
   }
    /**
     * When this is unloaded, the game calls the destroy method.
     * So you can clean up everything nicely!
     */
    destroy() {
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
/**
 * For the game to know about your plugin, you must export it!
 *
 * Use `export default` to expose your plugin Class.
 */
export default Plugin;
