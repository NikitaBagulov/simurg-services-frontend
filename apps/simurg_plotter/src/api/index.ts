import axios from 'axios';

const baseURL = process.env.API_URL;

if (!baseURL) {
  throw new Error('API URL not defined in environment variables.');
}

const api = axios.create({
  baseURL,
});

export type PlotType = 'map2d' | 'gim' | 'ipp_mercator' | 'ipp_polar' | 'dst';

export type PlotRequest = {
  row: number;
  col: number;
  plot_type: PlotType;
  data_file: string;
  title: string;
  timestamp: string;
  rowspan: number;
  colspan: number;
  colorbar: boolean;
  product_type: string;
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
  delimiter?: string; // Only for 'dst' plot_type
};

export type GeneratePlotRequest = {
  height: number;
  dpi: number;
  file_name: string;
  nrows: number;
  ncols: number;
  plots: PlotRequest[];
};

export type GenerateArchiveAnimationRequest = {
  start_time: string;
  end_time: string;
  interval_seconds: number;
  plot_request: GeneratePlotRequest;
};

export type GenerateResponse = {
  request_id: string;
  status: string;
};

export const generatePlot = async (data: GeneratePlotRequest): Promise<GenerateResponse> => {
  const response = await api.post<GenerateResponse>('/generate_plot/', data);
  return response.data;
};

export const generateArchiveAndAnimation = async (
  data: GenerateArchiveAnimationRequest,
): Promise<GenerateResponse> => {
  const response = await api.post<GenerateResponse>('/generate_archive_and_animation/', data);
  return response.data;
};

export const getProgress = async (url: string): Promise<any> => {
  const response = await api.get('/download_progress/', { params: { url } });
  return response.data;
};

export const getRequestProgress = async (request_id: string): Promise<any> => {
  const response = await api.get('/get_request_progress/', { params: { request_id } });
  return response.data;
};

export const getArchiveProgress = async (request_id: string): Promise<any> => {
  const response = await api.get('/get_archive_progress/', { params: { request_id } });
  return response.data;
};

export const downloadResult = async (request_id: string, filename: string): Promise<any> => {
  const response = await api.get('/download_result/', {
    params: { request_id, filename },
    responseType: 'blob',
  });
  return response.data;
};

export const downloadImages = async (request_id: string): Promise<any> => {
  const response = await api.get('/download_images/', {
    params: { request_id },
    responseType: 'blob',
  });
  return response.data;
};

export const downloadAnimation = async (request_id: string): Promise<any> => {
  const response = await api.get('/download_animation/', {
    params: { request_id },
    responseType: 'blob',
  });
  return response.data;
};
