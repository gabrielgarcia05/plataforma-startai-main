import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../componentes/navbar/navbar.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { LoadingComponent } from '../componentes/loading/loading.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule,LoadingComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

  isDesktop = true;
  isLoading = false;
  isLogado = false;

  constructor(private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object) {
    this.authService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.authService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.isLogado = this.authService.isAuthenticated();
    }

    
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 1024; 
    }
  }

}
