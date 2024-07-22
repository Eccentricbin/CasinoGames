import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = () => {
  return (
    <Menu>
      <Link className="menu-item" to="/blackjack">Blackjack</Link>
      <Link className="menu-item" to="/baccarat">Baccarat</Link>
      <Link className="menu-item" to="/ThreeCardPoker">3-Card Poker</Link>
      <Link className="menu-item" to="/Login">Login</Link>
    </Menu>
  );
};

export default SideMenu;
