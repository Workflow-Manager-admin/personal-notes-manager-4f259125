import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes.component';
import { LayoutComponent } from '../layout/layout.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, LayoutComponent, FormsModule],
  declarations: [NotesComponent],
  exports: [NotesComponent, LayoutComponent]
})
export class NotesModule { }
