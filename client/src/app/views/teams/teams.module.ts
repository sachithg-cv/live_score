import { NgModule } from '@angular/core';
import { ButtonModule, CardModule, FormModule, GridModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamCreateComponent } from './team-create/team-create.component';
import { PlayerCreateComponent } from './player-create/player-create.component';
import { PlayerListComponent } from './player-list/player-list.component';

@NgModule({
  imports: [
    CommonModule,
    TeamsRoutingModule,
    ButtonModule,
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
    TeamCreateComponent,
    PlayerCreateComponent,
    PlayerListComponent
  ],
})
export class TeamsModule {
}