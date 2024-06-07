interface Issue {
  title: string;
  question: string;
  description: string;
  id: string;
  labelYes?: string;
  labelNo?: string;
}

const issuesArr: Issue[] = [
  {
    title: 'Pace of housing development',
    question:
      'Is Alexandria building new housing too quickly or not quickly enough?',
    description:
      'While Alexandria is ahead of the housing production goals set in coordination with other local governments, the city has also lost thousands of units of affordable housing. Many advocates say construction needs to pick up, while others worry about overwhelming the city’s small-town character. Is Alexandria building new housing too quickly or not quickly enough?',
    id: 'pacing_too_quick',
    labelNo: 'Not quickly enough',
    labelYes: 'Too quickly',
  },
  {
    title: 'Government structure',
    question: 'Should City Council seats return to a ward/district system?',
    description:
      'Until the 1950s, Alexandria elected its City Council via a ward system, with each member of the body representing a specific set of neighborhoods. All seats on the council are now elected at-large, although School Board members are elected by district. Should City Council seats return to a ward/district system?',
    id: 'gov_structure',
  },
  {
    title: 'Council salaries',
    question:
      'Should Alexandria increase salaries for the City Council and mayor?',
    description:
      'Salaries for the mayor and the council in Alexandria stand at about $40,000 a year and have been raised once in the past two decades. The council may be looking at another raise soon. But a similar pay hike in Fairfax County — meant to make the job open to a wider range of people — was met with some pushback. Should Alexandria increase salaries for the City Council and mayor?',
    id: 'council_salary',
  },
  {
    title: 'Zoning for Housing',
    question:
      'Would you have voted for the final “Zoning for Housing/Housing for All” package?',
    description:
      'Residents and civic groups spent the past year debating a package of zoning changes that most notably eliminated single-family-only zoning in Alexandria. The City Council unanimously approved that plan in November, though some residents are suing to block it. Would you have voted for the final “Zoning for Housing/Housing for All” package?',
    id: 'zoning',
  },
  {
    title: 'Housing density',
    question:
      'Does Zoning for Housing need to go further and allow more than four units on any residential lot?',
    description:
      'Some urbanist advocacy groups said they were disappointed that the package of zoning changes did not allow for greater density in single-family neighborhoods and have called on the city to allow “five-plexes” or “six-plexes” in those areas. Does Zoning for Housing need to go further and allow more than four units on any residential lot?',
    id: 'density',
  },
  {
    title: 'Confederate streets',
    question: 'Is “rededicating” Confederate streets the single best approach?',
    description:
      'Council members have disagreed on whether it is appropriate to keep the city’s Confederate street names but “rededicate” them after new eponyms (such as renaming Jordan Street for former city resident Thomasina Jordan), or give those streets entirely new names. Is “rededicating” Confederate streets the single best approach?',
    id: 'conf_streets',
  },
  {
    title: 'Affordable housing funding',
    question:
      'Should the city put more money in its affordable housing trust fund, even if it means raising residential property taxes?',
    description:
      'Advocacy groups this year called for the city to inject millions into its affordable housing trust fund as a way to help stalled projects break ground. But the city is also facing a budget crunch with stagnant commercial tax revenue. Should the city put more money in its affordable housing trust fund, even if it means raising residential property taxes?',
    id: 'aff_funding',
  },
  {
    title: 'Torpedo Factory Art Center',
    question:
      'Should the city replace studios on the first floor with other uses, such as a cafe or makerspace?',
    description:
      'This crumbling city-owned waterfront property in Old Town has been a persistent challenge for Alexandria. Some city officials have called for revamping the building as a way to bring in more visitors and fund renovations, but many artists who rent out low-cost studio space say they are being unfairly targeted. Should the city replace studios on the first floor with other uses, such as a cafe or makerspace?',
    id: 'torpedo',
  },
  {
    title: 'School resource officers',
    question:
      'Should the City Council continue allocating money for school resource officers?',
    description:
      'The council voted to cut school resource officer positions from the city budget in 2021 but then restored the head count that was lost in a subsequent city budget without specifically designating those slots for SROs. A city-school system task force is working through the future of the SRO program. Should the City Council continue allocating money for school resource officers?',
    id: 'sro',
  },
  {
    title: 'Gaza cease-fire resolution',
    question: 'Should the City Council pass a Gaza cease-fire resolution?',
    description:
      'Activist groups have repeatedly taken to City Council meetings to call on lawmakers to pass a resolution in support of a cease-fire in Gaza. Many officials say the city has no purview over foreign policy and should refrain from weighing in on that topic, though activists point out the council previously considered resolutions condemning the Iraq War and the genocide in Darfur. Should the City Council pass a Gaza cease-fire resolution?',
    id: 'gaza',
  },
  {
    title: 'Bus rapid transit',
    question: 'Would you expand dedicated bus lanes?',
    description:
      'The city has planned or is considering to set aside lanes on part of Duke Street, Route 1 and in the Beauregard-Van Dorn corridor as dedicated lanes for bus rapid transit, although many of those projects are pending approval. Would you expand dedicated bus lanes?',
    id: 'brt',
  },
  {
    title: 'King Street',
    question: 'Should the city make more of King Street pedestrian-friendly?',
    description:
      'The City Council turned the 100 block of King Street in Old Town into a pedestrian-only car-free zone and is considering a proposal to do the same with the 200 block. Some residents are calling for that process to continue further up the street while others are worrying about the impact on car traffic. Should the city make more of King Street pedestrian-friendly?',
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
