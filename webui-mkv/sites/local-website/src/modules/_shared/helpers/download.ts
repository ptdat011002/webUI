import { StorageDirectory } from '../utils';

export const handleCreateAndDownloadFileTxt = async (
  data: object,
  fileName: string,
) => {
  const canSave = await StorageDirectory.canSaveFile();
  if (!canSave) {
    const aTag = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    aTag.href = URL.createObjectURL(file);
    aTag.download = `${fileName}.txt`;
    aTag.click();
    return;
  }

  const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });

  return StorageDirectory.saveFile(file, `${fileName}.txt`);
};
