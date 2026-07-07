---
source_url: "https://grok.com/c/ae8b78e0-08a3-43b7-911a-8f407061f6d3"
conversation_id: "ae8b78e0-08a3-43b7-911a-8f407061f6d3"
title: "CrowdSec Setup and Configuration Update"
extracted_at: "2026-06-29T16:33:14.526Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# CrowdSec Setup and Configuration Update

Source: [Grok conversation](https://grok.com/c/ae8b78e0-08a3-43b7-911a-8f407061f6d3)

## User

_Time: 2025-09-18T04:40:56.911Z_

WARN[0000] The "WARP_LICENSE_KEY" variable is not set. Defaulting to a blank string.
[+] Running 1/1
 ✔ Container crowdsec Started 0.4s
/var/lib/crowdsec/data was found in a volume
Local agent already registered
Check if lapi needs to register an additional agent
sqlite database permissions updated
/etc/crowdsec was found in a volume
Running hub update
Nothing to do, the hub index is up to date.
/var/lib/crowdsec/data was found in a volume
Running hub upgrade
Action plan:
🔄 check & update data files
downloading https://www.cloudflare.com/ips-v4
downloading https://www.cloudflare.com/ips-v6
Running: cscli parsers install "crowdsecurity/docker-logs"
Nothing to install or remove.
Running: cscli parsers install "crowdsecurity/cri-logs"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/appsec-crs"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/appsec-generic-rules"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/appsec-virtual-patching"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/whitelist-good-actors"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/base-http-scenarios"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/http-cve"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/linux"
Nothing to install or remove.
Running: cscli collections install "crowdsecurity/sshd"
Nothing to install or remove.
time="2025-09-18T04:40:30Z" level=info msg="Enabled feature flags: none"
time="2025-09-18T04:40:30Z" level=info msg="Crowdsec v1.7.0-c3036e21"
time="2025-09-18T04:40:30Z" level=info msg="Loading CAPI manager"
time="2025-09-18T04:40:31Z" level=info msg="CAPI manager configured successfully"
time="2025-09-18T04:40:31Z" level=info msg="Machine is enrolled in the console, Loading PAPI Client"
time="2025-09-18T04:40:31Z" level=info msg="Starting PAPI decision receiver"
time="2025-09-18T04:40:31Z" level=info msg="Start sending metrics to CrowdSec Central API (interval: 38m55s once, then 30m0s)"
time="2025-09-18T04:40:31Z" level=info msg="Starting Polling API Pull" interval=10 source=papi
time="2025-09-18T04:40:31Z" level=info msg="Start push to CrowdSec Central API (interval: 4s once, then 10s)"
time="2025-09-18T04:40:31Z" level=info msg="Start decisions sync to CrowdSec Central API (interval: 10s)" interval=10 source=papi
time="2025-09-18T04:40:31Z" level=info msg="CrowdSec Local API listening on 0.0.0.0:8080"
time="2025-09-18T04:40:31Z" level=info msg="last CAPI pull is newer than 1h30, skip."
time="2025-09-18T04:40:31Z" level=info msg="Start pull from CrowdSec Central API (interval: 2h2m21s once, then 2h0m0s)"
time="2025-09-18T04:40:31Z" level=info msg="capi metrics: sending"
time="2025-09-18T04:40:31Z" level=info msg="Loading grok library /etc/crowdsec/patterns"
time="2025-09-18T04:40:32Z" level=info msg="10.0.7.28 - [Thu, 18 Sep 2025 04:40:32 UTC] \"GET /v1/decisions?ip=149.130.219.117&banned=true HTTP/1.1 200 22.308855ms \"Crowdsec-Bouncer-Traefik-Plugin/1.X.X\" \""
time="2025-09-18T04:40:32Z" level=info msg="Loading enrich plugins"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'GeoIpCity'"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'GeoIpASN'"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'IpToRange'"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'reverse_dns'"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'ParseDate'"
time="2025-09-18T04:40:32Z" level=info msg="Successfully registered enricher 'UnmarshalJSON'"
time="2025-09-18T04:40:32Z" level=info msg="Loading parsers from 11 files"
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s00-raw/cri-logs.yaml stage=s00-raw
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s00-raw/docker-logs.yaml stage=s00-raw
time="2025-09-18T04:40:32Z" level=info msg="Loaded 2 parser nodes" file=/etc/crowdsec/parsers/s00-raw/syslog-logs.yaml stage=s00-raw
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s01-parse/appsec-logs.yaml stage=s01-parse
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s01-parse/sshd-logs.yaml stage=s01-parse
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s01-parse/traefik-logs.yaml stage=s01-parse
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s02-enrich/dateparse-enrich.yaml stage=s02-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s02-enrich/geoip-enrich.yaml stage=s02-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s02-enrich/http-logs.yaml stage=s02-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s02-enrich/public-dns-allowlist.yaml stage=s02-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/parsers/s02-enrich/whitelists.yaml stage=s02-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 12 nodes from 3 stages"
time="2025-09-18T04:40:32Z" level=info msg="Loading postoverflow parsers"
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/postoverflows/s00-enrich/rdns.yaml stage=s00-enrich
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/postoverflows/s01-whitelist/cdn-whitelist.yaml stage=s01-whitelist
time="2025-09-18T04:40:32Z" level=info msg="Loaded 1 parser nodes" file=/etc/crowdsec/postoverflows/s01-whitelist/seo-bots-whitelist.yaml stage=s01-whitelist
time="2025-09-18T04:40:32Z" level=info msg="Loaded 3 nodes from 2 stages"
time="2025-09-18T04:40:32Z" level=info msg="Loading 55 scenario files"
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=fragrant-tree name=crowdsecurity/CVE-2022-26134
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=young-night name=crowdsecurity/http-wordpress-scan
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=holy-lake name=crowdsecurity/http-generic-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=dry-cherry name=LePresidente/http-generic-401-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=twilight-haze name=LePresidente/http-generic-403-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=icy-violet name=crowdsecurity/f5-big-ip-cve-2020-5902
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=little-night name=crowdsecurity/http-cve-2021-41773
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=autumn-paper name=crowdsecurity/http-path-traversal-probing
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=broken-frost name=crowdsecurity/appsec-native
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=billowing-dew name=crowdsecurity/fortinet-cve-2022-40684
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=winter-frost name=crowdsecurity/CVE-2024-38475
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=twilight-leaf name=crowdsecurity/CVE-2023-22515
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=black-pond name=crowdsecurity/spring4shell_cve-2022-22965
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=still-snowflake name=crowdsecurity/crowdsec-appsec-outofband
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=snowy-wind name=crowdsecurity/http-bad-user-agent
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=lively-water name=crowdsecurity/CVE-2017-9841
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=summer-dust name=crowdsecurity/http-backdoors-attempts
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=autumn-leaf name=crowdsecurity/ssh-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=late-leaf name=crowdsecurity/ssh-bf_user-enum
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=delicate-flower name=crowdsecurity/apache_log4j2_cve-2021-44228
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=bitter-smoke name=crowdsecurity/CVE-2022-37042
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=autumn-leaf name=crowdsecurity/appsec-generic-test
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=cool-meadow name=crowdsecurity/CVE-2024-9474
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=throbbing-lake name=crowdsecurity/vmware-cve-2022-22954
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=spring-voice name=crowdsecurity/http-sensitive-files
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=ancient-glitter name=crowdsecurity/http-open-proxy
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=restless-glitter name=crowdsecurity/ssh-slow-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=hidden-brook name=crowdsecurity/ssh-slow-bf_user-enum
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=cold-frost name=crowdsecurity/CVE-2024-0012
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=broken-dew name=crowdsecurity/pulse-secure-sslvpn-cve-2019-11510
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=crimson-cherry name=crowdsecurity/ssh-generic-test
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=silent-frost name=crowdsecurity/http-xss-probbing
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=lingering-shape name=crowdsecurity/fortinet-cve-2018-13379
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=autumn-glade name=crowdsecurity/ssh-refused-conn
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=black-snow name=crowdsecurity/http-cve-probing
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=purple-wildflower name=crowdsecurity/http-generic-test
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=young-cherry name=crowdsecurity/CVE-2019-18935
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=autumn-cloud name=crowdsecurity/http-sap-interface-probing
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=lingering-lake name=ltsich/http-w00tw00t
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=empty-firefly name=crowdsecurity/appsec-vpatch
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=twilight-fog name=crowdsecurity/vmware-vcenter-vmsa-2021-0027
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=delicate-surf name=crowdsecurity/http-sqli-probbing-detection
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=falling-resonance name=crowdsecurity/CVE-2022-42889
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=white-butterfly name=crowdsecurity/http-cve-2021-42013
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=withered-lake name=crowdsecurity/CVE-2023-49103
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=snowy-sun name=crowdsecurity/netgear_rce
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=little-breeze name=crowdsecurity/thinkphp-cve-2018-20062
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=late-mountain name=crowdsecurity/CVE-2022-41082
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=white-pond name=crowdsecurity/CVE-2022-41697
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=autumn-rain name=crowdsecurity/CVE-2022-35914
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=summer-voice name=crowdsecurity/CVE-2022-46169-bf
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=broken-glade name=crowdsecurity/CVE-2022-46169-cmd
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=broken-glitter name=crowdsecurity/CVE-2022-44877
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=snowy-shape name=crowdsecurity/jira_cve-2021-26086
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=restless-fog name=crowdsecurity/http-probing
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=weathered-morning name=crowdsecurity/grafana-cve-2021-43798
time="2025-09-18T04:40:32Z" level=info msg="Adding trigger bucket" cfg=floral-frost name=crowdsecurity/CVE-2023-22518
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=blue-smoke name=crowdsecurity/ssh-cve-2024-6387
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=restless-smoke name=crowdsecurity/http-admin-interface-probing
time="2025-09-18T04:40:32Z" level=info msg="Adding leaky bucket" cfg=autumn-shape name=crowdsecurity/http-crawl-non_statics
time="2025-09-18T04:40:32Z" level=info msg="Loaded 60 scenarios"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2018-10562 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-7028 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-52301 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-29306 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-44529 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-22024 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27292 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-28987 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-28367 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-24893 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/generic-wordpress-uploads-listing to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2019-1003030 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2020-9054 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-41713 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-6205 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2018-1000861 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2018-13379 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-41082 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-20198 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-47218 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-49070 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/generic-freemarker-ssti to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2017-9841 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-3272 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2002-1131 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-22527 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-9474 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-35082 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-23897 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-25257 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-22515 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-32870 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-38856 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-29927 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2020-5902 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-24489 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-32113 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-38816 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-26294 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-29973 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-34102 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-31161 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-symfony-profiler to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-35078 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-26134 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-31499 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/generic-wordpress-uploads-php to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/experimental-no-user-agent to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-50164 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-0012 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-29849 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-7593 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/appsec-generic-test to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-28121 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-46805 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/crs to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-git-config to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-1389 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-52488 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-29824 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-8963 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-connectwise-auth-bypass to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-35914 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27564 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27956 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-51977 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-27926 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-44877 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-46169 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-6553 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-8190 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-49132 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-laravel-debug-mode to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-28255 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2019-12989 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2019-5418 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-22954 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27198 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-51378 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-51567 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-31324 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-0297 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-33617 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2007-0885 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-1388 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-23752 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-34362 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-38205 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-42793 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27348 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-27954 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-47812 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-3129 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-43798 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-22965 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-9465 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2020-11738 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-3519 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-4577 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2018-20062 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-3248 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-env-access to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/base-config to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2020-17496 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2022-25488 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-1212 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-3273 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2019-18935 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-22941 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2023-40044 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2024-57727 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2021-26086 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="Adding crowdsecurity/vpatch-CVE-2025-49113 to appsec rules"
time="2025-09-18T04:40:32Z" level=info msg="127.0.0.1 - [Thu, 18 Sep 2025 04:40:32 UTC] \"POST /v1/watchers/login HTTP/1.1 200 77.238132ms \"crowdsec/v1.7.0-c3036e21-docker\" \""
time="2025-09-18T04:40:32Z" level=info msg="loading acquisition file : /etc/crowdsec/acquis.yaml"
time="2025-09-18T04:40:32Z" level=info msg="Adding file /var/log/auth.log to datasources" type=file
time="2025-09-18T04:40:32Z" level=info msg="Adding file /var/log/syslog to datasources" type=file
time="2025-09-18T04:40:32Z" level=info msg="Adding file /var/log/traefik/traefik.log to datasources" type=file
time="2025-09-18T04:40:32Z" level=info msg="Cache duration for auth not set, using default: 1m0s" name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading /etc/crowdsec/appsec-configs/appsec-default.yaml" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading outofband rule crowdsecurity/experimental-*" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading outofband rule crowdsecurity/appsec-generic-test" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Loaded 2 outofband rules" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/base-config" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/vpatch-*" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/generic-*" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Loaded 110 inband rules" component=appsec_config name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Created 1 appsec runners" name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading acquisition file : /etc/crowdsec/acquis.d/appsec.yaml"
time="2025-09-18T04:40:32Z" level=info msg="Cache duration for auth not set, using default: 1m0s" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading /etc/crowdsec/appsec-configs/appsec-default.yaml" component=appsec_config type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading outofband rule crowdsecurity/experimental-*" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2147154162 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading outofband rule crowdsecurity/appsec-generic-test" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3952763708 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Loaded 2 outofband rules" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/base-config" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/vpatch-*" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2616401790 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3625405918 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3723052162 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 986143632 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3435141823 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 693197552 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2865860985 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 4021381493 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3506202600 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 983497889 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1657416341 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3611220813 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2000400913 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2546897341 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 764491039 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3715495722 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1179314543 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2678312955 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1131753999 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 100238081 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1892424268 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3770557426 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 179634712 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1284059895 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3636993500 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 533963848 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2350313383 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1296176023 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2450212933 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1080338931 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2250313229 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 144899573 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3213419749 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3779025215 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1676663165 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3784869585 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2494942783 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1037192667 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 167879297 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2874124840 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3909542354 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1738074897 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2944143831 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2977339560 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3162398282 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 697577587 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1322728889 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2846934619 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1441205652 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 4037192183 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1356514883 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2897493348 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2482417964 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3120438419 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 801459383 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2452221350 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1422219407 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2092647006 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 175613032 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1009308284 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2960415684 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1027517459 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1514605901 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 411128805 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 552165624 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1796732252 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2753814226 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1768513211 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 982444513 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1634953346 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2436627354 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1163677702 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1561248113 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 270569068 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1681005712 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3157202515 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3415232664 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 4029352239 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1030660560 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2145145579 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2126446186 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 705894435 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1146678565 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3783132254 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2790962051 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2660494520 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2986854460 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2989995759 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 412464235 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2462453727 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3840966918 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1848229329 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1816639226 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1510774183 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2945116514 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1063480236 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1699444758 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 2091076919 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3990063417 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1343787420 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 444309123 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1944101830 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 4225467021 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 4209899081 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 167021836 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1463383879 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 571501766 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3619108541 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3305896263 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1170824366 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1029416513 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 3246376209 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 288151288 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="loading inband rule crowdsecurity/generic-*" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1814702840 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 404042357 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=warning msg="conflicting id 1400181339 for rule !" component=appsec_collection_loader name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Loaded 110 inband rules" component=appsec_config name="0.0.0.0:7422/" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Created 1 appsec runners" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Starting processing data"
time="2025-09-18T04:40:32Z" level=warning msg="/var/log/auth.log is a directory, ignoring it." file=/var/log/auth.log type=file
time="2025-09-18T04:40:32Z" level=warning msg="/var/log/syslog is a directory, ignoring it." file=/var/log/syslog type=file
time="2025-09-18T04:40:32Z" level=info msg="127.0.0.1 - [Thu, 18 Sep 2025 04:40:32 UTC] \"GET /v1/allowlists?with_content=true HTTP/1.1 200 383.68µs \"crowdsec/v1.7.0-c3036e21-docker\" \""
time="2025-09-18T04:40:32Z" level=info msg="127.0.0.1 - [Thu, 18 Sep 2025 04:40:32 UTC] \"GET /v1/allowlists?with_content=true HTTP/1.1 200 198.92µs \"crowdsec/v1.7.0-c3036e21-docker\" \""
time="2025-09-18T04:40:32Z" level=info msg="1 appsec runner to start" name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="1 appsec runner to start" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Appsec listening on 0.0.0.0:7422" name=myAppSecComponent type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Appsec Runner ready to process event" runner_uuid=c8d5b0f3-bf0b-4f53-8442-509f7d33f471 type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Appsec Runner ready to process event" name=myAppSecComponent runner_uuid=01304330-81e4-4c06-9e0e-b66aa81ba077 type=appsec
time="2025-09-18T04:40:32Z" level=info msg="Appsec listening on 0.0.0.0:7422" type=appsec
time="2025-09-18T04:40:32Z" level=info msg="File datasource stopping" tail=/var/log/traefik/traefik.log type=file
panic: runtime error: invalid memory address or nil pointer dereference
        panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x28 pc=0x759d40]
