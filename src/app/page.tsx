import { csvParse } from 'd3-dsv';
import { promises as fs } from 'fs';
import { Fragment } from 'react';
import ScoreTable from './ScoreTable';
import { councilCandidates, issuesArr, mayoralCandidates } from './data';
import { CsvRow } from './models';
import styles from './page.module.css';

const waPoArticle =
  'https://www.washingtonpost.com/dc-md-va/2024/05/04/alexandria-2024-democratic-primary-election-voter-guide/';

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/public/data.csv', 'utf-8');
  const data = csvParse(file);
  return (
    <main className={styles.main}>
      <h1>Alexandria Candidates 2024</h1>
      <p>
        Data from{' '}
        <a href={waPoArticle} target="_blank">
          {waPoArticle}
        </a>
        .
      </p>
      <h2>Mayoral Candidates</h2>
      <ul>
        {mayoralCandidates.map(a => (
          <li key={a.id}>{a.fullName}</li>
        ))}
      </ul>
      <h2>City Council Candidates</h2>
      <ul>
        {councilCandidates.map(a => (
          <li key={a.id}>{a.fullName}</li>
        ))}
      </ul>

      <h2>Personal Scoring Table</h2>
      <ScoreTable columns={data.columns} data={data as unknown as CsvRow[]} />

      <h2>Issues</h2>
      {issuesArr.map(issue => (
        <Fragment key={issue.id}>
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
        </Fragment>
      ))}
    </main>
  );
}
