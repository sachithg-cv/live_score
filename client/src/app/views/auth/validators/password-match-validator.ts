import { AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


// export class MatchPassword implements Validator {

//     validate(formGroup: FormGroup){
//         const { password, passwordConfirmation } = formGroup.value;
//         if(password === passwordConfirmation) {
//             return null;
//         } else {
//             return {passwordsDontMatch: true};
//         }
//     }
// }

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmation = control.get('passwordConfirmation');
  
    return password?.value === passwordConfirmation?.value ? null : {passwordsDontMatch: true};
};