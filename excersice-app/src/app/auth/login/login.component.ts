import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
//import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: UntypedFormGroup;
  //uiLoadingSubs!: Subscription;
  loadingState$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    // private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.loadingState$ = this.store.select(
      fromRoot.getIsLoading
    ) as Observable<boolean>;
    // pipe(
    //   map((state) => state.ui.isLoading)
    // ) as Observable<boolean>;
    //.subscribe((state) => (this.loadingState$ = state as boolean));
    // this.uiLoadingSubs = this.uiService.loadingState.subscribe((state) => {
    //   this.loadingState = state;
    // });
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }

  ngOnDestroy(): void {
    // if (this.uiLoadingSubs) this.uiLoadingSubs.unsubscribe();
  }
}
