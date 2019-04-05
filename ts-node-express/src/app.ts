import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import RouteContrller from './common/route.controller';
import config from './config/config';
import validateEnv from './utils/validateEnv';
import loggerMiddleware from './middleware/logger';

validateEnv();

class App {

    public app: express.Application;

    constructor(controllers: RouteContrller[]) {
        this.app = express();
        this.app.use(loggerMiddleware);
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: RouteContrller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }

    private connectToTheDatabase() {
        const connectionString = `${config.mongoUser || ''}${config.mongoUser && config.mongoPassword ? ':' : ''}${config.mongoPassword || ''}${config.mongoPath}`;
        mongoose.connect(`mongodb://${connectionString}`, { useNewUrlParser: true })
            .then(connection => {
                console.log(`Connected to MongoDB: ${connectionString}`);
            });
    }

}

export default App;