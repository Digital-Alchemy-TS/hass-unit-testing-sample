## 🌐 Description

This folder contains a reference configuration for Home Assistant, which was used to generate the types and fixtures used within this repository.

## 📖 Synapse Application

You can find the application code for the typescript side of the install [here](../src/mocks/generator.ts)

## 🏗️ Setup

Run commands from repository root

```bash
# extract container configuration
tar -xzvf ./hass/reference.tar.gz -C ./hass
# start container (uses port: 9123)
docker-compose -f ./hass/docker-compose.yaml up -d
# start synapse app to power mock entities
npx tsx src/mocks/main.ts
```

## 🧨 Tear Down

`ctrl-c` will kill the synapse app, to kill the container

```bash
docker-compose -f ./hass/docker-compose.yaml down
```
