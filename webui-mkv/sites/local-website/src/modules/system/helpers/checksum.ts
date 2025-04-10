import crypto from 'crypto';

// return md5 hash checksum of file from File object
export const getMD5Checksum = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hash = crypto.createHash('md5');
  hash.update(Buffer.from(buffer));
  return hash.digest('hex');
};
