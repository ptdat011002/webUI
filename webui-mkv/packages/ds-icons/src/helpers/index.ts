export * from './IconBase';
export * from './IconContext';

export const hasColoredIcon = (ele: React.ReactElement | null): boolean => {
  if (!ele) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ele?.type as any)?.name?.endsWith('Colored');
};
