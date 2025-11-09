require('dotenv').config();

const mongoose = require('mongoose');
const { connect } = require('../lib/connectMongoose');

const Product = require('../models/Product');
const User = require('../models/User');

const USER_PASSWORD = {
  'kratos@example.com': 'hQXs5Eu0LvqM',
  'zeus@example.com': 'KEP3sIRhRliC',
  'atenea@example.com': 'Q7qqtMVU5zVa',
  'poseidon@example.com': 'mvgMMwfzmb0s',
  'hades@example.com': 'r5T7QaVuKxol',
  'ares@example.com': 'bcMbQ3GN0Fjk',
  'hefesto@example.com': 'TV1ify7b9S0r',
  'hermes@example.com': 'LhQKtAVlRM5s',
  'helios@example.com': 'gZMD1cgtro2A',
  'persefone@example.com': 'CRG9vPoz0eiY',
  'atreus@example.com': 'k1KEeYSnVyFm',
  'freya@example.com': '8hoQzGHRF71p',
  'baldur@example.com': 'oNC8cgrKDEQz',
  'mimir@example.com': 'XBBZk4DMFFwa',
  'thor@example.com': 'Wq9F6v1Ahhja',
  'odin@example.com': 'bolM6CR8b970',
  'sindri@example.com': 'uLiw2FKJRMgo',
  'faye@example.com': 'VKLVVYVKmx9Y',
  'angrboda@example.com': 'cxVSJrDnwr0D',
  'surtr@example.com': 'RpicyD6VWbcZ',
};

