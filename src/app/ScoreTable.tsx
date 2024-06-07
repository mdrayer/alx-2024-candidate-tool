'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { MouseEvent, createElement, useState } from 'react';
import theme from '../theme';
import NumberInput from './NumberInput';
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

  const handleInputChange = (issue: string, value: number | null) => {
    let num = Number(value === null ? 0 : value);
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

  const totalWeight = Object.values(weightDict).reduce<number>(
    (prev, curr) => (prev += Math.abs(curr)),
    0,
  );

  return (
    <div>
      <Typography align="center" variant="h2">
        Weighted Scoring Table
      </Typography>
      <Typography align="center" m={2} mb={0}>
        Set the <strong>response weight</strong> between {WEIGHT_MIN} and{' '}
        {WEIGHT_MAX} for each issue question, {WEIGHT_MAX} meaning a strong{' '}
        <strong>yes</strong> and {WEIGHT_MIN} meaning a strong{' '}
        <strong>no</strong>.
      </Typography>
      <Typography align="center" m={2} mt={0}>
        Leaving the weight at 0 means that the issue will have no effect on the
        score.
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '100vh' }}>
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
                    <NumberInput
                      aria-label={`Weight for ${issue.title}`}
                      max={WEIGHT_MAX}
                      min={WEIGHT_MIN}
                      onChange={(_, val) => handleInputChange(row.issue, val)}
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
                        <Typography component="span" sx={{ display: 'none' }}>
                          {issue.labelNo || 'No'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={2} align="right" component="th" scope="row">
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
                        data.reduce<Record<string, string>>((prev, curr) => {
                          return {
                            ...prev,
                            [curr.issue]: curr[a.id],
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
    </div>
  );
}

interface IssuePopupProps {
  issue: Issue;
}
function IssuePopup({ issue }: IssuePopupProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `${issue.id}-popover` : undefined;

  return (
    <span>
      <IconButton onClick={handleClick} title="More information on this issue">
        <InfoIcon color="info" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ maxWidth: 450 }}
      >
        <Typography sx={{ p: 2 }}>{issue.description}</Typography>
      </Popover>
    </span>
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
  weightDict: WeightDict,
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
  weightDict: WeightDict,
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
