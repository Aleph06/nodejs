// config.js

const config = {
    mongoUser: process.env.MONGO_USER,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoPath:process.env. MONGO_PATH,
    port: process.env.PORT
};

export default config;