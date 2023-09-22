============
Installation
============

.. code-block:: bash

    $ git clone <repository>
    $ cd open-zaaktypebeheer-ui
    $ npm install
    $ npm run dev / npm run start

Configuration
=============
Configure your ``.env`` to point to the API of the backend.

.. code-block:: bash

    $ cp .env.example .env

Change the ``VITE_BASE_API_URL`` to point to the backend API.

Build
=====
For the complete build guide: https://vitejs.dev/guide/build.html

Backend
=======
The backend is availible in the following repository: [open-zaaktypebeheer](https://github.com/maykinmedia/open-zaaktypebeheer)

.. Make sure to configure the backend to allow CORS requests from the frontend.