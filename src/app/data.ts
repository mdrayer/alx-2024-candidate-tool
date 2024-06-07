interface Issue {
  title: string;
  description: string;
  id: string;
  labelYes?: string;
  labelNo?: string;
}

const issuesArr: Issue[] = [
  {
    title: 'Pace of housing development',
    description:
      'Is Alexandria building new housing too quickly or not quickly enough?',
    id: 'pacing_too_quick',
    labelNo: 'Not quickly enough',
    labelYes: 'Too quickly',
  },
  {
    title: 'Government structure',
    description: 'Should City Council seats return to a ward/district system?',
    id: 'gov_structure',
  },
  {
    title: 'Council salaries',
    description:
      'Should Alexandria increase salaries for the City Council and mayor?',
    id: 'council_salary',
  },
  {
    title: 'Zoning for Housing',
    description:
      'Would you have voted for the final “Zoning for Housing/Housing for All” package?',
    id: 'zoning',
  },
  {
    title: 'Housing density',
    description:
      'Does Zoning for Housing need to go further and allow more than four units on any residential lot?',
    id: 'density',
  },
  {
    title: 'Confederate streets',
    description:
      'Is “rededicating” Confederate streets the single best approach?',
    id: 'conf_streets',
  },
  {
    title: 'Affordable housing funding',
    description:
      'Should the city put more money in its affordable housing trust fund, even if it means raising residential property taxes?',
    id: 'aff_funding',
  },
  {
    title: 'Torpedo Factory Art Center',
    description:
      'Should the city replace studios on the first floor with other uses, such as a cafe or makerspace?',
    id: 'torpedo',
  },
  {
    title: 'School resource officers',
    description:
      'Should the City Council continue allocating money for school resource officers?',
    id: 'sro',
  },
  {
    title: 'Gaza cease-fire resolution',
    description: 'Should the City Council pass a Gaza cease-fire resolution?',
    id: 'gaza',
  },
  {
    title: 'Bus rapid transit',
    description: 'Would you expand dedicated bus lanes?',
    id: 'brt',
  },
  {
    title: 'King Street',
    description:
      'Should the city make more of King Street pedestrian-friendly?',
    id: 'king_st',
  },
];
const issuesDict = issuesArr.reduce<Record<string, Issue>>(
  (prev, curr) => ({
    ...prev,
    [curr.id]: curr,
  }),
  {},
);

interface Candidate {
  fullName: string;
  lastName: string;
  id: string;
  type: 'mayor' | 'council';
}
interface MayoralCandidate extends Candidate {
  type: 'mayor';
}
interface CouncilCandidate extends Candidate {
  type: 'council';
}
const mayoralCandidates: MayoralCandidate[] = (
  [
    {
      fullName: 'Alyia Smith-Parker Gaskins',
      lastName: 'Gaskins',
      id: 'gaskins',
    },
    {
      fullName: 'Amy Jackson',
      lastName: 'Jackson',
      id: 'jackson',
    },
    {
      fullName: 'Steven Peterson',
      lastName: 'Peterson',
      id: 'peterson',
    },
  ] satisfies Array<Omit<MayoralCandidate, 'type'>>
).map(o => ({ ...o, type: 'mayor' }));
const councilCandidates: CouncilCandidate[] = (
  [
    {
      fullName: 'Canek Aguirre',
      lastName: 'Aguirre',
      id: 'aguirre',
    },
    {
      fullName: 'Sarah R. Bagley',
      lastName: 'Bagley',
      id: 'bagley',
    },
    {
      fullName: 'John Taylor Chapman',
      lastName: 'Chapman',
      id: 'chapman',
    },
    {
      fullName: 'Abdel Elnoubi',
      lastName: 'Elnoubi',
      id: 'elnoubi',
    },
    {
      fullName: 'Jacinta E. Greene',
      lastName: 'Greene',
      id: 'greene',
    },
    {
      fullName: 'Kevin Harris',
      lastName: 'Harris',
      id: 'harris',
    },
    {
      fullName: 'Jonathan P. Huskey',
      lastName: 'Huskey',
      id: 'huskey',
    },
    {
      fullName: 'James “Jimmy” Lewis',
      lastName: 'Lewis',
      id: 'lewis',
    },
    {
      fullName: 'R. Kirk McPike',
      lastName: 'McPike',
      id: 'mcpike',
    },
    {
      fullName: "Jesse O'Connell",
      lastName: "O'Connell",
      id: 'oconnell',
    },
    {
      fullName: 'Charlotte Scherer',
      lastName: 'Scherer',
      id: 'scherer',
    },
  ] satisfies Array<Omit<CouncilCandidate, 'type'>>
).map(o => ({ ...o, type: 'council' }));

const allCandidates: Candidate[] = [...mayoralCandidates, ...councilCandidates];
const candidatesDict = allCandidates.reduce<Record<string, Candidate>>(
  (prev, curr) => ({
    ...prev,
    [curr.id]: curr,
  }),
  {},
);

export {
  allCandidates,
  candidatesDict,
  councilCandidates,
  issuesArr,
  issuesDict,
  mayoralCandidates,
};
