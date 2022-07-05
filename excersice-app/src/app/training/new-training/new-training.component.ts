import {
  Component,
  //  EventEmitter,
  OnDestroy,
  OnInit,
  // Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
//import { map } from 'rxjs/operators';
import { UiService } from 'src/app/shared/ui.service';
import * as fromApp from '../../store/app.reducer';
import * as fromTraining from '../store/training.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  //@Output() trainingEmmiter = new EventEmitter();
  //exerciseSubscription!: Subscription;
  loadingState$!: Observable<boolean>; //= false;
  exercises$!: Observable<Exercise[] | null>; //:Exercise[] | null = [];
  //uiLoadingSubs  Subscription;

  constructor(
    private trainingService: TrainingService,
    // private uiService: UiService,
    private store: Store<fromTraining.State> // private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.loadingState$ = this.store.select(fromApp.getIsLoading);
    // this.uiService.loadingState.subscribe((state) => {
    //   this.loadingState = state;
    // });
    //
    // this.exerciseSubscription =
    //   this.trainingService.exerciseFetchEvent.subscribe(
    //     (exercises) => (this.exercises = exercises)
    //   );
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.getExercises();
  }

  getExercises() {
    this.trainingService.getExercises();
  }

  emitTraining(f: NgForm) {
    //this.trainingEmmiter.emit(this.trainingService.currentExercise);
    this.trainingService.emitCurrentExercise(f.value.select);
  }

  ngOnDestroy(): void {
    // if (this.exerciseSubscription) this.exerciseSubscription.unsubscribe();
    // if (this.uiLoadingSubs) this.uiLoadingSubs.unsubscribe();
  }
}
