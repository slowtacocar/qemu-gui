import Sidebar from "./Sidebar";
import Disk from "./Disk";
import Table from "./Table";
import Button from "./Button";
import Dialog from "./Dialog";
import Form from "./Form";
import { useFetch } from "../hooks";

function Disks() {
  const [disks, updateDisks] = useFetch("disks");
  const [selected, setSelected] = React.useState();
  const newDialog = React.useRef();
  const uploadDialog = React.useRef();

  return (
    <Sidebar>
      {disks ? (
        <>
          <h1>Disks</h1>
          <Table>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Delete</th>
              <th scope="col">Info</th>
            </tr>
            <>
              {disks.map((disk) => (
                <tr key={disk}>
                  <th scope="row">{disk}</th>
                  <td>
                    <Button
                      palette={["rgb(255, 255, 255)", "rgb(238, 68, 68)"]}
                      onClick={async () => {
                        await fetch(`disks/${disk}`, { method: "DELETE" });
                        updateDisks();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button
                      palette={["rgb(0, 0, 0)", "rgb(238, 238, 238)"]}
                      onClick={() => {
                        setSelected(disk);
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
                newDialog.current.showModal();
              }}
            >
              New Disk
            </Button>
          </p>
          <p>
            <Button
              noMargin
              palette={["rgb(0, 0, 0)", "rgb(238, 238, 238"]}
              onClick={() => {
                uploadDialog.current.showModal();
              }}
            >
              Upload Disk
            </Button>
          </p>
          <Dialog ref={newDialog}>
            <Form
              method="dialog"
              onSubmit={async (event) => {
                await fetch(
                  `disks/${event.target.name.value}?size=${event.target.size.value}`,
                  { method: "PUT" }
                );
                updateDisks();
              }}
            >
              <p>
                <label>
                  Name:
                  <input type="text" name="name" />
                </label>
              </p>
              <p>
                {" "}
                <label>
                  Size:
                  <input type="text" name="size" />
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
          <Dialog ref={uploadDialog}>
            <Form
              action="/disks"
              method="post"
              encType="multipart/form-data"
              target="_blank"
              onSubmit={() => {
                uploadDialog.current.close();
                updateDisks();
              }}
            >
              <p>
                <label>
                  File:
                  <input type="file" name="file" />
                </label>
              </p>
              <p>
                <Button
                  noMargin
                  palette={["rgb(255, 255, 255)", "rgb(51, 136, 221"]}
                >
                  Upload
                </Button>
              </p>
            </Form>
          </Dialog>
        </>
      ) : (
        "Loading..."
      )}
      {selected && <Disk selected={selected} />}
    </Sidebar>
  );
}

export default Disks;
