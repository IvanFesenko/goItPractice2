import {getKnex} from '.';

const knex = getKnex();

export default async () => new Promise(resolve => knex.transaction(resolve));