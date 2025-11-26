/** @type {import('tailwindcss').Config} */
import { theme } from './src/styles/theme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        saffron: theme.colors.primary, // Alias for primary color
        gray: theme.colors.gray,
        success: theme.colors.success,
        error: theme.colors.error,
        warning: theme.colors.warning,
        info: theme.colors.info,
      },
      fontFamily: {
        sans: theme.fonts.sans,
        serif: theme.fonts.serif,
        mono: theme.fonts.mono,
      },
      fontSize: theme.fontSizes,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      zIndex: theme.zIndex,
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
