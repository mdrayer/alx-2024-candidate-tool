import { Typography } from '@mui/material';
import { csvParse } from 'd3-dsv';
import { promises as fs } from 'fs';
import ScoreTable from './ScoreTable';
import { CsvRow } from './models';
import styles from './page.module.css';

const waPoArticle =
  'https://www.washingtonpost.com/dc-md-va/2024/05/04/alexandria-2024-democratic-primary-election-voter-guide/';

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/public/data.csv', 'utf-8');
  const data = csvParse(file);
  return (
    <main className={styles.main}>
      <Typography align="center" variant="h1">
        Alexandria 2024 Candidate Tool
      </Typography>
      <Typography align="center" m={2}>
        A tool to help you figure out who to vote for in the Alexandria 2024
        Democratic primary election.
      </Typography>
      <Typography align="center" variant="body2" mb={2}>
        Data from{' '}
        <a href={waPoArticle} target="_blank">
          &quot;A guide to the 2024 Alexandria Democratic primary election&quot;
          article
        </a>{' '}
        by Teo Armus in the Washington Post, published on May 4, 2024.
      </Typography>

      <ScoreTable columns={data.columns} data={data as unknown as CsvRow[]} />
    </main>
  );
}
