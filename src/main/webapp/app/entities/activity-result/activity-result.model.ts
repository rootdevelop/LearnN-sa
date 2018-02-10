import { BaseEntity } from './../../shared';

export class ActivityResult implements BaseEntity {
    constructor(
        public id?: string,
        public user?: string,
        public challengeId?: string,
        public result?: string,
        public timeSpent?: number,
        public timestamp?: any,
    ) {
    }
}
