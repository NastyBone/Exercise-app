import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
//import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleBar = new EventEmitter();
  isAuth$!: Observable<boolean>; //boolean = false;
  //authSubscription!: Subscription;

  toggleSideBar() {
    this.toggleBar.emit();
  }
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getisAuthenticated);
    // this.authSubscription = this.authService.authChange.subscribe((data) => {
    //   this.isAuth = data;
    // });
  }

  ngOnDestroy(): void {
    // if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
