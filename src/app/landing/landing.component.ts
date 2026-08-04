import { Component, output, signal, OnDestroy, inject } from '@angular/core';
import { AudioService } from '../audio.service';
import { CONFIG } from '../config';

interface HeartParticle {
  id: number;
  left: number;
  scale: number;
  delay: string;
}

@Component({
  selector: 'app-landing',
  imports: [],
  template: `
    <div class="landing-container flex flex-col justify-center items-center h-full p-4 relative overflow-hidden select-none">
      
      <!-- Floating Hearts Background -->
      @for (heart of hearts(); track heart.id) {
        <span class="heart-float text-3xl pulse-heart"
              [style.left.%]="heart.left"
              [style.transform]="'scale(' + heart.scale + ')'"
              [style.animationDelay]="heart.delay">
          💖
        </span>
      }

      <!-- Main Retro Arcade Frame -->
      <div class="pixel-border-lg bg-[var(--hk-cream)] p-6 md:p-8 max-w-md w-full text-center relative z-10 flex flex-col items-center gap-6 shadow-[8px_8px_0_rgba(0,0,0,0.15)]">
        
        <!-- Pixel Hello Kitty Style Bow -->
        <button type="button" 
                class="bow-wrapper w-20 h-14 bounce-retro cursor-pointer border-none bg-transparent outline-none p-0 focus-visible:ring-4 focus-visible:ring-pink-300 rounded" 
                (click)="onBowClick()"
                aria-label="Play bow chime sound">
          <svg viewBox="0 0 24 16" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Outlines -->
            <path d="M4 1h16M2 2h2m16 0h2M1 4h1m20 0h1M1 6h1m20 0h1M2 8h2m16 0h2M4 9h16" stroke="#4a0e17" stroke-width="1.2" stroke-linecap="square"/>
            <!-- Left loop (red) -->
            <rect x="2" y="2" width="7" height="6" fill="#ff2a54"/>
            <!-- Right loop (red) -->
            <rect x="15" y="2" width="7" height="6" fill="#ff2a54"/>
            <!-- Center knot (white/yellow) -->
            <rect x="10" y="3" width="4" height="4" fill="#ffd166"/>
            <!-- Outer outlines for center knot -->
            <rect x="9" y="3" width="1" height="4" stroke="#4a0e17" stroke-width="1"/>
            <rect x="14" y="3" width="1" height="4" stroke="#4a0e17" stroke-width="1"/>
            <!-- Inner bow details -->
            <path d="M6 4h1v2H6zm11 0h1v2h-1z" fill="#4a0e17"/>
          </svg>
        </button>

        <!-- Animated Headline -->
        <div class="w-full">
          <h1 class="text-xs md:text-sm font-pixel leading-relaxed text-[var(--hk-text)] tracking-wider" style="white-space: pre-line">
            {{ config.landingHeadline }}
          </h1>
        </div>

        <!-- Sweet Subtitle -->
        <p class="text-sm md:text-base text-[var(--hk-text)] font-semibold leading-relaxed max-w-[280px]">
          "{{ config.landingSubtitle }}"
        </p>

        <!-- The main press me button -->
        <button type="button" 
                class="pixel-btn pixel-btn-red text-[10px] md:text-xs tracking-widest mt-2 focus:ring-4 focus:ring-pink-300"
                (click)="onPressMe()">
          PRESS ME!
        </button>

      </div>

      <!-- Extra instructions / status bar at bottom of landing -->
      <div class="absolute bottom-4 text-[10px] font-pixel text-[var(--hk-text)] opacity-70">
        [ SELECT START TO SURPRISE ]
      </div>

    </div>
  `
})
export class LandingComponent implements OnDestroy {
  readonly config = CONFIG;
  private readonly audioService = inject(AudioService);
  
  // Emitter to notify parent view transition
  readonly pressMe = output<void>();

  // Reactive list of heart particles
  readonly hearts = signal<HeartParticle[]>([]);
  private heartIdCounter = 0;
  private readonly heartIntervalId: any;

  constructor() {
    // Generate floating hearts periodically
    this.heartIntervalId = setInterval(() => {
      this.spawnHeart();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.heartIntervalId) {
      clearInterval(this.heartIntervalId);
    }
  }

  private spawnHeart() {
    const newHeart: HeartParticle = {
      id: this.heartIdCounter++,
      left: Math.random() * 90 + 5, // Keep within screen margins (5% to 95%)
      scale: Math.random() * 0.7 + 0.5, // sizes between 0.5 and 1.2
      delay: '0s'
    };

    this.hearts.update(list => {
      // Keep only last 15 hearts to prevent memory overflow
      const truncated = list.length > 15 ? list.slice(list.length - 14) : list;
      return [...truncated, newHeart];
    });
  }

  onBowClick() {
    this.audioService.playBlip();
  }

  onPressMe() {
    // Play retro chime sound
    this.audioService.playCoin();
    
    // Emit page press event to transition views
    this.pressMe.emit();
  }
}