async function createSecureUser(email, name, plainPassword) {
  if (!plainPassword) {
    throw new Error(`Password missing for ${email}`);
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
  const userKratos = await createSecureUser(
    'kratos@example.com',
    'Kratos',
    USER_PASSWORD['kratos@example.com'],
  );
  const userZeus = await createSecureUser(
    'zeus@example.com',
    'Zeus',
    USER_PASSWORD['zeus@example.com'],
  );
  const userAtenea = await createSecureUser(
    'atenea@example.com',
    'Atenea',
    USER_PASSWORD['atenea@example.com'],
  );
  const userPoseidon = await createSecureUser(
    'poseidon@example.com',
    'Poseidón',
    USER_PASSWORD['poseidon@example.com'],
  );
  const userHades = await createSecureUser(
    'hades@example.com',
    'Hades',
    USER_PASSWORD['hades@example.com'],
  );
  const userAres = await createSecureUser(
    'ares@example.com',
    'Ares',
    USER_PASSWORD['ares@example.com'],
  );
  const userHefesto = await createSecureUser(
    'hefesto@example.com',
    'Hefesto',
    USER_PASSWORD['hefesto@example.com'],
  );
  const userHermes = await createSecureUser(
    'hermes@example.com',
    'Hermes',
    USER_PASSWORD['hermes@example.com'],
  );
  const userHelios = await createSecureUser(
    'helios@example.com',
    'Helios',
    USER_PASSWORD['helios@example.com'],
  );
  const userPersefone = await createSecureUser(
    'persefone@example.com',
    'Perséfone',
    USER_PASSWORD['persefone@example.com'],
  );
  const userAtreus = await createSecureUser(
    'atreus@example.com',
    'Atreus',
    USER_PASSWORD['atreus@example.com'],
  );
  const userFreya = await createSecureUser(
    'freya@example.com',
    'Freya',
    USER_PASSWORD['freya@example.com'],
  );
  const userBaldur = await createSecureUser(
    'baldur@example.com',
    'Baldur',
    USER_PASSWORD['baldur@example.com'],
  );
  const userMimir = await createSecureUser(
    'mimir@example.com',
    'Mímir',
    USER_PASSWORD['mimir@example.com'],
  );
  const userThor = await createSecureUser(
    'thor@example.com',
    'Thor',
    USER_PASSWORD['thor@example.com'],
  );
  const userOdin = await createSecureUser(
    'odin@example.com',
    'Odín',
    USER_PASSWORD['odin@example.com'],
  );
  const userSindri = await createSecureUser(
    'sindri@example.com',
    'Sindri',
    USER_PASSWORD['sindri@example.com'],
  );
  const userFaye = await createSecureUser(
    'faye@example.com',
    'Faye',
    USER_PASSWORD['faye@example.com'],
  );
  const userAngrboda = await createSecureUser(
    'angrboda@example.com',
    'Angrboda',
    USER_PASSWORD['angrboda@example.com'],
  );
  const userSurtr = await createSecureUser(
    'surtr@example.com',
    'Surtr',
    USER_PASSWORD['surtr@example.com'],
  );

  const [
    kratos,
    zeus,
    atenea,
    poseidon,
    hades,
    ares,
    hefesto,
    hermes,
    helios,
    persefone,
    atreus,
    freya,
    baldur,
    mimir,
    thor,
    odin,
    sindri,
    faye,
    angrboda,
    surtr,
  ] = await User.insertMany([
    userKratos,
    userZeus,
    userAtenea,
    userPoseidon,
    userHades,
    userAres,
    userHefesto,
    userHermes,
    userHelios,
    userPersefone,
    userAtreus,
    userFreya,
    userBaldur,
    userMimir,
    userThor,
    userOdin,
    userSindri,
    userFaye,
    userAngrboda,
    userSurtr,
  ]);

  console.log('Inserting seed products...');
  await Product.insertMany([
    { name: 'Espadas del Caos', owner: kratos._id, price: 2500, tags: ['lifestyle', 'work'] },
    { name: 'Espada del Olimpo', owner: kratos._id, price: 3200, tags: ['work'] },
    { name: 'Cestus de Nemea', owner: kratos._id, price: 850, tags: ['lifestyle'] },
    { name: 'Arco de Apolo', owner: kratos._id, price: 900, tags: ['work', 'lifestyle'] },
    { name: 'Botas de Hermes', owner: kratos._id, price: 1100, tags: ['lifestyle', 'motor'] },
    { name: 'Hacha de Leviatán', owner: kratos._id, price: 3800, tags: ['work'] },
    { name: 'Escudo del Guardián', owner: kratos._id, price: 1700, tags: ['work', 'lifestyle'] },
    { name: 'Guanteletes de Hades', owner: kratos._id, price: 2400, tags: ['work'] },
    { name: 'Rayo de Zeus', owner: zeus._id, price: 4000, tags: ['work'] },
    { name: 'La Égida', owner: zeus._id, price: 1500, tags: ['lifestyle', 'work'] },
    { name: 'Daga de Atenea', owner: atenea._id, price: 1800, tags: ['work'] },
    { name: 'Escudo de Atenea', owner: atenea._id, price: 1300, tags: ['work', 'lifestyle'] },
    { name: 'Escudo de Poseidón', owner: poseidon._id, price: 1500, tags: ['work', 'lifestyle'] },
    { name: 'Tridente de Poseidón', owner: poseidon._id, price: 2800, tags: ['work'] },
    { name: 'Garras del Tártaro', owner: hades._id, price: 1900, tags: ['work'] },
    { name: 'Espada de Ares', owner: ares._id, price: 2200, tags: ['work'] },
    { name: 'Escudo de Ares', owner: ares._id, price: 1100, tags: ['work', 'lifestyle'] },
    { name: 'Martillo de Hefesto', owner: hefesto._id, price: 1600, tags: ['work'] },
    { name: 'Forja de Hefesto', owner: hefesto._id, price: 5000, tags: ['work'] },
    { name: 'Casco de Hermes', owner: hermes._id, price: 1000, tags: ['mobile', 'lifestyle'] },
    { name: 'Cabeza de Helios', owner: helios._id, price: 3500, tags: ['mobile', 'lifestyle'] },
    { name: 'Guante de Perséfone', owner: persefone._id, price: 900, tags: ['lifestyle'] },
    { name: 'Arco de Atreus', owner: atreus._id, price: 1500, tags: ['work', 'lifestyle'] },
    { name: 'Runas Rúnicas', owner: atreus._id, price: 400, tags: ['work', 'mobile'] },
    { name: 'Collar de Brisingamen', owner: freya._id, price: 4500, tags: ['lifestyle'] },
    { name: 'Talismán de la Caza', owner: freya._id, price: 800, tags: ['lifestyle', 'mobile'] },
    {
      name: 'Cota de Malla de Baldur',
      owner: baldur._id,
      price: 2100,
      tags: ['lifestyle', 'work'],
    },
    { name: 'Cabeza de Mímir', owner: mimir._id, price: 2600, tags: ['mobile', 'lifestyle'] },
    { name: 'Martillo Mjölnir', owner: thor._id, price: 5500, tags: ['work'] },
    {
      name: 'Cinturón de la Fuerza (Megingjörð)',
      owner: thor._id,
      price: 2300,
      tags: ['work', 'lifestyle'],
    },
    { name: 'Gungnir', owner: odin._id, price: 5200, tags: ['work'] },
    { name: 'Cuervo de Odín (Huginn/Muninn)', owner: odin._id, price: 1900, tags: ['mobile'] },
    { name: 'Talismán de Sindri', owner: sindri._id, price: 1200, tags: ['lifestyle', 'mobile'] },
    { name: 'Runa de Enanaje', owner: sindri._id, price: 600, tags: ['work', 'mobile'] },
    { name: 'Cenizas de Faye', owner: faye._id, price: 300, tags: ['lifestyle'] },
    { name: 'Runa de la Madre', owner: faye._id, price: 700, tags: ['mobile', 'lifestyle'] },
    { name: 'Runa de Angrboda', owner: angrboda._id, price: 850, tags: ['mobile', 'lifestyle'] },
    { name: 'Corazón de Surtr', owner: surtr._id, price: 6000, tags: ['work'] },
  ]);

  console.log('Init DB completed.');
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('--- ERROR EN initDB ---');
  console.error(err);
  process.exit(1);
});
