import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button(props) {
  const { palette, noMargin, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={noMargin ? styles.noMargin : styles.margin}
      style={{
        border: palette[2] ? `2px solid ${palette[2]}` : "none",
        background: palette[1],
        color: palette[0],
      }}
    />
  );
}

Button.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  noMargin: PropTypes.bool,
};

export default Button;
