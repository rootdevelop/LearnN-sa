/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LearnNTestModule } from '../../../test.module';
import { ChallengeComponent } from '../../../../../../main/webapp/app/entities/challenge/challenge.component';
import { ChallengeService } from '../../../../../../main/webapp/app/entities/challenge/challenge.service';
import { Challenge } from '../../../../../../main/webapp/app/entities/challenge/challenge.model';

describe('Component Tests', () => {

    describe('Challenge Management Component', () => {
        let comp: ChallengeComponent;
        let fixture: ComponentFixture<ChallengeComponent>;
        let service: ChallengeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [ChallengeComponent],
                providers: [
                    ChallengeService
                ]
            })
            .overrideTemplate(ChallengeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChallengeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChallengeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Challenge('123')],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.challenges[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
