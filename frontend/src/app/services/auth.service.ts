//Src: https://medium.com/geekculture/how-to-build-a-simple-login-in-angular-express-mysql-2c98cad532fd
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

   getUserDetails() {
    if(localStorage.getItem('userData')){
      return localStorage.getItem('userData')}
      else{
      return null
    }
    
  }setDataInLocalStorage(variableName: string, data: string) {
      localStorage.setItem(variableName, data);
  }getToken() {
      return localStorage.getItem('token');
  }clearStorage() {
      localStorage.clear();
  }
}