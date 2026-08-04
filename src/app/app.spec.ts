import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { describe, it, beforeEach, expect } from 'vitest';
import { CONFIG } from './config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const expectedHeadline = CONFIG.landingHeadline.replace(/\n/g, ' ');
    expect(compiled.querySelector('h1')?.textContent?.replace(/\s+/g, ' ')).toContain(expectedHeadline);
  });
});
