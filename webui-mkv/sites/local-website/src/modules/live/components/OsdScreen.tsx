import { styled } from '@packages/ds-core';
import React, { useEffect, useRef, useState } from 'react';
import { IOSDPosition } from '../types';
import { t } from 'configs/i18next';

export interface OsdScreenProps {
  className?: string;
  name: {
    show?: boolean;
    display_name?: string;
    position?: IOSDPosition;
  };
  datetime: {
    show?: boolean;
    position?: IOSDPosition;
  };
  people_count?: string;
}

const getTime = () => new Date().toLocaleString();

const defaultMedia = {
  width: 1280,
  height: 720,
};

export const OsdScreen: React.FC<OsdScreenProps> = ({
  className,
  name,
  datetime,
  people_count
}) => {
  const [time, setTime] = useState(getTime());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && people_count) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '0.75rem Arial';
        ctx.fillStyle = '#f1e8e8';
        ctx.fillText(t('ppcount').concat(people_count ?? ''), 10, 20);
      }
    }
  }, [people_count]);

  return (
    <OsdScreenWrapper className={className}>
      <canvas ref={canvasRef} width={200} height={30} style={{ position: 'absolute', top: '5%' }} />
      <div
        style={{
          display: name?.show ? 'block' : 'none',
          position: 'absolute',
          fontSize: '0.75rem',
          top: ((name?.position?.x ? name.position.x : 0) / defaultMedia.width) * 100 + '%',
          left: ((name?.position?.y ? name.position.y : 0) / defaultMedia.height) * 100 + '%',
        }}
      >
        {name.display_name}
      </div>
      <div
        style={{
          display: datetime?.show ? 'block' : 'none',
          position: 'absolute',
          top: ((datetime?.position?.x? datetime.position.x : 0) / defaultMedia.width) * 100 + '%',
          left: ((datetime?.position?.y? datetime.position.y : 0) / defaultMedia.height) * 100 + '%',
          fontSize: '0.75rem',
        }}
      >
        {time}
      </div>
    </OsdScreenWrapper>
  );
};

const OsdScreenWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
