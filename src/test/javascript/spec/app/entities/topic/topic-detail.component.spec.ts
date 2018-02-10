/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LearnNTestModule } from '../../../test.module';
import { TopicDetailComponent } from '../../../../../../main/webapp/app/entities/topic/topic-detail.component';
import { TopicService } from '../../../../../../main/webapp/app/entities/topic/topic.service';
import { Topic } from '../../../../../../main/webapp/app/entities/topic/topic.model';

describe('Component Tests', () => {

    describe('Topic Management Detail Component', () => {
        let comp: TopicDetailComponent;
        let fixture: ComponentFixture<TopicDetailComponent>;
        let service: TopicService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [TopicDetailComponent],
                providers: [
                    TopicService
                ]
            })
            .overrideTemplate(TopicDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TopicDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TopicService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Topic('123')
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.topic).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
