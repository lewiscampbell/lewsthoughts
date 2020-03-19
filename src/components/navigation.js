import React from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'

export default () => (
  <header>
    <h1 class="title">lewsthoughts</h1>
    <nav role="navigation">
      <ul className={styles.navigation}>
        <li className={styles.navigationItem}>
          <Link to="/">Home</Link>
        </li>
        <li className={styles.navigationItem}>
          <Link to="/blog/">Blog</Link>
        </li>
      </ul>
    </nav>
  </header>
)
