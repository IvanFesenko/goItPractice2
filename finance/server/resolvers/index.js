import {mergeSchemas} from 'apollo-server-micro';
import schemas from "../schemas";
import userResolvers from './user';

const resolvers = {...userResolvers}

export default mergeSchemas({schemas, resolvers});