'use client';

import { Mark } from '@mui/base';
import { Alert, Box, Button, Slider, Typography } from '@mui/material';
import { FormEventHandler } from 'react';
import { useData } from './DataContext';
import styles from './IssueForm.module.css';
import { Issue, issuesArr } from './data';

const VALUES = [-3, -2, -1, 0, 1, 2, 3];
const VALUE_TO_LABEL: Record<number, string> = {
  [-3]: 'Disagree Strongly',
  [-2]: 'Disagree',
  [-1]: 'Disagree Slightly',
  [0]: 'Neutral',
  [1]: 'Agree Slightly',
  [2]: 'Agree',
  [3]: 'Agree Strongly',
};
const marks = VALUES.map<Mark>(a => ({
  value: a,
  label: VALUE_TO_LABEL[a].replaceAll(' ', ' \n '),
}));
function valueText(value: number): string {
  return VALUE_TO_LABEL[value];
}

interface IssueSliderProps {
  index: number;
  issue: Issue;
  onSliderChange: (newValue: number) => void;
  value: number;
}
function IssueSlider({
  index,
  issue,
  onSliderChange,
  value,
}: IssueSliderProps) {
  return (
    <Box
      alignItems="center"
      p={2}
      mb={5}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant="h3">
        Topic {index}: {issue.title}
      </Typography>
      <Alert severity="info" sx={{ maxWidth: 800 }}>
        {issue.description}
      </Alert>
      <Typography variant="subtitle1">
        <strong>{issue.question}</strong>
      </Typography>
      <Box pb={1} px={3} sx={{ width: 400 }}>
        <Slider
          aria-label={issue.question}
          classes={{
            markLabel: styles.markLabel,
          }}
          getAriaValueText={valueText}
          step={1}
          min={VALUES[0]}
          max={VALUES[VALUES.length - 1]}
          valueLabelDisplay="off"
          marks={marks}
          track={false}
          onChange={(_, v) => {
            onSliderChange(Array.isArray(v) ? v[0] : v);
          }}
          value={value}
        />
      </Box>
    </Box>
  );
}

function IssueForm(): JSX.Element {
  const {
    isClickedCandidate,
    isSubmitted,
    setCandidateClicked,
    setSubmitted,
    setValue,
    weightDict,
  } = useData();

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <Typography align="center" mt={5} variant="h2">
        Questionnaire
      </Typography>
      {/* <Typography align="center">
        Fill out this form to see candidate scores
      </Typography> */}
      <form onSubmit={handleSubmit}>
        {issuesArr.map((a, i) => (
          <IssueSlider
            key={a.id}
            index={i + 1}
            issue={a}
            onSliderChange={newValue => setValue(a.id, newValue)}
            value={weightDict[a.id]}
          />
        ))}
        <Box textAlign="center">
          <Button type="submit" variant="contained">
            Submit
          </Button>
          {!(isSubmitted || isClickedCandidate) && (
            <Button
              onClick={() => setCandidateClicked(true)}
              size="small"
              sx={{ marginLeft: 2, textTransform: 'unset' }}
              type="button"
            >
              Or view candidate responses
            </Button>
          )}
        </Box>
      </form>
    </div>
  );
}

export default IssueForm;
