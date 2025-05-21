export type ClockVariant =
  | "full"
  | "themeCard"
  | "smallPreview"
  | "colorSettings";

export interface ThemeProps {
  color: string;
  variant?: ClockVariant;
  previewMode: boolean;
}
