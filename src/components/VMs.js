import Sidebar from "./Sidebar";
import VM from "./VM";
import Table from "./Table";
import Button from "./Button";
import Dialog from "./Dialog";
import Form from "./Form";
import { useFetch, useFetchAll } from "../hooks";

function VMs() {
  const [vms, updateVMs] = useFetch("vms");
  const [processes] = useFetchAll("vms", vms, "process");
  const [selected, setSelected] = React.useState();
  const dialog = React.useRef();

  return (
    <Sidebar>
      {vms ? (
        <>
          <h1>VMs</h1>
          <Table>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Running</th>
              <th scope="col">Start</th>
              <th scope="col">Kill</th>
              <th scope="col">Connect</th>
              <th scope="col">Delete</th>
              <th scope="col">Info</th>
            </tr>
            <>
              {vms.map((vm, index) => (
                <tr key={vm}>
                  <th scope="row">{vm}</th>
                  <td>{processes[index] ? "Running" : "Stopped"}</td>
                  <td>
                    <Button
                      palette={["rgb(255, 255, 255)", "rgb(51, 170, 51)"]}
                      onClick={async () => {
                        await fetch(`vms/${vm}/process`, { method: "PUT" });
                        updateVMs();
                      }}
                    >
                      Start
                    </Button>
                  </td>
                  <td>
                    <Button
                      palette={["rgb(255, 255, 255)", "rgb(238, 153, 51)"]}
                      onClick={async () => {
                        await fetch(`vms/${vm}/process`, { method: "DELETE" });
                        updateVMs();
                      }}
                    >
                      Kill
                    </Button>
                  </td>
                  <td>
                    <Button
                      palette={["rgb(255, 255, 255)", "rgb(51, 136, 221)"]}
                      onClick={async () => {
                        const response = await fetch(`vms/${vm}`, {
                          method: "GET",
                        });
                        const json = await response.json();
                        open(
                          `spice-html5/spice_auto.html?port=${
                            parseInt(json.port, 10) - 100
                          }`,
                          "_blank"
                        );
                      }}
                    >
                      Connect
                    </Button>
                  </td>
                  <td>
                    <Button
                      palette={["rgb(255, 255, 255)", "rgb(238, 68, 68)"]}
                      onClick={async () => {
                        await fetch(`vms/${vm}`, { method: "DELETE" });
                        updateVMs();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button
                      palette={["rgb(0, 0, 0)", "rgb(238, 238, 238)"]}
                      onClick={() => {
                        setSelected(vm);
                      }}
                    >
                      Info
                    </Button>
                  </td>
                </tr>
              ))}
            </>
          </Table>
          <p>
            <Button
              noMargin
              palette={["rgb(255, 255, 255)", "rgb(51, 136, 221"]}
              onClick={() => {
                dialog.current.showModal();
              }}
            >
              New VM
            </Button>
          </p>
          <Dialog ref={dialog}>
            <Form
              method="dialog"
              onSubmit={async (event) => {
                await fetch(
                  `vms/${event.target.name.value}?hda=${event.target.hda.value}&cdrom=${event.target.cdrom.value}&memory=${event.target.memory.value}&port=${event.target.port.value}&password=${event.target.password.value}&cores=${event.target.cores.value}&vdagent=${event.target.vdagent.value}`,
                  { method: "PUT" }
                );
                updateVMs();
              }}
            >
              <p>
                <label>
                  Name:
                  <input type="text" name="name" />
                </label>
              </p>
              <p>
                <label>
                  Hard Drive:
                  <input type="text" name="hda" />
                </label>
              </p>
              <p>
                <label>
                  CD ROM:
                  <input type="text" name="cdrom" />
                </label>
              </p>
              <p>
                <label>
                  Memory:
                  <input type="text" name="memory" />
                </label>
              </p>
              <p>
                <label>
                  SPICE Port:
                  <input type="text" name="port" />
                </label>
              </p>
              <p>
                <label>
                  SPICE Password:
                  <input type="text" name="password" />
                </label>
              </p>
              <p>
                <label>
                  Cores:
                  <input type="text" name="cores" />
                </label>
              </p>
              <p>
                <label>
                  Enable vdagent:
                  <select name="vdagent">
                    <option value="">No</option>
                    <option value="true">Yes</option>
                  </select>
                </label>
              </p>
              <p>
                {" "}
                <Button
                  noMargin
                  palette={["rgb(255, 255, 255)", "rgb(51, 136, 221"]}
                >
                  Create
                </Button>
              </p>
            </Form>
          </Dialog>
        </>
      ) : (
        "Loading..."
      )}
      {selected && <VM selected={selected} />}
    </Sidebar>
  );
}

export default VMs;
