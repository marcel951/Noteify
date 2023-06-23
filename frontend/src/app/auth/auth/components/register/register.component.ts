import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'

const options = {
  translations: zxcvbnDePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnDePackage.dictionary
  },
}
  let res :any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLogin: boolean = false
  errorMessage: any

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router

  ) { }

  ngOnInit() {
    this.isUserLogin();
    zxcvbnOptions.setOptions(options);
  }

  // ngAfterViewInit():void{
  //   this.form.valueChanges?.subscribe(username => console.log(username))
  // }

  // onChange(form: NgForm) {
  //   let username = (<HTMLInputElement>document.getElementById("username")).value;
  //   console.log(username);
  //   console.log("onchange");
  // }


  
  onSubmit(form: NgForm) {
    const app = document.getElementById("liveAlertPlaceholder")!;
            //app?.classList.add("alert");   //add the class
            //app?.classList.add("alert-primary");
    
    const appendAlert = (message: any, type: any) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')

      app.append(wrapper);
    }

    this._api.postTypeRequest('user/checkPW', form.value).subscribe((resCheck: any) => {
      if(resCheck.score > 2){
        this.registerNewUser(form);
      } else {
        appendAlert("Your password is too weak.", 'danger');
        if(resCheck.feedback.warning){
          appendAlert(resCheck.feedback.warning, 'info');
        }
        console.log(resCheck.feedback);
      }
    });
  }

  registerNewUser(form:any){
    const app = document.getElementById("liveAlertPlaceholder")!;
            //app?.classList.add("alert");   //add the class
            //app?.classList.add("alert-primary");
    
    const appendAlert = (message: any, type: any) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')

      app.append(wrapper);
    }


    this._api.postTypeRequest('user/register', form.value).subscribe((res: any) => {
      if (res.status) {
        //console.log(res);
        this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
        this._auth.setDataInLocalStorage('token', res.token);
        this._router.navigate(['']);
        console.log("Registration successfull");
      } else {
        console.log(res);
        appendAlert(res.msg, 'danger')
      }
    });
  }

  isUserLogin(){
    if(this._auth.getUserDetails() != null){
      this.isLogin = true;
    }
  }
}
