import { Injectable, signal } from '@angular/core';
import translations from './translations';

export type SupportedLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang = signal<SupportedLang>('es');

  translate(key: string, params?: Record<string, string>): string {
    const langDict = translations[this.currentLang()] ?? translations['es'];
    let value = langDict[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{{${k}}}`, v);
      }
    }
    return value;
  }

  toggle(): void {
    this.currentLang.update(l => (l === 'es' ? 'en' : 'es'));
  }
}
