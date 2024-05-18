import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TokenService } from '../../../../services/token.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Category } from '../../../../models/category';
import { log } from 'util';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, ButtonModule, ConfirmDialogModule
    , DialogModule, OverlayPanelModule,],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss'
})
export class AdminCategoryComponent implements OnInit {
  categories: Category[] = []
  category?: Category
  categoryForm: FormGroup
  visibleAdd: boolean = false
  visibleUpdate: boolean = false
  constructor(private toastr: ToastrService, private confirmationService: ConfirmationService, private categoryService: CategoryService, private tokenService: TokenService) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.minLength(3)])
    });
  }
  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        debugger
        this.categories = response;
      }
    })
  }
  createCategory() {
    const categoryDto = {
      name: this.categoryForm.get('name')?.value
    }
    this.categoryService.create(categoryDto).subscribe({
      next: (response: any) => {
        this.categories.push(response)
        this.closeDiallog()
        this.toastr.success('Thêm thành công','Thành công')
      },
      error: (error: any) => {
        this.toastr.error(`Thêm thất bại ${error.error}`,'Thất bại')
      },
    })
  }
  showDialog() {
    this.visibleAdd = true;
  }
  closeDiallog() {
    this.visibleAdd = false
    this.visibleUpdate = false
  }
  showUpdateDialog(id: number) {
    this.visibleUpdate = true
    this.categoryService.getById(id).subscribe({
      next: (response: any) => {
        this.category = response
        if(this.category) {
          this.categoryForm.get('name')?.setValue(this.category.name)
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    })
  }
  updateCategory() {
    const categoryDto = {
      name: this.categoryForm.get('name')?.value
    }
    this.categoryService.update(categoryDto,this.category?.id!).subscribe({
      next: (response: any) => {
        const index = this.categories.findIndex(cate => cate.id === response.id)
        if (index != -1) {
          this.categories.splice(index, 1)
          this.categories.splice(index, 0,response)
        }
        this.closeDiallog()
        this.toastr.success('Sửa thành công','Thành công')
      },
      error: (error: any) => {
        this.toastr.error(`Sửa thất bại ${error.error}`,'Thất bại')
      },
    })
  }
  deleteCategory(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa danh mục : ' + id + ' không ',
      header: 'Xóa danh mục',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.categoryService.delete(id).subscribe({
          next: (response: any) => {
              this.categories.splice(index, 1)
            this.toastr.success('Xóa thành công','Thành công')
          },
          error: (error: any) => {
            this.toastr.error(`Xóa thất bại ${error.error}`,'Thất bại')
          },
        })
      },
      reject: () => {

      }
    });

  }
}
