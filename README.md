# ws-chat-test
A simple app I built to test out nodejs websockets.

## Running the app
1. Run `npm install` in each directory
2. Run `npm run serve` in each directory

## Building the respective docker images
Each directory contains `docker_build.sh` and a Dockerfile.
You can simply build the Dockerfile configuration with the default settings by running `./docker_build.sh`.
  - This will firstly build the app and then create a dockerfile from the sources.

## Default port mapping
- 80 -> Frontend
- 8000 -> Backend


## Running the app
Before running, make sure that Ports 80 and 8000 are not used.

Either you can simply execute the `docker_run.sh` files in each directory.
