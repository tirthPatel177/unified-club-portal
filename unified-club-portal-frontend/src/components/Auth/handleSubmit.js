// API Calling

const doLogin = (e) => {
    e.preventDefault();
    
    console.log(e);
    console.log("Logging in");
};

const doSignup = (e) => {
    e.preventDefault();
    console.log(e);
    console.log("Sigging in");
};

export {doLogin, doSignup};