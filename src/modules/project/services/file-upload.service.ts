import { apiClient } from '@/shared/api/api';
import type { UrlResponse } from '@/shared/types/url';

export class FileUploadService {
  static upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`file-upload`, { body: formData }).json<UrlResponse>();
  }
}
