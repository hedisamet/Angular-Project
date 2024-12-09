import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    // Subscribe to auth state changes
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userSubject.next(user);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  getUserClaims(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.userSubject.next(user);
          resolve(user);
        } else {
          this.userSubject.next(null);
          reject('No user logged in');
        }
      });
    });
  }

  getUserToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken()
            .then((token) => resolve(token))
            .catch(() => reject('No token Available.'));
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  doGoogleLogin(): Promise<any> {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((result) => {
        this.userSubject.next(result.user);
        this.router.navigate(['/dashboard']);
      });
  }

  doLogout(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Logout error:', error);
        throw error;
      });
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.afAuth.onAuthStateChanged(user => {
        observer.next(!!user);
      });
    });
  }
}
