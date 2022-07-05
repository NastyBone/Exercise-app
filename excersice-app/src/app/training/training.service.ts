import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription, switchMap, take } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as fromTraining from './store/training.reducer';
import * as UI from '../shared/store/ui.actions';
import * as Training from './store/training.actions';
@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  // private excercises: Exercise[] = [
  //   // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
  //   // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  // ];

  // currentExercise?: Exercise | null;
  // exerciseEvent = new Subject<Exercise | null>();
  // exerciseFetchEvent = new Subject<Exercise[] | null>();
  // exercisesFetchEvent = new Subject<Exercise[] | null>();
  dbSubscriptions: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private uiService: UiService, // private authService: AuthService
    private store: Store<fromTraining.State>
  ) {}

  async getExercises() {
    //this.uiService.loadingState.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.dbSubscriptions.push(
      this.firestore
        .collection('available-exercises')
        .snapshotChanges()
        .pipe(
          map((docArray: any[]) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: (doc.payload.doc.data() as Exercise).name,
                duration: (doc.payload.doc.data() as Exercise).duration,
                calories: (doc.payload.doc.data() as Exercise).calories,
              };
            });
          })
        )
        .subscribe({
          next: (exercises: Exercise[]) => {
            //this.excercises = exercises;
            //this.exerciseFetchEvent.next([...this.excercises]);
            //this.uiService.loadingState.next(false);
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          error: (e) => {
            this.uiService.showSnackBar(e.code, '', 3000);
            //  this.exerciseFetchEvent.next(null);
            //this.uiService.loadingState.next(false);
            this.store.dispatch(new UI.StopLoading());
          },
        })
    );
  }

  emitCurrentExercise(exerciseId: string) {
    // this.currentExercise = this.excercises.find((ex) => ex.id == exerciseId);
    // if (this.currentExercise)
    // this.exerciseEvent.next({ ...this.currentExercise });
    this.store.dispatch(new Training.StartTraining(exerciseId));
  }

  // getCurrentExercise() {
  //   return { ...this.currentExercise };
  // }

  completedExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((currentExercise) => {
        if (currentExercise) {
          this.addToDatabase({
            ...currentExercise,
            date: new Date(),
            status: 'completed',
          });
        }
      });
    this.store.dispatch(new Training.StopTraining(null));
    // this.currentExercise = null;
    // this.exerciseEvent.next(null);
  }

  canceledExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((currentExercise) => {
        if (currentExercise) {
          this.addToDatabase({
            ...currentExercise,
            duration: currentExercise.duration * (progress / 100),
            calories: currentExercise.calories * (progress / 100),
            date: new Date(),
            status: 'cancelled',
          });
        }
      });
    // if (this.currentExercise) {
    //   this.addToDatabase({
    //     ...this.currentExercise,
    //     duration: this.currentExercise.duration * (progress / 100),
    //     calories: this.currentExercise.calories * (progress / 100),
    //     date: new Date(),
    //     status: 'cancelled',
    //   });
    // }
    // this.currentExercise = null;
    // this.exerciseEvent.next(null);
    this.store.dispatch(new Training.StopTraining(null));
  }

  fetchActualExercises() {
    this.dbSubscriptions.push(
      this.fireAuth.authState
        .pipe(
          switchMap((user) => {
            return this.firestore
              .collection('users')
              .doc(user?.uid)
              .collection('finished-exercises')
              .valueChanges();
          })
        )
        .subscribe((exercises) => {
          //console.log(exercises);
          //this.exercisesFetchEvent.next(exercises as Exercise[]);
          this.store.dispatch(
            new Training.SetFinishedTrainings(exercises as Exercise[])
          );
        })
    );
  }

  private addToDatabase(exercise: Exercise) {
    this.fireAuth.authState
      .pipe(
        switchMap((user) => {
          return this.firestore
            .collection('users')
            .doc(user?.uid)
            .collection('finished-exercises')
            .add(exercise);
        })
      )
      .subscribe();
  }

  cancelSubscriptions() {
    this.dbSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
