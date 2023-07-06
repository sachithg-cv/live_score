import { NgModule } from '@angular/core';
import { ButtonModule, CardModule, FormModule, GridModule, TableModule } from '@coreui/angular';
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
    DropdownModule
  ],
  declarations: [
    MatchCreateComponent,
    MatchListComponent,
    MatchViewComponent,
    MatchTossResultComponent
  ],
})
export class MatchesModule {
}