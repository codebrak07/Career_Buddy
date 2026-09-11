import React from 'react';

interface SectionIndexProps {
  index: string; // "01", "02", etc.
  label: string;
  sublabel?: string;
  accentColor?: string;
  className?: string;
}

/**
 * Editorial section index — spacious, calm, legible header.
 * Provides clear typography hierarchy and removes visual noise.
 */
export const SectionIndex: React.FC<SectionIndexProps> = ({
  index,
  label,
  sublabel,
  accentColor = '#FF5A1F',
  className = '',
}) => {
  return (
    <div className={`section-header-block ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-[11px] font-bold tracking-wider"
          style={{
            backgroundColor: `${accentColor}12`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {index}
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-[#6E7A8A]">
          SECTION
        </span>
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14171A]"
        style={{
          fontFamily: 'var(--font-editorial, inherit)',
          letterSpacing: '-0.025em',
        }}
      >
        {label}
      </h2>
      {sublabel && (
        <p className="mt-2 text-sm text-[#525B67] max-w-3xl leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
};
