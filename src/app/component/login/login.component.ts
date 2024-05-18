import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { User } from '../../../models/user';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email: string = 'lan@gmail.com';
  password: string = '123';
  rememberMe?: boolean;
  message: string = '';
  user?: User | null;
  constructor(private userService: UserService, private tokenService: TokenService, private router: Router
    , private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.user = this.userService.getUser()
    if (this.user)
      this.email = this.user?.email;
    console.log(this.email);
  }
  login() {
    console.log(this.password);
    this.userService.login(this.email, this.password).subscribe({

      next: (response: any) => {
        debugger

        this.userService.getByToken(response.token).subscribe({
          next: (userResponse: any) => {
            debugger
            if (userResponse.is_active === false) {
              this.toastr.warning(`Tài khoản của bạn đã bị xóa`, 'Thất bại')
            } else {
              this.user = {
                ...userResponse
              }
              if (this.rememberMe) {
                if (this.user)
                  this.userService.setUser(this.user);
              }
              this.tokenService.setToken(response.token);
              const roleId = this.tokenService.getRoleIdByToken();
              if (roleId === 1) {
                this.router.navigate(['/admin/dashboard']);

              } else {
                this.router.navigate(['/']);
              }

              this.toastr.success('Đăng nhập thành công', 'Thành công')
            }

          }
        })

      },
      error: (error: any) => {
        this.toastr.warning(`Đăng nhập thất bại sai tài khoản hoặc mật khẩu`, 'Thất bại')
      },
    })
  }
}
