'use client';

import {
  Alert,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import theme from '../theme';
import { useData } from './DataContext';
import styles from './ScoreTable.module.css';
import { councilCandidates, mayoralCandidates } from './data';
import { CsvRow, WeightDictionary } from './models';

interface ScoreTableProps {
  columns: string[];
  data: CsvRow[];
}
function ScoreTable({ columns, data }: ScoreTableProps): JSX.Element | null {
  const { isClickedCandidate, isSubmitted, weightDict } = useData();

  if (!data || !columns) {
    return <div>ERROR</div>;
  }

  if (isClickedCandidate && !isSubmitted) {
    return (
      <Grid
        container={true}
        direction="column"
        alignItems="center"
        justifyContent="center"
        m={4}
      >
        <Grid item={true}>
          <Alert severity="warning">
            Submit your responses above to see candidate scores.
          </Alert>
        </Grid>
      </Grid>
    );
  }

  if (!isSubmitted) {
    return null;
  }

  const mayoralScores = mayoralCandidates
    .map(m => {
      return {
        ...m,
        score: getCandidateScore(data, weightDict, m.id),
      };
    })
    .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));
  const shouldHighlight = !mayoralScores.every(
    a => a.score === mayoralScores[0].score,
  );
  const councilScores = councilCandidates
    .map(m => {
      return {
        ...m,
        score: getCandidateScore(data, weightDict, m.id),
      };
    })
    .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));

  const mayorHighlightScore = shouldHighlight
    ? mayoralScores[0].score
    : Infinity;
  const councilHighlightScore = shouldHighlight
    ? councilScores[5].score
    : Infinity;

  const totalWeight = Object.values(weightDict).reduce<number>(
    (prev, curr) => (prev += Math.abs(curr)),
    0,
  );

  return (
    <section>
      <Grid container={true} spacing={2} sx={{ marginTop: 2 }}>
        <Grid item={true} md={6}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ScoresDisplay
              label="Mayor Scores"
              scores={mayoralScores}
              scoreThreshold={mayorHighlightScore}
              total={totalWeight}
            />
          </Box>
        </Grid>
        <Grid item={true} md={6}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ScoresDisplay
              label="City Council Scores"
              scores={councilScores}
              scoreThreshold={councilHighlightScore}
              total={totalWeight}
            />
          </Box>
        </Grid>
      </Grid>
    </section>
  );
}

const BAR_HEIGHT = 30;
const BAR_WIDTH_MAX = 200;
interface ScoresDisplayProps {
  label: string;
  scores: Array<{ id: string; fullName: string; score: number }>;
  scoreThreshold?: number;
  total: number;
}
function ScoresDisplay({
  label,
  scores,
  scoreThreshold = Infinity,
  total,
}: ScoresDisplayProps) {
  return (
    <div>
      <Typography align="center" variant="h3">
        {label}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {scores.map(a => {
              const pct = total > 0 ? a.score / total : 0;
              const isHighlighted = a.score >= scoreThreshold;
              const barWidth = pct * BAR_WIDTH_MAX;
              const textIsInside = barWidth > 20;
              const textX = textIsInside ? barWidth - 4 : barWidth + 4;
              return (
                <TableRow key={a.id}>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: 'none', width: 200 }}
                  >
                    <Typography component="span">
                      {isHighlighted ? (
                        <strong>{a.fullName}</strong>
                      ) : (
                        a.fullName
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <svg
                      viewBox={`0 0 ${BAR_WIDTH_MAX} ${BAR_HEIGHT}`}
                      height={BAR_HEIGHT}
                      width={BAR_WIDTH_MAX}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={barWidth}
                        height={BAR_HEIGHT}
                        fill={
                          theme.palette.primary[
                            isHighlighted ? 'main' : 'light'
                          ]
                        }
                      />
                      <text
                        className={clsx(styles.barText, {
                          [styles.isInside]: textIsInside,
                          [styles.isHighlighted]: isHighlighted,
                        })}
                        x={textX}
                        y={BAR_HEIGHT / 2}
                        dy="0.35rem"
                        textAnchor={textIsInside ? 'end' : 'start'}
                      >
                        {a.score}
                      </text>
                      <rect
                        x={0}
                        y={0}
                        width={BAR_WIDTH_MAX}
                        height={BAR_HEIGHT}
                        fillOpacity={0}
                        strokeWidth={1}
                        stroke="black"
                      />
                    </svg>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function calculateCandidateScore(
  data: Record<string, string>,
  weightDict: WeightDictionary,
): number {
  let score = 0;

  Object.entries(weightDict).forEach(([issue, weight]) => {
    // Get the candidate response. 1 means yes, 0 means no.
    const candidateDatum = data[issue];
    // If user's weight is positive, this means we want to factor in
    // "yes" responses. Negative means "no" responses".
    if (weight > 0) {
      // Factor in "yes" responses to score.
      if (candidateDatum === '1') {
        score += weight;
      }
    } else if (weight < 0) {
      // Factor in "no" responses to score.
      if (candidateDatum === '0') {
        score += -weight;
      }
    }
  });

  return score;
}
function getCandidateScore(
  data: CsvRow[],
  weightDict: WeightDictionary,
  id: string,
): number {
  const candidateDict = data.reduce<Record<string, string>>((prev, curr) => {
    return {
      ...prev,
      [curr.issue]: curr[id],
    };
  }, {});
  return calculateCandidateScore(candidateDict, weightDict);
}

export default ScoreTable;
