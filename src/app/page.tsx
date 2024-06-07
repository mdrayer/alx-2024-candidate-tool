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
        Alexandria Candidates 2024
      </Typography>
      <Typography align="center" variant="body2" p={2}>
        Data from{' '}
        <a href={waPoArticle} target="_blank">
          &quot;A guide to the 2024 Alexandria Democratic primary election&quot;
          article
        </a>{' '}
        by Teo Armus in the Washington Post, published on May 4, 2024.
      </Typography>

      {/* <Typography variant="h2">Mayoral Candidates</Typography>
      <List dense={true}>
        {mayoralCandidates.map(a => (
          <ListItem key={a.id}>
            <Typography component="span">{a.fullName}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant="h2">City Council Candidates</Typography>
      <List dense={true}>
        {councilCandidates.map(a => (
          <ListItem key={a.id}>
            <Typography component="span">{a.fullName}</Typography>
          </ListItem>
        ))}
      </List> */}

      <ScoreTable columns={data.columns} data={data as unknown as CsvRow[]} />
    </main>
  );
}
