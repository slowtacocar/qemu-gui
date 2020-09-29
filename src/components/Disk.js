import PropTypes from "prop-types";
import Table from "./Table";
import { useFetch } from "../hooks";

function Disk(props) {
  const [disk] = useFetch(`disks/${props.selected}`);
  return disk ? (
    <Table>
      <></>
      {Object.keys(disk).map((key) => (
        <tr key={key}>
          <th scope="row">{key}</th>
          <td>{disk[key]}</td>
        </tr>
      ))}
    </Table>
  ) : (
    "Loading..."
  );
}

Disk.propTypes = {
  selected: PropTypes.string,
};

export default Disk;
