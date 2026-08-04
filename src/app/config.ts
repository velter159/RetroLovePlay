export interface MemoryCard {
  id: number;
  title: string;
  emoji: string;
  desc: string;
  details: string;
  colorClass: string;
  image1: string;
  image1Caption: string;
  image2: string;
  image2Caption: string;
  image3: string;
  image3Caption: string;
  image4: string;
  image4Caption: string;
  underMaintenance?: boolean;
}

export interface AppConfig {
  siteTitle: string;
  siteBranding: string;
  p1Name: string;
  landingHeadline: string;
  landingSubtitle: string;
  homepageHeader: string;
  portraitImage: string;
  portraitTitle: string;
  portraitCaption: string;
  portraitLoveNote: string;
  gameTitle: string;
  gameHighscoreKey: string;
  memories: MemoryCard[];
}

export const CONFIG: AppConfig = {
  siteTitle: "💖 Retro Love Site 💖",
  siteBranding: "RETRO PLAY",
  p1Name: "PLAYER 1",
  landingHeadline: "HAPPY ANNIVERSARY!",
  landingSubtitle: "A sweet retro surprise made just for the most beautiful person in the world! 🌸",
  homepageHeader: "WELCOME! PLEASE SELECT A MEMORY CARTRIDGE TO START",
  portraitImage: "images/couple_portrait.png",
  portraitTitle: "SWEETEST BOND 🌸",
  portraitCaption: "YOU & ME",
  portraitLoveNote: "FOREVER & ALWAYS 💖",
  gameTitle: "🎀 CHIBI RUN 🎀",
  gameHighscoreKey: "retro_run_high_score",
  memories: [
    {
      id: 1,
      title: "Our First Date",
      emoji: "🌸",
      desc: "The beginning of us...",
      details: "Write the beautiful story of how you first met and details of your first date here!\n\nCustomize this template to tell your unique love story. Share the laughter, the nervousness, the first hand-held walk, and all the sweet moments that made it special.",
      colorClass: "bg-pink-100",
      image1: "images/first_date_1.png",
      image1Caption: "Happy Us 🌸",
      image2: "images/hands_held.png",
      image2Caption: "Hand in Hand ❤️",
      image3: "images/first_date_3.png",
      image3Caption: "Snack Time 🍎",
      image4: "images/first_date_4.png",
      image4Caption: "First Photobooth 📸"
    },
    {
      id: 2,
      title: "Food Adventures",
      emoji: "🍛",
      desc: "Yummylicious food...",
      details: "Write about your food adventures here! List your favorite cafes, the meals you love to share, or the funny kitchen disasters you experienced together.\n\nFrom fancy restaurants to late-night takeout, food brings us together and builds the best memories!",
      colorClass: "bg-blue-100",
      image1: "images/sweet_moments_1.png",
      image1Caption: "Matcha Love ☕",
      image2: "images/sweet_moments_2.png",
      image2Caption: "Lunch Time 🥩",
      image3: "images/sweet_moments_3.png",
      image3Caption: "Korean Chicken 🍗",
      image4: "images/sweet_moments_4.png",
      image4Caption: "Your Foodie Partner 💖"
    },
    {
      id: 3,
      title: "Sweet Moments",
      emoji: "🧁",
      desc: "Inside jokes & hugs...",
      details: "Share your sweet everyday moments, warm hugs, inside jokes, and daily text messages.\n\nEvery small moment builds the beautiful foundation of love that supports us through everything.",
      colorClass: "bg-yellow-100",
      image1: "images/phone_love.png",
      image1Caption: "Kish Kish 😽",
      image2: "images/late_calls_1.png",
      image2Caption: "Silly Moment 🤪",
      image3: "images/late_calls_2.png",
      image3Caption: "Road Trip ⛰️",
      image4: "images/love_letter.png",
      image4Caption: "Love Notes ✉️"
    },
    {
      id: 4,
      title: "Traveling Together",
      emoji: "✈️",
      desc: "Exploring the world...",
      details: "Describe your travels and plans for future adventures here!\n\nWhether it is a trip to a new country, a hike up a mountain, or just walking down the street, every path is an adventure when we walk it hand in hand.",
      colorClass: "bg-green-100",
      image1: "images/adventures_1.png",
      image1Caption: "Adventures ✈️",
      image2: "images/adventures_2.png",
      image2Caption: "Calling Home 📞",
      image3: "images/adventures_3.png",
      image3Caption: "Forever ❤️",
      image4: "images/adventures_4.png",
      image4Caption: "Love Notes ✉️",
      underMaintenance: true // Set to true to show the retro under construction card
    }
  ]
};
