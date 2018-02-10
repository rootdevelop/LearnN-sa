import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivityResult } from './activity-result.model';
import { ActivityResultService } from './activity-result.service';

@Injectable()
export class ActivityResultPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private activityResultService: ActivityResultService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.activityResultService.find(id)
                    .subscribe((activityResultResponse: HttpResponse<ActivityResult>) => {
                        const activityResult: ActivityResult = activityResultResponse.body;
                        activityResult.timestamp = this.datePipe
                            .transform(activityResult.timestamp, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.activityResultModalRef(component, activityResult);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.activityResultModalRef(component, new ActivityResult());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    activityResultModalRef(component: Component, activityResult: ActivityResult): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.activityResult = activityResult;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
