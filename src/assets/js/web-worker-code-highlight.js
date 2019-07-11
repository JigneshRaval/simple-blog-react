onmessage = (event) => {
    importScripts('./highlight.pack.js');
    console.log('Web worker : ', event);
    self.hljs.configure({ tabReplace: 4 });
    const result = self.hljs.highlightAuto(event.data);
    postMessage(result.value);
    close();
};
