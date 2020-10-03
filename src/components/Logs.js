import { useFetch } from "../hooks";

export default function Logs() {
  const [logs] = useFetch("logs");
  return (
    <>
      <pre>{(logs && logs.qemu) || null}</pre>
      <pre>{(logs && logs.websockify) || null}</pre>
    </>
  );
}
