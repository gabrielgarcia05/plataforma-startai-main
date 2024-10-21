import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  showSnackbar(message: string) {
    const snackbar = document.getElementById('snackbar')!;
    snackbar.innerText = message;
    snackbar.className = 'snackbar show';

    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
    }, 3000); 
  }

  validarData(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; 
    }
  
    const data = new Date(control.value);
    const dataValida = !isNaN(data.getTime()); 
  
    return dataValida ? null : { dataInvalida: 'Data inválida' }; 
  }
  

}
