import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false
  errorMessage: any

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router
  ) { }

  ngOnInit() {
    this.isUserLogin();
  }
  onSubmit(form: NgForm) {
    const app = document.getElementById("liveAlertPlaceholder")!;


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

    this._api.postTypeRequest('user/login', form.value).subscribe((res: any) => {
      
      if (res.status == 1) {
        console.log(res);
        this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
        this._auth.setDataInLocalStorage('token', res.token);
        this._router.navigate(['']);
      }else {
        app.innerHTML = '';
        appendAlert("The given password and username doesn't match.", 'danger');
      }
    })
  }

    isUserLogin(){
      if(this._auth.getUserDetails() != null){this.isLogin = true;
    }}

    logout(){
    this._auth.clearStorage()
    this._router.navigate(['']);
    }
}
