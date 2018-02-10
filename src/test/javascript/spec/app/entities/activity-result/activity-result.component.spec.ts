/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LearnNTestModule } from '../../../test.module';
import { ActivityResultComponent } from '../../../../../../main/webapp/app/entities/activity-result/activity-result.component';
import { ActivityResultService } from '../../../../../../main/webapp/app/entities/activity-result/activity-result.service';
import { ActivityResult } from '../../../../../../main/webapp/app/entities/activity-result/activity-result.model';

describe('Component Tests', () => {

    describe('ActivityResult Management Component', () => {
        let comp: ActivityResultComponent;
        let fixture: ComponentFixture<ActivityResultComponent>;
        let service: ActivityResultService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [ActivityResultComponent],
                providers: [
                    ActivityResultService
                ]
            })
            .overrideTemplate(ActivityResultComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ActivityResultComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActivityResultService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ActivityResult('123')],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.activityResults[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
