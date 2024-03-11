const ExpressError = require("./ExpressError");
const GEOCODE_API_KEY = process.env.GEOCODE_MAPS_CO_KEY;
const URL =  'https://geocode.maps.co';

async function forwardGeoCode(address){
    const entryPoint = `${URL}/search?q=${address}&api_key=${GEOCODE_API_KEY}`;
    const response = await fetch(entryPoint);

    if (!response.ok) {
        throw new ExpressError(`HTTP error! Status: ${response.status}`);
    }
    const codes = await response.json()
    const {lon, lat} = codes[0];
    return {
        type: "Point",
        coordinates: [lon, lat]
    };
}
async function reverseGeoCode(latitude, longitude){
    const entryPoint = `${URL}/reverse?q=lat=${latitude}&lon=${longitude}&api_key=${GEOCODE_API_KEY}`;
    const response = await fetch(entryPoint);

    if (!response.ok) {
        throw new ExpressError(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

module.exports = {geoCode: forwardGeoCode};