goroutine 141 [running]:
net/http.(*onceCloseListener).close(...)
        net/http/server.go:3930
sync.(*Once).doSlow(0x40018d91b8?, 0x400007fbb0?)
        sync/once.go:78 +0xf0
sync.(*Once).Do(...)
        sync/once.go:69
net/http.(*onceCloseListener).Close(0x4001f903c0)
        net/http/server.go:3926 +0x48
panic({0x1f056e0?, 0x3882760?})
        runtime/panic.go:792 +0x124
net/http.(*onceCloseListener).Accept(0x2709228?)
        <autogenerated>:1 +0x28
net/http.(*Server).Serve(0x40018d9100, {0x0, 0x0})
        net/http/server.go:3424 +0x290
github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec.(*AppsecSource).listenAndServe.func1({0x0?, 0x0?}, 0x58?)
        github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec/appsec.go:366 +0x110
github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec.(*AppsecSource).listenAndServe.func3({0x4001e7d070, 0xc})
        github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec/appsec.go:413 +0x150
created by github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec.(*AppsecSource).listenAndServe in goroutine 138
        github.com/crowdsecurity/crowdsec/pkg/acquisition/modules/appsec/appsec.go:402 +0x28c
 
how to fix this bug with crowdsec?

## Assistant

