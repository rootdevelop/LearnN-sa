/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LearnNTestModule } from '../../../test.module';
import { ActivityResultDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/activity-result/activity-result-delete-dialog.component';
import { ActivityResultService } from '../../../../../../main/webapp/app/entities/activity-result/activity-result.service';

describe('Component Tests', () => {

    describe('ActivityResult Management Delete Component', () => {
        let comp: ActivityResultDeleteDialogComponent;
        let fixture: ComponentFixture<ActivityResultDeleteDialogComponent>;
        let service: ActivityResultService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LearnNTestModule],
                declarations: [ActivityResultDeleteDialogComponent],
                providers: [
                    ActivityResultService
                ]
            })
            .overrideTemplate(ActivityResultDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ActivityResultDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActivityResultService);
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
