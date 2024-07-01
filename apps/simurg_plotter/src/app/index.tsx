import { Stack, Title, Button, Progress } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import {
  generatePlot,
  generateArchiveAndAnimation,
  downloadResult,
  downloadImages,
  downloadAnimation,
  getRequestProgress,
  getArchiveProgress,
} from '~/api';
import { useTranslation } from '~/lib/i18next';
import { ArchiveAnimationForm } from '~/ui/archiveAnimationForm';
import { ComboSelection } from '~/ui/comboSelection';
import { SinglePlotForm } from '~/ui/singlePlotForm';
import { TypeSelection } from '~/ui/typeSelection';

type FormType = 'none' | 'singlePlot' | 'archiveAnimation';

const App: React.FC = () => {
  const [result, setResult] = useState<Nullable<any>>(null);
  const [request, setRequest] = useState<Nullable<any>>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [selectedCombo, setSelectedCombo] =
    useState<Nullable<{ id: string; requestSkeleton: Record<string, any> }>>(null);
  const [currentForm, setCurrentForm] = useState<FormType>('none');
  const { t } = useTranslation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (requestId) {
      interval = setInterval(async () => {
        try {
          let response;
          if (currentForm === 'singlePlot') {
            response = await getRequestProgress(requestId);
          } else if (currentForm === 'archiveAnimation') {
            response = await getArchiveProgress(requestId);
          }
          setProgress(response.progress);
          if (response.progress === 100 && interval) {
            clearInterval(interval);
          }
        } catch {
          if (interval) {
            clearInterval(interval);
          }
        }
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [requestId, currentForm]);

  const handleComboSelect = (combo: { id: string; requestSkeleton: Record<string, any> }): void => {
    setSelectedCombo(combo);
    setCurrentForm('none');
  };

  const handleTypeSelect = (type: string | null): void => {
    if (type) {
      setCurrentForm(type as FormType);
    } else {
      setCurrentForm('none');
    }
  };

  const handleFormSubmit = async (data: any): Promise<void> => {
    if (selectedCombo) {
      const plots = selectedCombo.requestSkeleton.plot_request.plots || [];
      let finalRequest: Record<string, any> | undefined;
      if (currentForm === 'singlePlot') {
        finalRequest = {
          plot_request: {
            ...selectedCombo.requestSkeleton.plot_request,
            file_name: data.fileName,
            plots: plots.map((plot: any) => ({
              ...plot,
              timestamp: data.timestamp,
            })),
          },
        };
        try {
          const response = await generatePlot(finalRequest.plot_request); // Call generatePlot function
          setRequestId(response.request_id); // Store the request_id from the server response
        } catch {
          // Handle error silently
        }
      } else if (currentForm === 'archiveAnimation') {
        finalRequest = {
          start_time: data.start_time,
          end_time: data.end_time,
          interval_seconds: data.interval_seconds,
          plot_request: {
            ...selectedCombo.requestSkeleton.plot_request,
            file_name: data.fileName,
            plots: plots.map((plot: any) => ({
              ...plot,
              timestamp: data.start_time,
            })),
          },
        };
        try {
          const response = await generateArchiveAndAnimation(finalRequest);
          setRequestId(response.request_id);
        } catch {
          // Handle error silently
        }
      }
      setRequest(finalRequest);
      setResult(data);
    }
  };

  const handleDownload = async (type: 'result' | 'images' | 'animation'): Promise<void> => {
    if (requestId) {
      try {
        let response;
        if (type === 'result') {
          response = await downloadResult(
            requestId,
            selectedCombo?.requestSkeleton.plot_request.file_name || 'result',
          );
        } else if (type === 'images') {
          response = await downloadImages(requestId);
        } else if (type === 'animation') {
          response = await downloadAnimation(requestId);
        }
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        let extension = 'png';
        if (type === 'animation') {
          extension = 'gif';
        } else if (type === 'images') {
          extension = 'zip';
        }
        link.setAttribute('download', `${requestId}.${extension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        // Handle error silently
      }
    }
  };

  const resetSelection = (): void => {
    setSelectedCombo(null);
    setCurrentForm('none');
    setResult(null);
    setRequest(null);
    setRequestId(null);
    setProgress(null);
  };

  return (
    <Stack>
      <Title>{t('Graph Generator')}</Title>
      {!selectedCombo && <ComboSelection onComboSelect={handleComboSelect} />}
      {selectedCombo && currentForm === 'none' && <TypeSelection onSelect={handleTypeSelect} />}

      {currentForm === 'archiveAnimation' && <ArchiveAnimationForm onSubmit={handleFormSubmit} />}
      {currentForm === 'singlePlot' && <SinglePlotForm onSubmit={handleFormSubmit} />}

      {progress !== null && (
        <div>
          <Title order={3}>{t('Progress')}</Title>
          <Progress value={progress} />
        </div>
      )}

      {result && (
        <div>
          <Title order={3}>{t('Result')}</Title>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <Title order={3}>{t('Final Request')}</Title>
          <pre>{JSON.stringify(request, null, 2)}</pre>
          <Button onClick={resetSelection}>Reset</Button>
          {progress === 100 && currentForm === 'singlePlot' && (
            <Button onClick={async() =>  handleDownload('result')}>Download Result</Button>
          )}
          {progress === 100 && currentForm === 'archiveAnimation' && (
            <>
              <Button onClick={async() =>  handleDownload('images')}>Download Images</Button>
              <Button onClick={async() =>  handleDownload('animation')}>Download Animation</Button>
            </>
          )}
        </div>
      )}
    </Stack>
  );
};

export default App;
