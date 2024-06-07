'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChangeEvent, createElement, useState } from 'react';
import styles from './ScoreTable.module.css';
import {
  Issue,
  councilCandidates,
  issuesDict,
  mayoralCandidates,
} from './data';
import { CsvRow } from './models';

type WeightDict = Record<string, number>;

const WEIGHT_MIN = -10;
const WEIGHT_MAX = 10;
const ISSUE_COL_MAX_WIDTH = 300;

interface ScoreTableProps {
  columns: string[];
  data: CsvRow[];
}
function ScoreTable({ columns, data }: ScoreTableProps): JSX.Element {
  const [weightDict, setWeightDict] = useState<WeightDict>(
    data.reduce<WeightDict>((dict, curr) => {
      return {
        ...dict,
        [curr.issue]: 0,
      };
    }, {}),
  );

  if (!data || !columns) {
    return <div>ERROR</div>;
  }

  const handleWeightChange = (
    e: ChangeEvent<HTMLInputElement>,
    issue: string,
  ) => {
    let num = Number(e.target.value);
    // Ensure number is still within min-max range.
    num = Math.min(num, WEIGHT_MAX);
    num = Math.max(num, WEIGHT_MIN);
    // Ensure number is an integer.
    num = Math.round(num);
    setWeightDict(dict => ({
      ...dict,
      [issue]: num,
    }));
  };

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

  const scoresDict = [...mayoralScores, ...councilScores].reduce<
    Record<string, number>
  >(
    (prev, curr) => ({
      ...prev,
      [curr.id]: curr.score,
    }),
    {},
  );
  const mayorHighlightScore = shouldHighlight
    ? mayoralScores[0].score
    : Infinity;
  const councilHighlightScore = shouldHighlight
    ? councilScores[5].score
    : Infinity;

  return (
    <div>
      <Typography align="center" variant="h2">
        Weighted Scoring Table
      </Typography>
      <Typography align="center" m={2} mb={0}>
        Set the <strong>&quot;yes&quot; response weight</strong> between{' '}
        {WEIGHT_MIN} and
        {WEIGHT_MAX} for each issue question, {WEIGHT_MAX} meaning a strong{' '}
        <strong>yes</strong> and {WEIGHT_MIN} meaning a strong{' '}
        <strong>no</strong>.
      </Typography>
      <Typography align="center" m={2} mt={0}>
        Leaving the weight at 0 means that the issue will have no effect on the
        score.
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, maxHeight: '100vh' }}
      >
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                rowSpan={2}
                sx={{ maxWidth: ISSUE_COL_MAX_WIDTH }}
              >
                Issue
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Weight
              </TableCell>
              <TableCell
                align="center"
                colSpan={mayoralCandidates.length}
                scope="colgroup"
                sx={{
                  borderLeft: 1,
                  borderRight: 1,
                  borderTop: 1,
                }}
              >
                Mayoral Candidates
              </TableCell>
              <TableCell
                align="center"
                colSpan={councilCandidates.length}
                scope="colgroup"
              >
                City Council Candidates
              </TableCell>
            </TableRow>
            <TableRow>
              {mayoralCandidates.map((m, i) => (
                <TableCell
                  key={m.id}
                  align="center"
                  sx={{
                    borderLeft: i === 0 ? 1 : undefined,
                    borderRight:
                      i === mayoralCandidates.length - 1 ? 1 : undefined,
                    top: 38,
                  }}
                >
                  {m.lastName}
                </TableCell>
              ))}
              {councilCandidates.map(c => (
                <TableCell key={c.id} align="center" sx={{ top: 38 }}>
                  {c.lastName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => {
              const issue = issuesDict[row.issue];
              return (
                <TableRow key={row.issue}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ maxWidth: ISSUE_COL_MAX_WIDTH }}
                  >
                    <Typography>
                      <IssuePopup issue={issue} />
                      {issue.title}
                    </Typography>
                    <Typography fontSize="0.75rem" variant="body2">
                      {issue.question}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <input
                      max={WEIGHT_MAX}
                      min={WEIGHT_MIN}
                      onChange={e => handleWeightChange(e, row.issue)}
                      step={1}
                      type="number"
                      value={weightDict[row.issue]}
                    />
                  </TableCell>
                  {[...mayoralCandidates, ...councilCandidates].map((m, i) => (
                    <TableCell
                      key={m.id}
                      align="center"
                      sx={{
                        borderLeft: i === 0 ? 1 : undefined,
                        borderRight:
                          i === mayoralCandidates.length - 1 ? 1 : undefined,
                      }}
                    >
                      {row[m.id] === '1' ? (
                        <Tooltip
                          title={`${m.fullName} - ${issue.labelYes || 'Yes'}`}
                        >
                          <IconButton>
                            <CheckCircleOutlineIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <span className={styles['visually-hidden']}>
                          {issue.labelNo || 'No'}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell
                colSpan={2}
                align="right"
                component="th"
                scope="row"
                sx={{ maxWidth: ISSUE_COL_MAX_WIDTH }}
              >
                Score
              </TableCell>
              {[...mayoralCandidates, ...councilCandidates].map((a, i) => {
                return (
                  <TableCell
                    key={a.id}
                    align="center"
                    sx={{
                      // Add borders for mayor cells.
                      borderBottom:
                        i >= 0 && i <= mayoralCandidates.length - 1
                          ? 1
                          : undefined,
                      borderLeft: i === 0 ? 1 : undefined,
                      borderRight:
                        i === mayoralCandidates.length - 1 ? 1 : undefined,
                    }}
                  >
                    {createElement(
                      scoresDict[a.id] >=
                        (a.type === 'mayor'
                          ? mayorHighlightScore
                          : councilHighlightScore)
                        ? 'strong'
                        : 'span',
                      {},
                      calculateCandidateScore(
                        data.reduce<Record<string, number>>((prev, curr) => {
                          return {
                            ...prev,
                            [curr.issue]: curr[a.id] === '1' ? 1 : 0,
                          };
                        }, {}),
                        weightDict,
                      ),
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container={true} spacing={2} sx={{ marginTop: 2 }}>
        <Grid item={true} sm={6}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ScoresDisplay
              label="Mayor Scores"
              scores={mayoralScores}
              scoreThreshold={mayorHighlightScore}
            />
          </Box>
        </Grid>
        <Grid item={true} sm={6}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ScoresDisplay
              label="City Council Scores"
              scores={councilScores}
              scoreThreshold={councilHighlightScore}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

interface IssuePopupProps {
  issue: Issue;
}
function IssuePopup({ issue }: IssuePopupProps): JSX.Element {
  return (
    <Tooltip title={issue.description}>
      <IconButton>
        <InfoIcon color="info" />
      </IconButton>
    </Tooltip>
  );
}

interface ScoresDisplayProps {
  label: string;
  scores: Array<{ id: string; fullName: string; score: number }>;
  scoreThreshold?: number;
}
function ScoresDisplay({
  label,
  scores,
  scoreThreshold = Infinity,
}: ScoresDisplayProps) {
  return (
    <div>
      <Typography variant="h3">{label}</Typography>
      <List component="ol" sx={{ listStyle: 'decimal', pl: 4 }} dense={true}>
        {scores.map(a => {
          const text = `${a.fullName} - ${a.score}`;
          return (
            <ListItem key={a.id} sx={{ display: 'list-item' }}>
              <Typography component="span">
                {a.score >= scoreThreshold ? <strong>{text}</strong> : text}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

function calculateCandidateScore(
  data: Record<string, number>,
  weightDict: WeightDict,
): number {
  let score = 0;

  Object.entries(weightDict).forEach(([issue, weight]) => {
    const candidateDatum = data[issue];
    score += candidateDatum * weight;
  });

  return score;
}
function getCandidateScore(
  data: CsvRow[],
  weightDict: WeightDict,
  id: string,
): number {
  const candidateDict = data.reduce<Record<string, number>>((prev, curr) => {
    return {
      ...prev,
      [curr.issue]: curr[id] === '1' ? 1 : 0,
    };
  }, {});
  return calculateCandidateScore(candidateDict, weightDict);
}

export default ScoreTable;