_Time: 2025-09-18T04:41:54.006Z_

### Key Points
- **The crash appears to stem from a nil pointer dereference in CrowdSec's AppSec module during HTTP server initialization**, specifically when closing a listener on port 7422; this is a known instability in version 1.7.0, often linked to conflicting rule IDs in AppSec configurations.
- **Evidence suggests configuration conflicts in loaded rules (e.g., duplicate IDs in virtual patching or CRS rules)** are triggering the failure, as seen in the numerous "conflicting id" warnings before the panic.
- **Immediate workaround**: Upgrade AppSec collections with force to resolve ID conflicts; if unresolved, disable AppSec or downgrade to v1.6.x, as recent users report stability improvements.
- **No controversy here**—this is a technical bug with community-reported fixes; report details to CrowdSec GitHub for a patch if needed.

### Diagnosis
Your logs show CrowdSec v1.7.0 starting normally (loading parsers, scenarios, and 110+ AppSec rules) but failing right after initializing the AppSec runner on port 7422. The stack trace points to `appsec.go:366` in the `listenAndServe` function, where a goroutine attempts to close a nil HTTP listener, causing a segmentation violation. This isn't isolated—similar panics occur in Docker setups with AppSec enabled.

Warnings about `/var/log/auth.log` and `/var/log/syslog` being directories are benign (just ignored files), but the flood of "conflicting id" errors during rule loading (e.g., for `vpatch-CVE-*` rules) indicates duplicate or malformed SecLang rule IDs, which can leave the server in an unstable state.

