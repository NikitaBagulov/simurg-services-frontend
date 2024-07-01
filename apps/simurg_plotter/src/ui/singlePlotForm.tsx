import { Button, TextInput, Stack, Title } from '@mantine/core';
import React, { useState } from 'react';

type SinglePlotFormProps = {
  onSubmit: (data: any) => void;
};

export const SinglePlotForm: React.FC<SinglePlotFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFormSubmit = (): void => {
    const timestamp = `${date}T${time}`;
    const data = {
      timestamp,
      fileName,
    };
    onSubmit(data);
  };

  return (
    <Stack>
      <Title order={4}>Single Plot Configuration</Title>
      <TextInput
        label="Date"
        placeholder="Enter date (YYYY-MM-DD)"
        value={date}
        onChange={(event) => setDate(event.currentTarget.value)}
      />
      <TextInput
        label="Time"
        placeholder="Enter time (HH:MM:SS)"
        value={time}
        onChange={(event) => setTime(event.currentTarget.value)}
      />
      <TextInput
        label="File Name"
        placeholder="Enter file name"
        value={fileName}
        onChange={(event) => setFileName(event.currentTarget.value)}
      />
      <Button onClick={handleFormSubmit}>Submit</Button>
    </Stack>
  );
};
