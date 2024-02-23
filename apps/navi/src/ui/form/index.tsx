import { useState, type FC } from 'react';
import * as yup from 'yup';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Box, Button, FileInput, Text } from '@mantine/core';
import { assert } from '@simurg-microfrontends/shared/lib/typescript';
import { notification } from '@simurg-microfrontends/shared/lib/notification';
import { BACKEND_URL } from '~/config/env';

type FormValues = {
  obsFile: Nullable<File>;
  navFile: Nullable<File>;
};

const formSchema = yup.object({
  obsFile: yup.mixed().required('Obs файл обязательный'),
  navFile: yup.mixed().required('Nav файл обязательный'),
});

export const Form: FC = () => {
  const form = useForm<FormValues>({
    initialValues: {
      obsFile: null,
      navFile: null,
    },
    validate: yupResolver(formSchema),
  });
  const [result, setResult] =
    useState<Nullable<{ valid: boolean; coordinates: [number, number, number] }>>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (values: FormValues): Promise<void> => {
    const { obsFile, navFile } = values;
    assert(obsFile && navFile, 'Obs and nav files must be defined');

    const obsArrayBuffer = await obsFile.arrayBuffer();
    const navArrayBuffer = await navFile.arrayBuffer();
    const obsBlob = new Blob([new Uint8Array(obsArrayBuffer)], {
      type: 'application/octet-stream',
    });
    const navBlob = new Blob([new Uint8Array(navArrayBuffer)], {
      type: 'application/octet-stream',
    });

    const formData = new FormData();
    formData.append('obsfile', obsBlob, obsFile.name);
    formData.append('navfile', navBlob, navFile.name);

    try {
      setIsPending(true);
      const res = await fetch(`${BACKEND_URL}/coordinates`, {
        method: 'POST',
        body: formData,
      });
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed to calculate coordinates');
      }
      const data = await res.json();
      setResult(data);
    } catch {
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при расчете координат 😔',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box maw={400}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          label="Obs файл"
          placeholder="Загрузить файл"
          withAsterisk
          accept=".17o"
          disabled={isPending}
          {...form.getInputProps('obsFile')}
        />
        <FileInput
          label="Nav файл"
          placeholder="Загрузить файл"
          withAsterisk
          mt="md"
          accept=".17n"
          disabled={isPending}
          {...form.getInputProps('navFile')}
        />
        <Button type="submit" mt="md" loading={isPending}>
          Рассчитать координаты
        </Button>
      </form>
      {result && <Text mt="md">{JSON.stringify(result)}</Text>}
    </Box>
  );
};
