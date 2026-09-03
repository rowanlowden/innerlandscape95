export const feelingGroups = [
  {
    name: 'High energy, unpleasant',
    shortName: 'High / unpleasant',
    color: '#cc5a52',
    feelings: ['Anxious', 'Overwhelmed', 'Stressed', 'Irritated', 'Embarrassed', 'Tense'],
  },
  {
    name: 'High energy, pleasant',
    shortName: 'High / pleasant',
    color: '#e2c84f',
    feelings: ['Pleasant', 'Excited', 'Curious', 'Alive', 'Delighted'],
  },
  {
    name: 'Low energy, unpleasant',
    shortName: 'Low / unpleasant',
    color: '#628dc4',
    feelings: ['Tired', 'Bored', 'Discouraged', 'Sad', 'Disengaged'],
  },
  {
    name: 'Low energy, pleasant',
    shortName: 'Low / pleasant',
    color: '#5aa879',
    feelings: ['Calm', 'Relaxed', 'Comfortable', 'Understood', 'Appreciated'],
  },
]

export const feelings = feelingGroups.flatMap((group) =>
  group.feelings.map((name) => ({
    name,
    group: group.name,
    groupLabel: group.shortName,
    color: group.color,
  })),
)
