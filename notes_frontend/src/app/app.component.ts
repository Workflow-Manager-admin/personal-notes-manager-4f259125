import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NotesComponent } from './notes/notes.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LayoutComponent, NotesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'Notes';
  theme: 'light' | 'dark' = 'light';

  constructor() {
    // Guards for browser APIs (SSR-safe)
    let saved: string | null = null;
    const win = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    if (win && win.localStorage && win.matchMedia && win.document) {
      try {
        saved = win.localStorage.getItem('theme');
        if (
          saved === 'dark' ||
          (saved !== 'light' && win.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
          this.theme = 'dark';
          win.document.body.classList.add('dark-mode');
        }
      } catch {/* intentionally ignore errors when accessing theme from storage */}
    }
  }

  // PUBLIC_INTERFACE
  /** Toggle between light/dark mode */
  toggleTheme() {
    const win = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    if (win && win.document) {
      if (this.theme === 'dark') {
        win.document.body.classList.add('dark-mode');
      } else {
        win.document.body.classList.remove('dark-mode');
      }
      try { win.localStorage?.setItem('theme', this.theme); } catch {/* intentionally ignore errors when storing theme */}
    }
  }
}
