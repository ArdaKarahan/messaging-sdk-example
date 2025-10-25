import React, { useState, useEffect } from 'react';
import styles from './SatelliteSection.module.css';
import satelliteData from '../data/satellites.json';

interface Satellite {
  name: string;
  company: string;
  walletAddress: string;
  publicKey: string;
}

const SatelliteSection: React.FC = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSatellites(satelliteData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading satellites...</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {satellites.map((satellite) => (
        <div key={satellite.name} className={styles.card}>
          <h3>{satellite.name}</h3>
          <p><strong>Company:</strong> {satellite.company}</p>
          <p className={styles.truncate}><strong>Wallet:</strong> {satellite.walletAddress}</p>
          <p className={styles.truncate}><strong>Public Key:</strong> {satellite.publicKey}</p>
        </div>
      ))}
    </div>
  );
};

export default SatelliteSection;
