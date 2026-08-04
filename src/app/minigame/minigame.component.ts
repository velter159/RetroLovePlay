import { Component, signal, inject, output, OnDestroy } from '@angular/core';
import { AudioService } from '../audio.service';
import { CONFIG } from '../config';

interface Obstacle {
  id: number;
  x: number; // percentage (0 to 100)
  width: number; // percentage
  height: number; // percentage
  type: 'heart' | 'clock' | 'book';
  speed: number;
}

@Component({
  selector: 'app-minigame',
  imports: [],
  template: `
    <div class="game-container w-full h-full relative flex flex-col justify-between overflow-hidden bg-[#e0f2fe]"
         (click)="handleScreenClick($event)">
      
      <!-- Blue Sky & Clouds Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="cloud-1 absolute top-[10%] left-[10%] w-12 h-6 bg-white/60 rounded-full blur-[1px]"></div>
        <div class="cloud-2 absolute top-[25%] right-[15%] w-16 h-8 bg-white/60 rounded-full blur-[1px]"></div>
        <div class="cloud-3 absolute top-[40%] left-[50%] w-10 h-5 bg-white/50 rounded-full blur-[1px]"></div>
      </div>

      <!-- Top Stats Bar -->
      <div class="w-full flex justify-between p-2.5 z-10 font-pixel text-[7px] md:text-[9px] text-[#4a0e17] select-none">
        <div class="flex flex-col gap-0.5">
          <span>SCORE: {{ score() }}</span>
          <span>BEST: {{ highScore() }}</span>
        </div>
        <button type="button" 
                class="pixel-btn-exit bg-[#ff2a54] hover:bg-[#ff5c7d] text-[#fffafb] border-2 border-[#4a0e17] px-1.5 py-0.5 text-[6px] md:text-[8px] cursor-pointer"
                (click)="exitGame($event)">
          ◀ EXIT
        </button>
      </div>

      <!-- Main Game Area -->
      <div class="flex-grow w-full relative">
        <!-- Chibi Character Player -->
        <div class="game-player absolute transition-transform duration-75"
             [class.running]="gameState() === 'playing' && !isJumping()"
             [class.jumping]="isJumping()"
             [style.left.%]="playerX"
             [style.top.%]="playerY()"
             [style.width.%]="playerWidth"
             [style.height.%]="playerHeight">
          
          <!-- Chibi Pixel Art SVG -->
          <svg viewBox="0 0 32 32" class="w-full h-full">
            <!-- Hair back -->
            <rect x="6" y="8" width="20" height="16" fill="#ffd166"/>
            <!-- Head/Skin -->
            <rect x="8" y="10" width="16" height="12" fill="#ffe5db"/>
            <!-- Hair bangs/front -->
            <rect x="6" y="6" width="20" height="4" fill="#ffd166"/>
            <rect x="6" y="10" width="4" height="6" fill="#ffd166"/>
            <rect x="22" y="10" width="4" height="6" fill="#ffd166"/>
            <rect x="10" y="8" width="12" height="2" fill="#ffd166"/>
            <!-- Glasses Frame -->
            <rect x="8" y="12" width="7" height="4" fill="none" stroke="#4a0e17" stroke-width="1.5"/>
            <rect x="17" y="12" width="7" height="4" fill="none" stroke="#4a0e17" stroke-width="1.5"/>
            <rect x="15" y="13" width="2" height="1" fill="#4a0e17"/>
            <!-- Eyes inside glasses -->
            <rect x="10" y="14" width="2" height="2" fill="#4a0e17"/>
            <rect x="19" y="14" width="2" height="2" fill="#4a0e17"/>
            <!-- Blush -->
            <rect x="9" y="16" width="2" height="1" fill="#ff85a1"/>
            <rect x="21" y="16" width="2" height="1" fill="#ff85a1"/>
            <!-- Mouth -->
            <rect x="15" y="18" width="2" height="1" fill="#ff477e"/>
            <!-- Pink Bow on top left -->
            <rect x="7" y="4" width="4" height="3" fill="#ff2a54"/>
            <rect x="13" y="4" width="4" height="3" fill="#ff2a54"/>
            <rect x="11" y="5" width="2" height="2" fill="#ffffff"/>
            <!-- Dress/Checkered Body -->
            <rect x="9" y="22" width="14" height="8" fill="#4a0e17"/>
            <!-- Checkered pattern (white pixels on dress) -->
            <rect x="11" y="23" width="2" height="2" fill="#ffffff"/>
            <rect x="19" y="23" width="2" height="2" fill="#ffffff"/>
            <rect x="15" y="25" width="2" height="2" fill="#ffffff"/>
            <rect x="11" y="27" width="2" height="2" fill="#ffffff"/>
            <rect x="19" y="27" width="2" height="2" fill="#ffffff"/>
            <!-- Legs -->
            <rect x="11" y="30" width="3" height="2" fill="#ffe5db"/>
            <rect x="18" y="30" width="3" height="2" fill="#ffe5db"/>
            <rect x="10" y="31" width="4" height="1" fill="#4a0e17"/>
            <rect x="18" y="31" width="4" height="1" fill="#4a0e17"/>
          </svg>
        </div>

        <!-- Dynamic Obstacles -->
        @for (obstacle of obstacles(); track obstacle.id) {
          <div class="absolute"
               [style.left.%]="obstacle.x"
               [style.top.%]="groundY - obstacle.height"
               [style.width.%]="obstacle.width"
               [style.height.%]="obstacle.height">
            @if (obstacle.type === 'heart') {
              <!-- Broken Heart 💔 -->
              <svg viewBox="0 0 16 16" class="w-full h-full">
                <path d="M8 3.5C8 3.5 7 1.5 4.5 1.5C2 1.5 0 3.5 0 6C0 10 5.5 13 8 14.5C10.5 13 16 10 16 6C16 3.5 14 1.5 11.5 1.5C9 1.5 8 3.5 8 3.5Z" fill="#ff2a54"/>
                <path d="M8 3.5 L7.5 6 L9 8.5 L7.5 11 L8 14" stroke="#fffafb" stroke-width="1.2" fill="none"/>
              </svg>
            } @else if (obstacle.type === 'clock') {
              <!-- Alarm Clock ⏰ -->
              <svg viewBox="0 0 16 16" class="w-full h-full">
                <rect x="1" y="1" width="4" height="3" fill="#4a0e17" rx="1"/>
                <rect x="11" y="1" width="4" height="3" fill="#4a0e17" rx="1"/>
                <circle cx="8" cy="9" r="6" fill="#ffd166" stroke="#4a0e17" stroke-width="1.2"/>
                <circle cx="8" cy="9" r="4.5" fill="#fffafb"/>
                <path d="M8 9 L8 6.5 M8 9 L10 9" stroke="#4a0e17" stroke-width="1.2" stroke-linecap="round"/>
                <path d="M5 6 L7 7 M11 6 L9 7" stroke="#4a0e17" stroke-width="0.8" stroke-linecap="round"/>
              </svg>
            } @else {
              <!-- Book 📘 -->
              <svg viewBox="0 0 16 16" class="w-full h-full">
                <rect x="2" y="1" width="12" height="14" fill="#3b82f6" stroke="#4a0e17" stroke-width="1.2" rx="1"/>
                <rect x="11" y="2" width="2" height="12" fill="#fffafb"/>
                <rect x="4" y="4" width="6" height="1.5" fill="#ffd166"/>
                <rect x="4" y="7" width="5" height="1" fill="#4a0e17"/>
                <rect x="4" y="9" width="4" height="1" fill="#4a0e17"/>
              </svg>
            }
          </div>
        }
      </div>

      <!-- Retro Checkered Ground -->
      <div class="w-full h-[15%] relative bg-[#fdf2f8] border-t-4 border-[#4a0e17] overflow-hidden select-none">
        <div class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#fbcfe8_8px,#fbcfe8_16px)] opacity-50"></div>
        <!-- Little flower decorations on the floor -->
        <div class="absolute left-[20%] top-2 text-[6px]">🌸</div>
        <div class="absolute left-[65%] top-4 text-[6px]">🌸</div>
      </div>

      <!-- Game Menu Overlays (Start/Restart Screen) -->
      @if (gameState() === 'start') {
        <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 z-20">
          <div class="bg-[var(--hk-cream)] border-4 border-[#4a0e17] rounded p-4 text-center max-w-[200px] shadow-[4px_4px_0_#4a0e17] animate-in zoom-in-95 duration-150">
            <h2 class="text-[10px] md:text-[10px] font-pixel text-[#ff477e] mb-2 animate-bounce">
              {{ config.gameTitle }}
            </h2>
            <p class="text-[7px] font-pixel text-[var(--hk-text)] leading-normal mb-3">
              HELP HER JUMP OVER OBSTACLES!
            </p>
            <button type="button" 
                    (click)="startGame($event)"
                    class="pixel-btn-start bg-[#ffd166] hover:bg-[#ffe099] text-[#4a0e17] border-2 border-[#4a0e17] px-3 py-1 text-[8px] font-pixel cursor-pointer shadow-[2px_2px_0_#4a0e17]">
              START GAME
            </button>
            <p class="text-[5px] font-pixel text-[#4a0e17] opacity-60 mt-3">
              TAP SCREEN OR PRESS A TO JUMP
            </p>
          </div>
        </div>
      }

      @if (gameState() === 'gameover') {
        <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-20">
          <div class="bg-[var(--hk-cream)] border-4 border-[#4a0e17] rounded p-4 text-center max-w-[200px] shadow-[4px_4px_0_#4a0e17] animate-in zoom-in-95 duration-150">
            <h2 class="text-[10px] md:text-[12px] font-pixel text-[#ff2a54] mb-2">
              💥 GAME OVER 💥
            </h2>
            <div class="text-[7px] font-pixel text-[var(--hk-text)] flex flex-col gap-1 mb-3">
              <span>SCORE: {{ score() }}</span>
              @if (score() >= highScore() && score() > 0) {
                <span class="text-[#ff2a54] animate-pulse">🏆 NEW BEST! 🏆</span>
              } @else {
                <span>BEST: {{ highScore() }}</span>
              }
            </div>
            <button type="button" 
                    (click)="startGame($event)"
                    class="pixel-btn-start bg-[#ffd166] hover:bg-[#ffe099] text-[#4a0e17] border-2 border-[#4a0e17] px-3 py-1 text-[8px] font-pixel cursor-pointer shadow-[2px_2px_0_#4a0e17]">
              PLAY AGAIN
            </button>
          </div>
        </div>
      }

    </div>
  `,
  styles: `
    .font-pixel {
      font-family: 'Press Start 2P', monospace;
    }
    
    @keyframes runBounce {
      0% { transform: translateY(0); }
      50% { transform: translateY(-3%); }
      100% { transform: translateY(0); }
    }
    
    .game-player.running {
      animation: runBounce 0.25s infinite steps(2);
    }
    
    .game-player.jumping {
      transform: translateY(-2%) scale(1.05);
    }

    .cloud-1 { animation: floatCloud 20s linear infinite; }
    .cloud-2 { animation: floatCloud 25s linear infinite; }
    .cloud-3 { animation: floatCloud 15s linear infinite; }

    @keyframes floatCloud {
      0% { transform: translateX(300px); }
      100% { transform: translateX(-300px); }
    }
  `
})
export class MinigameComponent implements OnDestroy {
  readonly config = CONFIG;
  readonly audioService = inject(AudioService);
  
