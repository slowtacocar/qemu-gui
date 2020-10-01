import PropTypes from "prop-types";
import Table from "./Table";
import Form from "./Form";
import Button from "./Button";
import { useFetch } from "../hooks";

function VM(props) {
  const [vm, updateVM] = useFetch(`vms/${props.selected}`);
  const [values, updateValues] = React.useState({});
  React.useEffect(() => {
    updateValues(vm || {});
  }, [vm]);
  return vm ? (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        await fetch(
          `vms/${props.selected}?${props.vmFeatures
            .map((feature) => `${feature.name}=${values[feature.name]}`)
            .join("&")}`,
          { method: "PUT" }
        );
        updateVM();
      }}
    >
      <Table>
        <></>
        {props.vmFeatures.map((feature) => (
          <tr key={feature.name}>
            <th scope="row">{feature.displayName}</th>
            <td>
              <input
                type="text"
                value={values[feature.name] || ""}
                name={feature.name}
                onChange={(event) => {
                  updateValues({
                    ...values,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
            </td>
          </tr>
        ))}
      </Table>
      <p>
        <Button noMargin palette={["rgb(255, 255, 255)", "rgb(51, 136, 221)"]}>
          Update
        </Button>
      </p>
    </Form>
  ) : (
    "Loading..."
  );
}

VM.propTypes = {
  selected: PropTypes.string,
  vmFeatures: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default VM;
