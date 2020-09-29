import styles from "./Dialog.module.css";

function Dialog(props, ref) {
  return <dialog className={styles.dialog} {...props} ref={ref} />;
}

export default React.forwardRef(Dialog);
