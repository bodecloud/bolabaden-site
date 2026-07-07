---
source_url: "https://grok.com/c/bc0f5760-f547-43d9-a6e0-1940e5bcaf0f"
conversation_id: "bc0f5760-f547-43d9-a6e0-1940e5bcaf0f"
title: "PowerShell Script for Git Submodule Updates"
extracted_at: "2026-06-29T16:33:08.336Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# PowerShell Script for Git Submodule Updates

Source: [Grok conversation](https://grok.com/c/bc0f5760-f547-43d9-a6e0-1940e5bcaf0f)

## User

_Time: 2025-11-10T08:42:18.464Z_

Please fix in my script (attached)

## Assistant

_Time: 2025-11-10T08:42:35.137Z_



## User

_Time: 2025-11-10T08:43:12.343Z_

Please fix in my script (attached). DO NOT search the web for this task. Constrain your response to be the full exhaustive comprehensive script with no additional text.

## Assistant

_Time: 2025-11-10T08:43:15.819Z_



## User

_Time: 2025-11-10T08:43:21.008Z_

Please fix in my script (attached). DO NOT search the web for this task. Constrain your response to be the full exhaustive comprehensive script with no additional text.

## Assistant

_Time: 2025-11-10T08:44:11.288Z_

```powershell
#!/usr/bin/env pwsh

# Script to update all submodules in the repository without hardcoding per-module logic

Set-StrictMode -Version Latest

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Invoke-Command {
    param(
        [Parameter(Mandatory = $true)] [string] $Tool,
        [Parameter()] [string[]] $Arguments = @()
    )

    try {
        $output = & $Tool @Arguments 2>&1
        $exitCode = $LASTEXITCODE
        return [PSCustomObject]@{
            ExitCode = $exitCode
            Output   = if ($null -eq $output) { @() } elseif ($output -is [System.Array]) { $output } else { @($output) }
        }
    } catch {
        return [PSCustomObject]@{
            ExitCode = 1
            Output   = @($_.Exception.Message)
        }
    }
}

function Get-SubmodulePaths {
    $result = Invoke-Command -Tool 'git' -Arguments @('config', '--file', '.gitmodules', '--get-regexp', 'path')
    if ($result.ExitCode -ne 0) {
        Write-WarningMessage "Unable to read .gitmodules (git exit code $($result.ExitCode))."
        return @()
    }

    $paths = @()
    foreach ($line in $result.Output) {
        if (-not [string]::IsNullOrWhiteSpace($line)) {
            $splitIndex = $line.LastIndexOf(' ')
            if ($splitIndex -ge 0 -and $splitIndex -lt ($line.Length - 1)) {
                $paths += $line.Substring($splitIndex + 1).Trim()
            }
        }
    }
    return ($paths | Where-Object { $_ } | Select-Object -Unique)
}

function Get-RepoIdentifierFromUrl {
    param([string]$Url)
    if (-not $Url) { return $null }

    $regex = [regex]'github\.com[:\/](?<owner>[^\/]+)\/(?<repo>[^\/]+?)(?:\.git)?$'
    $match = $regex.Match($Url)
    if ($match.Success) {
        $owner = $match.Groups['owner'].Value
        $repo  = $match.Groups['repo'].Value
        return "$owner/$repo"
    }
    return $null
}

function Get-UpstreamUrl {
    param(
        [string]$OriginUrl,
        [string]$ParentFullName
    )
    if (-not $ParentFullName) { return $null }

    if ($OriginUrl -like 'git@github.com:*') {
        return "git@github.com:$ParentFullName.git"
    }
    return "https://github.com/$ParentFullName.git"
}

function Get-ForkInfo {
    param(
        [string]$RepoIdentifier,
        [bool]$GhAvailable,
        [string]$OriginUrl
    )

    $info = [PSCustomObject]@{
        IsFork             = $false
        ParentFullName     = $null
        ParentDefaultBranch = $null
        UpstreamUrl        = $null
    }

    if (-not $GhAvailable -or -not $RepoIdentifier) { return $info }

    $ghResult = Invoke-Command -Tool 'gh' -Arguments @('api', "repos/$RepoIdentifier")
    if ($ghResult.ExitCode -ne 0) {
        Write-WarningMessage "  Unable to query GitHub for fork information (gh exit code $($ghResult.ExitCode))."
        return $info
    }

    try {
        $repoInfo = ($ghResult.Output | Out-String | ConvertFrom-Json)
    } catch {
        Write-WarningMessage "  Received invalid JSON from GitHub CLI when checking fork info."
        return $info
    }

    if (-not $repoInfo.fork) { return $info }
    if (-not $repoInfo.parent) {
        Write-WarningMessage "  This repository is flagged as a fork but the upstream metadata is unavailable (possibly deleted)."
        return $info
    }

    $parentFullName = $repoInfo.parent.full_name
    if (-not $parentFullName) {
        Write-WarningMessage "  Unable to determine parent repository name for fork."
        return $info
    }

    $info.IsFork             = $true
    $info.ParentFullName     = $parentFullName
    $info.ParentDefaultBranch = $repoInfo.parent.default_branch
    $info.UpstreamUrl        = Get-UpstreamUrl -OriginUrl $OriginUrl -ParentFullName $parentFullName
    return $info
}

function Resolve-TargetBranch {
    param(
        [string]$CurrentBranch,
        [string]$RemoteHead,
        [string[]]$AvailableRemoteBranches
    )

    $preferredBranches = @()
    if ($CurrentBranch) { $preferredBranches += $CurrentBranch }
    if ($RemoteHead)    { $preferredBranches += $RemoteHead }
    $preferredBranches += @('main', 'master')

    foreach ($candidate in $preferredBranches | Where-Object { $_ }) {
        if ($AvailableRemoteBranches -contains "origin/$candidate") {
            return $candidate
        }
    }
    return $null
}

function Get-RemoteHeadBranch {
    $remoteShow = Invoke-Command -Tool 'git' -Arguments @('remote', 'show', 'origin')
    if ($remoteShow.ExitCode -ne 0) { return $null }

    foreach ($line in $remoteShow.Output) {
        if ($line -match 'HEAD branch:\s*(\S+)') {
            return $Matches[1]
        }
    }
    return $null
}

function Set-Branch {
    param([string]$BranchName)

    $currentBranchResult = Invoke-Command -Tool 'git' -Arguments @('branch', '--show-current')
    $currentBranch = ($currentBranchResult.Output | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 1)

    if ($currentBranch -eq $BranchName) { return $true }

    $checkoutResult = Invoke-Command -Tool 'git' -Arguments @('checkout', $BranchName)
    if ($checkoutResult.ExitCode -eq 0) { return $true }

    $createResult = Invoke-Command -Tool 'git' -Arguments @('checkout', '-B', $BranchName, "origin/$BranchName")
    if ($createResult.ExitCode -eq 0) { return $true }

    Write-WarningMessage "  Unable to switch to branch '$BranchName'."
    return $false
}

function Get-RemoteBranches {
    $result = Invoke-Command -Tool 'git' -Arguments @('ls-remote', '--heads', 'origin')
    if ($result.ExitCode -ne 0) {
        Write-WarningMessage "  Unable to list remote branches from origin (git exit code $($result.ExitCode))."
        return @()
    }

    $branches = @()
    foreach ($line in $result.Output) {
        if (-not [string]::IsNullOrWhiteSpace($line)) {
            $parts = $line -split '\t'
            if ($parts.Count -ge 2 -and $parts[1] -match '^refs/heads/(.+)$') {
                $branches += "origin/$($Matches[1])"
            }
        }
    }
    return $branches
}

function Update-FromOrigin {
    param([string]$BranchName)

    $fetchResult = Invoke-Command -Tool 'git' -Arguments @('fetch', 'origin', $BranchName)
    if ($fetchResult.ExitCode -ne 0) {
        Write-WarningMessage "  Failed to fetch origin/$BranchName (git exit code $($fetchResult.ExitCode))."
        return $false
    }

    $pullResult = Invoke-Command -Tool 'git' -Arguments @('pull', '--ff-only', 'origin', $BranchName)
    if ($pullResult.ExitCode -ne 0) {
        Write-WarningMessage "  Unable to fast-forward with origin/$BranchName (git exit code $($pullResult.ExitCode))."
        return $false
    }

    if (($pullResult.Output | Out-String).Trim() -eq 'Already up to date.') {
        Write-Info "  Origin already up to date for branch '$BranchName'."
    } else {
        Write-Success "  Updated from origin/$BranchName."
    }
    return $true
}

function Update-FromUpstream {
    param(
        [string]$TempRemoteName,
        [string]$UpstreamUrl,
        [string]$TargetBranch
    )

    $addRemote = Invoke-Command -Tool 'git' -Arguments @('remote', 'add', $TempRemoteName, $UpstreamUrl)
    if ($addRemote.ExitCode -ne 0) {
        $setRemote = Invoke-Command -Tool 'git' -Arguments @('remote', 'set-url', $TempRemoteName, $UpstreamUrl)
        if ($setRemote.ExitCode -ne 0) {
            Write-WarningMessage "  Unable to add temporary upstream remote ($UpstreamUrl)."
            return $false
        }
    }

    $fetchResult = Invoke-Command -Tool 'git' -Arguments @('fetch', $TempRemoteName, $TargetBranch)
    if ($fetchResult.ExitCode -ne 0) {
        Write-WarningMessage "  Failed to fetch $TargetBranch from upstream ($UpstreamUrl)."
        return $false
    }

    $mergeRef = "$TempRemoteName/$TargetBranch"
    $revParse = Invoke-Command -Tool 'git' -Arguments @('rev-parse', $mergeRef)
    if ($revParse.ExitCode -ne 0) {
        Write-WarningMessage "  Upstream branch '$TargetBranch' does not exist."
        return $false
    }

    $upToDateCheck = Invoke-Command -Tool 'git' -Arguments @('merge-base', '--is-ancestor', $mergeRef, 'HEAD')
    if ($upToDateCheck.ExitCode -eq 0) {
        Write-Info "  Upstream changes are already present locally."
        return $true
    }

    $canFastForward = Invoke-Command -Tool 'git' -Arguments @('merge-base', '--is-ancestor', 'HEAD', $mergeRef)
    if ($canFastForward.ExitCode -eq 0) {
        $ffMerge = Invoke-Command -Tool 'git' -Arguments @('merge', '--ff-only', $mergeRef)
        if ($ffMerge.ExitCode -ne 0) {
            Write-WarningMessage "  Unable to fast-forward to upstream/$TargetBranch."
            return $false
        }
        Write-Success "  Fast-forwarded to match upstream/$TargetBranch."
        return $true
    }

    $testMerge = Invoke-Command -Tool 'git' -Arguments @('merge', '--no-commit', '--no-ff', $mergeRef)
    if ($testMerge.ExitCode -ne 0) {
        Invoke-Command -Tool 'git' -Arguments @('merge', '--abort') | Out-Null
        Write-WarningMessage "  Conflicts detected when merging upstream/$TargetBranch. Skipping."
        return $false
    }

    Invoke-Command -Tool 'git' -Arguments @('merge', '--abort') | Out-Null
    $fullMerge = Invoke-Command -Tool 'git' -Arguments @('merge', '--no-ff', '--no-edit', $mergeRef)
    if ($fullMerge.ExitCode -ne 0) {
        Invoke-Command -Tool 'git' -Arguments @('merge', '--abort') | Out-Null
        Write-WarningMessage "  Merge with upstream/$TargetBranch failed. Skipping."
        return $false
    }

    Write-Success "  Merged upstream/$TargetBranch without conflicts."
    return $true
}

# Main script execution
Write-Info "Updating all submodules..."

$ghAvailable = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
if (-not $ghAvailable) {
    Write-WarningMessage "GitHub CLI (gh) is not available; fork detection will be limited."
}

$submodules = Get-SubmodulePaths
if ($submodules.Count -eq 0) {
    Write-WarningMessage "No submodules found in this repository."
    exit 0
}

Write-Info "Found $($submodules.Count) submodule(s): $($submodules -join ', ')"

$updatedCount = 0
$skippedCount = 0
$failedCount  = 0

foreach ($submodule in $submodules) {
    Write-Info "Updating submodule: $submodule"

    if (-not (Test-Path $submodule)) {
        Write-WarningMessage "  Submodule path '$submodule' does not exist locally. Skipping."
        $skippedCount++
        continue
    }

    try {
        Push-Location $submodule
    } catch {
        Write-WarningMessage "  Unable to enter submodule directory '$submodule'. Skipping."
        $skippedCount++
        continue
    }

    try {
        $originUrlResult = Invoke-Command -Tool 'git' -Arguments @('config', '--get', 'remote.origin.url')
        $originUrl = ($originUrlResult.Output | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 1)

        if (-not $originUrl) {
            Write-WarningMessage "  Unable to determine origin URL for submodule. Skipping."
            $skippedCount++
            continue
        }

        $repoIdentifier   = Get-RepoIdentifierFromUrl -Url $originUrl
        $remoteBranches   = Get-RemoteBranches
        if ($remoteBranches.Count -eq 0) {
            Write-WarningMessage "  No remote branches detected on origin. Skipping."
            $skippedCount++
            continue
        }

        $currentBranchResult = Invoke-Command -Tool 'git' -Arguments @('branch', '--show-current')
        $currentBranch = ($currentBranchResult.Output | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 1)
        $remoteHead    = Get-RemoteHeadBranch
        $targetBranch  = Resolve-TargetBranch -CurrentBranch $currentBranch -RemoteHead $remoteHead -AvailableRemoteBranches $remoteBranches

        if (-not $targetBranch) {
            Write-WarningMessage "  Unable to determine a branch to update. Skipping."
            $skippedCount++
            continue
        }

        if (-not (Set-Branch -BranchName $targetBranch)) {
            $skippedCount++
            continue
        }

        if (-not (Update-FromOrigin -BranchName $targetBranch)) {
            $skippedCount++
            continue
        }

        $forkInfo = Get-ForkInfo -RepoIdentifier $repoIdentifier -GhAvailable $ghAvailable -OriginUrl $originUrl
        $upstreamUpdated = $false

        if ($forkInfo.IsFork -and $forkInfo.UpstreamUrl) {
            $upstreamBranch = if ($forkInfo.ParentDefaultBranch) { $forkInfo.ParentDefaultBranch } else { $targetBranch }
            $tempRemoteName = '__update_submodules_upstream__'

            try {
                $upstreamUpdated = Update-FromUpstream -TempRemoteName $tempRemoteName -UpstreamUrl $forkInfo.UpstreamUrl -TargetBranch $upstreamBranch
                if ($upstreamUpdated) {
                    $pushResult = Invoke-Command -Tool 'git' -Arguments @('push', 'origin', $targetBranch)
                    if ($pushResult.ExitCode -ne 0) {
                        Write-WarningMessage "  Failed to push updates back to origin for branch '$targetBranch'."
                        $upstreamUpdated = $false
                    } else {
                        Write-Success "  Pushed fork updates to origin/$targetBranch."
                    }
                }
            } finally {
                Invoke-Command -Tool 'git' -Arguments @('remote', 'remove', $tempRemoteName) | Out-Null
            }

            if (-not $upstreamUpdated) {
                Write-WarningMessage "  Fork update skipped for '$submodule'."
            }
        }

        $updatedCount++
    } catch {
        Write-ErrorMessage "  Unexpected error: $($_.Exception.Message). Skipping submodule '$submodule'."
        $failedCount++
    } finally {
        Pop-Location
    }
}

Write-Info "Submodule update summary:"
Write-Success "  Updated: $updatedCount"
Write-WarningMessage "  Skipped: $skippedCount"
if ($failedCount -gt 0) {
    Write-ErrorMessage "  Failed: $failedCount"
    exit 1
} else {
    Write-Info "  Failed: $failedCount"
}
Write-Success "✓ Submodule processing completed."
```
