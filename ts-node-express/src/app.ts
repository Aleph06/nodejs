import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import RouteController from './common/route.controller';
import config from './config/config';
import validateEnv from './utils/validateEnv';
import loggerMiddleware from './middleware/logger';
// import { Observable, from } from 'rxjs';
// import { tap } from 'rxjs/operators';
import errorMiddleware from './middleware/error.middleware';

validateEnv();

class App {

    public app: express.Application;

    constructor(controllers: RouteController[]) {
        this.app = express();

        this.connectToTheDatabase();
        // .pipe(
        //     tap(() => {
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        //     })
        // ).subscribe(connection => console.log(`Connected to MongoDB: ${connection.version}`),
        //     error => { throw error });
    }

    private initializeMiddlewares() {
        // console.log(`InitializeMiddlewares`);
        this.app.use(bodyParser.json());
        this.app.use(loggerMiddleware);
    }

    private initializeErrorHandling() {
      this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: RouteController[]) {
        // console.log(`initializeControllers`);
        controllers.forEach((controller) => {
            // console.log(`controller ${controller.path}`);
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }

    private connectToTheDatabase()/*: Observable<typeof mongoose> */ {
        const connectionString = `${config.mongoUser || ''}${config.mongoUser && config.mongoPassword ? ':' : ''}${config.mongoPassword || ''}${config.mongoPath}`;
        // return from(
        mongoose.connect(`mongodb://${connectionString}`, { useNewUrlParser: true }) /*);*/
            .then(connection => {
                console.log(`Connected to MongoDB`);
            });
    }

}

export default App;