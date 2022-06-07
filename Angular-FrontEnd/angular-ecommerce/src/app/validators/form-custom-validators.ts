import { FormControl, ValidationErrors } from "@angular/forms";

export class FormCustomValidators {

    static noWhiteSpace(controls: FormControl): ValidationErrors{
        if(controls.value != null && controls.value.trim().length === 0){
            return {'noWhiteSpace': true};
        }
        return null;
    }
}
