---
source_url: "https://grok.com/c/65c9ffec-31a2-44f9-b49b-c19ed0ddc781"
conversation_id: "65c9ffec-31a2-44f9-b49b-c19ed0ddc781"
title: "PowerShell URL Download Fix with Redirects"
extracted_at: "2026-06-29T16:25:43.693Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# PowerShell URL Download Fix with Redirects

Source: [Grok conversation](https://grok.com/c/65c9ffec-31a2-44f9-b49b-c19ed0ddc781)

## User

_Time: 2025-08-10T06:20:59.776Z_

$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination)
        try {
            $filename = Split-Path $url -Leaf
            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url"
            Invoke-WebRequest -Uri $url -OutFile $output
            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url"
        }
    } -ArgumentList $url, $destination
}
# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
        }
    }
    Start-Sleep -Milliseconds 500
    $jobs = $jobs | Where-Object { $_.State -eq 'Running' }
}
 
 
please fix the problem where it's not downloading correctly, e.g.
 

```
https://real-debrid.com/d/TQIRWV47YNVJK32B
https://real-debrid.com/d/VARHCET3E425YC6B
https://real-debrid.com/d/IV7E7RF7FTI2CCEF
```

trying to download urls.txt like the above, i get the following downloads that are not correct
 

```
TQIRWV47YNVJK32B
VARHCET3E425YC6B
IV7E7RF7FTI2CCEF
```

when opening the urls in my browser i get a .mp4 download an the actaul real name of the file. please fix the powershell script to properly do what we need it to do

## Assistant

_Time: 2025-08-10T06:25:45.608Z_

$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

# Provide your Real-Debrid username and password here for authentication
$username = "your_username"
$password = "your_password"

$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination, $username, $password)
        try {
            # Create a session to maintain cookies
            $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

            # Perform login to obtain authentication cookies
            $loginUrl = "https://real-debrid.com/login"
            $body = @{
                user = $username
                pass = $password
            }
            Invoke-WebRequest -Uri $loginUrl -Method Post -Body $body -WebSession $session | Out-Null

            # Use HEAD request to retrieve headers, including Content-Disposition for the actual filename
            $response = Invoke-WebRequest -Uri $url -Method Head -WebSession $session

            # Default to URL leaf if no Content-Disposition is found
            $filename = Split-Path $url -Leaf
            if ($response.Headers['Content-Disposition']) {
                $contentDisposition = $response.Headers['Content-Disposition']
                if ($contentDisposition -match 'filename="?([^"]+)"?') {
                    $filename = $matches[1]
                }
            }

            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url to $filename"

            # Download the file using the authenticated session
            Invoke-WebRequest -Uri $url -OutFile $output -WebSession $session

            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url - Error: $($_.Exception.Message)"
        }
    } -ArgumentList $url, $destination, $username, $password
}

# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    $completedJobs = @()
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
            $completedJobs += $job
        }
    }
    $jobs = $jobs | Where-Object { $jobs -notcontains $_ -or $_.State -eq 'Running' }
    Start-Sleep -Milliseconds 500
}

## User

_Time: 2025-08-10T07:53:40.416Z_

$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination)
        try {
            $filename = Split-Path $url -Leaf
            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url"
            Invoke-WebRequest -Uri $url -OutFile $output
            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url"
        }
    } -ArgumentList $url, $destination
}
# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
        }
    }
    Start-Sleep -Milliseconds 500
    $jobs = $jobs | Where-Object { $_.State -eq 'Running' }
}
 
 
please fix the problem where it's not downloading correctly, e.g.
 

```
https://real-debrid.com/d/TQIRWV47YNVJK32B
https://real-debrid.com/d/VARHCET3E425YC6B
https://real-debrid.com/d/IV7E7RF7FTI2CCEF
```

trying to download urls.txt like the above, i get the following downloads that are not correct
 

```
TQIRWV47YNVJK32B
VARHCET3E425YC6B
IV7E7RF7FTI2CCEF
```

when opening the urls in my browser i get a .mp4 download an the actaul real name of the file. please fix the powershell script to properly do what we need it to do

note: absolutely zero login or authentication is required for these urls.

## Assistant

_Time: 2025-08-10T07:54:27.457Z_



## User

_Time: 2025-08-10T07:54:41.325Z_

