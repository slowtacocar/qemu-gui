import { promises as fs } from "fs";
import path from "path";
import VMs from "../components/VMs";
import processes from "../lib/processes";
import auth from "../lib/auth";
import SiteNavbar from "../components/SiteNavbar";

export async function getServerSideProps(context) {
  await auth(context.req, context.res);
  const vms = await fs.readdir(path.join(process.cwd(), "vms"));

  return {
    props: {
      vms: Object.fromEntries(
        vms.map((vm) => [vm, { running: processes.running(vm) }])
      ),
    },
  };
}

export default function Home(props) {
  return (
    <SiteNavbar>
      <VMs vms={props.vms} />
    </SiteNavbar>
  );
}
