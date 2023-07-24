import { NgModule } from '@angular/core';
import { ButtonGroupModule, ButtonModule, CardModule, FormModule, GridModule, TableModule, AlertModule, ListGroupModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { MatchesRoutingModule } from './matches-routing.module';
import { MatchCreateComponent} from './match-create/match-create.component';
import { MatchListComponent } from './match-list/match-list.component';
import { DropdownModule } from 'primeng/dropdown';
import { MatchViewComponent } from './match-view/match-view.component';
import { MatchTossResultComponent } from './match-toss-result/match-toss-result.component';
import { MatchStartFirstInningComponent } from './match-start-first-inning/match-start-first-inning.component';
import { MatchStartSecondInningComponent } from './match-start-second-inning/match-start-second-inning.component';
import { MatchLiveListAdminComponent } from './match-live-list-admin/match-live-list-admin.component';
import { MatchScoreComponent } from './match-score/match-score.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  imports: [
    CommonModule,
    MatchesRoutingModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    IconModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DropdownModule,
    ButtonGroupModule,
    DialogModule,
    AlertModule,
    ListGroupModule,
  ],
  declarations: [
    MatchCreateComponent,
    MatchListComponent,
    MatchViewComponent,
    MatchTossResultComponent,
    MatchStartFirstInningComponent,
    MatchStartSecondInningComponent,
    MatchLiveListAdminComponent,
    MatchScoreComponent
  ],
})
export class MatchesModule {
}