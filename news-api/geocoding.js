// geocoding.js
const axios = require('axios');

async function reverseGeocode(lat, lon) {
  const LOCATIONIQ_URL = `https://us1.locationiq.com/v1/reverse?key=pk.8ecec6f8b88e3e78fc9d9f5e80a5a25e&lat=${lat}&lon=${lon}&format=json`;
  
  try {
    console.log(`Making request to: ${LOCATIONIQ_URL}`);  // Debugging the request URL

    const response = await axios.get(LOCATIONIQ_URL);

    console.log('Response received:', response.data);  // Debugging the response

    if (response.data && response.data.address) {
      const address = response.data.address;
      const city = address.city || address.town || address.village;
      return city;
    } else {
      throw new Error('No address found for the given coordinates');
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error.message);
    throw error;
  }
};

const forwardGeocoding = async (region) => {
  const LOCATIONIQ_URL = `https://us1.locationiq.com/v1/search?key=pk.8ecec6f8b88e3e78fc9d9f5e80a5a25e&q=${region}&format=json`
  try {
    const response = await axios.get(LOCATIONIQ_URL);

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return { lat: 0, lng: 0 };
  } catch (error) {
    console.error(`Error fetching coordinates for region "${region}":`, error.message);
    return { lat: 0, lng: 0 };
  }
};

module.exports = {
  reverseGeocode,
  forwardGeocoding
};