### Quick Fixes
1. **Upgrade Collections with Force**: Run `cscli collections upgrade --force crowdsecurity/appsec-generic-rules` and `cscli collections upgrade --force crowdsecurity/appsec-virtual-patching`. This overwrites conflicting rules.
2. **Disable AppSec Temporarily**: Edit `/etc/crowdsec/acquis.d/appsec.yaml` to comment out the AppSec datasource, then restart CrowdSec. Re-enable after upgrades.
3. **Downgrade Version**: If using Docker, pull and run v1.6.5 (e.g., `docker pull crowdsecurity/crowdsec:v1.6.5`). Users in OPNsense environments report this resolves AppSec crashes.
4. **Clean Configs**: Inspect `/etc/crowdsec/appsec-configs/` for duplicate rules; remove or consolidate files like `appsec-default.yaml`.

Restart with `systemctl restart crowdsec` or `docker restart crowdsec` after changes. Monitor logs for recurrence.

### Verification
Test post-fix by querying the LAPI (`curl http://localhost:8080/v1/decisions`) and AppSec endpoint (`curl -X POST http://localhost:7422/v1/evaluate`). If the panic persists, generate a support dump (`cscli support dump`) and submit to support@crowdsec.net.

---

### Comprehensive Analysis of the CrowdSec AppSec Panic Bug

