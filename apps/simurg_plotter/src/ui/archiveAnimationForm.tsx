import { Button, TextInput, NumberInput, Stack, Title } from '@mantine/core';
import React, { useState } from 'react';

type ArchiveAnimationFormProps = {
  onSubmit: (data: any) => void;
};

export const ArchiveAnimationForm: React.FC<ArchiveAnimationFormProps> = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState<number | undefined>(undefined);
  const [fileName, setFileName] = useState('');

  const handleFormSubmit = (): void => {
    const startTimeFormatted = `${startDate}T${startTime}`;
    const endTimeFormatted = `${startDate}T${endTime}`;
    const data = {
      start_time: startTimeFormatted,
      end_time: endTimeFormatted,
      interval_seconds: intervalSeconds,
      fileName,
    };
    onSubmit(data);
  };

  return (
    <Stack>
      <Title order={4}>Archive/Animation Configuration</Title>
      <TextInput
        label="Start Date"
        placeholder="Enter start date (YYYY-MM-DD)"
        value={startDate}
        onChange={(event) => setStartDate(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Start Time"
        placeholder="Enter start time (HH:MM:SS)"
        value={startTime}
        onChange={(event) => setStartTime(event.currentTarget.value)}
        required
      />
      <TextInput
        label="End Time"
        placeholder="Enter end time (HH:MM:SS)"
        value={endTime}
        onChange={(event) => setEndTime(event.currentTarget.value)}
        required
      />
      <NumberInput
        label="Interval Seconds"
        placeholder="Enter interval in seconds"
        value={intervalSeconds}
        onChange={(value) => setIntervalSeconds(value ? Number(value) : undefined)}
        required
        min={1}
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