  // Game states
  readonly gameState = signal<'start' | 'playing' | 'gameover'>('start');
  readonly score = signal<number>(0);
  readonly highScore = signal<number>(0);
  
  // Character settings
  readonly playerX = 15; // horizontal position percent
  readonly groundY = 100; // floor percent
  readonly playerWidth = 10; // percent of container
  readonly playerHeight = 16; // percent of container
  
  // Character dynamics
  readonly playerY = signal<number>(this.groundY - this.playerHeight);
  readonly isJumping = signal<boolean>(false);
  private velocityY = 0;
  private gravity = 0.45;
  private jumpForce = -8.2;
  
  // Obstacles
  readonly obstacles = signal<Obstacle[]>([]);
  private nextObstacleId = 0;
  private obstacleSpawnTimer = 0;
  
  // Game dynamics
  private baseSpeed = 1.3;
  private speedIncrement = 0.05;
  private frameId: number | null = null;
  private lastTime = 0;

  // Outputs
  readonly close = output<void>();

  constructor() {
    // Load high score from local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedHighScore = localStorage.getItem(CONFIG.gameHighscoreKey);
      if (savedHighScore) {
        this.highScore.set(parseInt(savedHighScore, 10));
      }
    }
  }

  ngOnDestroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  startGame(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.audioService.playSelect();
    this.score.set(0);
    this.obstacles.set([]);
    this.isJumping.set(false);
    this.velocityY = 0;
    this.playerY.set(this.groundY - this.playerHeight);
    this.gameState.set('playing');
    this.obstacleSpawnTimer = 0;
    this.lastTime = performance.now();
    
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.frameId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  jump() {
    if (this.gameState() !== 'playing') {
      if (this.gameState() === 'start' || this.gameState() === 'gameover') {
        this.startGame();
      }
      return;
    }
    if (!this.isJumping()) {
      this.audioService.playBlip();
      this.velocityY = this.jumpForce;
      this.isJumping.set(true);
    }
  }

  handleScreenClick(event: MouseEvent) {
    // Click outside exit button should trigger jump
    const target = event.target as HTMLElement;
    if (target.closest('.pixel-btn-exit')) {
      return;
    }
    this.jump();
  }

  exitGame(event: MouseEvent) {
    event.stopPropagation();
    this.audioService.playBlip();
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.close.emit();
  }

  private gameLoop(time: number) {
    if (this.gameState() !== 'playing') return;

    const delta = time - this.lastTime;
    this.lastTime = time;

    this.updatePhysics();
    this.updateObstacles(delta);
    this.checkCollisions();

    this.frameId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  private updatePhysics() {
    if (this.isJumping()) {
      this.velocityY += this.gravity;
      const nextY = this.playerY() + this.velocityY;
      const landingY = this.groundY - this.playerHeight;
      
      if (nextY >= landingY) {
        this.playerY.set(landingY);
        this.velocityY = 0;
        this.isJumping.set(false);
      } else {
        this.playerY.set(nextY);
      }
    }
  }

  private updateObstacles(delta: number) {
    // Speed increases with score
    const currentSpeed = this.baseSpeed + (this.score() * this.speedIncrement);
    
    // Spawn obstacles
    this.obstacleSpawnTimer += delta;
    // Spawn every 1.8s to 3s (randomized)
    const spawnInterval = 1800 + Math.random() * 1200;
    
    if (this.obstacleSpawnTimer >= spawnInterval) {
      this.obstacleSpawnTimer = 0;
      this.spawnObstacle(currentSpeed);
    }

    // Move current obstacles
    const activeObstacles = this.obstacles().map(obs => ({
      ...obs,
      x: obs.x - currentSpeed
    }));

    // Filter obstacles that passed the screen
    const remainingObstacles = activeObstacles.filter(obs => {
      const isOut = obs.x + obs.width < 0;
      if (isOut) {
        // Point scored!
        this.score.update(s => s + 1);
        this.audioService.playCoin();
        
        // Save new high score if achieved
        if (this.score() > this.highScore()) {
          this.highScore.set(this.score());
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(CONFIG.gameHighscoreKey, this.score().toString());
          }
        }
      }
      return !isOut;
    });

    this.obstacles.set(remainingObstacles);
  }

  private spawnObstacle(speed: number) {
    const types: ('heart' | 'clock' | 'book')[] = ['heart', 'clock', 'book'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Random height/width
    let width = 7;
    let height = 11;
    
    if (type === 'book') {
      width = 8;
      height = 13;
    } else if (type === 'clock') {
      width = 9;
      height = 11;
    }

    this.obstacles.update(obs => [
      ...obs,
      {
        id: this.nextObstacleId++,
        x: 100,
        width,
        height,
        type,
        speed
      }
    ]);
  }

  private checkCollisions() {
    const pLeft = this.playerX;
    const pRight = this.playerX + this.playerWidth;
    const pTop = this.playerY();
    const pBottom = this.playerY() + this.playerHeight;

    for (const obs of this.obstacles()) {
      const oLeft = obs.x;
      const oRight = obs.x + obs.width;
      const oTop = this.groundY - obs.height;
      const oBottom = this.groundY;

      // Check box overlap
      // Adding a small amount of padding (2% of screen) to make collision more forgiving
      const padX = 2;
      const padY = 2;
      if (
        pRight - padX > oLeft + padX &&
        pLeft + padX < oRight - padX &&
        pBottom - padY > oTop + padY &&
        pTop + padY < oBottom - padY
      ) {
        this.triggerGameOver();
        break;
      }
    }
  }

  private triggerGameOver() {
    this.gameState.set('gameover');
    this.audioService.stopBgm();
    // Play sound on game over
    this.audioService.playBlip();
    setTimeout(() => {
      this.audioService.playBlip();
    }, 150);

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}