#### Overview and Root Cause
CrowdSec's AppSec (Application Security) component, which provides WAF-like protection via SecLang rules, is crashing during startup in your setup. The error—"panic: runtime error: invalid memory address or nil pointer dereference"—occurs in the Go runtime when the AppSec module's HTTP server (listening on 0.0.0.0:7422) attempts to close a listener that hasn't been properly initialized. This is triggered in the `listenAndServe` goroutine (appsec.go:366), part of the acquisition module responsible for handling in-band/out-of-band rule evaluations.

From your logs:
- Startup succeeds up to loading 110 in-band rules and 2 out-of-band rules from `/etc/crowdsec/appsec-configs/appsec-default.yaml`.
- Dozens of "conflicting id" warnings appear during rule loading for the AppSec runner (e.g., IDs like 2147154162, 3952763708 for generic rules), indicating duplicate or overlapping rule identifiers in collections like `crowdsecurity/vpatch-*` and `crowdsecurity/crs`.
- The runner initializes ("Appsec Runner ready to process event"), but the server panics immediately on Accept/Close, likely because malformed rules leave internal structures (e.g., rule targets or collections) as nil.

This bug is version-specific to 1.7.0 (commit c3036e21), introduced in the September 2025 release alongside WAF improvements. While the changelog highlights better CRS/ModSecurity integration and hub testing, it omits stability fixes for rule loading—suggesting an oversight in handling ID collisions during multi-config merges. Earlier versions (1.6.x) lack this exact panic but have related issues like invalid distinct expressions causing runtime crashes.

