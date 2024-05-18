import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { environment } from '../../environments/environment';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements OnInit {

  collapsedItems: { [key: string]: boolean } = {};
  toggleCollapse(key: string): void {
    this.collapsedItems[key] = !this.collapsedItems[key];
  }
  isCollapsed(key: string): boolean {
    return this.collapsedItems[key];
  }
  products?: [Product]
  categories?: [Category]
  totalPages: number = 0
  currentPage: number = 0;
  pageSize: number = 4;
  cate_id: number = 0;
  keyword: string = '';
  sortType: string = '';
  visiblePage: number[] = [];
  suggestedProducts: Product[] = [];
  averageRating: { id: number, value: number }[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const page = params['page'];
      if (page) {
        this.currentPage = page
      }
      this.onPageChange(this.currentPage);
    });
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        debugger
        this.categories = response;
      }
    })
  }
  searchProduct(cate_id: number, keyword: string, page: number) {
    this.productService.getProducts(page, this.pageSize, keyword, cate_id).subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.totalPages = response.totalPages;
        if (this.currentPage <= this.totalPages - 2) {
          this.getVisiblePage();
        }
        this.averageRatings()
      }
    });
  }

  onClickSearchProductsByCategory(cate_id: number) {
    this.cate_id = cate_id;
    this.currentPage = 0
    this.onPageChange(this.currentPage);
  }
  onClickSearchProductsByKeyWord(keyword: string) {
    this.keyword = keyword;
    this.currentPage = 0
    this.onPageChange(this.currentPage);
    this.suggestedProducts = []
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
  sortData() {
    if (this.sortType === 'asc') {
      this.products = this.products?.sort((a, b) => a.price - b.price);
    } else if (this.sortType === 'desc') {
      this.products = this.products?.sort((a, b) => b.price - a.price);
    }
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.searchProduct(this.cate_id, this.keyword, page);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // to retain other query parameters
    });
    this.scrollToTop()
  }
  getVisiblePage(): void {
    const totalPagesToShow = 5; // Số trang hiển thị tối đa trên thanh phân trang
    const visiblePageCount = Math.min(totalPagesToShow, this.totalPages); // Số trang hiển thị thực sự
    const startPage = Math.max(0, this.currentPage - Math.floor(visiblePageCount / 2)); // Trang bắt đầu hiển thị

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
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onClickSuggestProductsByKeyWord() {
    this.getSuggestedProducts();
  }

  getSuggestedProducts() {
    if (this.keyword.length > 2) {
      this.productService.getProducts(0, 999, this.keyword, 0).subscribe({
        next: (response: any) => {
          this.suggestedProducts = response.products;
        }
      });
    } else {
      this.suggestedProducts = [];
    }
  }
  averageRatings() {
    this.products?.forEach((product) => {
      debugger
      const totalRating = product.ratings.reduce(
        (total, item) => total + item.value, 0
      );
      this.averageRating.push({ id: product.id, value: product.ratings.length > 0 ?Math.round( totalRating / product.ratings.length) : 5 })
      // this.averageRating = this.ratings.length > 0 ? totalRating/this.ratings.length: 5
      // this.ratings.forEach(rating =>{
      //   if(rating.value == 5) {
      //     this.count5Start++
      //   }
      //   if(rating.value == 4) {
      //     this.count4Start++
      //   }
      //   if(rating.value == 3) {
      //     this.count3Start++
      //   }
      //   if(rating.value == 2) {
      //     this.count2Start++
      //   }
      //   if(rating.value == 1) {
      //     this.count1Start++
      //   }
    })
  }

} 
