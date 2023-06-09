import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  }
  
  onSubmit(form: NgForm) {
    this._api.postTypeRequest('user/register', form.value).subscribe((res: any) => {
      if (res.status) { 
        console.log(res);
        this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));  
        this._auth.setDataInLocalStorage('token', res.token);  
        this._router.navigate(['login']);
      } else { 
        console.log(res);
        //alert(res.msg);
        
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