#### Affected Components and Reproduction
- **Version Impact**: Primarily v1.7.0 in Docker environments; reproducible in Traefik-integrated setups (as hinted by your traefik.log datasource).
- **Triggers**:
  - Loading collections: `crowdsecurity/appsec-crs`, `appsec-generic-rules`, `appsec-virtual-patching`.
  - Conflicting rules from virtual patches (e.g., CVE-2024-0012, CVE-2023-22515) or generic WordPress/SEO filters.
  - Docker volumes mounting `/etc/crowdsec` or `/var/lib/crowdsec/data` with stale configs.
- **Steps to Reproduce** (based on community reports):
  1. Install v1.7.0 via Docker: `docker run -d --name crowdsec crowdsecurity/crowdsec`.
  2. Install AppSec collections: `cscli collections install crowdsecurity/appsec-*`.
  3. Start with AppSec enabled in `acquis.yaml`.
  4. Observe panic after "Created 1 appsec runners".

Similar patterns appear in hybrid setups (e.g., Unraid with NPMplus or OPNsense plugins), where AppSec evaluates requests but fails under load.

#### Known Similar Issues
The following table summarizes related GitHub issues and forum threads, highlighting patterns in AppSec crashes:

| Issue/Thread | Version | Description | Status | Key Insight |
|--------------|---------|-------------|--------|-------------|
| [#3390: Invalid memory on SecRuleUpdateTargetById](https://github.com/crowdsecurity/crowdsec/issues/3390) | 1.6.4 | Startup crash in AppSecRunner.Init due to nil target in custom SecLang rules. | Open | Rule target misconfiguration leads to nil deref; upgrade rules as workaround. |
| [#3351: Invalid distinct expression crash](https://github.com/crowdsecurity/crowdsec/issues/3351) | 1.6.4-rc4 | Runtime panic when pouring events to leaky bucket with bad `distinct` expr (e.g., in appsec-outofband-ban). | Open | Scenario filters cause nil in bucket instantiation; validate YAML syntax. |
| [#3389: Unknown directive false positive & crash](https://github.com/crowdsecurity/crowdsec/issues/3389) | 1.6.x | Goroutine crash in StartRunSvc with nil pointer during directive parsing. | Open | Tied to malformed seclang; echoes your conflicting IDs. |
| [#3441: Seclang rules causing crash](https://github.com/crowdsecurity/crowdsec/issues/3441) | 1.6.5-rc4 | Specific rule (`SecRule &REQUEST_COOKIES_NAMES:wp_cookie`) panics on non-selectable collection. | Open | Invalid collection access (e.g., cookies) mirrors your vpatch loads. |
| [#3780: Fatal error crashes Docker](https://github.com/crowdsecurity/crowdsec/issues/3780) | 1.7.0 | Container crashes post-startup; logs show appsec init failures. | Open | Docker-specific; resolved by volume cleanup. |
| [OPNsense Forum: Quits with new update](https://forum.opnsense.org/index.php?topic=45226.0) | 1.7.0 (plugin 24.7.12) | Intermittent quits/restarts; "unable to load alert context" tied to appsec-generic-rules. | Resolved by users | Force-upgrade collections or revert to 24.7.11; maintainer couldn't repro but suggests support dump. |
| [NPMplus Discussion #1717](https://github.com/ZoeyVid/NPMplus/discussions/1717) | 1.7.0 | Exact listenAndServe panic (net/http Accept nil deref) in Unraid Docker; blocks access with 500 errors. | Open | Port conflicts (e.g., 6060 vs. 7422); no fix, but disabling AppSec works. |
| [Discourse: AppSec stops responding](https://discourse.crowdsec.net/t/appsec-stops-responding-every-few-weeks-essentially-lockin-me-out/2577) | 1.7.0 | Periodic lockouts (every 3 weeks); restart container fixes temporarily. | Ongoing | Resource exhaustion in runners; monitor with debug logs. |

These span 1.6.x to 1.7.0, with 1.7.0 exacerbating rule conflicts post-CRS enhancements.

#### Detailed Resolution Steps
To address this systematically:

1. **Debug Logging**: Set `log_level: trace` in `/etc/crowdsec/appsec-configs/appsec-default.yaml` and restart. This exposes rule ID collisions (e.g., via `cscli appsec-rules list --verbose`).

2. **Resolve Conflicts**:
   - List rules: `cscli appsec-rules list | grep conflicting`.
   - Upgrade: 
     ```
     cscli collections upgrade --force crowdsecurity/appsec-crs
     cscli collections upgrade --force crowdsecurity/appsec-generic-rules
     cscli collections upgrade --force crowdsecurity/appsec-virtual-patching
     ```
   - If errors, remove tainted: `cscli collections remove crowdsecurity/appsec-generic-rules` then reinstall.

3. **Config Validation**:
   - Hub test: `cscli hubtest appsec` to simulate loads.
   - Inspect rules: `cscli appsec-rules inspect crowdsecurity/vpatch-CVE-2024-0012` for ID duplicates.
   - Whitelist good actors if false positives contribute: Ensure `crowdsecurity/whitelist-good-actors` is installed.

4. **Downgrade/Rollback**:
   - Docker: `docker pull crowdsecurity/crowdsec:v1.6.5` and update compose file.
   - OPNsense/Debian: `opnsense-revert -r 24.7.11 crowdsec` or `apt install crowdsec=1.6.5`.

5. **Long-Term Prevention**:
   - Use single config files to avoid merges.
   - Monitor with Prometheus (enabled in 1.7.0) for runner metrics.
   - Update to future patches—watch [releases](https://github.com/crowdsecurity/crowdsec/releases) for 1.7.1.

#### Performance and Security Implications
- **Impact**: AppSec downtime exposes your Traefik/HTTP endpoints to unfiltered attacks (e.g., SQLi, XSS from your loaded scenarios like http-sqli-probbing-detection).
- **Trade-offs**: Disabling AppSec reduces WAF coverage but restores core IDS (e.g., ssh-bf, http-cve-probing). Research leans toward enabling only essential vpatch rules post-fix to minimize conflicts.
- **Community Consensus**: Forums emphasize force-upgrades as low-risk; downgrades for production stability. No evidence of exploits targeting this bug.

If these steps fail, the evidence points to a deeper Go/net/http race—file a GitHub issue with your `cscli support dump` output.

### Key Citations
- [GitHub Issue #3390: Invalid memory address on SecRuleUpdateTargetById](https://github.com/crowdsecurity/crowdsec/issues/3390)
- [GitHub Issue #3351: Invalid distinct expression leads to crash](https://github.com/crowdsecurity/crowdsec/issues/3351)
- [GitHub Releases: v1.7.0 Changelog](https://github.com/crowdsecurity/crowdsec/releases/tag/v1.7.0)
- [OPNsense Forum: Crowdsec quits with new update](https://forum.opnsense.org/index.php?topic=45226.0)
- [NPMplus Discussion #1717: Panic in listenAndServe](https://github.com/ZoeyVid/NPMplus/discussions/1717)
- [GitHub Issue #3441: Seclang rules crash](https://github.com/crowdsecurity/crowdsec/issues/3441)
- [CrowdSec Docs: AppSec Troubleshooting](https://docs.crowdsec.net/docs/next/appsec/troubleshooting/)
