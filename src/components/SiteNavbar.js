import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function SiteNavbar(props) {
  return (
    <div className="d-flex flex-column vp-height">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>QEMU GUI</Navbar.Brand>
        <Nav>
          <Link href="/">
            <a className="nav-link" role="button">
              VMs
            </a>
          </Link>
          <Link href="/disks">
            <a className="nav-link" role="button">
              Disks
            </a>
          </Link>
          <Link href="/logs">
            <a className="nav-link" role="button">
              Logs
            </a>
          </Link>
        </Nav>
      </Navbar>
      <div className="flex-grow-1 p-3 overflow-auto">{props.children}</div>
    </div>
  );
}

export default SiteNavbar;
