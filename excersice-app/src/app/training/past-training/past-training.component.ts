import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
//import { Subscription } from 'rxjs';
import * as fromTraining from '../store/training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'status'];
  dataSource = new MatTableDataSource<Exercise>();
  //fetchExercisesSubscription!: Subscription;
  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    //this.dataSource.data =
    // this.fetchExercisesSubscription =
    //   this.trainingService.exercisesFetchEvent.subscribe(
    //     (exercises: Exercise[] | null) => {
    //       if (exercises) this.dataSource.data = exercises;
    //     }
    //   );

    this.store
      .select(fromTraining.getFinishedExercises)
      .subscribe((exercises) => {
        if (exercises) this.dataSource.data = exercises;
      });
    this.trainingService.fetchActualExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filterData(data: KeyboardEvent) {
    if (data.target) {
      this.dataSource.filter = (data.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
    }
  }
  ngOnDestroy(): void {
    // if (this.fetchExercisesSubscription)
    //   this.fetchExercisesSubscription.unsubscribe();
  }
}
