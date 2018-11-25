# ML Model Deployment Options

This repo demonstrates an end-to-end, architecturally correct solution for deploying a Tensorflow (Keras) model on a backend with a queue, and entirely on the frontend with TensorflowJS.

It accompanies my Medium article (find it [https://medium.com/@tomgrek](here).)

An example deployment can be found at [https://exploitip.com](exploitip).

The repo contains:

1. An example backend Python application for queuing machine learning jobs received from a web app, and also serving up their progress and results to said web app.

2. An example worker that also runs on the backend, in Python, that loads a RNN model exported from Tensorflow and processes jobs from the queue in order.

3. The model (stored as _model.json_ and _group1-shard1of1_), exported from Tensorflow, TensorflowJS compatible. It's a simple model based entirely on Google's Tensorflow RNN Nietzche text generation example. This model can be run at both the front and back end! (*Note* I barely trained the model - two or three epochs only, it is not the point of this repo. If you are looking for excellent Nietzche-like text generation, look away!)

4. A sample front end web application showing how to run the model at the front end, and how to interact with the back end.

5. A Jupyter notebook showing how the model and character mappings were created, trained, and exported.

## Requirements

### Backend

* A running Redis instance
* `pip install mlq` (MLQ is a queuing system for ML jobs)
* Python 3.6 +

### Frontend

* yarn
* `yarn install` from the root directory
* `yarn watch` lets you develop the frontend locally

### Then

* `./deploy.sh` will build and upload to a server such as an AWS t2.micro or a Linode.
* `python worker.py` to run a worker instance. Run as many of these as you have server resources/cores/processes/threads; they do all need to connect to a Redis instance.
* `FLASK_APP=app.py python -m flask run --host=127.0.0.1 --port=5001` to run the server.
* Configure nginx to serve up the static assets and proxy_pass `/api` to the `localhost:5001` (i.e., the server).

### Hopefully you know this but

If you're SSH'd into a server and setting all this up, and your SSH connection drops or you log out, the Python apps will stop running. Look into screen or tmux as simple ways to keep them running.

## Notes

This is a bare-bones, minimal example. See the README files in server/ and worker/ for further details. For a production-hardened deployment you would probably want extra resiliency, better logging, stronger security and so on.
