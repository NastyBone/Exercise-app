import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TrainingComponent } from './training/training.component';
import { TrainingRoutingModule } from './training/training-routing.module';
import { DialogComponent } from '../dialog/dialog.component';

@NgModule({
  declarations: [
    CurrentTrainingComponent,
    NewTrainingComponent,
    TrainingComponent,
    PastTrainingComponent,
  ],
  entryComponents: [DialogComponent],
  imports: [SharedModule, TrainingRoutingModule],
})
export class TrainingModule {}
