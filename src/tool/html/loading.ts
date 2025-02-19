export async function loading<T>(componentPromise: Promise<T>) {
    // console.log('loading');

    let loadingDOM = document.createElement('div');
    loadingDOM.style.cssText = `
        width:100%;
        height:.25rem;
        position:absolute;
        bottom:0;
        left:0;
        background:#0002;
        z-index:10000;
    `;
    loadingDOM.id ='loadingDOM';
    const loadingDOM_block = document.createElement('div');
    loadingDOM_block.style.cssText = `
        height:.25rem;
        width:0%;
        background:#0aa1ed;
        border-radius:.125rem;
        transition: width .2s;
    `;
    loadingDOM.appendChild(loadingDOM_block);
    document.body.appendChild(loadingDOM);
    let count = 0;
    let timer = setInterval(() => {
        loadingDOM_block.style.width = count + "%";
        count++;
        if (count >= 98) {
            clearInterval(timer);
        }
    }, 19);
    const component = await componentPromise;
    clearInterval(timer);
    document.body.removeChild(loadingDOM);
    return component;
}