import { NgModule } from '@angular/core';
import { ButtonModule, CardModule, FormModule, GridModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { PublicRoutingModule} from './public-routing,module';

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
    
  ],
})
export class PublicModule {
}