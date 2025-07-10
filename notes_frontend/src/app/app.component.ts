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
    // SSR/browser-safe guards for theme logic. Never reference undeclared variables.
    let saved: string | null = null;
    if (
      typeof globalThis !== 'undefined' &&
      globalThis.localStorage &&
      globalThis.matchMedia &&
      globalThis.document
    ) {
      try {
        saved = globalThis.localStorage.getItem('theme');
        if (
          saved === 'dark' ||
          (saved !== 'light' && globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
          this.theme = 'dark';
          globalThis.document.body.classList.add('dark-mode');
        }
      } catch {/* intentionally ignore errors when accessing theme from storage */}
    }
  }

  // PUBLIC_INTERFACE
  /** Toggle between light/dark mode */
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    if (typeof globalThis !== 'undefined' && globalThis.document) {
      if (this.theme === 'dark') {
        globalThis.document.body.classList.add('dark-mode');
      } else {
        globalThis.document.body.classList.remove('dark-mode');
      }
      try {
        if (globalThis.localStorage) {
          globalThis.localStorage.setItem('theme', this.theme);
        }
      } catch {/* intentionally ignore errors when storing theme */}
    }
  }
}
