import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * Layout component with sidebar and topbar for navigation and theme switching.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LayoutComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() themeToggle = new EventEmitter();

  toggleTheme() {
    this.themeToggle.emit();
  }
}
