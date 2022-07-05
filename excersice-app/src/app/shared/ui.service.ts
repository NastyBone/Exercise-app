import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loadingState = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(code: string, action: string, duration: number) {
    let message!: string;
    switch (code) {
      case 'auth/email-already-in-use':
        message = 'Email already in use';
        break;
      case 'auth/internal-error':
        message = 'Internal error';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email';
        break;
      case 'auth/wrong-password':
        message = 'Email or password incorrect';
        break;
      case 'auth/invalid-recipient-email':
        message = 'Invalid email domain';
        break;
      case 'auth/user-not-found':
        message = 'Email not found';
        break;
      case 'auth/network-request-failed':
        message = 'No internet connection';
        break;
      default:
        message = 'Unknow Error';
    }
    this.snackBar.open(message, action, { duration: duration });
  }
}
