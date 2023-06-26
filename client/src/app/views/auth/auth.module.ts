import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    IconModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [SignupComponent, SigninComponent],
})
export class AuthModule {
}
