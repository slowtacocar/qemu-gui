import keys from "../../keys.json";

const vmFeatures = [
  {
    name: "hda",
    displayName: "Hard Drive",
    args: (query, fullQuery) => [
      "-drive",
      `file=disks/${query}` +
        ",format=raw" +
        ",media=disk" +
        (fullQuery.virtio && ",if=virtio"),
    ],
  },
  {
    name: "cdrom",
    displayName: "CD ROM 1",
    args: (query) => ["-drive", `file=disks/${query},format=raw,media=cdrom`],
  },
  {
    name: "cdrom2",
    displayName: "CD ROM 2",
    args: (query) => ["-drive", `file=disks/${query},format=raw,media=cdrom`],
  },
  { name: "memory", displayName: "Memory", args: (query) => ["-m", query] },
  { name: "port", displayName: "SPICE Port", args: () => [] },
  { name: "tlsport", displayName: "SPICE TLS Port", args: () => [] },
  { name: "wssport", displayName: "WebSockets SPICE Port", args: () => [] },
  {
    name: "password",
    displayName: "SPICE Password",
    args: (query, fullQuery) => [
      "-spice",
      `password=${query}` +
        (fullQuery.port && `,port=${fullQuery.port}`) +
        (fullQuery.tlsport &&
          `,tls-port=${fullQuery.tlsport},x509-cert-file=${keys.tls.cert},x509-key-file=${keys.tls.key},x509-cacert-file=${keys.tls.cacert}`),
    ],
  },
  {
    name: "cores",
    displayName: "Cores",
    args: (query) => ["-smp", `cores=${query}`],
  },
  {
    name: "vdagent",
    displayName: "Enable Vdagent (leave this empty to disable)",

    args: () => [
      "-device",
      "virtio-serial-pci,id=virtio-serial0,max_ports=16,bus=pci.0,addr=0x5",
      "-chardev",
      "spicevmc,name=vdagent,id=vdagent",
      "-device",
      "virtserialport,nr=1,bus=virtio-serial0.0,chardev=vdagent,name=com.redhat.spice.0",
    ],
  },
  {
    name: "virtio",
    displayName: "Enable Virtio (leave this empty to disable)",
    args: () => [],
  },
  {
    name: "enlightenments",
    displayName: "Enable Enlightenments (leave this empty to disable)",
    args: () => [],
  },
];

export default vmFeatures;
