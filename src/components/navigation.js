import React from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'





export default () => (
  <header>
    <h1 class="title">Lew's Thoughts</h1>

    <nav role="navigation">
      <ul className={styles.navigation}>
        <li className={styles.navigationItem}>
          <Link to="/" className={styles.link}>Home</Link>
        </li>
        <li className={styles.navigationItem}>
          <Link to="/blog/" className={styles.link}>Blog</Link>
        </li>
        <li className={styles.navigationItem}>
          <Link to="/lews_talks/" className={styles.link}>Lew's Talks</Link>
        </li>
      </ul>
    </nav>

  </header>
)
