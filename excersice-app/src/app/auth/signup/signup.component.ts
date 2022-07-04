import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private uiService: UiService) {}
  maxDate!: Date;
  uiLoadingSub!: Subscription;
  loadingState = false;
  ngOnInit(): void {
    this.uiLoadingSub = this.uiService.loadingState.subscribe((state) => {
      {
        this.loadingState = state;
      }
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  ngOnDestroy(): void {
    if (this.uiLoadingSub) this.uiLoadingSub.unsubscribe();
  }
}
