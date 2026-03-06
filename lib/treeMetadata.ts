export const TREE_METADATA = [
  {
    name: 'BARE TREE',
    type: 'BARE',
    tierLabel: '1 / 6',
    rangeLabel: '0–50',
    previewCommitsLabel: '25',
    previewCommitsValue: 25,
    color: '#aac4d8',
    pageDescription:
      'Inactive or brand new account. The tree has shed all its leaves and sleeps under frost, waiting for the first commit of spring.',
    cardDescription:
      'Inactive or brand new account. Waiting for the first commit of spring.',
  },
  {
    name: 'SAKURA TREE',
    type: 'SAKURA',
    tierLabel: '2 / 6',
    rangeLabel: '51–200',
    previewCommitsLabel: '130',
    previewCommitsValue: 130,
    color: '#ff9ec7',
    pageDescription:
      'A casual contributor. Your tree blossoms with pink petals carried by the wind — beautiful, gentle, full of potential.',
    cardDescription:
      'A casual contributor. Blossoms with pink petals carried by the wind.',
  },
  {
    name: 'WILLOW TREE',
    type: 'WILLOW',
    tierLabel: '3 / 6',
    rangeLabel: '201–500',
    previewCommitsLabel: '350',
    previewCommitsValue: 350,
    color: '#7dd9a8',
    pageDescription:
      'A regular developer. Your willow drapes long, lush strands — a developer who shows up consistently and builds steadily.',
    cardDescription:
      'A regular developer. Consistent growth with calm, steady momentum.',
  },
  {
    name: 'OAK TREE',
    type: 'OAK',
    tierLabel: '4 / 6',
    rangeLabel: '501–1000',
    previewCommitsLabel: '720',
    previewCommitsValue: 720,
    color: '#d4a017',
    pageDescription:
      'A strong, productive developer. Dense canopy, deep roots. Your oak is a landmark — others can stand in its shade.',
    cardDescription:
      'A strong productive developer. Dense canopy and deep roots.',
  },
  {
    name: 'REDWOOD',
    type: 'REDWOOD',
    tierLabel: '5 / 6',
    rangeLabel: '1001–2000',
    previewCommitsLabel: '1,450',
    previewCommitsValue: 1450,
    color: '#ff6030',
    pageDescription:
      'A towering presence. Tier upon tier of branches reach the sky. You are a force in the community — prolific and unstoppable.',
    cardDescription:
      'A towering presence in the community. Prolific and unstoppable.',
  },
  {
    name: 'CRYSTAL TREE',
    type: 'CRYSTAL',
    tierLabel: '6 / 6',
    rangeLabel: '2000+',
    previewCommitsLabel: '2,800+',
    previewCommitsValue: 2800,
    color: '#c060ff',
    pageDescription:
      'A towering crystalline tree shines above the rest. You are the 0.1% — a monument to dedication.',
    cardDescription:
      'A monument to dedication. Elite consistency at massive scale.',
  },
] as const

export const MAX_TREE_TIER = TREE_METADATA.length - 1
