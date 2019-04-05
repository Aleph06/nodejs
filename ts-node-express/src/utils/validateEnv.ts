import {
    cleanEnv, str, port
} from 'envalid';

function validateEnv() {
    console.log('called validate env');
    console.log('env', JSON.stringify(process.env));
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
    }, {});
}

export default validateEnv;