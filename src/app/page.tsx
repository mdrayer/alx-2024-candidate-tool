import { List, ListItem, Typography } from '@mui/material';
import { csvParse } from 'd3-dsv';
import { promises as fs } from 'fs';
import ScoreTable from './ScoreTable';
import { councilCandidates, mayoralCandidates } from './data';
import { CsvRow } from './models';
import styles from './page.module.css';

const waPoArticle =
  'https://www.washingtonpost.com/dc-md-va/2024/05/04/alexandria-2024-democratic-primary-election-voter-guide/';

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/public/data.csv', 'utf-8');
  const data = csvParse(file);
  return (
    <main className={styles.main}>
      <Typography variant="h1">Alexandria Candidates 2024</Typography>
      <Typography>
        Data from{' '}
        <a href={waPoArticle} target="_blank">
          {waPoArticle}
        </a>
        .
      </Typography>
      <Typography variant="h2">Mayoral Candidates</Typography>
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
      </List>

      <ScoreTable columns={data.columns} data={data as unknown as CsvRow[]} />
    </main>
  );
}
