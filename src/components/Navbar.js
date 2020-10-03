import PropTypes from "prop-types";
import styles from "./Navbar.module.css";

function Navbar(props) {
  const [element, setElement] = React.useState(props.children[0][0].element);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <span className={styles.title}>{props.title}</span>
        <div className={styles.links}>
          {props.children[0].map((child) => (
            <a
              key={child.name}
              className={styles.link}
              onClick={() => {
                setElement(child.element);
              }}
            >
              {child.name}
            </a>
          ))}
        </div>
        <div className={styles.dropdownContainer}>
          <button className={styles.dropdownButton}>▽</button>
          <nav className={styles.dropdown}>
            {props.children[1].map((child) => (
              <a
                key={child.name}
                className={styles.link}
                onClick={() => {
                  setElement(child.element);
                }}
              >
                {child.name}
              </a>
            ))}
          </nav>
        </div>
      </nav>
      <main className={styles.main}>{element}</main>
    </div>
  );
}

Navbar.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        element: PropTypes.node.isRequired,
      }).isRequired
    ).isRequired
  ).isRequired,
  title: PropTypes.string,
};

export default Navbar;
