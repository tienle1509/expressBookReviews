const axios = require('axios').default;

const connectToURL = (url) => {
    const req = axios.get(url);

    req.then(res => {
        console.log(res.data);
    });
}

connectToURL("https://tienltc1509-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");