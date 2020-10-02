import Typography from "typography"
import nordTheme from 'typography-theme-nord'

// nordTheme.overrideThemeStyles

const typography = new Typography(nordTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
