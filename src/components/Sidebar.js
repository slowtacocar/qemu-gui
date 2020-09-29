import PropTypes from "prop-types";
import styles from "./Sidebar.module.css";

function Sidebar(props) {
  return (
    <div
      className={props.children[1] ? styles.paneContainer : styles.container}
    >
      <div className={styles.pane}>
        <div className={styles.scroll}>{props.children[0]}</div>
      </div>
      {props.children[1] && (
        <aside className={styles.sidebar}>
          <div className={styles.scroll}>{props.children[1]}</div>
        </aside>
      )}
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Sidebar;
