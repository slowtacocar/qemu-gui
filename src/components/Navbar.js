import PropTypes from "prop-types";
import styles from "./Navbar.module.css";

function Navbar(props) {
  const [element, setElement] = React.useState(props.children[0].element);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <span className={styles.title}>QEMU GUI</span>
        <div className={styles.links}>
          {props.children.map((child) => (
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
      </nav>
      <main className={styles.main}>{element}</main>
    </div>
  );
}

Navbar.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      element: PropTypes.node.isRequired,
    }).isRequired
  ).isRequired,
};

export default Navbar;
