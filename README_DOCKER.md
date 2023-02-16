### Setting up docker

```bash
apt-get install docker
nano /lib/systemd/system/docker.service
```

**Rename:**
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

**To:**
ExecStart=/usr/bin/dockerd -H fd:// -H 0.0.0.0:2375 --containerd=/run/containerd/containerd.sock

### Firewall

```bash
apt-get install ufw # firewall
ufw status
ufw default deny incoming
ufw allow 80 # http
ufw allow 443 # https
ufw allow 27017 # default mongo port
ufw allow 27018 # docker mongo port
ufw allow 8080 # siglar.com
ufw allow 8081 # api.vueux.com
ufw allow 8082 # api.jscomponent.com
ufw allow 8001 # demo.siglar.com
ufw allow 2375 # docker api (should not be exposed later)
ufw allow ssh
ufw status
# ufw delete allow 443
```

```bash
systemctl daemon-reload
service docker restart
```