import './vendor.ts';

import {NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { LearnNSharedModule, UserRouteAccessService } from './shared';
import { LearnNAppRoutingModule} from './app-routing.module';
import { LearnNHomeModule } from './home/home.module';
import { LearnNAdminModule } from './admin/admin.module';
import { LearnNAccountModule } from './account/account.module';
import { LearnNEntityModule } from './entities/entity.module';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';
import {ExecuteComponent} from "./execute/execute.component";
import { TopicOverviewComponent } from './topic-overview/topic-overview.component';
import {TopicProgressService} from "./topic-overview/topic-progress.service";
import { EscapeHtmlPipe } from './shared/escape-html.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import {ChartsModule} from "ng2-charts";

@NgModule({
    imports: [
        BrowserModule,
        LearnNAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        ChartsModule,
        LearnNSharedModule,
        LearnNHomeModule,
        LearnNAdminModule,
        LearnNAccountModule,
        LearnNEntityModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
        ExecuteComponent,
        TopicOverviewComponent,
        EscapeHtmlPipe,
        DashboardComponent,
        UserDashboardComponent,
        QuestionDashboardComponent],
    providers: [
        ProfileService,
        PaginationConfig,
        TopicProgressService,
        UserRouteAccessService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        }
    ],
    bootstrap: [ JhiMainComponent ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnNAppModule {}
