import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, throwIfEmpty } from 'rxjs';
//import { UiService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
//import { TrainingService } from '../training.service';
import * as fromTrainig from '../store/training.reducer';
//import * as Training from '../store/training.actions';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  isTraining$!: Observable<boolean>; // = false;
  currentExercise!: Exercise | null;
  // exerciseEventSubscription = new Subscription();
  constructor(
    // private trainingService: TrainingService,
    private store: Store<fromTrainig.State>
  ) {}

  ngOnInit(): void {
    this.isTraining$ = this.store.select(fromTrainig.getIsTraining);
    // this.exerciseEventSubscription =
    //   this.trainingService.exerciseEvent.subscribe((ex) => {
    //     this.currentExercise = ex;
    //     if (ex) this.onTraining();
    //     else this.isTraining = false;
    //   });
  }

  // onTraining() {
  //   this.isTraining = true;
  // }

  ngOnDestroy(): void {
    // if (this.exerciseEventSubscription)
    //   this.exerciseEventSubscription.unsubscribe();
  }
}
