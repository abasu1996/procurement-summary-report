# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Approval mail integration (BPA)

Each saved report receives a display reference such as `PSR-000001` (sequential, zero-padded to 6 digits); the underlying `ID` remains a UUID for OData navigation.

In the BPA approval e-mail, make **Click here** point to the deployed UI route below, replacing `<request-id>` with the report's technical `ID`:

```
https://<your-app-host>/index.html#/main/<request-id>
```

The link opens the report read-only. Only the next selected approver sees the Approve and Reject buttons; the backend enforces this too, so the decision cannot be forged by calling the service directly.

Configure `BPA_SUBMISSION_WEBHOOK_URL` on the CAP service with the BPA endpoint that starts the approval-mail automation. On submission, CAP sends the report reference, requester e-mail, and selected approver list. BPA can use the first approver's e-mail and the link above to send its first mail.

To let BPA send the requester-decision e-mail, configure its endpoint as `BPA_DECISION_WEBHOOK_URL`. When the final approver decides, CAP POSTs this JSON payload to that endpoint:

```json
{
  "event": "PSR_APPROVAL_DECIDED",
  "requestID": "<uuid>",
  "requestNumber": "PSR-000001",
  "procurementName": "...",
  "decision": "APPROVED or REJECTED",
  "requesterEmail": "...",
  "decidedBy": "...",
  "decidedAt": "<ISO timestamp>"
}
```

Use `requesterEmail`, `decision`, and `requestNumber` in the BPA mail to the requester. No BPA URL or credentials are stored in source control.

## Learn More

Learn more at <https://cap.cloud.sap>.

## SAP BTP deployment

Use Node.js 22.13 or newer in the Node.js 22 release line.

```sh
npm ci
npm run build:mta
npm run deploy
```

The MTA creates a dedicated `psr-db` HANA HDI container and deploys
`psr-srv`, `psr-db-deployer`, and `psr-approuter`. It binds the existing
`flowmate-common-auth` XSUAA instance, with user tokens forwarded to the
Flowmate common master-data service. Users need its `MasterDataRead` role
(or a role granting equivalent read access) for master-data dropdowns.

The deployment target is the currently selected Cloud Foundry org/space.
The default common-service URL targets AP11 space `org-b/test`; override
the MTA `common-service-url` parameter when deploying to another target.
Local development retains SQLite and the existing mock users.

Application URL in `org-b/test`:
https://psr-org-b-test.cfapps.ap11.hana.ondemand.com

BPA e-mail automation still requires the optional
`BPA_SUBMISSION_WEBHOOK_URL` and `BPA_DECISION_WEBHOOK_URL` environment
variables documented above.
