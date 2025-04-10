export interface IStorageInfo {
  serial?: string;
  device_type: 'Internal' | 'SDCard';
  total_size?: number;
  free_size?: number;
  total_time?: number;
  free_time?: number;
  format_enable?: boolean;
  record_size?: number;
  override: 'Off' | 'Auto';
  threshold: number;
  rw_type?: string;
}

export interface IStorage {
  storage_info: IStorageInfo;
}
