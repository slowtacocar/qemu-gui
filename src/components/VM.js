import PropTypes from "prop-types";
import Table from "./Table";
import Form from "./Form";
import Button from "./Button";
import { useFetch } from "../hooks";

function VM(props) {
  const [vm, updateVM] = useFetch(`vms/${props.selected}`);
  return vm ? (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        await fetch(
          `vms/${props.selected}?${Object.keys(vm)
            .map((key) => `${key}=${event.target[key].value}`)
            .join("&")}`,
          { method: "PUT" }
        );
        updateVM();
      }}
    >
      <Table>
        <></>
        {Object.keys(vm).map((key) => (
          <tr key={key}>
            <th scope="row">{key}</th>
            <td>
              <input type="text" defaultValue={vm[key]} name={key} />
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
};

export default VM;
