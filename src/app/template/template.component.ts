import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/AuthService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit, OnDestroy {
  userName: string = '';
  private userSubscription: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.userName = user.email.split('@')[0];
      } else {
        this.userName = '';
      }
    });
  }

  ngOnInit() {
    // Initial user check
    this.auth.getUserClaims().catch(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logOut(): void {
    this.auth.doLogout().catch(error => {
      console.error('Logout failed:', error);
    });
  }
}
