import { NgModule } from '@angular/core';
import { ButtonModule, CardModule, FormModule, GridModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { PublicRoutingModule} from './public-routing,module';
import { LiveMatchComponent } from './live-match/live-match.component';
import { ScheduledMatchComponent } from './scheduled-match/scheduled-match.component';
import { CompletedMatchComponent } from './completed-match/completed-match.component';
import { LiveInningComponent } from './live-inning/live-inning.component';
import { OtherInningComponent } from './other-inning/other-inning.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    PublicRoutingModule,
    CardModule,
    FormModule,
    GridModule,
    IconModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule
  ],
  declarations: [
    LiveMatchComponent,
    ScheduledMatchComponent,
    CompletedMatchComponent,
    LiveInningComponent,
    OtherInningComponent
  ],
})
export class PublicModule {
}