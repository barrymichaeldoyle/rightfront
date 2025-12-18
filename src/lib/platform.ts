export function detectPlatform(appId: string): "ios" | "android" | null {
  // iOS App Store IDs start with "id" followed by numbers
  if (/^id\d+$/.test(appId)) {
    return "ios";
  }
  // Android package names follow reverse domain notation (e.g., com.example.app)
  if (/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(appId)) {
    return "android";
  }
  // Return null if format is unclear
  return null;
}
