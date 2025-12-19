export type Platform = "ios" | "android";

const IOS_APP_ID_REGEX = /^id\d{7,13}$/i; // e.g., id324684580
const ANDROID_PACKAGE_NAME_REGEX = /^(?=.{3,255}$)(?:[a-z0-9_]+\.)+[a-z0-9_]+$/; // e.g., com.spotify.music

export function detectPlatform(appId: string): Platform | null {
  // iOS App Store IDs start with "id" followed by numbers
  if (IOS_APP_ID_REGEX.test(appId)) {
    return "ios";
  }
  // Android package names follow reverse domain notation (e.g., com.example.app)
  if (ANDROID_PACKAGE_NAME_REGEX.test(appId)) {
    return "android";
  }
  // Return null if format is unclear
  return null;
}
