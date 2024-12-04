'use client'
import React from 'react';

const Pattern: React.FC = () => {
  return (
    <div className="w-screen h-screen" style={{
      background: `
        conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0),
        conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) 60px 60px,
        conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) calc(2 * 60px) calc(2 * 60px),
        conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) calc(3 * 60px) calc(3 * 60px),
        repeating-linear-gradient(135deg, #adafff 0 12.5%, #474bff 0 25%)
      `,
      backgroundSize: 'calc(4 * 60px) calc(4 * 60px)',
    }}>
    </div>
  );
}

export default Pattern;
