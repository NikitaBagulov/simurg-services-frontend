import { Select, Stack, Title } from '@mantine/core';
import React from 'react';

type TypeSelectionProps = {
  onSelect: (type: string | null) => void;
};

export const TypeSelection: React.FC<TypeSelectionProps> = ({ onSelect }) => {
  const handleChange = (value: string | null): void => {
    onSelect(value);
  };

  return (
    <Stack>
      <Title order={3}>Select Plot Type</Title>
      <Select
        label="Plot type"
        placeholder="Choose type"
        onChange={handleChange}
        data={[
          { value: 'singlePlot', label: 'Single' },
          { value: 'archiveAnimation', label: 'Archive/Animation' },
        ]}
      />
    </Stack>
  );
};
