export interface IOperatorUpdateOffline {
  fileUpload: File;
}
export interface IOperatorUpdateOnline {
  autoUpdate: boolean;
  username: string;
  password: string;
  serverUrl: string;
}

export interface IOperatorImportFile {
  importFile: File;
}

export interface IOperatorExportFile {
  exportFile: string;
}
