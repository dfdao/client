class Plugin {
  constructor() {
  }

  async render(container) {
    container.style.width = '400px';

    let label = document.createElement('label');
    label.innerText = 'who will be impersonating you?';
    let input = document.createElement('input');
    input.type = 'text';
    input.style.color = 'green';

    let button = document.createElement('button');
    //button.style.width = '100%';
    button.style.marginBottom = '10px';
    button.innerHTML = 'impersonate Me!';
    button.onclick = async () => {
      await df.contractsAPI.coreContract.impersonateMe(input.value);
      const impersonator = await df.contractsAPI.coreContract.isImpersonator(input.value);
      df.terminal.current.println(`${input.value} is impersonating ${impersonator}`);
    };

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(button);
  }

  destroy() {
  }
}

export default Plugin;
