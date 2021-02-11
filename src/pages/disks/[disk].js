import { promises as fs } from "fs";
import { execSync } from "child_process";
import path from "path";
import Disks from "../../components/Disks";
import { useRouter } from "next/router";
import auth from "../../lib/auth";
import SiteNavbar from "../../components/SiteNavbar";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export async function getServerSideProps(context) {
  await auth(context.req, context.res);
  const disks = await fs.readdir(path.join(process.cwd(), "disks"));
  const stdout = execSync(
    `qemu-img info --output=json "disks/${context.params.disk}"`
  );

  return {
    props: {
      disks,
      disk: JSON.parse(stdout),
    },
  };
}

export default function Disk(props) {
  const router = useRouter();

  return (
    <SiteNavbar>
      <Row>
        <Col>
          <Disks disks={props.disks} />
        </Col>
        <Col>
          <Table responsive striped>
            <tbody>
              {Object.keys(props.disk).map((key) => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{props.disk[key]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </SiteNavbar>
  );
}
