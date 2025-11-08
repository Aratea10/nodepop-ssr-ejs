require('dotenv').config();

const mongoose = require('mongoose');
const { connect } = require('../lib/connectMongoose');

const Product = require('../models/Product');
const User = require('../models/User');

const USER_PASSWORD = {
  'atenea@example.com': 'Q7qqtMVU5zVa',
  'ares@example.com': 'bcMbQ3GN0Fjk',
  'kratos@example.com': 'hQXs5Eu0LvqM',
  'freya@example.com': '8hoQzGHRF71p',
};

async function createSecureUser(email, name, plainPassword) {
    if (!plainPassword) {
        throw new Error(`Password missing for ${email}`)
    }
    const user = new User({ email, name, passwordHash: '' });
    await user.setPassword(plainPassword);
    return user;
}

async function main() {
    await connect();

    console.log('Clearing collections...');
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Creating users with individual passwords...');
    const userAtenea = await createSecureUser(
        'atenea@example.com',
        'Atenea',
        USER_PASSWORD['atenea@example.com']
    );
    const userAres = await createSecureUser(
        'ares@example.com',
        'Ares',
        USER_PASSWORD['ares@example.com']
    );
    const userKratos = await createSecureUser(
        'kratos@example.com',
        'Kratos',
        USER_PASSWORD['kratos@example.com']
    );
    const userFreya = await createSecureUser (
        'freya@example.com',
        'Freya',
        USER_PASSWORD['freya@example.com']
    );

    const [atenea, ares, kratos, freya] = await User.insertMany([
        userAtenea,
        userAres,
        userKratos,
        userFreya,
    ]);

    console.log('Inserting seed products...');
    await Product.insertMany([
    { name: 'Égida de Atenea', owner: atenea._id, price: 400, tags: ['work', 'lifestyle'] },
    { name: 'Lanza de Atenea', owner: atenea._id, price: 320, tags: ['work'] },
    { name: 'Búho de Atenea (talismán)', owner: atenea._id, price: 65, tags: ['lifestyle', 'mobile'] },
    { name: 'Espada de Ares', owner: ares._id, price: 410, tags: ['work'] },
    { name: 'Yelmo del Dios de la Guerra', owner: ares._id, price: 270, tags: ['work', 'lifestyle'] },
    { name: 'Carro de combate espartano', owner: ares._id, price: 550, tags: ['motor'] },
    { name: 'Vanaheim Seiðr Grimoire', owner: freya._id, price: 140, tags: ['lifestyle', 'mobile'] },
    { name: 'Capa de bruja de los Vanir', owner: freya._id, price: 230, tags: ['lifestyle'] },
    { name: 'Trineo de lobos de Freya', owner: freya._id, price: 380, tags: ['motor'] },
    { name: 'Espadas del Caos', owner: kratos._id, price: 400, tags: ['work'] },
    { name: 'Hacha de Leviathan', owner: kratos._id, price: 450, tags: ['work'] },
    { name: 'Escudo del Guardián', owner: kratos._id, price: 180, tags: ['work', 'lifestyle'] },
    { name: 'Draupnir', owner: kratos._id, price: 420, tags: ['work'] },
    { name: 'Barca del Lago de los Nueve', owner: kratos._id, price: 300, tags: ['motor'] },
    { name: 'Amuleto rúnico de viaje', owner: kratos._id, price: 75, tags: ['lifestyle', 'mobile'] },
  ]);

    console.log('Init DB completed.');
    await mongoose.connection.close();
}

main().catch((err) => {
    console.error('--- ERROR EN initDB ---');
    console.error(err);
    process.exit(1);
});