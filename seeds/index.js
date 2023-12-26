if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const fetch = require('node-fetch');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function fetchRandomPhoto(query, width, height) {
    const apiKey = process.env.UNSPLASH_KEY;
    const apiUrl = process.env.UNSPLASH_URL;
    const endPoint = `${apiUrl}/photos/random?query=${query}&client_id=${apiKey}`;

    try {
        const response = await fetch(endPoint);
        if (response.ok) {
            const photoData = await response.json();
            return photoData.urls.raw + `&fit=crop&w=${width}&h=${height}`;
        } else {
            console.log('Failed to fetch photo:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching photo:', error);
        return null;
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const ownerID = "658a05af02ebf55ff0fbffe7";
        const price = Math.floor(Math.random() * 30) + 20;
        const random1000 = Math.floor(Math.random() * 1000);
        const titleDesc = sample(descriptors);
        const titlePlace = sample(places);
        const query = `${titleDesc},${titlePlace}`;
        const imgUrl = await fetchRandomPhoto(query, 300, 300);
        const camp = new Campground({
            owner: ownerID,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${titleDesc} ${titlePlace}`,
            image: imgUrl,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla maiores ullam, sit facere velit repellendus eum delectus blanditiis consequatur, ad quidem quibusdam quisquam rerum placeat aut et asperiores tenetur dicta?`,
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})