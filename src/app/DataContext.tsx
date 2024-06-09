'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { issuesArr } from './data';
import { WeightDictionary } from './models';

type DataContextType = {
  isSubmitted: boolean;
  setSubmitted: (value: boolean) => void;
  /** Whether the "View Candidate Response" button has been clicked. */
  isClickedCandidate: boolean;
  setCandidateClicked: (value: boolean) => void;
  setValue: (id: string, value: number) => void;
  weightDict: WeightDictionary;
};

const DataContext = createContext<DataContextType>({
  isClickedCandidate: false,
  isSubmitted: false,
  setCandidateClicked: () => {},
  setSubmitted: () => {},
  setValue: () => {},
  weightDict: {},
});

function DataContextProvider({ children }: PropsWithChildren) {
  const [isClickedCandidate, setCandidateClicked] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [weightDict, setWeightDict] = useState<WeightDictionary>(
    issuesArr.reduce<WeightDictionary>(
      (prev, curr) => ({ ...prev, [curr.id]: 0 }),
      {},
    ),
  );
  const handleSetValue: DataContextType['setValue'] = (id, value) => {
    setWeightDict(dict => ({ ...dict, [id]: value }));
  };
  return (
    <DataContext.Provider
      value={{
        isClickedCandidate,
        setCandidateClicked,
        isSubmitted,
        setSubmitted,
        setValue: handleSetValue,
        weightDict,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  return useContext(DataContext);
}

export { DataContextProvider, useData };
