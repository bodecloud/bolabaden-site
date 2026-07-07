---
source_url: "https://grok.com/c/92e56c0c-6782-4b76-bb0b-ef9f76399054"
conversation_id: "92e56c0c-6782-4b76-bb0b-ef9f76399054"
title: "New conversation"
extracted_at: "2026-06-29T16:23:13.681Z"
message_count: 1
export_suite: "identity"
provenance: grok-rest-api
---

# New conversation

Source: [Grok conversation](https://grok.com/c/92e56c0c-6782-4b76-bb0b-ef9f76399054)

## User

_Time: 2025-08-30T13:41:03.645Z_

2025/08/30 13:16:48 Unable to parse template: template: traefik-docker-labels-conf.tmpl:2117: unexpected EOF\
\
please fix @traefik-comprehensive-docker-labels.tmpl\
\
HINT: therre are **two** instances of `{{ end }}` that are MISSING. And NO they PROBABLY DO NOT BOTH GO AT THE BOTTOM, actually find where we're missing one.
 

```

# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
# Comprehensive Traefik Docker Labels to File Provider YAML Template
# This template provides 1:1 conversion from Docker labels to Traefik file provider configuration

{{/* 
  This section collects all containers with traefik.enable=true
  Source: pkg/provider/docker/shared_labels.go:36-37 - extractDockerLabels() checks for traefik.enable
  Source: pkg/provider/docker/config.go:40-42 - keepContainer() checks container.ExtraConf.Enable
*/}}
{{ $enabledContainers := slice }}
{{ range $c := . }}
  {{ if eq (index $c.Labels "traefik.enable") "true" }}
    {{ $enabledContainers = append $enabledContainers $c }}
  {{ end }}
{{ end }}

{{ if $enabledContainers }}

{{/* 
  Check if we have any HTTP configuration
  Source: pkg/provider/docker/config.go:51-58 - Checking for HTTP configuration
*/}}
{{ $hasHTTPConfig := false }}
{{ range $c := $enabledContainers }}
  {{ range $key, $value := $c.Labels }}
    {{ if or (hasPrefix $key "traefik.http.routers.") (hasPrefix $key "traefik.http.services.") (hasPrefix $key "traefik.http.middlewares.") }}
      {{ $hasHTTPConfig = true }}
    {{ end }}
  {{ end }}
{{ end }}

{{ if $hasHTTPConfig }}
http:
  {{/* 
    HTTP Routers section
    Source: pkg/provider/docker/config.go:98 - BuildRouterConfiguration is called
    Source: pkg/provider/provider.go - BuildRouterConfiguration function builds router config from labels
  */}}
  {{ $allRouterNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect router names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.http labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.http.routers." }}
        {{ $withoutPrefix := trimPrefix "traefik.http.routers." $key }}
        {{ $routerName := index (split $withoutPrefix ".") 0 }}
        {{ if $routerName }}
          {{ $_ := set $allRouterNames $routerName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
    
    {{/* 
      If no explicit routers but traefik.enable=true, create default router
      Source: pkg/provider/provider.go - BuildRouterConfiguration creates default router if none exists
    */}}
    {{ $hasRouterLabels := false }}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.http.routers." }}
        {{ $hasRouterLabels = true }}
      {{ end }}
    {{ end }}
    {{ if not $hasRouterLabels }}
      {{ $_ := set $allRouterNames $containerName $c }}
    {{ end }}
  {{ end }}
  
  {{ if $allRouterNames }}
  routers:
    {{ range $routerName, $container := $allRouterNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $routerPrefix := printf "traefik.http.routers.%s." $routerName }}
      
      {{/* 
        Check if this is an explicit router or default
        Source: pkg/provider/provider.go - BuildRouterConfiguration checks for explicit router config
      */}}
      {{ $isExplicitRouter := false }}
      {{ range $key, $value := $labels }}
        {{ if hasPrefix $key $routerPrefix }}
          {{ $isExplicitRouter = true }}
        {{ end }}
      {{ end }}
      
    {{ $routerName }}:
      {{ if $isExplicitRouter }}
        {{/* 
          Explicit router configuration
          Source: pkg/provider/provider.go - BuildRouterConfiguration sets router properties from labels
        */}}
        {{ if hasKey $labels (printf "%srule" $routerPrefix) }}
          {{ $rule := index $labels (printf "%srule" $routerPrefix) }}
      rule: {{ $rule }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%sservice" $routerPrefix) }}
          {{ $service := index $labels (printf "%sservice" $routerPrefix) }}
      service: {{ $service }}
        {{ else }}
      service: {{ $containerName }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%sentrypoints" $routerPrefix) }}
          {{ $entrypoints := index $labels (printf "%sentrypoints" $routerPrefix) }}
      entryPoints:
          {{ $eps := split $entrypoints "," }}
          {{ range $entrypoint := $eps }}
        - {{ trim $entrypoint " " }}
          {{ end }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%smiddlewares" $routerPrefix) }}
          {{ $middlewares := index $labels (printf "%smiddlewares" $routerPrefix) }}
      middlewares:
          {{ $mws := split $middlewares "," }}
          {{ range $middleware := $mws }}
        - {{ trim $middleware " " }}
          {{ end }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%spriority" $routerPrefix) }}
          {{ $priority := index $labels (printf "%spriority" $routerPrefix) }}
      priority: {{ $priority }}
        {{ end }}
        
        {{/* 
          TLS Configuration
          Source: pkg/provider/provider.go - BuildRouterConfiguration handles TLS config
        */}}
        {{ $tlsEnabled := index $labels (printf "%stls" $routerPrefix) }}
        {{ $certResolver := index $labels (printf "%stls.certresolver" $routerPrefix) }}
        {{ $tlsOptions := index $labels (printf "%stls.options" $routerPrefix) }}
        {{ $passthrough := index $labels (printf "%stls.passthrough" $routerPrefix) }}
        
        {{/* 
          Parse domains
          Source: pkg/provider/provider.go - BuildRouterConfiguration parses domain labels with array indices
        */}}
        {{ $domains := slice }}
        {{ $domainIndices := dict }}
        {{ range $key, $value := $labels }}
          {{ if hasPrefix $key (printf "%stls.domains" $routerPrefix) }}
            {{ $withoutPrefix := trimPrefix (printf "%stls.domains" $routerPrefix) $key }}
            {{ if regexMatch "^\\[([0-9]+)\\]\\.main$" $withoutPrefix }}
              {{ $index := regexReplaceAll "^\\[([0-9]+)\\]\\.main$" $withoutPrefix "$1" }}
              {{ $_ := set $domainIndices $index true }}
            {{ end }}
          {{ end }}
        {{ end }}
        
        {{ range $index, $_ := $domainIndices }}
          {{ $domain := dict }}
          {{ $mainKey := printf "%stls.domains[%s].main" $routerPrefix $index }}
          {{ $sansKey := printf "%stls.domains[%s].sans" $routerPrefix $index }}
          
          {{ if hasKey $labels $mainKey }}
            {{ $_ := set $domain "main" (index $labels $mainKey) }}
          {{ end }}
          
          {{ if hasKey $labels $sansKey }}
            {{ $sansValue := index $labels $sansKey }}
            {{ $sans := split $sansValue "," }}
            {{ $_ := set $domain "sans" $sans }}
          {{ end }}
          
          {{ $domains = append $domains $domain }}
        {{ end }}
        
        {{ if or (eq $tlsEnabled "true") $certResolver $domains $tlsOptions (eq $passthrough "true") }}
      tls:
          {{ if eq $tlsEnabled "true" }}
        {}
          {{ end }}
          {{ if $certResolver }}
        certResolver: {{ $certResolver }}
          {{ end }}
          {{ if $domains }}
        domains:
            {{ range $domain := $domains }}
          - main: {{ $domain.main }}
              {{ if $domain.sans }}
            sans:
                {{ range $san := $domain.sans }}
              - {{ trim $san " " }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          {{ if $tlsOptions }}
        options: {{ $tlsOptions }}
          {{ end }}
          {{ if eq $passthrough "true" }}
        passthrough: true
          {{ end }}
        {{ end }}
      {{ else }}
        {{/* 
          Default router configuration
          Source: pkg/provider/docker/shared.go:24 - DefaultTemplateRule defines default Host rule
        */}}
      rule: Host(`{{ $containerName }}.${DOMAIN}`)
      service: {{ $containerName }}
      entryPoints:
        - websecure
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    HTTP Services section
    Source: pkg/provider/docker/config.go:155-178 - buildServiceConfiguration builds services
  */}}
  {{ $allServiceNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect service names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.http labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.http.services." }}
        {{ $withoutPrefix := trimPrefix "traefik.http.services." $key }}
        {{ $serviceName := index (split $withoutPrefix ".") 0 }}
        {{ if $serviceName }}
          {{ $_ := set $allServiceNames $serviceName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
    
    {{/* 
      If no explicit services but traefik.enable=true, create default service
      Source: pkg/provider/docker/config.go:158-165 - Creates default service if none exists
    */}}
    {{ $hasServiceLabels := false }}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.http.services." }}
        {{ $hasServiceLabels = true }}
      {{ end }}
    {{ end }}
    {{ if not $hasServiceLabels }}
      {{ $_ := set $allServiceNames $containerName $c }}
    {{ end }}
  {{ end }}
  
  {{ if $allServiceNames }}
  services:
    {{ range $serviceName, $container := $allServiceNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $servicePrefix := printf "traefik.http.services.%s." $serviceName }}
      {{ $containerPort := "" }}
      {{ if gt (len $container.Addresses) 0 }}
        {{ $containerPort = (index $container.Addresses 0).Port }}
      {{ end }}
      
      {{/* 
        Check if this is an explicit service or default
        Source: pkg/provider/docker/config.go:158-165 - Checks for explicit service config
      */}}
      {{ $isExplicitService := false }}
      {{ range $key, $value := $labels }}
        {{ if hasPrefix $key $servicePrefix }}
          {{ $isExplicitService = true }}
        {{ end }}
      {{ end }}
      
    {{ $serviceName }}:
      {{ if $isExplicitService }}
        {{/* 
          Explicit service configuration
          Source: pkg/provider/docker/config.go:171-176 - Adds server to loadbalancer
        */}}
        {{ $hasLoadBalancer := false }}
        {{ range $key, $value := $labels }}
          {{ if hasPrefix $key (printf "%sloadbalancer." $servicePrefix) }}
            {{ $hasLoadBalancer = true }}
          {{ end }}
        {{ end }}
        
        {{ if $hasLoadBalancer }}
      loadBalancer:
          {{ $serverPort := index $labels (printf "%sloadbalancer.server.port" $servicePrefix) }}
          {{ if not $serverPort }}{{ $serverPort = $containerPort }}{{ end }}
          
          {{ $serverScheme := index $labels (printf "%sloadbalancer.server.scheme" $servicePrefix) }}
          {{ if not $serverScheme }}{{ $serverScheme = "http" }}{{ end }}
          
          {{ $serverURL := index $labels (printf "%sloadbalancer.server.url" $servicePrefix) }}
          {{ if $serverURL }}
        servers:
          - url: {{ $serverURL }}
          {{ else }}
        servers:
          - url: {{ $serverScheme }}://{{ $containerName }}:{{ $serverPort }}
          {{ end }}
          
          {{ if hasKey $labels (printf "%sloadbalancer.passhostheader" $servicePrefix) }}
            {{ $passHostHeader := index $labels (printf "%sloadbalancer.passhostheader" $servicePrefix) }}
            {{ if eq $passHostHeader "false" }}
        passHostHeader: false
            {{ end }}
          {{ end }}
          
          {{ if hasKey $labels (printf "%sloadbalancer.sticky" $servicePrefix) }}
            {{ $sticky := index $labels (printf "%sloadbalancer.sticky" $servicePrefix) }}
            {{ if eq $sticky "true" }}
        sticky:
              {{ $cookieName := index $labels (printf "%sloadbalancer.sticky.cookie.name" $servicePrefix) }}
              {{ $cookieSecure := index $labels (printf "%sloadbalancer.sticky.cookie.secure" $servicePrefix) }}
              {{ $cookieHttpOnly := index $labels (printf "%sloadbalancer.sticky.cookie.httponly" $servicePrefix) }}
              {{ $cookieSameSite := index $labels (printf "%sloadbalancer.sticky.cookie.samesite" $servicePrefix) }}
              {{ $cookieDomain := index $labels (printf "%sloadbalancer.sticky.cookie.domain" $servicePrefix) }}
              {{ $cookiePath := index $labels (printf "%sloadbalancer.sticky.cookie.path" $servicePrefix) }}
              {{ $cookieMaxAge := index $labels (printf "%sloadbalancer.sticky.cookie.maxage" $servicePrefix) }}
              {{ if or $cookieName $cookieSecure $cookieHttpOnly $cookieSameSite $cookieDomain $cookiePath $cookieMaxAge }}
          cookie:
                {{ if $cookieName }}
            name: {{ $cookieName }}
                {{ end }}
                {{ if $cookieSecure }}
            secure: {{ $cookieSecure }}
                {{ end }}
                {{ if $cookieHttpOnly }}
            httpOnly: {{ $cookieHttpOnly }}
                {{ end }}
                {{ if $cookieSameSite }}
            sameSite: {{ $cookieSameSite }}
                {{ end }}
                {{ if $cookieDomain }}
            domain: {{ $cookieDomain }}
                {{ end }}
                {{ if $cookiePath }}
            path: {{ $cookiePath }}
                {{ end }}
                {{ if $cookieMaxAge }}
            maxAge: {{ $cookieMaxAge }}
                {{ end }}
              {{ else }}
          {}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{/* 
            Health Check Configuration
            Source: pkg/provider/docker/config.go:171-176 - Health check configuration is part of loadbalancer
            Source: docs/content/reference/dynamic-configuration/docker-labels.yml:202-214 - Health check labels
          */}}
          {{ $hasHealthCheck := false }}
          {{ range $key, $value := $labels }}
            {{ if hasPrefix $key (printf "%sloadbalancer.healthcheck." $servicePrefix) }}
              {{ $hasHealthCheck = true }}
            {{ end }}
          {{ end }}
          {{ if $hasHealthCheck }}
        healthCheck:
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.path" $servicePrefix) }}
              {{ $healthCheckPath := index $labels (printf "%sloadbalancer.healthcheck.path" $servicePrefix) }}
          path: {{ $healthCheckPath }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.port" $servicePrefix) }}
              {{ $healthCheckPort := index $labels (printf "%sloadbalancer.healthcheck.port" $servicePrefix) }}
          port: {{ $healthCheckPort }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.interval" $servicePrefix) }}
              {{ $healthCheckInterval := index $labels (printf "%sloadbalancer.healthcheck.interval" $servicePrefix) }}
          interval: {{ $healthCheckInterval }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.timeout" $servicePrefix) }}
              {{ $healthCheckTimeout := index $labels (printf "%sloadbalancer.healthcheck.timeout" $servicePrefix) }}
          timeout: {{ $healthCheckTimeout }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.scheme" $servicePrefix) }}
              {{ $healthCheckScheme := index $labels (printf "%sloadbalancer.healthcheck.scheme" $servicePrefix) }}
          scheme: {{ $healthCheckScheme }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.hostname" $servicePrefix) }}
              {{ $healthCheckHostname := index $labels (printf "%sloadbalancer.healthcheck.hostname" $servicePrefix) }}
          hostname: {{ $healthCheckHostname }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.followredirects" $servicePrefix) }}
              {{ $healthCheckFollowRedirects := index $labels (printf "%sloadbalancer.healthcheck.followredirects" $servicePrefix) }}
          followRedirects: {{ $healthCheckFollowRedirects }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.method" $servicePrefix) }}
              {{ $healthCheckMethod := index $labels (printf "%sloadbalancer.healthcheck.method" $servicePrefix) }}
          method: {{ $healthCheckMethod }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sloadbalancer.healthcheck.status" $servicePrefix) }}
              {{ $healthCheckStatus := index $labels (printf "%sloadbalancer.healthcheck.status" $servicePrefix) }}
          status: {{ $healthCheckStatus }}
            {{ end }}
            
            {{/* 
              Health check headers
              Source: docs/content/reference/dynamic-configuration/docker-labels.yml:203-204 - Health check headers
            */}}
            {{ $hasHealthCheckHeaders := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sloadbalancer.healthcheck.headers." $servicePrefix) }}
                {{ $hasHealthCheckHeaders = true }}
              {{ end }}
            {{ end }}
            {{ if $hasHealthCheckHeaders }}
          headers:
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sloadbalancer.healthcheck.headers." $servicePrefix) }}
                  {{ $headerName := trimPrefix (printf "%sloadbalancer.healthcheck.headers." $servicePrefix) $key }}
            {{ $headerName }}: {{ $value }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{/* 
            Response Forwarding
            Source: docs/content/reference/dynamic-configuration/docker-labels.yml:218 - Response forwarding labels
          */}}
          {{ if hasKey $labels (printf "%sloadbalancer.responseforwarding.flushinterval" $servicePrefix) }}
            {{ $flushInterval := index $labels (printf "%sloadbalancer.responseforwarding.flushinterval" $servicePrefix) }}
        responseForwarding:
          flushInterval: {{ $flushInterval }}
          {{ end }}
          
          {{/* 
            Servers Transport
            Source: docs/content/reference/dynamic-configuration/docker-labels.yml:219 - Servers transport label
          */}}
          {{ if hasKey $labels (printf "%sloadbalancer.serverstransport" $servicePrefix) }}
            {{ $serversTransport := index $labels (printf "%sloadbalancer.serverstransport" $servicePrefix) }}
        serversTransport: {{ $serversTransport }}
          {{ end }}
          
          {{/* 
            Strategy
            Source: docs/content/reference/dynamic-configuration/docker-labels.yml:229 - Strategy label
          */}}
          {{ if hasKey $labels (printf "%sloadbalancer.strategy" $servicePrefix) }}
            {{ $strategy := index $labels (printf "%sloadbalancer.strategy" $servicePrefix) }}
        strategy: {{ $strategy }}
          {{ end }}
        {{ end }}
      {{ else }}
        {{/* 
          Default service configuration
          Source: pkg/provider/docker/config.go:158-165 - Creates default service with loadbalancer
          Source: pkg/provider/docker/config.go:259-294 - addServer adds URL to loadbalancer
        */}}
      loadBalancer:
        servers:
          - url: http://{{ $containerName }}:{{ $containerPort }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    HTTP Middlewares section
    Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.http labels
    Source: docs/content/reference/dynamic-configuration/docker-labels.yml:3-167 - Middleware labels
  */}}
  {{ $allMiddlewareNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect middleware names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.http labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.http.middlewares." }}
        {{ $withoutPrefix := trimPrefix "traefik.http.middlewares." $key }}
        {{ $middlewareName := index (split $withoutPrefix ".") 0 }}
        {{ if $middlewareName }}
          {{ $_ := set $allMiddlewareNames $middlewareName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{ if $allMiddlewareNames }}
  middlewares:
    {{ range $middlewareName, $container := $allMiddlewareNames }}
      {{ $labels := $container.Labels }}
      {{ $middlewarePrefix := printf "traefik.http.middlewares.%s." $middlewareName }}
      
    {{ $middlewareName }}:
      {{/* 
        Check for each middleware type
        Source: docs/content/reference/dynamic-configuration/docker-labels.yml:3-167 - Middleware types
      */}}
      {{ $middlewareTypes := slice "addprefix" "basicauth" "buffering" "chain" "circuitbreaker" "compress" "contenttype" "digestauth" "errors" "forwardauth" "grpcweb" "headers" "ipallowlist" "ipwhitelist" "inflightreq" "passtlsclientcert" "plugin" "ratelimit" "redirectregex" "redirectscheme" "replacepath" "replacepathregex" "retry" "stripprefix" "stripprefixregex" }}
      
      {{ range $type := $middlewareTypes }}
        {{ $hasType := false }}
        {{ range $key, $value := $labels }}
          {{ if hasPrefix $key (printf "%s%s." $middlewarePrefix $type) }}
            {{ $hasType = true }}
          {{ end }}
        {{ end }}
        {{ $enabledValue := index $labels (printf "%s%s" $middlewarePrefix $type) }}
        
        {{ if or $hasType (eq $enabledValue "true") }}
          {{ if eq $type "addprefix" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:3 */}}
      addPrefix:
            {{ if hasKey $labels (printf "%saddprefix.prefix" $middlewarePrefix) }}
              {{ $prefix := index $labels (printf "%saddprefix.prefix" $middlewarePrefix) }}
        prefix: {{ $prefix }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "basicauth" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:4-8 */}}
      basicAuth:
            {{ if hasKey $labels (printf "%sbasicauth.users" $middlewarePrefix) }}
              {{ $users := index $labels (printf "%sbasicauth.users" $middlewarePrefix) }}
        users:
              {{ $userList := split $users "," }}
              {{ range $user := $userList }}
          - {{ trim $user " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbasicauth.usersfile" $middlewarePrefix) }}
              {{ $usersFile := index $labels (printf "%sbasicauth.usersfile" $middlewarePrefix) }}
        usersFile: {{ $usersFile }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbasicauth.realm" $middlewarePrefix) }}
              {{ $realm := index $labels (printf "%sbasicauth.realm" $middlewarePrefix) }}
        realm: {{ $realm }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbasicauth.headerfield" $middlewarePrefix) }}
              {{ $headerField := index $labels (printf "%sbasicauth.headerfield" $middlewarePrefix) }}
        headerField: {{ $headerField }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbasicauth.removeheader" $middlewarePrefix) }}
              {{ $removeHeader := index $labels (printf "%sbasicauth.removeheader" $middlewarePrefix) }}
              {{ if eq $removeHeader "true" }}
        removeHeader: true
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "buffering" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:9-13 */}}
      buffering:
            {{ if hasKey $labels (printf "%sbuffering.maxrequestbodybytes" $middlewarePrefix) }}
              {{ $maxRequestBodyBytes := index $labels (printf "%sbuffering.maxrequestbodybytes" $middlewarePrefix) }}
        maxRequestBodyBytes: {{ $maxRequestBodyBytes }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbuffering.maxresponsebodybytes" $middlewarePrefix) }}
              {{ $maxResponseBodyBytes := index $labels (printf "%sbuffering.maxresponsebodybytes" $middlewarePrefix) }}
        maxResponseBodyBytes: {{ $maxResponseBodyBytes }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbuffering.memrequestbodybytes" $middlewarePrefix) }}
              {{ $memRequestBodyBytes := index $labels (printf "%sbuffering.memrequestbodybytes" $middlewarePrefix) }}
        memRequestBodyBytes: {{ $memRequestBodyBytes }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbuffering.memresponsebodybytes" $middlewarePrefix) }}
              {{ $memResponseBodyBytes := index $labels (printf "%sbuffering.memresponsebodybytes" $middlewarePrefix) }}
        memResponseBodyBytes: {{ $memResponseBodyBytes }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sbuffering.retryexpression" $middlewarePrefix) }}
              {{ $retryExpression := index $labels (printf "%sbuffering.retryexpression" $middlewarePrefix) }}
        retryExpression: {{ $retryExpression }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "chain" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:14 */}}
      chain:
            {{ if hasKey $labels (printf "%schain.middlewares" $middlewarePrefix) }}
              {{ $chainMiddlewares := index $labels (printf "%schain.middlewares" $middlewarePrefix) }}
        middlewares:
              {{ $mwList := split $chainMiddlewares "," }}
              {{ range $middleware := $mwList }}
          - {{ trim $middleware " " }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "circuitbreaker" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:15-19 */}}
      circuitBreaker:
            {{ if hasKey $labels (printf "%scircuitbreaker.expression" $middlewarePrefix) }}
              {{ $expression := index $labels (printf "%scircuitbreaker.expression" $middlewarePrefix) }}
        expression: {{ $expression }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%scircuitbreaker.checkperiod" $middlewarePrefix) }}
              {{ $checkPeriod := index $labels (printf "%scircuitbreaker.checkperiod" $middlewarePrefix) }}
        checkPeriod: {{ $checkPeriod }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%scircuitbreaker.fallbackduration" $middlewarePrefix) }}
              {{ $fallbackDuration := index $labels (printf "%scircuitbreaker.fallbackduration" $middlewarePrefix) }}
        fallbackDuration: {{ $fallbackDuration }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%scircuitbreaker.recoveryduration" $middlewarePrefix) }}
              {{ $recoveryDuration := index $labels (printf "%scircuitbreaker.recoveryduration" $middlewarePrefix) }}
        recoveryDuration: {{ $recoveryDuration }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%scircuitbreaker.responsecode" $middlewarePrefix) }}
              {{ $responseCode := index $labels (printf "%scircuitbreaker.responsecode" $middlewarePrefix) }}
        responseCode: {{ $responseCode }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "compress" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:20-25 */}}
      compress:
            {{ $defaultEncoding := index $labels (printf "%scompress.defaultencoding" $middlewarePrefix) }}
            {{ $encodings := index $labels (printf "%scompress.encodings" $middlewarePrefix) }}
            {{ $excludedContentTypes := index $labels (printf "%scompress.excludedcontenttypes" $middlewarePrefix) }}
            {{ $includedContentTypes := index $labels (printf "%scompress.includedcontenttypes" $middlewarePrefix) }}
            {{ $minResponseBodyBytes := index $labels (printf "%scompress.minresponsebodybytes" $middlewarePrefix) }}
            
            {{ if or $defaultEncoding $encodings $excludedContentTypes $includedContentTypes $minResponseBodyBytes }}
              {{ if $defaultEncoding }}
        defaultEncoding: {{ $defaultEncoding }}
              {{ end }}
              {{ if $encodings }}
        encodings:
                {{ $encList := split $encodings "," }}
                {{ range $encoding := $encList }}
          - {{ trim $encoding " " }}
                {{ end }}
              {{ end }}
              {{ if $excludedContentTypes }}
        excludedContentTypes:
                {{ $ctList := split $excludedContentTypes "," }}
                {{ range $contentType := $ctList }}
          - {{ trim $contentType " " }}
                {{ end }}
              {{ end }}
              {{ if $includedContentTypes }}
        includedContentTypes:
                {{ $ctList := split $includedContentTypes "," }}
                {{ range $contentType := $ctList }}
          - {{ trim $contentType " " }}
                {{ end }}
              {{ end }}
              {{ if $minResponseBodyBytes }}
        minResponseBodyBytes: {{ $minResponseBodyBytes }}
              {{ end }}
            {{ else }}
        {}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "contenttype" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:26-27 */}}
      contentType:
            {{ $autoDetect := index $labels (printf "%scontenttype.autodetect" $middlewarePrefix) }}
            {{ if $autoDetect }}
        autoDetect: {{ $autoDetect }}
            {{ else }}
        {}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "digestauth" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:28-32 */}}
      digestAuth:
            {{ if hasKey $labels (printf "%sdigestauth.users" $middlewarePrefix) }}
              {{ $users := index $labels (printf "%sdigestauth.users" $middlewarePrefix) }}
        users:
              {{ $userList := split $users "," }}
              {{ range $user := $userList }}
          - {{ trim $user " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sdigestauth.usersfile" $middlewarePrefix) }}
              {{ $usersFile := index $labels (printf "%sdigestauth.usersfile" $middlewarePrefix) }}
        usersFile: {{ $usersFile }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sdigestauth.realm" $middlewarePrefix) }}
              {{ $realm := index $labels (printf "%sdigestauth.realm" $middlewarePrefix) }}
        realm: {{ $realm }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sdigestauth.headerfield" $middlewarePrefix) }}
              {{ $headerField := index $labels (printf "%sdigestauth.headerfield" $middlewarePrefix) }}
        headerField: {{ $headerField }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sdigestauth.removeheader" $middlewarePrefix) }}
              {{ $removeHeader := index $labels (printf "%sdigestauth.removeheader" $middlewarePrefix) }}
              {{ if eq $removeHeader "true" }}
        removeHeader: true
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "errors" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:33-35 */}}
      errors:
            {{ if hasKey $labels (printf "%serrors.status" $middlewarePrefix) }}
              {{ $status := index $labels (printf "%serrors.status" $middlewarePrefix) }}
        status:
              {{ $statusList := split $status "," }}
              {{ range $s := $statusList }}
          - {{ trim $s " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%serrors.service" $middlewarePrefix) }}
              {{ $service := index $labels (printf "%serrors.service" $middlewarePrefix) }}
        service: {{ $service }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%serrors.query" $middlewarePrefix) }}
              {{ $query := index $labels (printf "%serrors.query" $middlewarePrefix) }}
        query: {{ $query }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "forwardauth" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:38-53 */}}
      forwardAuth:
            {{ if hasKey $labels (printf "%sforwardauth.address" $middlewarePrefix) }}
              {{ $address := index $labels (printf "%sforwardauth.address" $middlewarePrefix) }}
        address: {{ $address }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.trustforwardheader" $middlewarePrefix) }}
              {{ $trustForwardHeader := index $labels (printf "%sforwardauth.trustforwardheader" $middlewarePrefix) }}
              {{ if eq $trustForwardHeader "true" }}
        trustForwardHeader: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.authresponseheaders" $middlewarePrefix) }}
              {{ $authResponseHeaders := index $labels (printf "%sforwardauth.authresponseheaders" $middlewarePrefix) }}
        authResponseHeaders:
              {{ $headerList := split $authResponseHeaders "," }}
              {{ range $header := $headerList }}
          - {{ trim $header " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.authrequestheaders" $middlewarePrefix) }}
              {{ $authRequestHeaders := index $labels (printf "%sforwardauth.authrequestheaders" $middlewarePrefix) }}
        authRequestHeaders:
              {{ $headerList := split $authRequestHeaders "," }}
              {{ range $header := $headerList }}
          - {{ trim $header " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.authresponseheadersregex" $middlewarePrefix) }}
              {{ $authResponseHeadersRegex := index $labels (printf "%sforwardauth.authresponseheadersregex" $middlewarePrefix) }}
        authResponseHeadersRegex: {{ $authResponseHeadersRegex }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.addauthcookiestoresponse" $middlewarePrefix) }}
              {{ $addAuthCookiesToResponse := index $labels (printf "%sforwardauth.addauthcookiestoresponse" $middlewarePrefix) }}
        addAuthCookiesToResponse:
              {{ $cookieList := split $addAuthCookiesToResponse "," }}
              {{ range $cookie := $cookieList }}
          - {{ trim $cookie " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.forwardbody" $middlewarePrefix) }}
              {{ $forwardBody := index $labels (printf "%sforwardauth.forwardbody" $middlewarePrefix) }}
              {{ if eq $forwardBody "true" }}
        forwardBody: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.headerfield" $middlewarePrefix) }}
              {{ $headerField := index $labels (printf "%sforwardauth.headerfield" $middlewarePrefix) }}
        headerField: {{ $headerField }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sforwardauth.maxbodysize" $middlewarePrefix) }}
              {{ $maxBodySize := index $labels (printf "%sforwardauth.maxbodysize" $middlewarePrefix) }}
        maxBodySize: {{ $maxBodySize }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "grpcweb" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:54 */}}
      grpcWeb:
            {{ if hasKey $labels (printf "%sgrpcweb.alloworigins" $middlewarePrefix) }}
              {{ $allowOrigins := index $labels (printf "%sgrpcweb.alloworigins" $middlewarePrefix) }}
        allowOrigins:
              {{ $originList := split $allowOrigins "," }}
              {{ range $origin := $originList }}
          - {{ trim $origin " " }}
              {{ end }}
            {{ else }}
        {}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "headers" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:55-90 */}}
      headers:
            {{/* Custom Request Headers */}}
            {{ $hasCustomRequestHeaders := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sheaders.customrequestheaders." $middlewarePrefix) }}
                {{ $hasCustomRequestHeaders = true }}
              {{ end }}
            {{ end }}
            {{ if $hasCustomRequestHeaders }}
        customRequestHeaders:
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sheaders.customrequestheaders." $middlewarePrefix) }}
                  {{ $headerName := trimPrefix (printf "%sheaders.customrequestheaders." $middlewarePrefix) $key }}
          {{ $headerName }}: {{ $value }}
                {{ end }}
              {{ end }}
            {{ end }}
            
            {{/* Custom Response Headers */}}
            {{ $hasCustomResponseHeaders := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sheaders.customresponseheaders." $middlewarePrefix) }}
                {{ $hasCustomResponseHeaders = true }}
              {{ end }}
            {{ end }}
            {{ if $hasCustomResponseHeaders }}
        customResponseHeaders:
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sheaders.customresponseheaders." $middlewarePrefix) }}
                  {{ $headerName := trimPrefix (printf "%sheaders.customresponseheaders." $middlewarePrefix) $key }}
          {{ $headerName }}: {{ $value }}
                {{ end }}
              {{ end }}
            {{ end }}
            
            {{/* SSL Proxy Headers */}}
            {{ $hasSSLProxyHeaders := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sheaders.sslproxyheaders." $middlewarePrefix) }}
                {{ $hasSSLProxyHeaders = true }}
              {{ end }}
            {{ end }}
            {{ if $hasSSLProxyHeaders }}
        sslProxyHeaders:
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sheaders.sslproxyheaders." $middlewarePrefix) }}
                  {{ $headerName := trimPrefix (printf "%sheaders.sslproxyheaders." $middlewarePrefix) $key }}
          {{ $headerName }}: {{ $value }}
                {{ end }}
              {{ end }}
            {{ end }}
            
            {{/* Other header options */}}
            {{ if hasKey $labels (printf "%sheaders.accesscontrolallowcredentials" $middlewarePrefix) }}
              {{ $accessControlAllowCredentials := index $labels (printf "%sheaders.accesscontrolallowcredentials" $middlewarePrefix) }}
              {{ if eq $accessControlAllowCredentials "true" }}
        accessControlAllowCredentials: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolallowheaders" $middlewarePrefix) }}
              {{ $accessControlAllowHeaders := index $labels (printf "%sheaders.accesscontrolallowheaders" $middlewarePrefix) }}
        accessControlAllowHeaders:
              {{ $headerList := split $accessControlAllowHeaders "," }}
              {{ range $header := $headerList }}
          - {{ trim $header " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolallowmethods" $middlewarePrefix) }}
              {{ $accessControlAllowMethods := index $labels (printf "%sheaders.accesscontrolallowmethods" $middlewarePrefix) }}
        accessControlAllowMethods:
              {{ $methodList := split $accessControlAllowMethods "," }}
              {{ range $method := $methodList }}
          - {{ trim $method " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolalloworiginlist" $middlewarePrefix) }}
              {{ $accessControlAllowOriginList := index $labels (printf "%sheaders.accesscontrolalloworiginlist" $middlewarePrefix) }}
        accessControlAllowOriginList:
              {{ $originList := split $accessControlAllowOriginList "," }}
              {{ range $origin := $originList }}
          - {{ trim $origin " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolalloworiginlistregex" $middlewarePrefix) }}
              {{ $accessControlAllowOriginListRegex := index $labels (printf "%sheaders.accesscontrolalloworiginlistregex" $middlewarePrefix) }}
        accessControlAllowOriginListRegex:
              {{ $regexList := split $accessControlAllowOriginListRegex "," }}
              {{ range $regex := $regexList }}
          - {{ trim $regex " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolexposeheaders" $middlewarePrefix) }}
              {{ $accessControlExposeHeaders := index $labels (printf "%sheaders.accesscontrolexposeheaders" $middlewarePrefix) }}
        accessControlExposeHeaders:
              {{ $headerList := split $accessControlExposeHeaders "," }}
              {{ range $header := $headerList }}
          - {{ trim $header " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.accesscontrolmaxage" $middlewarePrefix) }}
              {{ $accessControlMaxAge := index $labels (printf "%sheaders.accesscontrolmaxage" $middlewarePrefix) }}
        accessControlMaxAge: {{ $accessControlMaxAge }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.addvaryheader" $middlewarePrefix) }}
              {{ $addVaryHeader := index $labels (printf "%sheaders.addvaryheader" $middlewarePrefix) }}
              {{ if eq $addVaryHeader "true" }}
        addVaryHeader: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.allowedhosts" $middlewarePrefix) }}
              {{ $allowedHosts := index $labels (printf "%sheaders.allowedhosts" $middlewarePrefix) }}
        allowedHosts:
              {{ $hostList := split $allowedHosts "," }}
              {{ range $host := $hostList }}
          - {{ trim $host " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.browserxssfilter" $middlewarePrefix) }}
              {{ $browserXssFilter := index $labels (printf "%sheaders.browserxssfilter" $middlewarePrefix) }}
              {{ if eq $browserXssFilter "true" }}
        browserXssFilter: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.contentsecuritypolicy" $middlewarePrefix) }}
              {{ $contentSecurityPolicy := index $labels (printf "%sheaders.contentsecuritypolicy" $middlewarePrefix) }}
        contentSecurityPolicy: {{ $contentSecurityPolicy }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.contentsecuritypolicyreportonly" $middlewarePrefix) }}
              {{ $contentSecurityPolicyReportOnly := index $labels (printf "%sheaders.contentsecuritypolicyreportonly" $middlewarePrefix) }}
        contentSecurityPolicyReportOnly: {{ $contentSecurityPolicyReportOnly }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.contenttypenosniff" $middlewarePrefix) }}
              {{ $contentTypeNosniff := index $labels (printf "%sheaders.contenttypenosniff" $middlewarePrefix) }}
              {{ if eq $contentTypeNosniff "true" }}
        contentTypeNosniff: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.custombrowserxssvalue" $middlewarePrefix) }}
              {{ $customBrowserXssValue := index $labels (printf "%sheaders.custombrowserxssvalue" $middlewarePrefix) }}
        customBrowserXssValue: {{ $customBrowserXssValue }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.customframeoptionsvalue" $middlewarePrefix) }}
              {{ $customFrameOptionsValue := index $labels (printf "%sheaders.customframeoptionsvalue" $middlewarePrefix) }}
        customFrameOptionsValue: {{ $customFrameOptionsValue }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.featurepolicy" $middlewarePrefix) }}
              {{ $featurePolicy := index $labels (printf "%sheaders.featurepolicy" $middlewarePrefix) }}
        featurePolicy: {{ $featurePolicy }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.forcestsheader" $middlewarePrefix) }}
              {{ $forceSTSHeader := index $labels (printf "%sheaders.forcestsheader" $middlewarePrefix) }}
              {{ if eq $forceSTSHeader "true" }}
        forceSTSHeader: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.framedeny" $middlewarePrefix) }}
              {{ $frameDeny := index $labels (printf "%sheaders.framedeny" $middlewarePrefix) }}
              {{ if eq $frameDeny "true" }}
        frameDeny: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.hostsproxyheaders" $middlewarePrefix) }}
              {{ $hostsProxyHeaders := index $labels (printf "%sheaders.hostsproxyheaders" $middlewarePrefix) }}
        hostsProxyHeaders:
              {{ $headerList := split $hostsProxyHeaders "," }}
              {{ range $header := $headerList }}
          - {{ trim $header " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.isdevelopment" $middlewarePrefix) }}
              {{ $isDevelopment := index $labels (printf "%sheaders.isdevelopment" $middlewarePrefix) }}
              {{ if eq $isDevelopment "true" }}
        isDevelopment: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.permissionspolicy" $middlewarePrefix) }}
              {{ $permissionsPolicy := index $labels (printf "%sheaders.permissionspolicy" $middlewarePrefix) }}
        permissionsPolicy: {{ $permissionsPolicy }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.publickey" $middlewarePrefix) }}
              {{ $publicKey := index $labels (printf "%sheaders.publickey" $middlewarePrefix) }}
        publicKey: {{ $publicKey }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.referrerpolicy" $middlewarePrefix) }}
              {{ $referrerPolicy := index $labels (printf "%sheaders.referrerpolicy" $middlewarePrefix) }}
        referrerPolicy: {{ $referrerPolicy }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.sslforcehost" $middlewarePrefix) }}
              {{ $sslForceHost := index $labels (printf "%sheaders.sslforcehost" $middlewarePrefix) }}
              {{ if eq $sslForceHost "true" }}
        sslForceHost: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.sslhost" $middlewarePrefix) }}
              {{ $sslHost := index $labels (printf "%sheaders.sslhost" $middlewarePrefix) }}
        sslHost: {{ $sslHost }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.sslredirect" $middlewarePrefix) }}
              {{ $sslRedirect := index $labels (printf "%sheaders.sslredirect" $middlewarePrefix) }}
              {{ if eq $sslRedirect "true" }}
        sslRedirect: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.ssltemporaryredirect" $middlewarePrefix) }}
              {{ $sslTemporaryRedirect := index $labels (printf "%sheaders.ssltemporaryredirect" $middlewarePrefix) }}
              {{ if eq $sslTemporaryRedirect "true" }}
        sslTemporaryRedirect: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.stsincludesubdomains" $middlewarePrefix) }}
              {{ $stsIncludeSubdomains := index $labels (printf "%sheaders.stsincludesubdomains" $middlewarePrefix) }}
              {{ if eq $stsIncludeSubdomains "true" }}
        stsIncludeSubdomains: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.stspreload" $middlewarePrefix) }}
              {{ $stsPreload := index $labels (printf "%sheaders.stspreload" $middlewarePrefix) }}
              {{ if eq $stsPreload "true" }}
        stsPreload: true
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sheaders.stsseconds" $middlewarePrefix) }}
              {{ $stsSeconds := index $labels (printf "%sheaders.stsseconds" $middlewarePrefix) }}
        stsSeconds: {{ $stsSeconds }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "ipallowlist" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:91-96 */}}
      ipAllowList:
            {{ if hasKey $labels (printf "%sipallowlist.sourcerange" $middlewarePrefix) }}
              {{ $sourceRange := index $labels (printf "%sipallowlist.sourcerange" $middlewarePrefix) }}
        sourceRange:
              {{ $rangeList := split $sourceRange "," }}
              {{ range $range := $rangeList }}
          - {{ trim $range " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sipallowlist.rejectstatuscode" $middlewarePrefix) }}
              {{ $rejectStatusCode := index $labels (printf "%sipallowlist.rejectstatuscode" $middlewarePrefix) }}
        rejectStatusCode: {{ $rejectStatusCode }}
            {{ end }}
            
            {{/* IP Strategy */}}
            {{ $hasIPStrategy := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sipallowlist.ipstrategy" $middlewarePrefix) }}
                {{ $hasIPStrategy = true }}
              {{ end }}
            {{ end }}
            {{ if or $hasIPStrategy (eq (index $labels (printf "%sipallowlist.ipstrategy" $middlewarePrefix)) "true") }}
        ipStrategy:
              {{ if hasKey $labels (printf "%sipallowlist.ipstrategy.depth" $middlewarePrefix) }}
                {{ $depth := index $labels (printf "%sipallowlist.ipstrategy.depth" $middlewarePrefix) }}
          depth: {{ $depth }}
              {{ end }}
              {{ if hasKey $labels (printf "%sipallowlist.ipstrategy.excludedips" $middlewarePrefix) }}
                {{ $excludedIPs := index $labels (printf "%sipallowlist.ipstrategy.excludedips" $middlewarePrefix) }}
          excludedIPs:
                {{ $ipList := split $excludedIPs "," }}
                {{ range $ip := $ipList }}
            - {{ trim $ip " " }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "ipwhitelist" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:97-101 */}}
      ipWhiteList:
            {{ if hasKey $labels (printf "%sipwhitelist.sourcerange" $middlewarePrefix) }}
              {{ $sourceRange := index $labels (printf "%sipwhitelist.sourcerange" $middlewarePrefix) }}
        sourceRange:
              {{ $rangeList := split $sourceRange "," }}
              {{ range $range := $rangeList }}
          - {{ trim $range " " }}
              {{ end }}
            {{ end }}
            
            {{/* IP Strategy */}}
            {{ $hasIPStrategy := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sipwhitelist.ipstrategy" $middlewarePrefix) }}
                {{ $hasIPStrategy = true }}
              {{ end }}
            {{ end }}
            {{ if or $hasIPStrategy (eq (index $labels (printf "%sipwhitelist.ipstrategy" $middlewarePrefix)) "true") }}
        ipStrategy:
              {{ if hasKey $labels (printf "%sipwhitelist.ipstrategy.depth" $middlewarePrefix) }}
                {{ $depth := index $labels (printf "%sipwhitelist.ipstrategy.depth" $middlewarePrefix) }}
          depth: {{ $depth }}
              {{ end }}
              {{ if hasKey $labels (printf "%sipwhitelist.ipstrategy.excludedips" $middlewarePrefix) }}
                {{ $excludedIPs := index $labels (printf "%sipwhitelist.ipstrategy.excludedips" $middlewarePrefix) }}
          excludedIPs:
                {{ $ipList := split $excludedIPs "," }}
                {{ range $ip := $ipList }}
            - {{ trim $ip " " }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "inflightreq" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:102-107 */}}
      inFlightReq:
            {{ if hasKey $labels (printf "%sinflightreq.amount" $middlewarePrefix) }}
              {{ $amount := index $labels (printf "%sinflightreq.amount" $middlewarePrefix) }}
        amount: {{ $amount }}
            {{ end }}
            
            {{/* Source Criterion */}}
            {{ $hasSourceCriterion := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sinflightreq.sourcecriterion." $middlewarePrefix) }}
                {{ $hasSourceCriterion = true }}
              {{ end }}
            {{ end }}
            {{ if $hasSourceCriterion }}
        sourceCriterion:
              {{ if hasKey $labels (printf "%sinflightreq.sourcecriterion.requesthost" $middlewarePrefix) }}
                {{ $requestHost := index $labels (printf "%sinflightreq.sourcecriterion.requesthost" $middlewarePrefix) }}
                {{ if eq $requestHost "true" }}
          requestHost: true
                {{ end }}
              {{ end }}
              
              {{ if hasKey $labels (printf "%sinflightreq.sourcecriterion.requestheadername" $middlewarePrefix) }}
                {{ $requestHeaderName := index $labels (printf "%sinflightreq.sourcecriterion.requestheadername" $middlewarePrefix) }}
          requestHeaderName: {{ $requestHeaderName }}
              {{ end }}
              
              {{/* IP Strategy */}}
              {{ $hasIPStrategy := false }}
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sinflightreq.sourcecriterion.ipstrategy." $middlewarePrefix) }}
                  {{ $hasIPStrategy = true }}
                {{ end }}
              {{ end }}
              {{ if $hasIPStrategy }}
          ipStrategy:
                {{ if hasKey $labels (printf "%sinflightreq.sourcecriterion.ipstrategy.depth" $middlewarePrefix) }}
                  {{ $depth := index $labels (printf "%sinflightreq.sourcecriterion.ipstrategy.depth" $middlewarePrefix) }}
            depth: {{ $depth }}
                {{ end }}
                {{ if hasKey $labels (printf "%sinflightreq.sourcecriterion.ipstrategy.excludedips" $middlewarePrefix) }}
                  {{ $excludedIPs := index $labels (printf "%sinflightreq.sourcecriterion.ipstrategy.excludedips" $middlewarePrefix) }}
            excludedIPs:
                  {{ $ipList := split $excludedIPs "," }}
                  {{ range $ip := $ipList }}
              - {{ trim $ip " " }}
                  {{ end }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "passtlsclientcert" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:108-127 */}}
      passTLSClientCert:
            {{ if hasKey $labels (printf "%spasstlsclientcert.pem" $middlewarePrefix) }}
              {{ $pem := index $labels (printf "%spasstlsclientcert.pem" $middlewarePrefix) }}
              {{ if eq $pem "true" }}
        pem: true
              {{ end }}
            {{ end }}
            
            {{/* Info */}}
            {{ $hasInfo := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%spasstlsclientcert.info." $middlewarePrefix) }}
                {{ $hasInfo = true }}
              {{ end }}
            {{ end }}
            {{ if $hasInfo }}
        info:
              {{ if hasKey $labels (printf "%spasstlsclientcert.info.notafter" $middlewarePrefix) }}
                {{ $notAfter := index $labels (printf "%spasstlsclientcert.info.notafter" $middlewarePrefix) }}
                {{ if eq $notAfter "true" }}
          notAfter: true
                {{ end }}
              {{ end }}
              
              {{ if hasKey $labels (printf "%spasstlsclientcert.info.notbefore" $middlewarePrefix) }}
                {{ $notBefore := index $labels (printf "%spasstlsclientcert.info.notbefore" $middlewarePrefix) }}
                {{ if eq $notBefore "true" }}
          notBefore: true
                {{ end }}
              {{ end }}
              
              {{ if hasKey $labels (printf "%spasstlsclientcert.info.sans" $middlewarePrefix) }}
                {{ $sans := index $labels (printf "%spasstlsclientcert.info.sans" $middlewarePrefix) }}
                {{ if eq $sans "true" }}
          sans: true
                {{ end }}
              {{ end }}
              
              {{/* Subject */}}
              {{ $hasSubject := false }}
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%spasstlsclientcert.info.subject." $middlewarePrefix) }}
                  {{ $hasSubject = true }}
                {{ end }}
              {{ end }}
              {{ if $hasSubject }}
          subject:
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.commonname" $middlewarePrefix) }}
                  {{ $commonName := index $labels (printf "%spasstlsclientcert.info.subject.commonname" $middlewarePrefix) }}
                  {{ if eq $commonName "true" }}
            commonName: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.country" $middlewarePrefix) }}
                  {{ $country := index $labels (printf "%spasstlsclientcert.info.subject.country" $middlewarePrefix) }}
                  {{ if eq $country "true" }}
            country: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.domaincomponent" $middlewarePrefix) }}
                  {{ $domainComponent := index $labels (printf "%spasstlsclientcert.info.subject.domaincomponent" $middlewarePrefix) }}
                  {{ if eq $domainComponent "true" }}
            domainComponent: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.locality" $middlewarePrefix) }}
                  {{ $locality := index $labels (printf "%spasstlsclientcert.info.subject.locality" $middlewarePrefix) }}
                  {{ if eq $locality "true" }}
            locality: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.organization" $middlewarePrefix) }}
                  {{ $organization := index $labels (printf "%spasstlsclientcert.info.subject.organization" $middlewarePrefix) }}
                  {{ if eq $organization "true" }}
            organization: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.organizationalunit" $middlewarePrefix) }}
                  {{ $organizationalUnit := index $labels (printf "%spasstlsclientcert.info.subject.organizationalunit" $middlewarePrefix) }}
                  {{ if eq $organizationalUnit "true" }}
            organizationalUnit: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.province" $middlewarePrefix) }}
                  {{ $province := index $labels (printf "%spasstlsclientcert.info.subject.province" $middlewarePrefix) }}
                  {{ if eq $province "true" }}
            province: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.subject.serialnumber" $middlewarePrefix) }}
                  {{ $serialNumber := index $labels (printf "%spasstlsclientcert.info.subject.serialnumber" $middlewarePrefix) }}
                  {{ if eq $serialNumber "true" }}
            serialNumber: true
                  {{ end }}
                {{ end }}
              {{ end }}
              
              {{/* Issuer */}}
              {{ $hasIssuer := false }}
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%spasstlsclientcert.info.issuer." $middlewarePrefix) }}
                  {{ $hasIssuer = true }}
                {{ end }}
              {{ end }}
              {{ if $hasIssuer }}
          issuer:
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.commonname" $middlewarePrefix) }}
                  {{ $commonName := index $labels (printf "%spasstlsclientcert.info.issuer.commonname" $middlewarePrefix) }}
                  {{ if eq $commonName "true" }}
            commonName: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.country" $middlewarePrefix) }}
                  {{ $country := index $labels (printf "%spasstlsclientcert.info.issuer.country" $middlewarePrefix) }}
                  {{ if eq $country "true" }}
            country: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.domaincomponent" $middlewarePrefix) }}
                  {{ $domainComponent := index $labels (printf "%spasstlsclientcert.info.issuer.domaincomponent" $middlewarePrefix) }}
                  {{ if eq $domainComponent "true" }}
            domainComponent: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.locality" $middlewarePrefix) }}
                  {{ $locality := index $labels (printf "%spasstlsclientcert.info.issuer.locality" $middlewarePrefix) }}
                  {{ if eq $locality "true" }}
            locality: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.organization" $middlewarePrefix) }}
                  {{ $organization := index $labels (printf "%spasstlsclientcert.info.issuer.organization" $middlewarePrefix) }}
                  {{ if eq $organization "true" }}
            organization: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.province" $middlewarePrefix) }}
                  {{ $province := index $labels (printf "%spasstlsclientcert.info.issuer.province" $middlewarePrefix) }}
                  {{ if eq $province "true" }}
            province: true
                  {{ end }}
                {{ end }}
                
                {{ if hasKey $labels (printf "%spasstlsclientcert.info.issuer.serialnumber" $middlewarePrefix) }}
                  {{ $serialNumber := index $labels (printf "%spasstlsclientcert.info.issuer.serialnumber" $middlewarePrefix) }}
                  {{ if eq $serialNumber "true" }}
            serialNumber: true
                  {{ end }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "plugin" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:128-131 */}}
      plugin:
            {{/* Extract plugin name and configuration */}}
            {{ $pluginNames := dict }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%splugin." $middlewarePrefix) }}
                {{ $pluginConfig := trimPrefix (printf "%splugin." $middlewarePrefix) $key }}
                {{ $pluginParts := split $pluginConfig "." }}
                {{ if gt (len $pluginParts) 0 }}
                  {{ $pluginName := index $pluginParts 0 }}
                  {{ $_ := set $pluginNames $pluginName true }}
                {{ end }}
              {{ end }}
            {{ end }}
            
            {{ range $pluginName, $_ := $pluginNames }}
        {{ $pluginName }}:
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%splugin.%s." $middlewarePrefix $pluginName) }}
                  {{ $configKey := trimPrefix (printf "%splugin.%s." $middlewarePrefix $pluginName) $key }}
          {{ $configKey }}: {{ $value }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "ratelimit" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:132-153 */}}
      rateLimit:
            {{ if hasKey $labels (printf "%sratelimit.average" $middlewarePrefix) }}
              {{ $average := index $labels (printf "%sratelimit.average" $middlewarePrefix) }}
        average: {{ $average }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sratelimit.burst" $middlewarePrefix) }}
              {{ $burst := index $labels (printf "%sratelimit.burst" $middlewarePrefix) }}
        burst: {{ $burst }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sratelimit.period" $middlewarePrefix) }}
              {{ $period := index $labels (printf "%sratelimit.period" $middlewarePrefix) }}
        period: {{ $period }}
            {{ end }}
            
            {{/* Source Criterion */}}
            {{ $hasSourceCriterion := false }}
            {{ range $key, $value := $labels }}
              {{ if hasPrefix $key (printf "%sratelimit.sourcecriterion." $middlewarePrefix) }}
                {{ $hasSourceCriterion = true }}
              {{ end }}
            {{ end }}
            {{ if $hasSourceCriterion }}
        sourceCriterion:
              {{ if hasKey $labels (printf "%sratelimit.sourcecriterion.requesthost" $middlewarePrefix) }}
                {{ $requestHost := index $labels (printf "%sratelimit.sourcecriterion.requesthost" $middlewarePrefix) }}
                {{ if eq $requestHost "true" }}
          requestHost: true
                {{ end }}
              {{ end }}
              
              {{ if hasKey $labels (printf "%sratelimit.sourcecriterion.requestheadername" $middlewarePrefix) }}
                {{ $requestHeaderName := index $labels (printf "%sratelimit.sourcecriterion.requestheadername" $middlewarePrefix) }}
          requestHeaderName: {{ $requestHeaderName }}
              {{ end }}
              
              {{/* IP Strategy */}}
              {{ $hasIPStrategy := false }}
              {{ range $key, $value := $labels }}
                {{ if hasPrefix $key (printf "%sratelimit.sourcecriterion.ipstrategy." $middlewarePrefix) }}
                  {{ $hasIPStrategy = true }}
                {{ end }}
              {{ end }}
              {{ if $hasIPStrategy }}
          ipStrategy:
                {{ if hasKey $labels (printf "%sratelimit.sourcecriterion.ipstrategy.depth" $middlewarePrefix) }}
                  {{ $depth := index $labels (printf "%sratelimit.sourcecriterion.ipstrategy.depth" $middlewarePrefix) }}
            depth: {{ $depth }}
                {{ end }}
                {{ if hasKey $labels (printf "%sratelimit.sourcecriterion.ipstrategy.excludedips" $middlewarePrefix) }}
                  {{ $excludedIPs := index $labels (printf "%sratelimit.sourcecriterion.ipstrategy.excludedips" $middlewarePrefix) }}
            excludedIPs:
                  {{ $ipList := split $excludedIPs "," }}
                  {{ range $ip := $ipList }}
              - {{ trim $ip " " }}
                  {{ end }}
                {{ end }}
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "redirectregex" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:154-156 */}}
      redirectRegex:
            {{ if hasKey $labels (printf "%sredirectregex.regex" $middlewarePrefix) }}
              {{ $regex := index $labels (printf "%sredirectregex.regex" $middlewarePrefix) }}
        regex: {{ $regex }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sredirectregex.replacement" $middlewarePrefix) }}
              {{ $replacement := index $labels (printf "%sredirectregex.replacement" $middlewarePrefix) }}
        replacement: {{ $replacement }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sredirectregex.permanent" $middlewarePrefix) }}
              {{ $permanent := index $labels (printf "%sredirectregex.permanent" $middlewarePrefix) }}
              {{ if eq $permanent "true" }}
        permanent: true
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "redirectscheme" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:157-159 */}}
      redirectScheme:
            {{ if hasKey $labels (printf "%sredirectscheme.scheme" $middlewarePrefix) }}
              {{ $scheme := index $labels (printf "%sredirectscheme.scheme" $middlewarePrefix) }}
        scheme: {{ $scheme }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sredirectscheme.port" $middlewarePrefix) }}
              {{ $port := index $labels (printf "%sredirectscheme.port" $middlewarePrefix) }}
        port: {{ $port }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sredirectscheme.permanent" $middlewarePrefix) }}
              {{ $permanent := index $labels (printf "%sredirectscheme.permanent" $middlewarePrefix) }}
              {{ if eq $permanent "true" }}
        permanent: true
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "replacepath" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:160 */}}
      replacePath:
            {{ if hasKey $labels (printf "%sreplacepath.path" $middlewarePrefix) }}
              {{ $path := index $labels (printf "%sreplacepath.path" $middlewarePrefix) }}
        path: {{ $path }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "replacepathregex" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:161-162 */}}
      replacePathRegex:
            {{ if hasKey $labels (printf "%sreplacepathregex.regex" $middlewarePrefix) }}
              {{ $regex := index $labels (printf "%sreplacepathregex.regex" $middlewarePrefix) }}
        regex: {{ $regex }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sreplacepathregex.replacement" $middlewarePrefix) }}
              {{ $replacement := index $labels (printf "%sreplacepathregex.replacement" $middlewarePrefix) }}
        replacement: {{ $replacement }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "retry" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:163-164 */}}
      retry:
            {{ if hasKey $labels (printf "%sretry.attempts" $middlewarePrefix) }}
              {{ $attempts := index $labels (printf "%sretry.attempts" $middlewarePrefix) }}
        attempts: {{ $attempts }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sretry.initialinterval" $middlewarePrefix) }}
              {{ $initialInterval := index $labels (printf "%sretry.initialinterval" $middlewarePrefix) }}
        initialInterval: {{ $initialInterval }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "stripprefix" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:165-166 */}}
      stripPrefix:
            {{ if hasKey $labels (printf "%sstripprefix.prefixes" $middlewarePrefix) }}
              {{ $prefixes := index $labels (printf "%sstripprefix.prefixes" $middlewarePrefix) }}
        prefixes:
              {{ $prefixList := split $prefixes "," }}
              {{ range $prefix := $prefixList }}
          - {{ trim $prefix " " }}
              {{ end }}
            {{ end }}
            
            {{ if hasKey $labels (printf "%sstripprefix.forceslash" $middlewarePrefix) }}
              {{ $forceSlash := index $labels (printf "%sstripprefix.forceslash" $middlewarePrefix) }}
              {{ if eq $forceSlash "true" }}
        forceSlash: true
              {{ end }}
            {{ end }}
          {{ end }}
          
          {{ if eq $type "stripprefixregex" }}
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:167 */}}
      stripPrefixRegex:
            {{ if hasKey $labels (printf "%sstripprefixregex.regex" $middlewarePrefix) }}
              {{ $regex := index $labels (printf "%sstripprefixregex.regex" $middlewarePrefix) }}
        regex:
              {{ $regexList := split $regex "," }}
              {{ range $r := $regexList }}
          - {{ trim $r " " }}
              {{ end }}
            {{ end }}
          {{ end }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    Check if we have any TCP configuration
    Source: pkg/provider/docker/config.go:51-58 - Checking for TCP configuration
  */}}
  {{ $hasTCPConfig := false }}
  {{ range $c := $enabledContainers }}
    {{ range $key, $value := $c.Labels }}
      {{ if or (hasPrefix $key "traefik.tcp.routers.") (hasPrefix $key "traefik.tcp.services.") (hasPrefix $key "traefik.tcp.middlewares.") }}
        {{ $hasTCPConfig = true }}
      {{ end }}
    {{ end }}
  {{ end }}

  {{ if $hasTCPConfig }}
tcp:
  {{/* 
    TCP Routers section
    Source: pkg/provider/docker/config.go:59-60 - BuildTCPRouterConfiguration is called
    Source: pkg/provider/provider.go - BuildTCPRouterConfiguration function builds router config from labels
  */}}
  {{ $allTCPRouterNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect router names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tcp labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.tcp.routers." }}
        {{ $withoutPrefix := trimPrefix "traefik.tcp.routers." $key }}
        {{ $routerName := index (split $withoutPrefix ".") 0 }}
        {{ if $routerName }}
          {{ $_ := set $allTCPRouterNames $routerName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{ if $allTCPRouterNames }}
  routers:
    {{ range $routerName, $container := $allTCPRouterNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $routerPrefix := printf "traefik.tcp.routers.%s." $routerName }}
      
    {{ $routerName }}:
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:237-251 */}}
      {{ if hasKey $labels (printf "%srule" $routerPrefix) }}
        {{ $rule := index $labels (printf "%srule" $routerPrefix) }}
      rule: {{ $rule }}
      {{ end }}
      
      {{ if hasKey $labels (printf "%sservice" $routerPrefix) }}
        {{ $service := index $labels (printf "%sservice" $routerPrefix) }}
      service: {{ $service }}
      {{ else }}
      service: {{ $containerName }}
      {{ end }}
      
      {{ if hasKey $labels (printf "%sentrypoints" $routerPrefix) }}
        {{ $entrypoints := index $labels (printf "%sentrypoints" $routerPrefix) }}
      entryPoints:
        {{ $eps := split $entrypoints "," }}
        {{ range $entrypoint := $eps }}
        - {{ trim $entrypoint " " }}
        {{ end }}
      {{ end }}
      
      {{ if hasKey $labels (printf "%smiddlewares" $routerPrefix) }}
        {{ $middlewares := index $labels (printf "%smiddlewares" $routerPrefix) }}
      middlewares:
        {{ $mws := split $middlewares "," }}
        {{ range $middleware := $mws }}
        - {{ trim $middleware " " }}
        {{ end }}
      {{ end }}
      
      {{ if hasKey $labels (printf "%spriority" $routerPrefix) }}
        {{ $priority := index $labels (printf "%spriority" $routerPrefix) }}
      priority: {{ $priority }}
      {{ end }}
      
      {{/* 
        TLS Configuration
        Source: pkg/provider/provider.go - BuildTCPRouterConfiguration handles TLS config
      */}}
      {{ $tlsEnabled := index $labels (printf "%stls" $routerPrefix) }}
      {{ $certResolver := index $labels (printf "%stls.certresolver" $routerPrefix) }}
      {{ $tlsOptions := index $labels (printf "%stls.options" $routerPrefix) }}
      {{ $passthrough := index $labels (printf "%stls.passthrough" $routerPrefix) }}
      
      {{/* 
        Parse domains
        Source: pkg/provider/provider.go - BuildTCPRouterConfiguration parses domain labels with array indices
      */}}
      {{ $domains := slice }}
      {{ $domainIndices := dict }}
      {{ range $key, $value := $labels }}
        {{ if hasPrefix $key (printf "%stls.domains" $routerPrefix) }}
          {{ $withoutPrefix := trimPrefix (printf "%stls.domains" $routerPrefix) $key }}
          {{ if regexMatch "^\\[([0-9]+)\\]\\.main$" $withoutPrefix }}
            {{ $index := regexReplaceAll "^\\[([0-9]+)\\]\\.main$" $withoutPrefix "$1" }}
            {{ $_ := set $domainIndices $index true }}
          {{ end }}
        {{ end }}
      {{ end }}
      
      {{ range $index, $_ := $domainIndices }}
        {{ $domain := dict }}
        {{ $mainKey := printf "%stls.domains[%s].main" $routerPrefix $index }}
        {{ $sansKey := printf "%stls.domains[%s].sans" $routerPrefix $index }}
        
        {{ if hasKey $labels $mainKey }}
          {{ $_ := set $domain "main" (index $labels $mainKey) }}
        {{ end }}
        
        {{ if hasKey $labels $sansKey }}
          {{ $sansValue := index $labels $sansKey }}
          {{ $sans := split $sansValue "," }}
          {{ $_ := set $domain "sans" $sans }}
        {{ end }}
        
        {{ $domains = append $domains $domain }}
      {{ end }}
      
      {{ if or (eq $tlsEnabled "true") $certResolver $domains $tlsOptions (eq $passthrough "true") }}
      tls:
        {{ if eq $tlsEnabled "true" }}
        {}
        {{ end }}
        {{ if $certResolver }}
        certResolver: {{ $certResolver }}
        {{ end }}
        {{ if $domains }}
        domains:
          {{ range $domain := $domains }}
          - main: {{ $domain.main }}
            {{ if $domain.sans }}
            sans:
              {{ range $san := $domain.sans }}
              - {{ trim $san " " }}
              {{ end }}
            {{ end }}
          {{ end }}
        {{ end }}
        {{ if $tlsOptions }}
        options: {{ $tlsOptions }}
        {{ end }}
        {{ if eq $passthrough "true" }}
        passthrough: true
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    TCP Services section
    Source: pkg/provider/docker/config.go:106-129 - buildTCPServiceConfiguration builds services
  */}}
  {{ $allTCPServiceNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect service names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tcp labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.tcp.services." }}
        {{ $withoutPrefix := trimPrefix "traefik.tcp.services." $key }}
        {{ $serviceName := index (split $withoutPrefix ".") 0 }}
        {{ if $serviceName }}
          {{ $_ := set $allTCPServiceNames $serviceName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
    
    {{/* 
      If no explicit services but TCP router exists, create default service
      Source: pkg/provider/docker/config.go:109-114 - Creates default service if none exists
    */}}
    {{ $hasTCPRouterLabels := false }}
    {{ $hasTCPServiceLabels := false }}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.tcp.routers." }}
        {{ $hasTCPRouterLabels = true }}
      {{ end }}
      {{ if hasPrefix $key "traefik.tcp.services." }}
        {{ $hasTCPServiceLabels = true }}
      {{ end }}
    {{ end }}
    {{ if and $hasTCPRouterLabels (not $hasTCPServiceLabels) }}
      {{ $_ := set $allTCPServiceNames $containerName $c }}
    {{ end }}
  {{ end }}
  
  {{ if $allTCPServiceNames }}
  services:
    {{ range $serviceName, $container := $allTCPServiceNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $servicePrefix := printf "traefik.tcp.services.%s." $serviceName }}
      {{ $containerPort := "" }}
      {{ if gt (len $container.Addresses) 0 }}
        {{ $containerPort = (index $container.Addresses 0).Port }}
      {{ end }}
      
    {{ $serviceName }}:
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:266-271 */}}
      loadBalancer:
        {{ if hasKey $labels (printf "%sloadbalancer.serverstransport" $servicePrefix) }}
          {{ $serversTransport := index $labels (printf "%sloadbalancer.serverstransport" $servicePrefix) }}
        serversTransport: {{ $serversTransport }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%sloadbalancer.proxyprotocol" $servicePrefix) }}
          {{ $proxyProtocol := index $labels (printf "%sloadbalancer.proxyprotocol" $servicePrefix) }}
          {{ if eq $proxyProtocol "true" }}
        proxyProtocol: {}
          {{ end }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%sloadbalancer.proxyprotocol.version" $servicePrefix) }}
          {{ $proxyProtocolVersion := index $labels (printf "%sloadbalancer.proxyprotocol.version" $servicePrefix) }}
        proxyProtocol:
          version: {{ $proxyProtocolVersion }}
        {{ end }}
        
        {{ if hasKey $labels (printf "%sloadbalancer.terminationdelay" $servicePrefix) }}
          {{ $terminationDelay := index $labels (printf "%sloadbalancer.terminationdelay" $servicePrefix) }}
        terminationDelay: {{ $terminationDelay }}
        {{ end }}
        
        {{ $serverPort := index $labels (printf "%sloadbalancer.server.port" $servicePrefix) }}
        {{ if not $serverPort }}{{ $serverPort = $containerPort }}{{ end }}
        
        {{ $serverTLS := index $labels (printf "%sloadbalancer.server.tls" $servicePrefix) }}
        
        servers:
          - address: {{ $containerName }}:{{ $serverPort }}
            {{ if eq $serverTLS "true" }}
            tls: {}
            {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    TCP Middlewares section
    Source: docs/content/reference/dynamic-configuration/docker-labels.yml:235-236 - TCP middleware labels
  */}}
  {{ $allTCPMiddlewareNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect middleware names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tcp labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.tcp.middlewares." }}
        {{ $withoutPrefix := trimPrefix "traefik.tcp.middlewares." $key }}
        {{ $middlewareName := index (split $withoutPrefix ".") 0 }}
        {{ if $middlewareName }}
          {{ $_ := set $allTCPMiddlewareNames $middlewareName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{ if $allTCPMiddlewareNames }}
  middlewares:
    {{ range $middlewareName, $container := $allTCPMiddlewareNames }}
      {{ $labels := $container.Labels }}
      {{ $middlewarePrefix := printf "traefik.tcp.middlewares.%s." $middlewareName }}
      
    {{ $middlewareName }}:
      {{/* Check for ipAllowList */}}
      {{ if hasKey $labels (printf "%sipallowlist.sourcerange" $middlewarePrefix) }}
        {{ $sourceRange := index $labels (printf "%sipallowlist.sourcerange" $middlewarePrefix) }}
      ipAllowList:
        sourceRange:
          {{ $rangeList := split $sourceRange "," }}
          {{ range $range := $rangeList }}
          - {{ trim $range " " }}
          {{ end }}
      {{ end }}
      
      {{/* Check for ipWhiteList */}}
      {{ if hasKey $labels (printf "%sipwhitelist.sourcerange" $middlewarePrefix) }}
        {{ $sourceRange := index $labels (printf "%sipwhitelist.sourcerange" $middlewarePrefix) }}
      ipWhiteList:
        sourceRange:
          {{ $rangeList := split $sourceRange "," }}
          {{ range $range := $rangeList }}
          - {{ trim $range " " }}
          {{ end }}
      {{ end }}
      
      {{/* Check for inflightConn */}}
      {{ if hasKey $labels (printf "%sinflightconn.amount" $middlewarePrefix) }}
        {{ $amount := index $labels (printf "%sinflightconn.amount" $middlewarePrefix) }}
      inflightConn:
        amount: {{ $amount }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* 
  Check if we have any UDP configuration
  Source: pkg/provider/docker/config.go:62-71 - Checking for UDP configuration
*/}}
{{ $hasUDPConfig := false }}
{{ range $c := $enabledContainers }}
  {{ range $key, $value := $c.Labels }}
    {{ if or (hasPrefix $key "traefik.udp.routers.") (hasPrefix $key "traefik.udp.services.") }}
      {{ $hasUDPConfig = true }}
    {{ end }}
  {{ end }}
{{ end }}

{{ if $hasUDPConfig }}
udp:
  {{/* 
    UDP Routers section
    Source: pkg/provider/docker/config.go:70-71 - BuildUDPRouterConfiguration is called
    Source: pkg/provider/provider.go - BuildUDPRouterConfiguration function builds router config from labels
  */}}
  {{ $allUDPRouterNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect router names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.udp labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.udp.routers." }}
        {{ $withoutPrefix := trimPrefix "traefik.udp.routers." $key }}
        {{ $routerName := index (split $withoutPrefix ".") 0 }}
        {{ if $routerName }}
          {{ $_ := set $allUDPRouterNames $routerName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{ if $allUDPRouterNames }}
  routers:
    {{ range $routerName, $container := $allUDPRouterNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $routerPrefix := printf "traefik.udp.routers.%s." $routerName }}
      
    {{ $routerName }}:
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:278-281 */}}
      {{ if hasKey $labels (printf "%sservice" $routerPrefix) }}
        {{ $service := index $labels (printf "%sservice" $routerPrefix) }}
      service: {{ $service }}
      {{ else }}
      service: {{ $containerName }}
      {{ end }}
      
      {{ if hasKey $labels (printf "%sentrypoints" $routerPrefix) }}
        {{ $entrypoints := index $labels (printf "%sentrypoints" $routerPrefix) }}
      entryPoints:
        {{ $eps := split $entrypoints "," }}
        {{ range $entrypoint := $eps }}
        - {{ trim $entrypoint " " }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{/* 
    UDP Services section
    Source: pkg/provider/docker/config.go:131-153 - buildUDPServiceConfiguration builds services
  */}}
  {{ $allUDPServiceNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $containerName := trimPrefix "/" $c.Name }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect service names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.udp labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.udp.services." }}
        {{ $withoutPrefix := trimPrefix "traefik.udp.services." $key }}
        {{ $serviceName := index (split $withoutPrefix ".") 0 }}
        {{ if $serviceName }}
          {{ $_ := set $allUDPServiceNames $serviceName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
    
    {{/* 
      If no explicit services but UDP router exists, create default service
      Source: pkg/provider/docker/config.go:134-139 - Creates default service if none exists
    */}}
    {{ $hasUDPRouterLabels := false }}
    {{ $hasUDPServiceLabels := false }}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.udp.routers." }}
        {{ $hasUDPRouterLabels = true }}
      {{ end }}
      {{ if hasPrefix $key "traefik.udp.services." }}
        {{ $hasUDPServiceLabels = true }}
      {{ end }}
    {{ end }}
    {{ if and $hasUDPRouterLabels (not $hasUDPServiceLabels) }}
      {{ $_ := set $allUDPServiceNames $containerName $c }}
    {{ end }}
  {{ end }}
  
  {{ if $allUDPServiceNames }}
  services:
    {{ range $serviceName, $container := $allUDPServiceNames }}
      {{ $containerName := trimPrefix "/" $container.Name }}
      {{ $labels := $container.Labels }}
      {{ $servicePrefix := printf "traefik.udp.services.%s." $serviceName }}
      {{ $containerPort := "" }}
      {{ if gt (len $container.Addresses) 0 }}
        {{ $containerPort = (index $container.Addresses 0).Port }}
      {{ end }}
      
    {{ $serviceName }}:
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:282 */}}
      loadBalancer:
        {{ $serverPort := index $labels (printf "%sloadbalancer.server.port" $servicePrefix) }}
        {{ if not $serverPort }}{{ $serverPort = $containerPort }}{{ end }}
        
        servers:
          - address: {{ $containerName }}:{{ $serverPort }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* 
  Check if we have any TLS configuration
  Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tls labels
*/}}
{{ $hasTLSConfig := false }}
{{ range $c := $enabledContainers }}
  {{ range $key, $value := $c.Labels }}
    {{ if hasPrefix $key "traefik.tls.stores." }}
      {{ $hasTLSConfig = true }}
    {{ end }}
  {{ end }}
{{ end }}

{{ if $hasTLSConfig }}
tls:
  {{/* 
    TLS Stores section
    Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tls.stores labels
  */}}
  {{ $allTLSStoreNames := dict }}
  {{ range $c := $enabledContainers }}
    {{ $labels := $c.Labels }}
    
    {{/* 
      Collect store names from this container
      Source: pkg/config/label/label.go:18-19 - DecodeConfiguration parses traefik.tls.stores labels
    */}}
    {{ range $key, $value := $labels }}
      {{ if hasPrefix $key "traefik.tls.stores." }}
        {{ $withoutPrefix := trimPrefix "traefik.tls.stores." $key }}
        {{ $storeName := index (split $withoutPrefix ".") 0 }}
        {{ if $storeName }}
          {{ $_ := set $allTLSStoreNames $storeName $c }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
  
  {{ if $allTLSStoreNames }}
  stores:
    {{ range $storeName, $container := $allTLSStoreNames }}
      {{ $labels := $container.Labels }}
      {{ $storePrefix := printf "traefik.tls.stores.%s." $storeName }}
      
    {{ $storeName }}:
      {{/* Source: docs/content/reference/dynamic-configuration/docker-labels.yml:272-277 */}}
      {{/* Default Generated Certificate */}}
      {{ $hasDGC := false }}
      {{ range $key, $value := $labels }}
        {{ if hasPrefix $key (printf "%sdefaultgeneratedcert." $storePrefix) }}
          {{ $hasDGC = true }}
        {{ end }}
      {{ end }}
      {{ if $hasDGC }}
      defaultGeneratedCert:
        {{ if hasKey $labels (printf "%sdefaultgeneratedcert.resolver" $storePrefix) }}
          {{ $resolver := index $labels (printf "%sdefaultgeneratedcert.resolver" $storePrefix) }}
        resolver: {{ $resolver }}
        {{ end }}
        
        {{/* Domain */}}
        {{ $hasDomain := false }}
        {{ range $key, $value := $labels }}
          {{ if hasPrefix $key (printf "%sdefaultgeneratedcert.domain." $storePrefix) }}
            {{ $hasDomain = true }}
          {{ end }}
        {{ end }}
        {{ if $hasDomain }}
        domain:
          {{ if hasKey $labels (printf "%sdefaultgeneratedcert.domain.main" $storePrefix) }}
            {{ $main := index $labels (printf "%sdefaultgeneratedcert.domain.main" $storePrefix) }}
          main: {{ $main }}
          {{ end }}
          
          {{ if hasKey $labels (printf "%sdefaultgeneratedcert.domain.sans" $storePrefix) }}
            {{ $sans := index $labels (printf "%sdefaultgeneratedcert.domain.sans" $storePrefix) }}
          sans:
            {{ $sansList := split $sans "," }}
            {{ range $san := $sansList }}
            - {{ trim $san " " }}
            {{ end }}
          {{ end }}
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}
```
