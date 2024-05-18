import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";
import { CommonModule } from "@angular/common";
import { Product } from "../../../../models/product";
import { ProductService } from "../../../../services/product.service";
import { environment } from "../../../environments/environment";
import { Component, Directive, HostListener, OnInit } from "@angular/core";
import { Category } from "../../../../models/category";
import { CategoryService } from "../../../../services/category.service";
import { TokenService } from "../../../../services/token.service";
import { ProductImage } from "../../../../models/product.image";
import { ColorService } from "../../../../services/color.service";
import { SizeService } from "../../../../services/size.service";
import { Size } from "../../../../models/size";
import { Color } from "../../../../models/color";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService, OverlayService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';

import { DialogModule } from 'primeng/dialog';
import { ProductImageService } from "../../../../services/product.image.service";
import { SizeProductService } from "../../../../services/size.product.service";
import { ColorProductService } from "../../../../services/color.product.service";
import { log } from "console";
@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [AdminHeaderComponent, AdminNavbarComponent, CommonModule, RouterLink, ReactiveFormsModule, FormsModule, ButtonModule, ConfirmDialogModule
    , DialogModule, OverlayPanelModule, FileUploadModule,
  ],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.scss'
})
export class AdminProductComponent implements OnInit {
  products: Product[] = []
  product?: Product
  categories: Category[] = []
  sizes: Size[] = []
  colors: Color[] = []
  totalPages: number = 0
  currentPage: number = 0;
  pageSize: number = 6;
  cate_id: number = 0;
  keyword: string = '';
  visiblePage: number[] = [];
  selectedSizes: { index: number, id: number }[] = [];;
  selectedUpdateSizes: { id: number }[] = [];;
  selectedColors: { index: number, id: number }[] = [];
  selectedUpdateColors: { id: number }[] = [];
  productForm: FormGroup
  files: File[] = []
  visibleAdd: boolean = false;
  visibleUpdate: boolean = false;
  selectedImageFile?: File
  constructor(private router: Router,private route: ActivatedRoute, private productService: ProductService, private categoryService: CategoryService
    , private tokenService: TokenService, private colorService: ColorService, private sizeService: SizeService,
    private toastr: ToastrService, private confirmationService: ConfirmationService, private productImageService: ProductImageService,
    private sizeProductService: SizeProductService, private colorProductService: ColorProductService
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100000000)]),
      description: new FormControl(''),
      cate_id: new FormControl('', Validators.required),
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const page = params['page'];
      if (page) {
        this.currentPage = page
      }
        this.onPageChange(this.currentPage);
    });
    this.colorService.getAll().subscribe({
      next: (response: any) => {
        this.colors = response
      }
    })
    this.sizeService.getAll().subscribe({
      next: (response: any) => {
        debugger
        this.sizes = response
      }
    })
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        debugger
        this.categories = response
      }
    })
  }

  searchProduct(cate_id: number, keyword: string, page: number) {
    this.productService.getProducts(page, this.pageSize, keyword, cate_id).subscribe({
      next: (response: any) => {
        debugger
        response.products.forEach((element: Product) => {
          // element.thumbnail = `${environment.apiBaseUrl}/products/images/${element.thumbnail}`;
          // element.product_images.forEach((productImage: ProductImage) => {
          //   productImage.image_url = `${environment.apiBaseUrl}/products/images/${productImage.image_url}`;
          // })
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        if (this.currentPage <= this.totalPages - 2) {
          this.getVisiblePage();
        }

      },
      error: (error: any) => {
        debugger
        console.log(` ${error}`)
      },
    });
  }
  onClickSearchProductsByKeyWord(keyword: string) {
    this.keyword = keyword;
    this.currentPage = 0
    this.onPageChange(this.currentPage);
  }
  onClickSearchProductsByCategory() {
    this.currentPage = 0
    this.onPageChange(this.currentPage);
  }
  resfeshSearhCategory() {
    this.cate_id = 0;
    this.onPageChange(0)
  }
  @Directive({
    selector: '[appEnterSearchProduct]'
  })
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter (thường là submit form)
      // Thực hiện các hành động của bạn ở đây
      this.onClickSearchProductsByKeyWord(this.keyword)
    }
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.searchProduct(this.cate_id, this.keyword, page);
    // this.router.navigate([this.router.url], { queryParams: { page: page } });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // to retain other query parameters
    });
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getVisiblePage(): void {
    const totalPagesToShow = 5;
    const visiblePageCount = Math.min(totalPagesToShow, this.totalPages);
    const startPage = Math.max(0, this.currentPage - Math.floor(visiblePageCount / 2));

    this.visiblePage = Array.from({ length: visiblePageCount }, (_, index) => startPage + index);
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onFirstPage() {
    this.onPageChange(0);
  }

  onLastPage() {
    this.onPageChange(this.totalPages - 1);
  }
  isSelectedSize(index: number, sizeId: number): boolean {
    return this.selectedSizes.some(size => size.id === sizeId);
  }

  onSizeClick(index: number, sizeId: any): void {
    if (this.isSelectedSize(index, sizeId)) {
      const selectedIndex = this.selectedSizes.findIndex(size => size.index === index);
      if (selectedIndex !== -1) {
        this.selectedSizes.splice(selectedIndex, 1);
      }
    } else {
      this.selectedSizes.push({ index, id: sizeId });
    }
  }
  isSelectedUpdateSize(sizeId: number): boolean {
    if (this.product) {
      this.product.size.map(size => this.selectedUpdateSizes.push({ id: size.id }))
    }
    return this.selectedUpdateSizes.some(size => size.id === sizeId);
  }
  isSelectedColor(index: number, colorId: number): boolean {
    return this.selectedColors.some(color => color.id === colorId);
  }
  isSelectedUpdateColor(colorId: number): boolean {
    if (this.product) {
      this.product.color.map(color => this.selectedUpdateColors.push({ id: color.id }))
    }
    return this.selectedUpdateColors.some(color => color.id === colorId);
  }
  onColorClick(index: number, colorId: any): void {
    if (this.isSelectedColor(index, colorId)) {
      const selectedIndex = this.selectedColors.findIndex(color => color.index === index);
      if (selectedIndex !== -1) {
        this.selectedColors.splice(selectedIndex, 1);
      }
    } else {
      this.selectedColors.push({ index, id: colorId });
    }
  }
  // onFileChange(event: any) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     this.files = Array.from(event.target.files);
  //   }
  // }
  onFileChange(event: any) {
    for (let file of event.files) {
      this.files.push(file);
    }
    this.files = this.files.reverse()
    console.log(this.files);
  }
  createProduct() {
    if (this.productForm.valid) {
      const sizes: any[] = [];
      this.selectedSizes.forEach(size => sizes.push(size.id))
      const colors: any[] = []
      this.selectedColors.forEach(color => colors.push(color.id))
      const productDto = {
        name: this.productForm.get('name')?.value,
        price: this.productForm.get('price')?.value,
        description: this.productForm.get('description')?.value,
        cate_id: parseInt(this.productForm.get('cate_id')?.value),
        sizes: sizes,
        colors: colors
      }
      console.log(productDto);
      console.log(this.files);
      if (this.files.length > 5) {
        this.toastr.error(`Thêm thất bại: chỉ được thêm tối đa 5 file`, 'Thất bại')
      } else {
        this.productService.createProduct(productDto).subscribe({
          next: (response: any) => {
            this.productService.createProductImages(response.id, this.files).subscribe({
              next: (response: any) => {
                debugger
                this.visibleAdd = false
                window.location.reload();
                this.toastr.success('Thêm thành công', 'Thành công')
              }, error: (error: any) => {
                debugger
                this.toastr.error(`Thêm thất bại: ${error.error}`, 'Thất bại')
              },
            })
          }, error: (error: any) => {
            debugger
            this.toastr.error(`Thêm thất bại: ${error.error}`, 'Thất bại')
            console.log(error);
          },
        })
      }
    } else {
      this.productForm.markAllAsTouched();
    }

  }
  updateProduct() {
    if (this.productForm.valid) {
      const productDto = {
        name: this.productForm.get('name')?.value,
        price: this.productForm.get('price')?.value,
        description: this.productForm.get('description')?.value,
        cate_id: parseInt(this.productForm.get('cate_id')?.value),
      }
      console.log(productDto);

      this.productService.upadateProduct(this.product?.id!, productDto).subscribe({
        next: (response: any) => {
          window.location.reload();
          this.toastr.success('Sửa thành công', 'Thành công')
        }, error: (error: any) => {
          this.toastr.error(`Sửa thất bại: ${error.error}`, 'Thất bại')
        },
      })
    } else {
      this.productForm.markAllAsTouched();
    }

  }
  deteleProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: (response: any) => {
        this.toastr.success('Xóa thành công', 'Thành công')
      }, error: (error: any) => {
        debugger
        this.toastr.error(`Xóa thất bại: ${error.error}`, 'Thất bại')
      },
    })
  }
  deleteProduct(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa sản phẩm : ' + id + ' không ',
      header: 'Xóa sản phẩm',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: (response: any) => {
            this.products.splice(index, 1)
            this.toastr.success('Xóa thành công', 'Thành công')
            // window.location.reload();
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
  showAddDialog() {
    this.visibleAdd = true;
  }
  closeAddDiallog() {
    this.visibleAdd = false
    this.visibleUpdate = false
  }
  showUpdateDialog(id: number) {
    this.visibleUpdate = true
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        this.product = response
        if (this.product) {
          this.productForm.get('name')?.setValue(this.product.name)
          this.productForm.get('price')?.setValue(this.product.price)
          this.productForm.get('description')?.setValue(this.product.description)
          this.productForm.get('cate_id')?.setValue(this.product.category.id)

        }
      }, error: (error: any) => {
        debugger
        this.toastr.error(`Xem thất bại: ${error.error}`, 'Thất bại')
      },
    })

  }
  editFile() {
    document.getElementById('fileInput')?.click()


  }
  updateProductImage(event: any, id: number, index: number) {
    this.selectedImageFile = event.target.files[0];
    if (this.selectedImageFile) {
      this.productImageService.updateProductImage(id, this.selectedImageFile).subscribe({
        next: (response: any) => {

          this.product!.product_images[index].image_url = response.image_url;


          this.toastr.success(`Sửa thành công`, 'Thành công');
        },
        error: (error: any) => {
          this.toastr.error(`Sửa thất bại: ${error.error}`, 'Thất bại');
        }
      });
    }

  }
  deleteProductImage(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa hình ảnh này không ',
      header: 'Xóa hình ảnh',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.productImageService.deleteProductImage(id).subscribe({
          next: (response: any) => {
            this.product?.product_images.splice(index, 1)
            this.toastr.success(`Xóa thành công`, 'Thành công')
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
  createProductImage(event: any, productId: number) {
    this.selectedImageFile = event.files[0];
    if (this.selectedImageFile) {
      this.productImageService.createProductImage(productId, this.selectedImageFile).subscribe({
        next: (response: any) => {

          this.product!.product_images.push(new ProductImage(response.id, response.image_url));

          this.toastr.success(`Thêm thành công`, 'Thành công');
        },
        error: (error: any) => {
          this.toastr.error(`Thêm thất bại: ${error.error}`, 'Thất bại');
        }
      });
    }

  }
  deleteSizeProduct(product_id: number, size_id: number, index: number) {
    this.sizeProductService.delete(product_id, size_id).subscribe({
      next: (response: any) => {
        this.toastr.success(`Xóa thành công`, 'Thành công');
        this.product?.size.splice(index, 1)
      },
      error: (error: any) => {
        this.toastr.error(`Xóa thất bại: ${error.error}`, 'Thất bại');
      }
    })
  }
  createSizeProduct() {
    let sizeProducts: Object[] = []
    this.selectedSizes.forEach(size => {
      const index = this.product?.size.findIndex(item => item.id === size.id);
      if (index === -1) {
        const sizeProduct = {
          product_id: this.product?.id,
          size_id: size.id
        }
        sizeProducts.push(sizeProduct)
      }
    })
    for (let index = 0; index < sizeProducts.length; index++) {
      this.sizeProductService.create(sizeProducts[index]).subscribe({
        next: (response: any) => {
          this.product?.size.push(response.size)
        },
        error: (error: any) => {
          this.toastr.error(`Thêm thất bại: ${error.error}`, 'Thất bại');
        }
      })
    }
    this.toastr.success(`Thêm thành công`, 'Thành công');

  }
  deleteColorProduct(product_id: number, color_id: number, index: number) {
    this.colorProductService.delete(product_id, color_id).subscribe({
      next: (response: any) => {
        this.toastr.success(`Xóa thành công`, 'Thành công');
        this.product?.color.splice(index, 1)
      },
      error: (error: any) => {
        this.toastr.error(`Xóa thất bại: ${error.error}`, 'Thất bại');
      }
    })
  }
  createColorProduct() {
    let colorProducts: Object[] = []
    this.selectedColors.forEach(color => {
      const index = this.product?.color.findIndex(item => item.id === color.id);
      if (index === -1) {
        const colorProduct = {
          product_id: this.product?.id,
          color_id: color.id
        }
        colorProducts.push(colorProduct)
      }
    })
    for (let index = 0; index < colorProducts.length; index++) {
      this.colorProductService.create(colorProducts[index]).subscribe({
        next: (response: any) => {
          this.product?.color.push(response.color)
        },
        error: (error: any) => {
          this.toastr.error(`Thêm thất bại: ${error.error}`, 'Thất bại');
        }
      })
    }
    this.toastr.success(`Thêm thành công`, 'Thành công');

  }


}

