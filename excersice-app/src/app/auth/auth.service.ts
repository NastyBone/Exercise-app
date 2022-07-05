import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import * as fromRoot from '../store/app.reducer';
import * as UI from '../shared/store/ui.actions';
import * as Auth from '../auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  registerUser(authData: AuthData) {
    //this.uiService.loadingState.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        //this.uiService.loadingState.next(false);
        this.store.dispatch(new UI.StopLoading());

        this.loginSuccess();
      })
      .catch((e) => {
        //this.uiService.loadingState.next(false);
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackBar(e.code, '', 3000);
      });
  }

  login(authData: AuthData) {
    //this.uiService.loadingState.next(true);
    this.store.dispatch(new UI.StartLoading());

    this.fireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        //this.uiService.loadingState.next(false);
        this.store.dispatch(new UI.StopLoading());

        this.loginSuccess();
      })
      .catch((e) => {
        // this.uiService.loadingState.next(false);
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackBar(e.code, '', 3000);
      });
  }

  logout() {
    this.fireAuth.signOut();
  }

  // isAuth() {
  //   return this.isAuthenticated;
  // }

  private loginSuccess() {
    this.store.dispatch(new Auth.SetAuth());
    // this.isAuthenticated = true;
    // this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  initAuthListener() {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuth());

        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauth());

        this.router.navigate(['/login']);
      }
    });
  }
}
