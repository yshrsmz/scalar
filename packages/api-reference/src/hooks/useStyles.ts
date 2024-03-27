import { type ThemeId, baseStyles, getThemeById } from '@scalar/themes'

type UseStylesOptions = {
  theme: ThemeId | undefined
}

function findOrCreateStyleTag(id: string): HTMLStyleElement {
  const existingStyleEl = document.querySelector(
    `style#${id}`,
  ) as HTMLStyleElement | null

  // Use the existing <style> tag if it's there
  if (existingStyleEl) {
    existingStyleEl.innerHTML = ''
    return existingStyleEl
  }

  // Create a new <style> tag otherwise
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.id = id
  head.prepend(style)
  return style
}

export function useStyles({ theme }: UseStylesOptions = { theme: 'default' }) {
  const id = 'scalar-refs-styles'

  const style = findOrCreateStyleTag(id)

  style.appendChild(document.createTextNode(baseStyles))
  style.appendChild(document.createTextNode(getThemeById(theme)))
}
