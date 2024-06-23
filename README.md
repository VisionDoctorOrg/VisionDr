## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

# Prerequisites

- Nestjs
- Nodejs
- TypeScript
- Prisma
- PostgreSQL database

# Usage

## Starting the Server

To start the API server, run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be accessible at  [API](https://test-ktsa.onrender.com/api/v1) 


Feel free to explore the API and refer to the [API Documentation](https://documenter.getpostman.com/view/19595090/2sA3XTefWd) for detailed information on each endpoint and their functionalities.




<!-- SELECT * FROM "User" where id = 4;
SELECT * FROM "AdjustInventory" where "companyId" = 4;
SELECT * FROM "AdminCompany" where "adminID" = 4;
SELECT * FROM "ApprovalNotifications" where "companyId" = 4;
SELECT * FROM "Category" where "companyId" = 4;
SELECT * FROM "Contacts" where "companyId" = 4;
SELECT * FROM "CustomRole" where "companyId" = 4;
SELECT * FROM "Customer" where "companyId" = 4;
SELECT * FROM "Department" where "companyId" = 4;
SELECT * FROM "DepartmentRole" where "companyId" = 4;
SELECT * FROM "EbayCredential" where "companyId" = 4;
SELECT * FROM "Employee" where "companyId" = 4;
SELECT * FROM "Image" where "companyId" = 4;
SELECT * FROM "InAppNotifications" where "companyId" = 4;
SELECT * FROM "Invoice" where "companyId" = 4;
SELECT * FROM "Item" where "companyId" = 4;
SELECT * FROM "ItemGroup" where "companyId" = 4;
SELECT * FROM "PackagingMetric" where "companyId" = 4;
SELECT * FROM "Payment" where "companyId" = 4;
SELECT * FROM "PriceList" where "companyId" = 4;
SELECT * FROM "Product" where "companyId" = 4;
SELECT * FROM "ProductHistory" where "companyId" = 4;
SELECT * FROM "PurchaseOrder" where "companyId" = 4;
SELECT * FROM "PurchaseOrderConfirmation" where "companyId" = 4;
SELECT * FROM "PurchasesTransaction" where "companyId" = 4;
SELECT * FROM "Request" where "companyId" = 4;
SELECT * FROM "SalesOrder" where "companyId" = 4;
SELECT * FROM "SalesTransaction" where "companyId" = 4;
SELECT * FROM "SerialNumber" where "companyId" = 4;
SELECT * FROM "ShopifyCredential" where "companyId" = 4;
SELECT * FROM "SystemRole" where "companyId" = 4;
SELECT * FROM "Task" where "companyId" = 4;
SELECT * FROM "TaskActivities" where "companyId" = 4;
SELECT * FROM "TaskComment" where "companyId" = 4;
SELECT * FROM "Variance" where "companyId" = 4;
SELECT * FROM "WareHouse" where "companyId" = 4;
SELECT * FROM "AuditLog" where "companyId" = 4; -->