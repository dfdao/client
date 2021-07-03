//what's the holdup? - @0x_bear
let snarkQueue = 0;
let moveQueue = 0;

class Plugin {
    constructor() {
        this.moveLabel = document.createElement('div');
        this.snarkLabel = document.createElement('div');
        this.waitLabel = document.createElement('div');
        this.callLabel = document.createElement('div');

        this.snarkLabel.innerText = `Snarking:: ?`;
        this.moveLabel.innerText = `Executing: ?`;
        this.waitLabel.innerText = `Unconfirmed: ?`;
        this.callLabel.innerText = `Call Queue: ?`;
    }

    calcQueue = () => {
        //console.log('running calcQueue');
        let snarking = df.snarkHelper.snarkProverQueue.taskQueue.running();
        let snarkQueue = df.snarkHelper.snarkProverQueue.taskQueue.getQueue().length
        let confirming = df.contractsAPI.txRequestExecutor.txQueue.concurrency;
        let confirmQueue = df.contractsAPI.txRequestExecutor.txQueue.taskQueue.length;
        let unconfirmed = df.getUnconfirmedMoves().length - snarking;
        let callQueue = df.contractsAPI.contractCaller.callQueue.taskQueue.length;

        this.snarkLabel.innerText = `Snarking: ${snarking}, ${snarkQueue} queued`;
        this.moveLabel.innerText = `Executing: ${confirming}, ${confirmQueue} queued`;
        this.waitLabel.innerText = `Unconfirmed: ${unconfirmed}`;
        this.callLabel.innerText = `Call Queue: ${callQueue}`;
        //console.log(this.moveLabel.innerText);
        //console.log(this.snarkLabel.innerText);
    }

    async render(container) {
        container.parentElement.style.minHeight = 'unset';
        container.style.width = '200px';
        container.style.minHeight = 'unset';

        container.appendChild(this.snarkLabel);
        container.appendChild(this.moveLabel);
        container.appendChild(this.waitLabel);
        container.appendChild(this.callLabel);

        this.loopedRefresh = setInterval(() => {
            this.calcQueue();
        }, 1 * 1000); // loop refresh every 30 secs.
    }

    destroy() {
        clearInterval(this.loopedRefresh);
    }
}

export default Plugin;