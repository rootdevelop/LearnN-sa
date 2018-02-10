/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LearnNTestModule } from '../../../test.module';
import { TopicDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/topic/topic-delete-dialog.component';
import { TopicService } from '../../../../../../main/webapp/app/entities/topic/topic.service';

describe('Component Tests', () => {

    describe('Topic Management Delete Component', () => {
        let comp: TopicDeleteDialogComponent;
        let fixture: ComponentFixture<TopicDeleteDialogComponent>;
        let service: TopicService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [TopicDeleteDialogComponent],
                providers: [
                    TopicService
                ]
            })
            .overrideTemplate(TopicDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TopicDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TopicService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete('123');
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith('123');
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
