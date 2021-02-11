import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import vmFeatures from "../lib/features";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function VMs(props) {
  const [modalShown, setModalShown] = React.useState();

  return (
    <>
      <h1>VMs</h1>
      <Table responsive striped>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Running</th>
            <th scope="col">Start</th>
            <th scope="col">Kill</th>
            <th scope="col">Connect</th>
            <th scope="col">Delete</th>
            <th scope="col">Info</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props.vms).map(([vm, info]) => (
            <tr key={vm}>
              <th scope="row">{vm}</th>
              <td>{info.running ? "Running" : "Stopped"}</td>
              <td>
                <Form method="post" action={`/api/vms/${vm}/start`}>
                  <Button variant="success" type="submit">
                    Start
                  </Button>
                </Form>
              </td>
              <td>
                <Form method="post" action={`/api/vms/${vm}/kill`}>
                  <Button variant="warning" type="submit">
                    Kill
                  </Button>
                </Form>
              </td>
              <td>
                <Form
                  method="get"
                  action={`/api/vms/${vm}/connect`}
                  target="_blank"
                >
                  <Button type="submit">Connect</Button>
                </Form>
              </td>
              <td>
                <Form method="post" action={`/api/vms/${vm}/delete`}>
                  <Button variant="danger" type="submit">
                    Delete
                  </Button>
                </Form>
              </td>
              <td>
                <Link href={`/vms/${vm}`}>
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
          setModalShown(true);
        }}
      >
        New VM
      </Button>
      <Modal show={modalShown} onHide={() => setModalShown(false)}>
        <Form method="post" action="/api/vms/create">
          <Modal.Body>
            <Form.Group controlId="vmsName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" required />
            </Form.Group>
            {vmFeatures.map((feature) => (
              <Form.Group key={feature.name} controlId={`vms${feature.name}`}>
                <Form.Label>{feature.displayName}</Form.Label>
                <Form.Control name={feature.name} />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

VMs.propTypes = {
  vms: PropTypes.objectOf(
    PropTypes.shape({
      running: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
};

export default VMs;
