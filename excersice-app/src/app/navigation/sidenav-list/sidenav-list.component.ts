import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
//import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../store/app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
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
    // this.authSubscription = this.authService.authChange.subscribe((data) => {
    //   this.isAuth = data;
    // });
    this.isAuth$ = this.store.select(fromRoot.getisAuthenticated);
  }

  ngOnDestroy(): void {
    //if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.toggleSideBar();
  }
}
