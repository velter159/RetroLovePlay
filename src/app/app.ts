import { Component, signal, inject, viewChild } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MinigameComponent } from './minigame/minigame.component';
import { AudioService } from './audio.service';
import { CONFIG } from './config';

@Component({
  selector: 'app-root',
  imports: [LandingComponent, HomepageComponent, MinigameComponent],
  templateUrl: './app.html',
  host: {
    '(window:keydown)': 'handleKeyDown($event)'
  }
})
export class App {
  readonly config = CONFIG;
  readonly audioService = inject(AudioService);

  // Track the active screen state reactively
  readonly currentView = signal<'landing' | 'home' | 'game'>('landing');

  // Track transition wipe screen state
  readonly transitionActive = signal(false);

  // Overlays state signals
  readonly startMenuOpen = signal(false);
  readonly selectOverlayOpen = signal(false);

  // Get ref to minigame if loaded
  readonly gameComponent = viewChild(MinigameComponent);

  // Cheat code tracking (Up -> Down -> Left -> Right)
  private inputSequence: string[] = [];
  private readonly cheatCode = ['up', 'down', 'left', 'right'];

  pressDirection(dir: 'up' | 'down' | 'left' | 'right') {
    // If minigame is running, D-pad controls character jump
    if (this.currentView() === 'game') {
      if (dir === 'up') {
        this.gameComponent()?.jump();
      }
      return;
    }

    this.audioService.playBlip();
    this.inputSequence.push(dir);
    if (this.inputSequence.length > 4) {
      this.inputSequence.shift();
    }

    // Check cheat code sequence
    if (JSON.stringify(this.inputSequence) === JSON.stringify(this.cheatCode)) {
      this.triggerMinigame();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.currentView() === 'game') {
      if (event.key === 'ArrowUp' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.gameComponent()?.jump();
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      this.pressDirection('up');
    } else if (event.key === 'ArrowDown') {
      this.pressDirection('down');
    } else if (event.key === 'ArrowLeft') {
      this.pressDirection('left');
    } else if (event.key === 'ArrowRight') {
      this.pressDirection('right');
    }
  }

  private triggerMinigame() {
    this.audioService.stopBgm();
    this.audioService.playSelect();
    
    // Clear overlay screens
    this.startMenuOpen.set(false);
    this.selectOverlayOpen.set(false);

    // Wipe transition to minigame screen
    this.transitionActive.set(true);
    setTimeout(() => {
      this.currentView.set('game');
      this.inputSequence = []; // clear sequence
      setTimeout(() => {
        this.transitionActive.set(false);
      }, 300);
    }, 600);
  }

  closeMinigame() {
    this.transitionActive.set(true);
    setTimeout(() => {
      this.currentView.set('home');
      this.audioService.startBgm();
      setTimeout(() => {
        this.transitionActive.set(false);
      }, 300);
    }, 600);
  }

  toggleStartMenu() {
    if (this.currentView() !== 'home') return;
    this.audioService.playBlip();
    this.startMenuOpen.update(v => !v);
    this.selectOverlayOpen.set(false);
  }

  toggleSelectOverlay() {
    if (this.currentView() !== 'home') return;
    this.audioService.playSelect();
    this.selectOverlayOpen.update(v => !v);
    this.startMenuOpen.set(false);
  }

  closeOverlays() {
    this.audioService.playBlip();
    this.startMenuOpen.set(false);
    this.selectOverlayOpen.set(false);
  }

  transitionToHome() {
    this.transitionActive.set(true);
    
    // Hold at midpoint to switch screen view and start audio
    setTimeout(() => {
      this.currentView.set('home');
      this.audioService.startBgm();
      
      // Let the wipe curtain slide away
      setTimeout(() => {
        this.transitionActive.set(false);
      }, 300);
    }, 600);
  }

  transitionToLanding() {
    this.transitionActive.set(true);
    this.audioService.playBlip();
    
    // Hold at midpoint to switch screen view and stop audio
    setTimeout(() => {
      this.currentView.set('landing');
      this.audioService.stopBgm();
      this.startMenuOpen.set(false);
      this.selectOverlayOpen.set(false);
      
      // Let the wipe curtain slide away
      setTimeout(() => {
        this.transitionActive.set(false);
      }, 300);
    }, 600);
  }
}

