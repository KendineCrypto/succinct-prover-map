import React from 'react';
import { Prover } from '../types';
import './ProverDetails.css';

interface ProverDetailsProps {
  prover: Prover | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ProverDetails: React.FC<ProverDetailsProps> = ({
  prover,
  isVisible,
  onClose
}) => {
  if (!isVisible || !prover) return null;

  return (
    <div className="prover-details-overlay" onClick={onClose}>
      <div className="prover-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="prover-header">
          <h2>{prover.name}</h2>
          <span className={`status ${prover.status}`}>
            {prover.status}
          </span>
        </div>
        
        <div className="prover-info">
          <div className="info-row" style={{ '--row-index': 0 } as React.CSSProperties}>
            <span className="label">Location:</span>
            <span className="value">{prover.city}, {prover.country}</span>
          </div>
          
          <div className="info-row" style={{ '--row-index': 1 } as React.CSSProperties}>
            <span className="label">Coordinates:</span>
            <span className="value">{prover.latitude.toFixed(4)}, {prover.longitude.toFixed(4)}</span>
          </div>
          
          <div className="info-row" style={{ '--row-index': 2 } as React.CSSProperties}>
            <span className="label">IP Address:</span>
            <span className="value">{prover.ip}</span>
          </div>
          
          <div className="info-row" style={{ '--row-index': 3 } as React.CSSProperties}>
            <span className="label">Uptime:</span>
            <span className="value">{prover.uptime}%</span>
          </div>
          
          <div className="info-row" style={{ '--row-index': 4 } as React.CSSProperties}>
            <span className="label">Start Date:</span>
            <span className="value">{new Date(prover.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 