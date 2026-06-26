import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Unique package/application ID for the Android app
  appId: "com.bytebond.meditrack",

  // Display name shown on device home screen and app drawer
  appName: "MediTrack",

  // The directory Vite outputs the production build to
  webDir: "dist",

  server: {
    // Using 'https' scheme allows BrowserRouter to work in Android WebView.
    // Without this, the app runs on file:// which breaks history-based routing.
    androidScheme: "https",
  },

  android: {
    // Allow cleartext HTTP traffic to local/dev backend (if needed during testing)
    // Set to false when deploying with a proper HTTPS backend
    allowMixedContent: true,

    // Capture back button press to navigate within the WebView
    captureInput: true,
  },
};

export default config;
