import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private excercises: Exercise[] = [
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  currentExercise?: Exercise | null;
  exerciseEvent = new Subject<Exercise | null>();
  exerciseFetchEvent = new Subject<Exercise[] | null>();
  exercisesFetchEvent = new Subject<Exercise[] | null>();
  dbSubscriptions: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private uiService: UiService // private authService: AuthService
  ) {}

  async getExercises() {
    this.uiService.loadingState.next(true);
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
            this.excercises = exercises;
            this.exerciseFetchEvent.next([...this.excercises]);
            this.uiService.loadingState.next(false);
          },
          error: (e) => {
            this.uiService.showSnackBar(e.code, '', 3000);
            this.exerciseFetchEvent.next(null);
            this.uiService.loadingState.next(false);
          },
        })
    );
  }

  emitCurrentExercise(exerciseId: string) {
    this.currentExercise = this.excercises.find((ex) => ex.id == exerciseId);
    if (this.currentExercise)
      this.exerciseEvent.next({ ...this.currentExercise });
  }

  getCurrentExercise() {
    return { ...this.currentExercise };
  }

  completedExercise() {
    if (this.currentExercise) {
      this.addToDatabase({
        ...this.currentExercise,
        date: new Date(),
        status: 'completed',
      });
    }
    this.currentExercise = null;
    this.exerciseEvent.next(null);
  }

  canceledExercise(progress: number) {
    if (this.currentExercise) {
      this.addToDatabase({
        ...this.currentExercise,
        duration: this.currentExercise.duration * (progress / 100),
        calories: this.currentExercise.calories * (progress / 100),
        date: new Date(),
        status: 'cancelled',
      });
    }
    this.currentExercise = null;
    this.exerciseEvent.next(null);
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
          this.exercisesFetchEvent.next(exercises as Exercise[]);
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
      .subscribe((data) => console.log(data));
  }

  cancelSubscriptions() {
    this.dbSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
