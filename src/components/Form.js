import styles from "./Form.module.css";

function Form(props) {
  return <form className={styles.form} {...props} />;
}

export default Form;
