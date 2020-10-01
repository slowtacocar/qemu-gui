import PropTypes from "prop-types";
import Table from "./Table";
import Form from "./Form";
import Button from "./Button";
import { useFetch } from "../hooks";

const vmFeatures = [
  { name: "hda", displayName: "Hard Drive" },
  { name: "cdrom", displayName: "CD ROM 1" },
  { name: "cdrom2", displayName: "CD ROM 2" },
  { name: "memory", displayName: "Memory" },
  { name: "port", displayName: "SPICE Port" },
  { name: "password", displayName: "SPICE Password" },
  { name: "cores", displayName: "Cores" },
  { name: "vdagent", displayName: "Enable Vdagent" },
  { name: "virtio", displayName: "Enable Virtio" },
];

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
          `vms/${props.selected}?${vmFeatures
            .map((feature) => `${feature.name}=${values[feature.name]}`)
            .join("&")}`,
          { method: "PUT" }
        );
        updateVM();
      }}
    >
      <Table>
        <></>
        {vmFeatures.map((feature) => (
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
};

export default VM;
