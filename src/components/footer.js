import React from 'react'
import { Link } from 'gatsby'
import styles from './footer.module.css'
import instagram from '../../static/instagram.png'
import twitter from '../../static/twitter.png'

export default () => (
  <footer>
    <div className={styles.smLinks}>
      <div className={styles.smItem}>
        <a href="https://www.instagram.com/lews_thoughts/" target="_blank"> <img src={instagram} alt=""/> </a>
      </div>
      <div className={styles.smItem}>
        <a href="https://twitter.com/lewiscampbellx" target="_blank"> <img src={twitter} alt=""/> </a>
      </div>
    </div>
  </footer>
)
