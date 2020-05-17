
export const sortContacts = contacts => {
  const lastContact = contact => {
    const { lastContacted, notes } = contact

    const noteDates =
      notes &&
      Object.values(notes)
        .map(note => note && note.lastUpdated)
        .filter(item => item !== 9007199254740991)

    const mostRecentNote = noteDates && Math.max(...noteDates)

    return Math.max(lastContacted, mostRecentNote)
  }

  const compare = (a, b) => {
    if (lastContact(a) < lastContact(b)) {
      return -1
    }
    if (lastContact(a) > lastContact(b)) {
      return 1
    }
    return 0
  }

  return (
    contacts &&
    contacts
      .filter(
        item =>
          !!item.lastContacted && (!item.bucket || item.bucket === 'active')
      )
      .sort(compare)
  )
}
