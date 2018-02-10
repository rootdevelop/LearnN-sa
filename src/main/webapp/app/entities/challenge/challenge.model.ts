import { BaseEntity } from './../../shared';

export class Challenge implements BaseEntity {
    constructor(
        public id?: string,
        public question?: string,
        public answer?: string,
        public language?: string,
        public active?: boolean,
        public snippet?: any,
        public topic?: string,
    ) {
        this.active = false;
    }
}
