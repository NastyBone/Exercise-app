import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UiService } from 'src/app/shared/ui.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingEmmiter = new EventEmitter();
  exerciseSubscription!: Subscription;
  loadingState = false;
  uiLoadingSubs!: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService // private firestore: AngularFirestore
  ) {}
  exercises: Exercise[] | null = [];

  ngOnInit(): void {
    this.uiLoadingSubs = this.uiService.loadingState.subscribe((state) => {
      this.loadingState = state;
    });
    this.getExercises();
    this.exerciseSubscription =
      this.trainingService.exerciseFetchEvent.subscribe(
        (exercises) => (this.exercises = exercises)
      );
  }

  getExercises() {
    this.trainingService.getExercises();
  }

  emitTraining(f: NgForm) {
    // this.trainingEmmiter.emit(this.trainingService.currentExercise);
    this.trainingService.emitCurrentExercise(f.value.select);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) this.exerciseSubscription.unsubscribe();
    if (this.uiLoadingSubs) this.uiLoadingSubs.unsubscribe();
  }
}
