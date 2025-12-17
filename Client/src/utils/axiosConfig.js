// First we need to import axios.js
import axios from "axios";


// Next we make an pre-configured 'instance' of axios, template for all my future calls
const instance = axios.create({
  // where we make our configurations
  // tells axios that all our calls from this instance need to go through this base address
  baseURL: "http://localhost:5000",
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";

// Also add/ configure interceptors && all the other cool stuff

export default instance;
