// API Calling

const handleLogin = (e) => {
    e.preventDefault();
    
    console.log(e);
    console.log("Logging in");
};

const handleSignup = (e) => {
    e.preventDefault();
    console.log(e);
    console.log("Sigging in");
};

export {handleLogin, handleSignup};