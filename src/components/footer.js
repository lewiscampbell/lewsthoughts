import React from 'react'
import { Link } from 'gatsby'
import styles from './footer.module.css'

export default () => (
  <footer>
    <div role="smLinks">
      <ul className={styles.navigation}>
        <li className={styles.smItem}>
          <a href="https://www.instagram.com/lewiscampbellx/"> <img src="instagram.png" alt="instagram"/> </a>
        </li>
        <li className={styles.smItem}>
          <a href="https://twitter.com/lewiscampbellx"> <img src="twitter.png" alt="twitter"/> </a>
        </li>
      </ul>
    </div>
  </footer>
)
