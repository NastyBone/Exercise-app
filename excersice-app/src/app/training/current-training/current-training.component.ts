import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { TrainingService } from '../training.service';
import * as fromTraining from '../store/training.reducer';
import { Store } from '@ngrx/store';
//import { Exercise } from '../exercise.model';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  progress: number = 0;
  timer!: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.currentTimer();
  }

  currentTimer() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((currentExercise) => {
        // currentExercise = this.trainingService.getCurrentExercise();
        let step;

        if (currentExercise?.duration) {
          step = currentExercise.duration * 10;
        } else {
          step = 1000;
        }
        // console.log(currentExercise.duration, currentExercise.name, step);

        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          if (this.progress >= 100) {
            this.trainingService.completedExercise();
            clearInterval(this.timer);
          }
        }, step);
      });
  }
  stopTimer() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        progress: this.progress,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.trainingService.canceledExercise(this.progress);
        //this.currentTrainingEmmiter.emit();
      } else {
        this.currentTimer();
      }
    });
  }
}
