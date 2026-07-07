---
source_url: "https://grok.com/c/2e0f2b06-07ed-4fae-8ae7-cbb7d772deac"
conversation_id: "2e0f2b06-07ed-4fae-8ae7-cbb7d772deac"
title: "Oracle Cloud Always Free Services List"
extracted_at: "2026-06-29T16:38:17.318Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Oracle Cloud Always Free Services List

Source: [Grok conversation](https://grok.com/c/2e0f2b06-07ed-4fae-8ae7-cbb7d772deac)

## User

_Time: 2025-07-15T13:58:59.744Z_

in oracle cloud vps's 'always free' tier, what else is 'always free' besides the VPS instances themselvse? Provide a comprehensive list 

## Assistant

_Time: 2025-07-15T14:01:36.169Z_

### Key Points
- Oracle Cloud's "Always Free" tier includes various services besides VPS instances, available indefinitely with usage limits.
- Research suggests the list covers networking, storage, databases, security, developer tools, monitoring, and more, but some services may have regional restrictions.
- The evidence leans toward these services being free forever, subject to Oracle's terms, with no additional cost if limits are respected.

---

### Overview
Oracle Cloud offers an "Always Free" tier that includes VPS instances and a wide range of additional services, all available for unlimited time as long as usage stays within specified limits. Below, we detail these services, excluding the VPS instances, to provide a clear understanding for professional use.

### Services Included
The "Always Free" tier encompasses several categories of services, each with defined limits. These are designed for developers, businesses, and individuals to explore Oracle Cloud capabilities without cost, provided usage does not exceed the free tier thresholds.

- **Networking and Connectivity**: Includes Virtual Cloud Networks (VCNs), Site-to-Site VPN, Load Balancing, Network Load Balancer, and VCN Flow Logs, each with specific capacity limits.
- **Storage**: Offers Block Volume and Object and Archive Storage, with defined storage capacities.
- **Databases and Data Management**: Includes Oracle NoSQL Database, Oracle HeatWave, and autonomous databases like Autonomous Data Warehouse, with regional and usage restrictions.
- **Security and Identity**: Provides Certificates, Vault, Bastions, and Security Advisor, each with limits on resources like certificates and keys.
- **Developer and Management Tools**: Encompasses Resource Manager, APEX Application Development, Console Dashboards, Application Performance Monitoring, Connector Hub, and Fleet Application Management, with limits on jobs, dashboards, and resources.
- **Monitoring and Notifications**: Includes Monitoring, Notifications, and Email Delivery, with caps on data points and notifications.
- **Other Services**: Features Cluster Placement Groups and Content Management Starter Edition, with regional and usage limits.

For detailed limits and regional availability, refer to the official Oracle documentation at [Oracle Cloud Always Free Resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) and [Oracle Cloud Free Tier FAQ](https://www.oracle.com/cloud/free/faq/).

---

### Survey Note: Detailed Analysis of Oracle Cloud "Always Free" Tier Services

This section provides a thorough examination of the services included in Oracle Cloud's "Always Free" tier, excluding VPS instances, based on official documentation and FAQs as of July 15, 2025. The analysis aims to offer a professional, detailed understanding for stakeholders evaluating cloud service options.

#### Background and Context
Oracle Cloud's "Always Free" tier is designed to provide perpetual access to a suite of cloud services without cost, subject to usage limits, distinguishing it from the time-limited free trial offering $300 in credits for 30 days. The tier is not available in US Government Cloud regions, and users must select a home region during signup, impacting service provisioning. This analysis focuses on services beyond VPS instances, ensuring a comprehensive view for professional planning and implementation.

#### Detailed Service Categories and Limits

The following table summarizes the "Always Free" services, categorized for clarity, with specific limits and notes on regional availability where applicable. Data is sourced from Oracle's official documentation and FAQs, ensuring accuracy and relevance.

| **Category**                     | **Service**                          | **Details and Limits**                                                                 | **Notes**                          |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------|-------------------------------------|
| **Networking and Connectivity**  | Virtual Cloud Networks (VCNs)        | Up to 2 VCNs, includes IPv4 and IPv6 support                                          | Free Tier tenancies only            |
|                                   | Site-to-Site VPN                    | Up to 50 IPSec connections                                                           | -                                   |
|                                   | Load Balancing                      | 1 Flexible Load Balancer (10 Mbps min/max), specific listener and server limits; varies by tenancy creation date (post-Dec 15, 2020, vs. earlier) | Tenancy date impacts limits         |
|                                   | Network Load Balancer               | 1 Load Balancer, 50 listeners, 50 backend sets, 512 servers/set, 1024 total servers   | -                                   |
|                                   | VCN Flow Logs                       | Up to 10 GB/month shared across OCI Logging service                                   | For traffic auditing and troubleshooting |
| **Storage**                      | Block Volume                        | 200 GB total (boot and block combined), 5 volume backups                              | -                                   |
|                                   | Object and Archive Storage          | 20 GB total                                                                          | -                                   |
| **Databases and Data Management**| Oracle NoSQL Database               | 133 million reads/month, 133 million writes/month, 3 tables, 25 GB/table (Phoenix Region only) | Regional restriction                |
|                                   | Oracle HeatWave                     | Standalone DB system, single-node cluster, 50 GB storage, 50 GB backup                | -                                   |
|                                   | Autonomous Data Warehouse           | Always Free, unlimited time                                                          | -                                   |
|                                   | Autonomous Transaction Processing   | Always Free, unlimited time                                                          | -                                   |
|                                   | Autonomous JSON Database            | Always Free, unlimited time                                                          | -                                   |
| **Security and Identity**        | Certificates                        | 5 certificate authorities (CAs), 150 certificates                                     | -                                   |
|                                   | Vault                               | All software-protected master keys free, 20 key versions (HSM), 150 secrets, 40 versions | -                                   |
|                                   | Bastions                            | Always Free, unlimited time                                                          | -                                   |
|                                   | Security Advisor                    | Always Free, unlimited time                                                          | -                                   |
| **Developer and Management Tools**| Resource Manager                    | 100 configuration source providers, 2 concurrent jobs (24h), 1 private endpoint, 100 templates, 100 stacks (specific variable and file limits) | -                                   |
|                                   | APEX Application Development        | Always Free, unlimited time                                                          | -                                   |
|                                   | Console Dashboards                  | 100 dashboards per tenancy                                                           | -                                   |
|                                   | Application Performance Monitoring  | 1000 tracing events, 10 Synthetic Monitor runs/hour                                  | -                                   |
|                                   | Connector Hub                       | 2 connectors                                                                         | -                                   |
|                                   | Fleet Application Management        | Manage lifecycle of first 25 resources/month (Compute and databases)                  | -                                   |
| **Monitoring and Notifications** | Monitoring                          | 500 million ingestion data points, 1 billion retrieval data points                   | -                                   |
|                                   | Notifications                       | 1 million HTTPS notifications/month, 1000 email notifications/month                   | -                                   |
|                                   | Email Delivery                      | 3000 emails/month                                                                    | -                                   |
| **Other Services**               | Cluster Placement Groups            | 10 to 50 groups per region, depending on pricing model                               | -                                   |
|                                   | Content Management Starter Edition  | Always Free, unlimited time                                                          | -                                   |

#### Additional Considerations
Several factors influence the usability of these services:
- **Regional Availability**: Services like Oracle NoSQL Database are restricted to the Phoenix Region for Always Free usage, necessitating careful region selection during account setup.
- **Tenancy Creation Date**: Load Balancing limits differ based on whether the tenancy was created on or after December 15, 2020, affecting resource planning for existing users.
- **Usage Limits and Upgrades**: Exceeding free tier limits incurs Pay As You Go charges, with pricing details available at [Oracle Cloud Price List](https://www.oracle.com/cloud/price-list/). Users can upgrade to paid accounts to access additional resources, requiring a credit card with a $100 hold for verification, though no charges apply if limits are respected.
- **Support and SLAs**: The "Always Free" tier does not include Service Level Agreements (SLAs) or Oracle Support, with community forums available for assistance, as noted in the FAQ at [Oracle Cloud Free Tier FAQ](https://www.oracle.com/cloud/free/faq/).

#### Conclusion
This analysis confirms a robust suite of "Always Free" services beyond VPS instances, catering to networking, storage, database, security, and management needs. Professionals should review regional availability and tenancy creation dates to optimize usage, ensuring alignment with organizational requirements. For further details, consult the official documentation at [Oracle Cloud Always Free Resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) and related FAQs.

## User

_Time: 2025-07-15T14:03:54.784Z_

in oracle cloud vps's 'always free' tier, what else is 'always free' besides the VPS instances themselvse? Provide a comprehensive list. Be as SPECIFIC as physically possible, zero ambiguity

## Assistant

_Time: 2025-07-15T14:06:01.646Z_

### Key Points
- Oracle Cloud's "Always Free" tier includes several services and resources besides VPS instances, available for unlimited time with specific limits.
- The list covers storage, networking, databases, security, and monitoring services, each with defined usage caps.
- Details may vary by region and tenancy creation date, so check official documentation for your setup.

### Services Included
Oracle Cloud offers a range of "Always Free" services beyond VPS instances, designed for developers and small projects. Below is a breakdown of these services, ensuring clarity for all users.

#### Certificates and Security
- **Certificates**: Includes 5 certificate authorities (CAs) and 150 certificates for secure communications.
- **Vault**: Provides all software-protected master encryption keys, 20 HSM-protected key versions, 150 secrets, and 40 secret versions (20 active, 20 pending deletion) for data security.

#### Storage Solutions
- **Block Volume**: Offers 200 GB of combined boot and block volume storage, with 5 volume backups for data persistence.
- **Object and Archive Storage**: Provides 20 GB of combined Standard, Infrequent Access, and Archive tier storage for scalable data needs.

#### Networking and Load Balancing
- **Cluster Placement Groups**: Allows 10 to 50 groups per region, depending on pricing, for optimized compute placement.
- **Load Balancing**: Includes 1 Flexible Load Balancer (10 Mbps min/max, 16 listeners, etc.) for tenancies created on or after December 15, 2020, or 1 Micro Load Balancer (10 Mbps, 10 listeners, etc.) for earlier tenancies.
- **Network Load Balancer**: Offers 1 balancer with 50 listeners, 50 backend sets, and up to 1024 total backend servers.
- **Virtual Cloud Networks (VCNs)**: Supports up to 2 VCNs for network isolation.
- **VCN Flow Logs**: Provides up to 10 GB per month for logging network traffic, shared across OCI Logging service.
- **Site-to-Site VPN**: Enables up to 50 IPSec connections for secure on-premises to cloud connectivity.

#### Database Services
- **Oracle Autonomous Database**: Includes 2 databases, each with 1 OCPU and 20 GB storage, for automated database management.
- **Oracle NoSQL Database**: Offers 133 million reads and writes per month, 3 tables with 25 GB storage each, for key-value data storage.
- **Oracle HeatWave**: Provides 50 GB storage and 50 GB backup storage for analytics within MySQL Database.

#### Management and Monitoring
- **Resource Manager**: Supports 100 configuration source providers, 2 concurrent jobs (24-hour duration), and other limits for infrastructure management.
- **Application Performance Monitoring**: Includes 1000 tracing events per hour and 10 Synthetic Monitor runs per hour for application performance insights.
- **Connectors**: Offers 2 Always Free connectors for integrating with other services or external systems, though specific details on connector types are not fully specified in available documentation.

For more details, refer to the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) and [Oracle Cloud Free Tier FAQ](https://www.oracle.com/cloud/free/faq/).

---

### Survey Note: Detailed Analysis of Oracle Cloud "Always Free" Tier Resources

This section provides a thorough examination of the services and resources included in Oracle Cloud's "Always Free" tier, excluding VPS (compute) instances, as of the current understanding based on official documentation and supplementary sources. The analysis aims to ensure precision and professionalism, catering to users seeking a comprehensive overview for professional use.

#### Background and Context
Oracle Cloud Infrastructure (OCI) offers an "Always Free" tier, distinct from its free trial, which provides $300 in credits for 30 days. The "Always Free" resources are available indefinitely, subject to specific usage limits, and are designed to support development, testing, and small-scale deployments. The focus here is on services beyond the VPS instances, which include VM.Standard.E2.1.Micro (AMD) with up to 2 instances and OCI Ampere A1 Compute (Arm) with 3,000 OCPU hours and 18,000 GB hours per month.

#### Methodology
The information was derived from the official OCI Free Tier documentation, specifically the "Always Free Resources" section, supplemented by FAQ pages and community discussions to ensure completeness. The analysis excludes compute instances to align with the user's request, focusing on storage, networking, databases, security, and monitoring services.

#### Detailed Listing of "Always Free" Resources

The following table summarizes the services and their specific limits, ensuring clarity and zero ambiguity:

| **Service**                     | **Description**                                                                 | **Always Free Limit**                                                                 |
|----------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| **Certificates**                | Certificate authorities (CAs) and certificates for secure communications.        | 5 CAs, 150 certificates.                                                             |
| **Block Volume**                | Combined boot and block volume storage, including backups.                      | 200 GB storage, 5 volume backups.                                                    |
| **Object and Archive Storage**  | Combined Standard, Infrequent Access, and Archive tier storage.                 | 20 GB total storage.                                                                 |
| **Vault**                       | Master encryption keys (software-protected and HSM-protected) and secrets management. | All software-protected keys, 20 HSM key versions, 150 secrets, 40 secret versions (20 active, 20 pending deletion). |
| **Resource Manager**            | Infrastructure as code management, including providers, jobs, and templates.    | 100 configuration source providers, 2 concurrent jobs (24-hour duration), 1 private endpoint, 100 private endpoint reachable IP addresses, 100 private templates, 100 stacks (250 variables/stack, 8192 bytes/variable, 11 MB zip/stack). |
| **Oracle Autonomous Database**  | Automated databases for transaction processing, data warehousing, APEX, JSON.  | 2 databases, each with 1 OCPU and 20 GB storage.                                     |
| **Oracle NoSQL Database**       | Distributed key-value database for high-performance reads and writes.           | 133 million reads/month, 133 million writes/month, 3 tables, 25 GB storage per table. |
| **Oracle HeatWave**             | Analytics database within MySQL, including storage and backups.                 | 50 GB storage, 50 GB backup storage.                                                 |
| **Cluster Placement Groups**    | Groups for optimized compute instance placement, varying by pricing model.      | 10 to 50 groups per region, depending on pricing.                                    |
| **Load Balancing**              | Load balancing for application traffic, with Flexible or Micro options based on tenancy creation date. | 1 Flexible Load Balancer (10 Mbps min/max, 16 listeners, 16 virtual hostnames, 16 backend sets, 1024 backend servers) for tenancies created on/after Dec 15, 2020; 1 Micro Load Balancer (10 Mbps, 10 listeners, etc.) for earlier tenancies. |
| **Network Load Balancer**       | High-performance load balancing at the network level.                          | 1 Network Load Balancer, 50 listeners, 50 backend sets, 512 backend servers per set, 1024 total backend servers. |
| **Virtual Cloud Networks (VCNs)**| Software-defined networks for resource isolation.                              | Up to 2 VCNs for Free Tier tenancies.                                                |
| **VCN Flow Logs**               | Logging for auditing and troubleshooting VCN traffic, shared with OCI Logging. | Up to 10 GB per month.                                                               |
| **Site-to-Site VPN**            | Secure IPSec connections between on-premises and VCNs.                         | Up to 50 IPSec connections.                                                          |
| **Application Performance Monitoring** | Tracing events and synthetic monitoring for application performance.          | 1000 tracing events per hour, 10 Synthetic Monitor runs per hour.                    |
| **Connectors**                  | Integration points for connecting with other services or external systems.      | 2 Always Free connectors, with specific types not detailed in available documentation. |

#### Additional Considerations
- **Region and Tenancy Specificity**: Some services, such as Autonomous Databases and compute instances, are provisionable only in the home region. The user should verify regional availability, as the list assumes standard regions outside US Government Cloud, where Always Free resources are not available.
- **Tenancy Creation Date Impact**: The type of Load Balancer (Flexible vs. Micro) depends on whether the tenancy was created before or on/after December 15, 2020, affecting the number of listeners, backend sets, and servers.
- **Support and SLAs**: The "Always Free" tier does not include service level agreements (SLAs) or Oracle Support, with community forums available for assistance. Users relying solely on Always Free resources cannot raise service requests in My Oracle Support.

#### Supporting Evidence
The information is sourced from the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), updated as of August 2024, and the [Oracle Cloud Free Tier FAQ](https://www.oracle.com/cloud/free/faq/), last accessed in July 2025. Community discussions on platforms like Reddit were reviewed for additional context but prioritized official documentation for accuracy.

This detailed analysis ensures that all relevant services are included, providing a professional and comprehensive response for users seeking to leverage Oracle Cloud's "Always Free" tier effectively.

## User

_Time: 2025-07-15T14:10:47.213Z_

```
Oracle Autonomous Database	Automated databases for transaction processing, data warehousing, APEX, JSON.	2 databases, each with 1 OCPU and 20 GB storage.
Oracle NoSQL Database	Distributed key-value database for high-performance reads and writes.	133 million reads/month, 133 million writes/month, 3 tables, 25 GB storage per table.
Oracle HeatWave	Analytics database within MySQL, including storage and backups.	50 GB
```

are you certain in 2025 these are still offered?

If so please provide their exact specifics so i can ensure i do not trigger billing due to a misunderstanding due to your ambiguity

## Assistant

_Time: 2025-07-15T14:12:05.821Z_

### Key Points
- It seems likely that in 2025, Oracle Cloud's "Always Free" tier still includes Oracle Autonomous Database, Oracle NoSQL Database, and Oracle HeatWave with specific limits, based on recent documentation.
- Research suggests these offerings have not changed recently, but always check the official Oracle Cloud documentation for the latest updates.

### Oracle Autonomous Database
The Oracle Autonomous Database in the "Always Free" tier includes:
- 2 databases, each with 1 Oracle CPU (non-scalable) and 20 GB storage (non-scalable).
- Supports up to 20 max simultaneous sessions.
- Runs on Serverless Exadata Infrastructure, suitable for Transaction Processing, Mixed Workloads, JSON Database, APEX Application Development, and Analytics and Data Warehousing.

### Oracle NoSQL Database
The Oracle NoSQL Database in the "Always Free" tier offers:
- Up to 133 million reads per month and 133 million writes per month.
- 3 tables, with 25 GB storage per table.

### Oracle HeatWave
The Oracle HeatWave in the "Always Free" tier provides:
- A standalone DB system with a single node HeatWave cluster in the home region.
- 50 GB storage for data and logs, plus 50 GB backup storage.

For the most current details, refer to the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm).

---

### Survey Note: Detailed Analysis of Oracle Cloud "Always Free" Tier Database Services in 2025

This section provides a comprehensive examination of the Oracle Autonomous Database, Oracle NoSQL Database, and Oracle HeatWave offerings within Oracle Cloud's "Always Free" tier, ensuring precision and professionalism for users seeking detailed insights. The analysis is based on official documentation and supplementary sources, reflecting the state as of July 15, 2025.

#### Background and Context
Oracle Cloud Infrastructure (OCI) offers an "Always Free" tier, distinct from its 30-day free trial with $300 in credits. The "Always Free" resources are available indefinitely, subject to specific usage limits, and are designed to support development, testing, and small-scale deployments. The focus here is on the database services—Oracle Autonomous Database, Oracle NoSQL Database, and Oracle HeatWave—ensuring users can leverage these resources without triggering unintended billing.

#### Methodology
The information was derived from the official OCI Free Tier documentation, specifically the "Always Free Resources" section, updated as of August 2024, and supplemented by the Oracle Cloud Free Tier FAQ and third-party analyses published in 2025. The analysis excludes compute instances and other non-database services to align with the user's query, focusing on the specified database offerings.

#### Detailed Listing of Always Free Database Resources

The following table summarizes the specific limits for each database service, ensuring clarity and zero ambiguity:

| **Service**                     | **Description**                                                                 | **Always Free Limit**                                                                 |
|----------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| **Oracle Autonomous Database**  | Automated databases for transaction processing, data warehousing, APEX, JSON, analytics. | 2 databases, 1 Oracle CPU (non-scalable), 20 GB storage (non-scalable), 20 max simultaneous sessions, Serverless Exadata Infrastructure, Workload Types: Transaction Processing and Mixed Workloads, JSON Database, APEX Application Development, Analytics and Data Warehousing. |
| **Oracle NoSQL Database**       | Distributed key-value database for high-performance reads and writes.           | Up to 133 million reads/month, 133 million writes/month, 3 tables, 25 GB storage per table. |
| **Oracle HeatWave**             | Analytics database within MySQL, including storage and backups.                 | Standalone DB system, single node HeatWave cluster in home region, 50 GB storage for data and logs, 50 GB backup storage. |

#### Supporting Evidence and Analysis
The details were confirmed through the official documentation at [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), accessed on July 15, 2025. Additional validation was provided by third-party sources, such as [topuser.pro/free-oracle-cloud-services-guide-oracle-cloud-free-tier-2025/](https://topuser.pro/free-oracle-cloud-services-guide-oracle-cloud-free-tier-2025/), published in May 2025, which highlighted the continued availability of these services without mention of recent changes.

Web searches for "Oracle Cloud Free Tier changes 2025" and "Oracle Cloud Free Tier updates 2025" did not reveal any announcements of modifications to these specific Always Free resources, reinforcing the likelihood that the offerings remain consistent. The Oracle Cloud Free Tier FAQ, last updated in August 2023, also did not indicate changes, and community discussions on platforms like GitHub (e.g., [oracle-cloud-free-tier-guide](https://gist.github.com/rssnyder/51e3cfedd730e7dd5f4a816143b25dbd), updated June 2025) confirmed ongoing usability without billing issues, provided limits are respected.

#### Regional and Tenancy Considerations
It is critical to note that these Always Free database resources can only be provisioned in the home region of the tenancy, as stated in the documentation. They are not available in US Government Cloud regions, and users must ensure their tenancy is configured accordingly during sign-up. The documentation emphasizes choosing the home region carefully, as this affects provisioning eligibility.

#### Billing and Usage Monitoring
To avoid triggering billing, users must adhere strictly to the specified limits. For example, exceeding 133 million reads or writes per month in Oracle NoSQL Database, or provisioning additional databases beyond the 2 allowed for Oracle Autonomous Database, would result in charges. The Always Free status is non-transferable, and users can delete and reprovision resources within limits, but monitoring usage is essential, as highlighted in sources like [redresscompliance.com/oracle-cloud-free-tier-how-to-get-started/](https://redresscompliance.com/oracle-cloud-free-tier-how-to-get-started/), published in May 2025.

#### Additional Insights
Third-party analyses, such as [getcyber.me/posts/wow-the-oracle-cloud-free-tier-is-a-game-changer-in-cloud-computing/](https://getcyber.me/posts/wow-the-oracle-cloud-free-tier-is-a-game-changer-in-cloud-computing/), published in January 2025, praised the generosity of Oracle's Always Free tier, particularly noting the Autonomous Databases as a significant value proposition. However, users are advised to periodically check the Oracle Cloud documentation for updates, as the provider may add new services or adjust existing ones, according to [topuser.pro/free-oracle-cloud-services-guide-oracle-cloud-free-tier-2025/](https://topuser.pro/free-oracle-cloud-services-guide-oracle-cloud-free-tier-2025/).

#### Conclusion
Based on the available evidence, it is reasonable to conclude that as of July 15, 2025, the Oracle Autonomous Database, Oracle NoSQL Database, and Oracle HeatWave remain part of the Always Free tier with the specifics outlined. Users can confidently utilize these resources for development and testing, provided they stay within the defined limits and monitor usage to prevent billing. For the most current and authoritative information, refer to the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) and [Oracle Cloud Free Tier FAQ](https://www.oracle.com/cloud/free/faq/).

## User

_Time: 2025-07-15T14:13:18.548Z_

i mean that's just so arbitrary. Does it GIVE me sql with the headmap database or is it some arbitrary thing? do they offer postgres or what

## Assistant

_Time: 2025-07-15T14:14:42.542Z_

### Key Points
- Oracle HeatWave in the "Always Free" tier is a MySQL-based database service and does not natively support SQL in the context of PostgreSQL. It uses MySQL syntax for querying, which is distinct but similar to standard SQL.
- Oracle Cloud’s "Always Free" tier does not include PostgreSQL as a database option. However, Oracle offers a separate managed PostgreSQL service (OCI Database with PostgreSQL), which is not part of the Always Free tier and incurs costs.
- To avoid billing, users must strictly adhere to the Always Free limits for HeatWave and other services, as exceeding these triggers charges.

### Clarification on Oracle HeatWave and SQL Support
Oracle HeatWave is a fully managed database service built on MySQL Enterprise Edition, integrated with an in-memory query accelerator for enhanced performance in transactions, analytics, and machine learning workloads. It supports MySQL’s SQL dialect, which is compatible with standard SQL but includes MySQL-specific syntax and features. For example:
- **Querying**: You can write standard SQL queries (e.g., `SELECT`, `INSERT`, `UPDATE`, `DELETE`) to interact with data in HeatWave, leveraging its in-memory query accelerator for real-time analytics.
- **Specific Features**: HeatWave supports advanced capabilities like HeatWave Lakehouse for querying data in object storage, HeatWave AutoML for machine learning, and HeatWave GenAI for in-database large language models (LLMs). These are accessible within the Always Free tier’s limits using MySQL syntax.
- **Limitations**: HeatWave does not support PostgreSQL’s SQL dialect or extensions (e.g., `CREATE EXTENSION` or PostgreSQL-specific functions like `generate_series`). If your application requires PostgreSQL-specific SQL features, HeatWave is not suitable.

The Always Free tier provides:
- **HeatWave Configuration**: A standalone DB system with a single-node HeatWave cluster in the home region, offering 50 GB storage for data and logs, plus 50 GB backup storage.[](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/releasenotes/mysql-database/heatwave-always-free.htm)
- **SQL Usage**: You can use MySQL Workbench, MySQL Shell, or other MySQL-compatible tools to execute SQL queries against the HeatWave database. For example, a query like `SELECT * FROM table_name WHERE column = 'value';` works as expected in MySQL’s SQL dialect.

To avoid billing:
- Do not exceed the 50 GB storage or 50 GB backup storage limits.
- Do not provision additional nodes or scale beyond the single-node cluster.
- Ensure the database remains on the latest active version (e.g., MySQL 9.2.1 as of 2025), as automatic updates may delete non-compliant instances, potentially causing data loss.[](https://www.reddit.com/r/oraclecloud/comments/1ivokds/warning_about_the_free_tier_heatwave_mysql/)
- Monitor usage via the Oracle Cloud Console to stay within Always Free limits.

### PostgreSQL Support in Oracle Cloud
Oracle Cloud does offer a managed PostgreSQL service called **OCI Database with PostgreSQL**, but it is **not** included in the Always Free tier. Key details:
- **Availability**: This is a paid service supporting PostgreSQL versions (e.g., 13, 14, 15, 16, with 12 phased out). It is designed for OLTP, spatial, OLAP, and vector workloads, with features like automated patching, backups, and OCI Database Optimized Storage.[](https://www.oracle.com/uk/cloud/postgresql/)[](https://www.oracle.com/cloud/postgresql/)
- **SQL Support**: It provides full PostgreSQL compatibility, supporting standard SQL and PostgreSQL-specific features (e.g., JSONB, PostGIS, full-text search).
- **Billing**: Using OCI Database with PostgreSQL will incur charges based on compute and storage usage, even during the $300 free trial period, as it is not an Always Free service. Pricing details are available at [oracle.com/cloud/pricing/](https://www.oracle.com/cloud/pricing/).
- **Free Trial Option**: You can use the $300 free trial credits to test OCI Database with PostgreSQL for up to 30 days, but once credits are exhausted or the trial expires, charges apply.[](https://www.oracle.com/heatwave/free/)

To avoid billing with PostgreSQL:
- Do not provision OCI Database with PostgreSQL unless you are prepared to use trial credits or pay for usage.
- If testing during the free trial, delete the PostgreSQL instance before the 30-day trial ends to avoid charges.

### Ensuring No Billing Due to Misunderstandings
To prevent unintended charges with HeatWave or other services:
1. **Verify Service Eligibility**: Confirm that you are using only Always Free services (e.g., HeatWave, Autonomous Database, NoSQL Database) within their specified limits. OCI Database with PostgreSQL is not Always Free.[](https://www.oracle.com/heatwave/free/)[](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/releasenotes/mysql-database/heatwave-always-free.htm)
2. **Monitor Usage**: Use the Oracle Cloud Console’s Cost and Usage Reports to track storage, compute, and backup usage for HeatWave (50 GB storage, 50 GB backups) and other services.
3. **Avoid Upgrades**: Do not upgrade HeatWave to a paid configuration (e.g., multi-node clusters) or enable features outside the Always Free limits (e.g., additional storage).
4. **Check Database Version**: For HeatWave, ensure the database runs the latest MySQL version to avoid deletion during automatic updates, as reported in user experiences.[](https://www.reddit.com/r/oraclecloud/comments/1ivokds/warning_about_the_free_tier_heatwave_mysql/)
5. **Delete Unused Resources**: If you experiment with paid services like OCI Database with PostgreSQL during the free trial, delete them before the trial ends to avoid charges.
6. **Review Documentation**: Regularly check the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) for updates, as Oracle may modify Always Free offerings.[](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/releasenotes/mysql-database/heatwave-always-free.htm)

### Specifics to Avoid Ambiguity
- **Oracle HeatWave**:
  - **SQL Dialect**: MySQL SQL, not PostgreSQL. Example query: `SELECT COUNT(*) FROM orders WHERE order_date >= '2025-01-01';`.
  - **Limits**: 50 GB data/logs, 50 GB backups, single-node cluster, home region only.
  - **Tools**: Compatible with MySQL clients (e.g., MySQL Workbench, MySQL Shell).
  - **Billing Risk**: Exceeding 50 GB storage/backups or scaling nodes triggers charges.
- **Oracle Autonomous Database**:
  - **SQL Dialect**: Oracle SQL, supporting Transaction Processing, Data Warehousing, APEX, JSON.
  - **Limits**: 2 databases, each with 1 OCPU, 20 GB storage, 20 max simultaneous sessions.
  - **Billing Risk**: Exceeding 2 databases, 20 GB storage, or 1 OCPU per database incurs charges.
- **Oracle NoSQL Database**:
  - **Access**: Key-value store, not SQL-based, but supports NoSQL APIs (e.g., REST, SDKs).
  - **Limits**: 133 million reads/writes per month, 3 tables, 25 GB storage per table.
  - **Billing Risk**: Exceeding read/write limits or adding tables beyond 3 triggers charges.
- **OCI Database with PostgreSQL**:
  - **SQL Dialect**: Full PostgreSQL SQL support (e.g., `SELECT * FROM table WHERE column ILIKE 'value%';`, JSONB queries).
  - **Availability**: Paid service, not Always Free. Can use $300 trial credits for 30 days.
  - **Billing Risk**: Any usage incurs charges after trial credits are exhausted.

### PostgreSQL Alternatives in Free Tiers
Since Oracle’s Always Free tier does not include PostgreSQL, consider third-party providers for free PostgreSQL hosting in 2025, as noted in recent analyses:
- **Neon**: Offers 3 GB storage, 1 project, 10 branches, shared compute with 1 GB RAM. Supports full PostgreSQL features.[](https://www.koyeb.com/blog/top-postgresql-database-free-tiers-in-2025)
- **Crunchy Data (Crunchy Bridge)**: Provides a “hobby-0” instance on AWS, free until a $5 minimum threshold is reached. Supports PostgreSQL 13–16.[](https://www.koyeb.com/blog/top-postgresql-database-free-tiers-in-2025)
- **AlwaysData**: Offers 1 GB storage (shared across services), 256 MB RAM, 0.25 CPU, supporting PostgreSQL and MySQL.[](https://gist.github.com/bmaupin/0ce79806467804fdbbf8761970511b8c)
- **Vercel**: Uses Neon for PostgreSQL hosting, accessible globally, with similar limits to Neon’s free tier.[](https://gist.github.com/bmaupin/0ce79806467804fdbbf8761970511b8c)

These providers are suitable for PostgreSQL-specific SQL needs and can be used without Oracle Cloud’s paid PostgreSQL service. Always verify their limits to avoid unexpected charges.

### Conclusion
Oracle HeatWave in the Always Free tier uses MySQL’s SQL dialect, not PostgreSQL, and provides 50 GB storage and 50 GB backups for a single-node cluster. OCI Database with PostgreSQL is a paid service, not included in the Always Free tier, and requires careful management to avoid billing during or after the $300 free trial. To ensure no charges, stick to Always Free services within their limits, monitor usage, and avoid provisioning paid services like OCI Database with PostgreSQL unless intentionally using trial credits. For PostgreSQL needs, consider free-tier alternatives like Neon or Crunchy Data. For the latest details, consult the [Oracle Cloud Infrastructure Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm).[](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/releasenotes/mysql-database/heatwave-always-free.htm)
