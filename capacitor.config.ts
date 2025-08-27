import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d2879f7355aa4014905857c405dc6155',
  appName: 'sacred-counts-tracker',
  webDir: 'dist',
  server: {
    url: 'https://d2879f73-55aa-4014-9058-57c405dc6155.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f1f14",
      showSpinner: false
    }
  }
};

export default config;