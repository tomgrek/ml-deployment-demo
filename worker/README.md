# A worker that runs some ML operation

Run as many of these as you want; they will pick things out of a queue, run a Tensorflow model on them, and store the results.

With python>=3.6: `python worker.py`

## Requirements

* Redis (the code assumes localhost:6379)
* Tensorflow, TensorflowJS, and MLQ Python packages installed.
