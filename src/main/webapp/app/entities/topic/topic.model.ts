import { BaseEntity } from './../../shared';

export class Topic implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public description?: string,
        public progress?: string
    ) {
    }
}
