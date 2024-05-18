import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent,RouterLink,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  userForm: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  constructor(private router: Router,private userService: UserService,private toastr: ToastrService) {
    this.userForm = new FormGroup({
      fullname: new FormControl("",[Validators.required]),
      email: new FormControl("",[Validators.required,Validators.email]),
      password: new FormControl("",[Validators.required,Validators.minLength(3)]),
      retype_password:new FormControl("",[Validators.required])
    })
  }
  register() {
    if(this.userForm.valid) {
      debugger
      this.userService.register(this.userForm.getRawValue()).subscribe({
        next: (response: any) => {
          debugger
            this.toastr.success('Đăng ký thành công','Thành công')
            this.router.navigate(['/login'])
        },
        error: (error: any) => {
          debugger
          this.toastr.error(`Đăng ký thất bại: ${error.error}`,'Thất bại')
        },
      })
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowPassword2() {
    this.showPassword2 = !this.showPassword2;
  }
}
