/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LearnNTestModule } from '../../../test.module';
import { TopicComponent } from '../../../../../../main/webapp/app/entities/topic/topic.component';
import { TopicService } from '../../../../../../main/webapp/app/entities/topic/topic.service';
import { Topic } from '../../../../../../main/webapp/app/entities/topic/topic.model';

describe('Component Tests', () => {

    describe('Topic Management Component', () => {
        let comp: TopicComponent;
        let fixture: ComponentFixture<TopicComponent>;
        let service: TopicService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [TopicComponent],
                providers: [
                    TopicService
                ]
            })
            .overrideTemplate(TopicComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TopicComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TopicService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Topic('123')],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.topics[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
