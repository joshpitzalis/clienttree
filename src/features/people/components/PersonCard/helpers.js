
export const firstLastInitial = fullName => {
  const names = fullName.split(' ')
  if (names.length === 0) {
    return 'ct'
  }
  if (names.length === 1) {
    return names
  }
  return names[0][0] + names[names.length - 1][0]
}
