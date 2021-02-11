import { promises as fs } from "fs";
import path from "path";
import Disks from "../../components/Disks";
import auth from "../../lib/auth";
import SiteNavbar from "../../components/SiteNavbar";

export async function getServerSideProps(context) {
  await auth(context.req, context.res);
  const disks = await fs.readdir(path.join(process.cwd(), "disks"));

  return {
    props: {
      disks,
    },
  };
}

export default function Home(props) {
  return (
    <SiteNavbar>
      <Disks disks={props.disks} />
    </SiteNavbar>
  );
}
