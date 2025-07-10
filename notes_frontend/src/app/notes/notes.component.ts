import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Note } from '../note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  loading = false;
  errorMsg = '';
  searchTerm = '';
  selectedNote: Note | null = null;
  editMode = false;
  saving = false;
  isBrowser: boolean = false;

  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly _supabaseService: SupabaseService) {
    this.isBrowser = typeof globalThis !== 'undefined' && !!globalThis.window;
  }

  // Adjust calls from this.supabase. → this.supabaseService.

  ngOnInit() {
    // Only fetch notes in the browser (not SSR)
    if (this.isBrowser) {
      this.fetchNotes();
    }
  }

  fetchNotes() {
    this.loading = true;
    this._supabaseService.getNotes().subscribe(({ data, error }) => {
      this.loading = false;
      if (error) {
        this.errorMsg = 'Failed to load notes.';
        this.notes = [];
        this.filteredNotes = [];
      } else {
        this.notes = data;
        this.filterNotes();
      }
    });
  }

  // Search/filter logic
  filterNotes() {
    if (!this.searchTerm?.trim()) {
      this.filteredNotes = [...this.notes];
      return;
    }
    const term = (this.searchTerm ?? '').toLowerCase();
    this.filteredNotes = this.notes.filter(note =>
      (note.title ?? '').toLowerCase().includes(term) ||
      (note.content ?? '').toLowerCase().includes(term)
    );
  }

  searchChanged() {
    this.filterNotes();
  }

  // PUBLIC_INTERFACE
  /** Safe wrapper for calling setTimeout on the browser; no-op if SSR. */
  safeSetTimeout(fn: () => void, ms: number) {
    if (this.isBrowser && typeof globalThis.setTimeout === 'function') {
      globalThis.setTimeout(fn, ms);
    }
  }

  // PUBLIC_INTERFACE
  /** Select an active note, guard for browser/SSR. */
  selectNote(note: Note) {
    if (!this.isBrowser) return;
    this.selectedNote = { ...note };
    this.editMode = false;
    this.safeSetTimeout(() => this.titleInput?.nativeElement?.focus(), 0);
  }

  // PUBLIC_INTERFACE
  /** Setup form for creating a new note (browser-only). */
  createNewNote() {
    if (!this.isBrowser) return;
    this.selectedNote = { title: '', content: '' };
    this.editMode = true;
    this.safeSetTimeout(() => this.titleInput?.nativeElement?.focus(), 0);
  }

  // PUBLIC_INTERFACE
  /** Save or update the current note (browser-only). */
  saveNote() {
    if (!this.isBrowser) return;
    if (!this.selectedNote) return;
    this.saving = true;
    this.errorMsg = '';
    const note = this.selectedNote;
    if (note.id && typeof note.id === 'number') {
      // update
      this._supabaseService.updateNote({id: note.id, title: note.title, content: note.content}).subscribe(
        ({ error }) => {
          this.saving = false;
          if (error) {
            this.errorMsg = 'Update failed.';
          } else {
            this.fetchNotes();
            this.editMode = false;
          }
        }
      );
    } else {
      // add
      this._supabaseService.addNote(note).subscribe(
        ({ error }) => {
          this.saving = false;
          if (error) {
            this.errorMsg = 'Create failed.';
          } else {
            this.fetchNotes();
            this.editMode = false;
          }
        }
      );
    }
  }

  // PUBLIC_INTERFACE
  /** Edit the selected note. */
  editSelectedNote() {
    if (!this.isBrowser) return;
    this.editMode = true;
    this.safeSetTimeout(() => this.titleInput?.nativeElement?.focus(), 0);
  }

  // PUBLIC_INTERFACE
  /** Cancel edit operation, browser only. */
  cancelEdit() {
    if (!this.isBrowser) return;
    if (!this.selectedNote?.id) {
      this.selectedNote = null;
    }
    this.editMode = false;
  }

  // PUBLIC_INTERFACE
  /** Delete currently selected note, browser only. */
  deleteSelectedNote() {
    if (!this.isBrowser) return;
    if (!this.selectedNote?.id || typeof this.selectedNote.id !== 'number') return;
    let confirmed = true;
    if (typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function') {
      confirmed = globalThis.confirm('Delete this note?');
    }
    if (!confirmed) return;
    this.saving = true;
    this._supabaseService.deleteNote(this.selectedNote.id).subscribe(
      ({ error }) => {
        this.saving = false;
        if (error) {
          this.errorMsg = 'Delete failed.';
        } else {
          this.selectedNote = null;
          this.fetchNotes();
        }
      }
    );
  }
}
