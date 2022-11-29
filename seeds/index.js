const mongoose = require('mongoose');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conncetion error: "));
db.once('open', () => {
    console.log("Database connected!")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6366961fd6367475b9a1e991",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe eius ratione molestiae sapiente dicta delectus ipsa, dignissimos eos? Iste perferendis nobis mollitia impedit qui id incidunt, itaque culpa at?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]

            },
            images: [{
                    url: 'https://res.cloudinary.com/dglikuuvz/image/upload/v1668192575/YelpCamp/jsyczm3tvs7argo1qebt.jpg',
                    filename: 'YelpCamp/jsyczm3tvs7argo1qebt',

                },
                {
                    url: 'https://res.cloudinary.com/dglikuuvz/image/upload/v1668192582/YelpCamp/pw1l4cmc9oykfo78czwa.jpg',
                    filename: 'YelpCamp/pw1l4cmc9oykfo78czwa',

                }
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});