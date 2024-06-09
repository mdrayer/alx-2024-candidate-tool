'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import {
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
import { MouseEvent, useState } from 'react';
import { useData } from './DataContext';
import {
  Issue,
  councilCandidates,
  issuesDict,
  mayoralCandidates,
} from './data';
import { CsvRow } from './models';

const ISSUE_COL_MIN_WIDTH = 300;
const ISSUE_COL_MAX_WIDTH = 350;

interface CandidateResponseTableProps {
  data: CsvRow[];
}
function CandidateResponseTable({
  data,
}: CandidateResponseTableProps): JSX.Element | null {
  const { isClickedCandidate, isSubmitted } = useData();

  if (!isSubmitted && !isClickedCandidate) {
    return null;
  }

  return (
    <section>
      <Typography align="center" variant="h2" my={2}>
        Candidate Response Table
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '100vh' }}>
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                rowSpan={2}
                sx={{
                  maxWidth: ISSUE_COL_MAX_WIDTH,
                  minWidth: ISSUE_COL_MIN_WIDTH,
                }}
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
            {data.map((row, rowI) => {
              const issue = issuesDict[row.issue];
              return (
                <TableRow key={row.issue}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      maxWidth: ISSUE_COL_MAX_WIDTH,
                      minWidth: ISSUE_COL_MIN_WIDTH,
                    }}
                  >
                    <Typography>
                      <IssuePopup issue={issue} />
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
                        borderBottom:
                          rowI === data.length - 1 &&
                          i >= 0 &&
                          i <= mayoralCandidates.length - 1
                            ? 1
                            : undefined,
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
          </TableBody>
        </Table>
      </TableContainer>
    </section>
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

export default CandidateResponseTable;
