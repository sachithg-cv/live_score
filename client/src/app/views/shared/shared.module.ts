import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InputComponent } from "./input/input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormModule} from '@coreui/angular';

@NgModule({
    declarations:[InputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormModule
    ],
    exports: [InputComponent]
})
export class SharedModule {}