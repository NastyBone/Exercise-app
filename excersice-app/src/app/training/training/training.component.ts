import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, throwIfEmpty } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  isTraining = false;
  currentExercise!: Exercise | null;
  exerciseEventSubscription = new Subscription();
  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseEventSubscription =
      this.trainingService.exerciseEvent.subscribe((ex) => {
        this.currentExercise = ex;
        if (ex) this.onTraining();
        else this.isTraining = false;
      });
  }

  onTraining() {
    this.isTraining = true;
  }

  ngOnDestroy(): void {
    if (this.exerciseEventSubscription)
      this.exerciseEventSubscription.unsubscribe();
  }
}
