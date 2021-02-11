import { qemuLogs, websockifyLogs } from "../lib/logs";
import auth from "../lib/auth";
import SiteNavbar from "../components/SiteNavbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export async function getServerSideProps(context) {
  await auth(context.req, context.res);
  return {
    props: {
      qemuLogs,
      websockifyLogs,
    },
  };
}

export default function Logs(props) {
  return (
    <SiteNavbar>
      <Row>
        <Col xs={6}>
          <pre>{props.qemuLogs.logs}</pre>
        </Col>
        <Col xs={6}>
          <pre>{props.websockifyLogs.logs}</pre>
        </Col>
      </Row>
    </SiteNavbar>
  );
}
