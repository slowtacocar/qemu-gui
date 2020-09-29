import Navbar from "../components/Navbar";
import VMs from "../components/VMs";
import Disks from "../components/Disks";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0px;
        }
      `}</style>
      <Navbar>
        {{ element: <VMs />, name: "VMs" }}
        {{ element: <Disks />, name: "Disks" }}
      </Navbar>
    </>
  );
}
