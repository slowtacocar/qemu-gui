import { useFetch } from "../hooks";
import Sidebar from "./Sidebar";

export default function Logs() {
  const [logs] = useFetch("logs");
  return (
    <Sidebar>
      <pre>{(logs && logs.qemu) || null}</pre>
      <pre>{(logs && logs.websockify) || null}</pre>
    </Sidebar>
  );
}
