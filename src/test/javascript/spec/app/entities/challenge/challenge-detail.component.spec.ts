/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LearnNTestModule } from '../../../test.module';
import { ChallengeDetailComponent } from '../../../../../../main/webapp/app/entities/challenge/challenge-detail.component';
import { ChallengeService } from '../../../../../../main/webapp/app/entities/challenge/challenge.service';
import { Challenge } from '../../../../../../main/webapp/app/entities/challenge/challenge.model';

describe('Component Tests', () => {

    describe('Challenge Management Detail Component', () => {
        let comp: ChallengeDetailComponent;
        let fixture: ComponentFixture<ChallengeDetailComponent>;
        let service: ChallengeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [ChallengeDetailComponent],
                providers: [
                    ChallengeService
                ]
            })
            .overrideTemplate(ChallengeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChallengeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChallengeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Challenge('123')
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.challenge).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
