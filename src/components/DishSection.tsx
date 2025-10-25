import React, { useState, useEffect } from 'react';
import styles from './DishSection.module.css';
import dishData from '../data/dishes.json';
import dishIcon from '../assets/dish-icon.jpeg';

interface Dish {
  totalStaked: number;
  location: string;
  timeInSystem: string;
}

const DishSection: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDishes(dishData);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return <div>Loading dishes...</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {dishes.map((dish, index) => (
        <div key={index} className={styles.card}>
          <img src={dishIcon} alt="Dish Icon" className={styles.icon} />
          <p><strong>Staked:</strong> {formatCurrency(dish.totalStaked)}</p>
          <p className={styles.location}><strong>Location:</strong> {dish.location}</p>
          <p><strong>Time:</strong> {dish.timeInSystem}</p>
        </div>
      ))}
    </div>
  );
};

export default DishSection;
