import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';

/**
 * PUBLIC_INTERFACE
 * Service for working with Supabase backend for notes CRUD.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = 'https://mzxyorlnbfdkneiezgjz.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eHlvcmxuYmZka25laWV6Z2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDUxMDksImV4cCI6MjA2NzYyMTEwOX0.URYpbwtC2u5ORBlUzpWPNspXMWq_cLBOKWMOgGbilyQ';
    this.supabase = createClient(url, key);
  }

  // PUBLIC_INTERFACE
  /** Fetch all notes, most recent first. */
  getNotes(): Observable<any> {
    return from(
      this.supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })
    );
  }

  // PUBLIC_INTERFACE
  /** Create a new note. */
  addNote(note: { title: string; content: string }): Observable<any> {
    return from(
      this.supabase
        .from('notes')
        .insert([{
          title: note.title,
          content: note.content,
        }])
    );
  }

  // PUBLIC_INTERFACE
  /** Update an existing note. */
  updateNote(note: { id: number; title: string; content: string }): Observable<any> {
    return from(
      this.supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
        })
        .eq('id', note.id)
    );
  }

  // PUBLIC_INTERFACE
  /** Delete a note by id. */
  deleteNote(id: number): Observable<any> {
    return from(
      this.supabase
        .from('notes')
        .delete()
        .eq('id', id)
    );
  }

  // PUBLIC_INTERFACE
  /** Search notes by title/content. Returns all if query empty. */
  searchNotes(query: string): Observable<any> {
    if (!query) return this.getNotes();
    return from(
      this.supabase
        .from('notes')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('updated_at', { ascending: false })
    );
  }
}
