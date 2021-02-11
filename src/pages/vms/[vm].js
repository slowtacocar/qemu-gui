import { promises as fs } from "fs";
import path from "path";
import VMs from "../../components/VMs";
import processes from "../../lib/processes";
import { useRouter } from "next/router";
import vmFeatures from "../../lib/features";
import auth from "../../lib/auth";
import SiteNavbar from "../../components/SiteNavbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export async function getServerSideProps(context) {
  await auth(context.req, context.res);
  const vms = await fs.readdir(path.join(process.cwd(), "vms"));
  const vm = await fs.readFile(
    path.join(process.cwd(), "vms", context.params.vm)
  );

  return {
    props: {
      vms: Object.fromEntries(
        vms.map((vm) => [vm, { running: processes.running(vm) }])
      ),
      vm: JSON.parse(vm),
    },
  };
}

export default function VM(props) {
  const router = useRouter();

  return (
    <SiteNavbar>
      <Row>
        <Col>
          <VMs vms={props.vms} />
        </Col>
        <Col>
          <Form method="POST" action={`/api/vms/${router.query.vm}`}>
            <Table responsive striped>
              <tbody>
                {vmFeatures.map((feature) => (
                  <tr key={feature.name}>
                    <th scope="row">{feature.displayName}</th>
                    <td>
                      <Form.Control
                        defaultValue={props.vm[feature.name]}
                        name={feature.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button block type="submit">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </SiteNavbar>
  );
}
