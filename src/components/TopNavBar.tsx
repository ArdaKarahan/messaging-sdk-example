import React, { useState } from 'react';
import styles from './TopNavBar.module.css';

import messageIcon from '../assets/message-icon.png';
import satelliteIcon from '../assets/satellite-icon.jpeg';
import dishIcon from '../assets/dish-icon.jpeg';

type Section = 'Messaging' | 'Satellites' | 'Dishes';

interface TopNavBarProps {
  onSectionChange: (section: Section) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState<Section>('Messaging');

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    onSectionChange(section);
  };

  return (
    <nav className={styles.navBar}>
      <div
        className={`${styles.navSection} ${activeSection === 'Messaging' ? styles.active : ''}`}
        onClick={() => handleSectionClick('Messaging')}
      >
        <img src={messageIcon} alt="Messaging" className={styles.icon} />
        <span>Messaging</span>
      </div>
      <div
        className={`${styles.navSection} ${activeSection === 'Satellites' ? styles.active : ''}`}
        onClick={() => handleSectionClick('Satellites')}
      >
        <img src={satelliteIcon} alt="Satellites" className={styles.icon} />
        <span>Satellites</span>
      </div>
      <div
        className={`${styles.navSection} ${activeSection === 'Dishes' ? styles.active : ''}`}
        onClick={() => handleSectionClick('Dishes')}
      >
        <img src={dishIcon} alt="Dishes" className={styles.icon} />
        <span>Dishes</span>
      </div>
    </nav>
  );
};

export default TopNavBar;
