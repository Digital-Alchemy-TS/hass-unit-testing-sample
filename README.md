## 🌐 Overview

Welcome to the Digital Alchemy example unit tests repo.
This code exists as a functional example of implementing unit tests within a nodejs application that works with Home Assistant.

You are able to able to run the tests standalone, without connecting to any instance of Home Assistant.
The configuration used to build the code is provided [here](./hass/), so you are able to build on the existing work to create your own mock environment.

- [Extended documentation](https://docs.digital-alchemy.app/hass/unit-testing)
- Ask questions on [Discord](https://discord.gg/JkZ35Gv97Y)

## 👢 Try it out

The following commands will install dependencies, configure type definitions for the project, and run the tests.

```bash
npm install
cp ./hass/types.d.ts ./node_modules/@digital-alchemy/hass/dist/dynamic.d.ts
npm run test
```

![passing tests](/assets/schedule-test.png)
