'use client';

import { ChangeEvent, useState } from 'react';
import { councilCandidates, issuesDict, mayoralCandidates } from './data';
import { CsvRow } from './models';

type WeightDict = Record<string, number>;

const WEIGHT_MIN = -10;
const WEIGHT_MAX = 10;

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
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Issue</th>
            <th colSpan={mayoralCandidates.length}>Mayoral Candidates</th>
            <th colSpan={councilCandidates.length}>City Council Candidates</th>
            <th rowSpan={2}>Weight</th>
          </tr>
          <tr>
            {mayoralCandidates.map(m => (
              <th key={m.id}>{m.lastName}</th>
            ))}
            {councilCandidates.map(c => (
              <th key={c.id}>{c.lastName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            const issue = issuesDict[row.issue];
            return (
              <tr key={row.issue}>
                <th>{issue.title}</th>
                {mayoralCandidates.map(m => (
                  <td key={m.id}>{row[m.id] === '1' ? 'X' : ''}</td>
                ))}
                {councilCandidates.map(m => (
                  <td key={m.id}>{row[m.id] === '1' ? 'X' : ''}</td>
                ))}
                <td>
                  <input
                    max={WEIGHT_MAX}
                    min={WEIGHT_MIN}
                    onChange={e => handleWeightChange(e, row.issue)}
                    step={1}
                    type="number"
                    value={weightDict[row.issue]}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            {columns.map((a, i) =>
              i === 0 ? (
                <th key={a}>Score</th>
              ) : (
                <td key={a}>
                  {calculateCandidateScore(
                    data.reduce<Record<string, number>>((prev, curr) => {
                      return {
                        ...prev,
                        [curr.issue]: curr[a] === '1' ? 1 : 0,
                      };
                    }, {}),
                    weightDict,
                  )}
                </td>
              ),
            )}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div>
        Mayor Scores:
        <ol>
          {mayoralScores
            .slice()
            .sort((a, b) =>
              a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
            )
            .map(a => (
              <li key={a.id}>
                {a.fullName} - {a.score}
              </li>
            ))}
        </ol>
      </div>
      <div>
        City Council Scores:
        <ol>
          {councilScores
            .slice()
            .sort((a, b) =>
              a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
            )
            .map(a => (
              <li key={a.id}>
                {a.fullName} - {a.score}
              </li>
            ))}
        </ol>
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
