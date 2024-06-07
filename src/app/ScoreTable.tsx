'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import {
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
import { ChangeEvent, useState } from 'react';
import { councilCandidates, issuesDict, mayoralCandidates } from './data';
import { CsvRow } from './models';

type WeightDict = Record<string, number>;

const WEIGHT_MIN = -10;
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

  const mayoralScores = mayoralCandidates.map(m => {
    return {
      ...m,
      score: getCandidateScore(data, weightDict, m.id),
    };
  });
  const councilScores = councilCandidates.map(m => {
    return {
      ...m,
      score: getCandidateScore(data, weightDict, m.id),
    };
  });

  return (
    <div>
      <Typography align="center" variant="h2">
        Weighted Scoring Table
      </Typography>
      <TableContainer component={Paper}>
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
              <TableCell align="center" rowSpan={2}>
                Weight
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
                </TableRow>
              );
            })}
            <TableRow>
              {columns.map((a, i) =>
                i === 0 ? (
                  <TableCell
                    key={a}
                    align="right"
                    component="th"
                    scope="row"
                    sx={{ maxWidth: ISSUE_COL_MAX_WIDTH }}
                  >
                    Score
                  </TableCell>
                ) : (
                  <TableCell
                    key={a}
                    align="center"
                    sx={{
                      borderLeft: i === 1 ? 1 : undefined,
                      borderRight:
                        i === mayoralCandidates.length ? 1 : undefined,
                    }}
                  >
                    {calculateCandidateScore(
                      data.reduce<Record<string, number>>((prev, curr) => {
                        return {
                          ...prev,
                          [curr.issue]: curr[a] === '1' ? 1 : 0,
                        };
                      }, {}),
                      weightDict,
                    )}
                  </TableCell>
                ),
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Typography variant="h3">Mayor Scores</Typography>
        <List component="ol" sx={{ listStyle: 'decimal', pl: 4 }} dense={true}>
          {mayoralScores
            .slice()
            .sort((a, b) =>
              a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
            )
            .map(a => (
              <ListItem key={a.id} sx={{ display: 'list-item' }}>
                {a.fullName} - {a.score}
              </ListItem>
            ))}
        </List>
      </div>
      <div>
        <Typography variant="h3">City Council Scores</Typography>
        <List component="ol" sx={{ listStyle: 'decimal', pl: 4 }} dense={true}>
          {councilScores
            .slice()
            .sort((a, b) =>
              a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
            )
            .map(a => (
              <ListItem key={a.id} sx={{ display: 'list-item' }}>
                {a.fullName} - {a.score}
              </ListItem>
            ))}
        </List>
      </div>
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