$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination)
        try {
            $filename = Split-Path $url -Leaf
            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url"
            Invoke-WebRequest -Uri $url -OutFile $output
            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url"
        }
    } -ArgumentList $url, $destination
}
# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
        }
    }
    Start-Sleep -Milliseconds 500
    $jobs = $jobs | Where-Object { $_.State -eq 'Running' }
}
 
 
please fix the problem where it's not downloading correctly, e.g.
 

```
https://real-debrid.com/d/TQIRWV47YNVJK32B
https://real-debrid.com/d/VARHCET3E425YC6B
https://real-debrid.com/d/IV7E7RF7FTI2CCEF
```

trying to download urls.txt like the above, i get the following downloads that are not correct
 

```
TQIRWV47YNVJK32B
VARHCET3E425YC6B
IV7E7RF7FTI2CCEF
```

when opening the urls in my browser i get a .mp4 download an the actaul real name of the file. please fix the powershell script to properly do what we need it to do

note: absolutely zero login or authentication is required for these urls.

literally all i need it to do is redirect and function accordingly like the browser would otherwise do....

## Assistant

_Time: 2025-08-10T07:54:51.187Z_



## User

_Time: 2025-08-10T07:56:28.388Z_

$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination)
        try {
            $filename = Split-Path $url -Leaf
            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url"
            Invoke-WebRequest -Uri $url -OutFile $output
            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url"
        }
    } -ArgumentList $url, $destination
}
# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
        }
    }
    Start-Sleep -Milliseconds 500
    $jobs = $jobs | Where-Object { $_.State -eq 'Running' }
}
 
 
please fix the problem where it's not downloading correctly, e.g.
 

```
https://real-debrid.com/d/TQIRWV47YNVJK32B
https://real-debrid.com/d/VARHCET3E425YC6B
https://real-debrid.com/d/IV7E7RF7FTI2CCEF
```

trying to download urls.txt like the above, i get the following downloads that are not correct
 

```
TQIRWV47YNVJK32B
VARHCET3E425YC6B
IV7E7RF7FTI2CCEF
```

when opening the urls in my browser i get expected functionality: a .mp4 download and the correct filename and correct size. please fix the powershell script to properly do what we need it to do. again currently powershell script is not downloading the correct filename, it is not redirecting to where the download actually is, etc. in other words ensure the powershell script is high level grabbing the URLs handling redirects and any weird things the browser would otherwise handle, high level.

note: absolutely zero login or authentication is required for these urls.

literally all i need it to do is redirect and function accordingly like the browser would otherwise do....

## Assistant

_Time: 2025-08-10T08:05:22.600Z_

```powershell
$urls = Get-Content ".\urls.txt"
$destination = ".\downloads"
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$jobs = @()
foreach ($url in $urls) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $destination)
        $userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        $headers = @{"User-Agent" = $userAgent}
        try {
            # Get headers to determine the correct filename
            $headResponse = Invoke-WebRequest -Uri $url -Method Head -Headers $headers -MaximumRedirection 10
            $filename = [System.IO.Path]::GetFileName($headResponse.BaseResponse.ResponseUri.AbsolutePath)
            if ($headResponse.Headers['Content-Disposition']) {
                $cd = $headResponse.Headers['Content-Disposition']
                if ($cd -match 'filename="?([^";]+)"?') {
                    $filename = $matches[1].Trim()
                }
            }
            if ([string]::IsNullOrWhiteSpace($filename)) {
                $filename = Split-Path $url -Leaf + ".mp4"  # Fallback with .mp4 extension if needed
            }
            $output = Join-Path $destination $filename
            Write-Host "Downloading: $url to $filename"
            # Download the file with proper headers to handle redirects and browser-like behavior
            Invoke-WebRequest -Uri $url -OutFile $output -Headers $headers -MaximumRedirection 10
            Write-Host "✅ Completed: $filename"
        } catch {
            Write-Host "❌ Failed: $url - $($_.Exception.Message)"
        }
    } -ArgumentList $url, $destination
}
# Monitor jobs in real time
while ($jobs.Count -gt 0) {
    foreach ($job in $jobs) {
        if ($job.State -eq 'Completed' -or $job.State -eq 'Failed') {
            Receive-Job $job
            Remove-Job $job
        }
    }
    Start-Sleep -Milliseconds 500
    $jobs = $jobs | Where-Object { $_.State -eq 'Running' }
}
```
