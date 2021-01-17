import {loggerMiddleware} from './redux/middlewares/loggerMiddleware';

const coreModule = {
    middlewares: [loggerMiddleware]
}

export default coreModule