import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { response } from 'express';
import { error } from 'console';
import { ConfirmationService } from "primeng/api";
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../../../models/role';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [AdminHeaderComponent, AdminNavbarComponent, CommonModule, RouterLink, ReactiveFormsModule, FormsModule, ButtonModule, ConfirmDialogModule
    , DialogModule, OverlayPanelModule, FileUploadModule,],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss'
})
export class AdminUserComponent implements OnInit {
  users: User[] = []
  roles: Role[] = []
  userForm: FormGroup;
  visibleAdd: boolean = false
  visibleUpdate: boolean = false
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService,
     private confirmationService: ConfirmationService) {
      this.userForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]), 
        fullname: new FormControl('', Validators.required), 
        password: new FormControl('', [Validators.required,Validators.minLength(3)]), 
        retype_password: new FormControl('', [Validators.required,Validators.minLength(3)]), 
        role_id: new FormControl(''), 
      });
     }
  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (response: any) => {
        this.users = response
      },
    })

  }
  showAddDialog() {
    this.visibleAdd = true;
  }
  closeAddDiallog() {
    this.visibleAdd = false
    // this.visibleUpdate = false
  }
  createUser() {
    if(this.userForm.valid) {
      debugger
      this.userService.register(this.userForm.getRawValue()).subscribe({
        next: (response: any) => {
          this.users.unshift(response)
            this.toastr.success('Thêm thành công','Thành công')
            this.closeAddDiallog()
        },
        error: (error: any) => {
          this.toastr.error(`Thêm thất bại: ${error.error}`,'Thất bại')
        },
      })
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  deleteUser(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa user : ' + id + ' không ',
      header: 'Xóa user',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.userService.delete(id).subscribe({
          next: (response: any) => {
            this.users[index].is_active = false
            this.toastr.success('Xóa thành công', 'Thành công')
          }, error: (error: any) => {
            debugger
            this.toastr.error(`Xóa thất bại: ${error.error}`, 'Thất bại')
          },
        })

      },
      reject: () => {

      }
    });

  }
}
