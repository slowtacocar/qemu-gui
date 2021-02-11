# qemu-gui

A web-based QEMU interface

This project is designed to be run on a local server and allows a client to connect and spin up KVM accelerated virtual machines. This program has only very basic support for some features of QEMU. A client can upload ISOs and create raw disk images on the server, and they can configure a virtual machine using these disks. The server also hosts a (very bad) SPICE over WebSockets client. A port can be set so a real SPICE client can be used.

![Screenshot](screenshot.png)

## Installation Instructions

Clone the repository (make sure to use `--recurse-submodules` to clone the SPICE client).

Run `npm run dev` to start a development server, or `npm start` for a production server. If you want a reverse proxy for HTTPS, run `node proxy.js` instead (this starts a production server on port 5000).

## Deployment Instructions

The whole program can be run under a docker container. So just install docker, clone the repo, and add TLS keys and passwords.

First, you'll need to copy your TLS keys to the server. If you're not using Let's Encrypt, you'll also need to edit the Docker Compose file to bind-mount a different path.

Next, create a file called `keys.json` in the root of the cloned repository that looks something like this:

    {
        "key": "Basic abcdefghijklmnop",
        "tls": {
            "key": "/etc/letsencrypt/live/example.com/privkey.pem",
            "fullchain": "/etc/letsencrypt/live/example.com/fullchain.pem",
            "cert": "/etc/letsencrypt/live/example.com/cert.pem",
            "cacert": "/etc/letsencrypt/live/example.com/chain.pem"
        }
    }

Replace `abcdefghijklmnop` with the Base64 encoding of `username:password` where `username` and `password` are the username and password you wish to use for HTTP authentication. Also, replace the values under `tls` with paths to the correct TLS keys. **You can remove the `tls` part to disable TLS.**

Finally, run `sudo docker-compose up` to start the server.
