.. _manual_config:

=============
Configuration
=============

.. _`configure_oidc`:

OIDC
====

If OpenID Connect (OIDC) is enabled, users can log in with Open ID Connect.

To enable OIDC go to the admin and navigate to **Configuration** > **OpenID Connect configuration** and then:

* Check the **Enable** checkbox.
* Fill in the **OpenID Connect client ID** and **OpenID Connect secret**.
* Fill in the **Discovery endpoint**.

.. _`configure_oz`:

Talking to Open Zaak
====================

In order to be able to make requests to Open Zaak, both the backend for the front end and Open Zaak need to be
configured.

**Open Zaak**

#. In the Open Zaak admin, go to **API Authorisations** > **Applications**.
#. Click on **Add application**
#. Fill in the following fields:

   - **Label**: ``Open Zaaktypebeheer``
   - **Client ID**: ``open-zaaktypebeheer``
   - **Secret key**: ``some-secret-value``

#. Click on **Save and continue editing**. Now, below the save buttons appears a button "Manage authorisations".
#. Click on **Manage authorisations** and check the ``Catalogi API`` component. Then check all the checkboxes starting with ``catalogi.``.
#. Click on **Save**.

**Backend for frontend**

#. In the Open Zaaktypebeheer admin, go to **Configuration** > **Services**.
#. Click on **Add service**.
#. Then, fill in the following fields:

   - **Label**: ``Catalogi API``
   - **OAS url**: The URL of the Catalogi API OAS. Generally, if Open Zaak is hosted at ``https://openzaak.nl``, then it should be at ``https://test.openzaak.nl/catalogi/api/v1/schema/openapi.json``.
   - **Type**: ``ZTC``
   - **API root URL**: It should be something like ``https://openzaak.nl/catalogi/api/v1/``.
   - **Client ID**: The ID configured in Open Zaak earlier (in the example above we used ``open-zaaktypebeheer``).
   - **Secret**: The secret key configured in Open Zaak earlier (in the example above we used ``some-secret-value``).

#. Click on **Save**.
