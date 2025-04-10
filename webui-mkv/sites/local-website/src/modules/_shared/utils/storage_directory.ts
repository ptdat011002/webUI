import { openDB } from 'idb';

const FILE_SYSTEM_NAME = 'file-system';
const STORAGE_DIRECTORY_STORE = 'storage-directory';
const DIRECTORY_HANDLE_KEY = 'directory';

const openDatabase = async () =>
  openDB(FILE_SYSTEM_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORAGE_DIRECTORY_STORE)) {
        db.createObjectStore(STORAGE_DIRECTORY_STORE);
      }
    },
  });

export class StorageDirectory {
  static saveDirectoryHandle = async (
    directoryHandle: FileSystemDirectoryHandle,
  ) => {
    const db = await openDatabase();

    const transaction = db.transaction(STORAGE_DIRECTORY_STORE, 'readwrite');
    const store = transaction.objectStore(STORAGE_DIRECTORY_STORE);

    await store.put(directoryHandle, DIRECTORY_HANDLE_KEY);

    await transaction.done;
  };

  static getSavedDirectoryHandle = async (): Promise<
    FileSystemDirectoryHandle | undefined
  > => {
    const db = await openDatabase();

    const transaction = db.transaction(STORAGE_DIRECTORY_STORE, 'readonly');
    const store = transaction.objectStore(STORAGE_DIRECTORY_STORE);

    const directoryHandle: FileSystemDirectoryHandle = await store.get(
      DIRECTORY_HANDLE_KEY,
    );

    await transaction.done;

    return directoryHandle;
  };

  static canSaveFile = async () => {
    try {
      const directoryHandle = await StorageDirectory.getSavedDirectoryHandle();
      return !!directoryHandle;
    } catch (error) {
      return false;
    }
  };

  static saveFile = async (blob: Blob | null, fileName: string) => {
    try {
      if (!blob) return;

      const directoryHandle = await StorageDirectory.getSavedDirectoryHandle();

      if (!directoryHandle) {
        return;
      }

      const permission = await directoryHandle.queryPermission();
      if (permission !== 'granted') {
        const newPermission = await directoryHandle.requestPermission();
        if (newPermission !== 'granted') {
          return;
        }
      }

      const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true,
      });

      const writable = await fileHandle.createWritable();

      await writable.write(blob);

      await writable.close();
    } catch (error) {
      throw new Error('Failed to save file.');
    }
  };
}
