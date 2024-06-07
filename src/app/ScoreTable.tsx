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
import { councilCandidates, issuesDict, mayoralCandidates } from './data';
import { CsvRow } from './models';

type WeightDict = Record<string, number>;

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 10;
const ISSUE_COL_MAX_WIDTH = '300px';

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
      <Typography align="center" p={2}>
        Description text on how to use the table. Ducimus aliquip luctus mollit
        est adipiscing nisi integer, quos? Volutpat! Blandit illo! Perferendis
        corrupti repudiandae, impedit justo corporis, blandit, ipsam.
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table size="small">
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
                  }}
                >
                  {m.lastName}
                </TableCell>
              ))}
              {councilCandidates.map(c => (
                <TableCell key={c.id} align="center">
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
                      <Tooltip title={issue.description}>
                        <IconButton>
                          <InfoIcon color="info" />
                        </IconButton>
                      </Tooltip>
                      {issue.title}
                    </Typography>
                    <Typography fontSize="0.75rem" variant="body2">
                      {issue.question}
                    </Typography>
                  </TableCell>
                  <TableCell>
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
                        ''
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
              {mayoralCandidates.map((a, i) => {
                return (
                  <TableCell
                    key={a.id}
                    align="center"
                    sx={{
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
                      scoresDict[a.id] >= mayorHighlightScore
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
              {councilCandidates.map(a => {
                return (
                  <TableCell key={a.id} align="center">
                    {createElement(
                      scoresDict[a.id] >= councilHighlightScore
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
            <div>
              <Typography variant="h3">Mayor Scores</Typography>
              <List
                component="ol"
                sx={{ listStyle: 'decimal', pl: 4 }}
                dense={true}
              >
                {mayoralScores.map(a => {
                  const text = `${a.fullName} - ${a.score}`;
                  return (
                    <ListItem key={a.id} sx={{ display: 'list-item' }}>
                      <Typography component="span">
                        {scoresDict[a.id] >= mayorHighlightScore ? (
                          <strong>{text}</strong>
                        ) : (
                          text
                        )}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </Box>
        </Grid>
        <Grid item={true} sm={6}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <div>
              <Typography variant="h3">City Council Scores</Typography>
              <List
                component="ol"
                sx={{ listStyle: 'decimal', pl: 4 }}
                dense={true}
              >
                {councilScores.map(a => {
                  const text = `${a.fullName} - ${a.score}`;
                  return (
                    <ListItem key={a.id} sx={{ display: 'list-item' }}>
                      <Typography component="span">
                        {scoresDict[a.id] >= councilHighlightScore ? (
                          <strong>{text}</strong>
                        ) : (
                          text
                        )}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </Box>
        </Grid>
      </Grid>
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
