import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function safeToString(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof (err as any).message === "string") return (err as any).message;
  if (typeof err === "object" && err !== null) return JSON.stringify(err);
  if (err === undefined) return "[undefined error]";
  return String(err);
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    try {
      // Use safe stringification for error output
      console.error(safeToString(err));
    } catch {
      // If console.error still fails, do nothing (avoid fatal crash)
    }
  });
