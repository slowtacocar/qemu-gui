import Navbar from "../components/Navbar";
import VMs from "../components/VMs";
import Disks from "../components/Disks";
import Logs from "../components/Logs";
import Restart from "../components/Restart";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0px;
        }
      `}</style>
      <Navbar title="QEMU GUI">
        {[
          { element: <VMs />, name: "VMs" },
          { element: <Disks />, name: "Disks" },
        ]}
        {[
          { element: <Logs />, name: "Logs" },
          { element: <Restart />, name: "Restart Server" },
        ]}
      </Navbar>
    </>
  );
}
