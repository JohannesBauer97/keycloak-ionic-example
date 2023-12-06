import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'example',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: false,
    allowNavigation: [
      "myschema://login/*",
      "http://192.168.1.21:8080/*",
      "http://localhost:8080/*"
    ]
  }
};

export default config;
