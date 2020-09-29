import PropTypes from "prop-types";
import styles from "./Table.module.css";

function Table(props) {
  return (
    <table className={styles.table}>
      <thead className={styles.head}>{props.children[0]}</thead>
      <tbody>{props.children[1]}</tbody>
    </table>
  );
}

Table.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};

export default Table;
