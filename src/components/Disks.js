import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Disks(props) {
  const [newModalShown, setNewModalShown] = React.useState();
  const [uploadModalShown, setUploadModalShown] = React.useState();

  return (
    <>
      <h1>Disks</h1>
      <Table responsive striped>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Delete</th>
            <th scope="col">Info</th>
          </tr>
        </thead>
        <tbody>
          {props.disks.map((disk) => (
            <tr key={disk}>
              <th scope="row">{disk}</th>
              <td>
                <Form method="post" action={`/api/disks/${disk}/delete`}>
                  <Button variant="danger" type="submit">
                    Delete
                  </Button>
                </Form>
              </td>
              <td>
                <Link href={`/disks/${disk}`}>
                  <Button variant="secondary">Info</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        block
        onClick={() => {
          setNewModalShown(true);
        }}
      >
        New Disk
      </Button>
      <Button
        block
        variant="secondary"
        onClick={() => {
          setUploadModalShown(true);
        }}
      >
        Upload Disk
      </Button>
      <Modal show={newModalShown} onHide={() => setNewModalShown(false)}>
        <Form method="post" action="/api/disks/create">
          <Modal.Body>
            <Form.Group controlId="disksName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group controlId="disksSize">
              <Form.Label>Size</Form.Label>
              <Form.Control name="size" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={uploadModalShown} onHide={() => setUploadModalShown(false)}>
        <Form
          action="/api/disks/upload"
          method="post"
          encType="multipart/form-data"
        >
          <Modal.Body>
            <Form.Group controlId="disksFile">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" name="file" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Upload</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

Disks.propTypes = {
  disks: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Disks;
