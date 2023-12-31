# About the GPtrigger Connery Runner App

The GPtrigger Connery Runner App is a [Connery](https://github.com/connery-io/connery-platform) app used to manage and invoke Gptrigger actions.

## Servers

The GPtrigger Connery Runner App uses the following services:

- Sliplane (used to deploy the Connery docker container)
- Hetzner (used as the underlying cloud server provider)
- Cloudflare (used to manage DNS records)

## Configuration

- Store valid envs in ./env (do not commit)
- Connery plugins are configured in ./apps/runner/connerty-runner-config.ts

## Deploying

- The repo is set to auto deploy on push to origin/main on github
- Check the status of the deployment in the [Sliplane dashboard](https://sliplane.com/dashboard)
- Check the underlying cloud server in the [Hetzner dashboard](https://console.hetzner.cloud/projects/1042331/servers/1042331)

- You can run a server health check at GET <https://gptrigger-runner.sliplane.app/>
