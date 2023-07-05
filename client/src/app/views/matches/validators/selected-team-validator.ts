import { AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const selectedTeamValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const team1 = control.get('team1');
    const team2 = control.get('team2');
  
    return team1?.value === team2?.value ? {sameTeamSelected: true} : null;
};