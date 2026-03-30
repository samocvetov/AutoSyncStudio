$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$version = (Get-Content (Join-Path $root "VERSION") -Raw).Trim()
$goWinres = "C:\Users\sysop\go\bin\go-winres.exe"
$icon = Join-Path $root "build\windows\icon.png"

if (-not (Test-Path $goWinres)) {
  throw "go-winres not found at $goWinres"
}

if (-not (Test-Path $icon)) {
  throw "Icon not found at $icon"
}

function Write-WinResources {
  param(
    [string]$TargetDir,
    [string]$Description,
    [string]$OriginalFilename
  )

  $winresDir = Join-Path $TargetDir "winres"
  $targetIcon = Join-Path $winresDir "icon.png"
  $targetIcon16 = Join-Path $winresDir "icon16.png"
  $jsonPath = Join-Path $winresDir "winres.json"

  New-Item -ItemType Directory -Force -Path $winresDir | Out-Null

  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($icon)
  $bmp256 = New-Object System.Drawing.Bitmap 256,256
  $graphics256 = [System.Drawing.Graphics]::FromImage($bmp256)
  $graphics256.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics256.DrawImage($img, 0, 0, 256, 256)
  $bmp256.Save($targetIcon, [System.Drawing.Imaging.ImageFormat]::Png)

  $bmp16 = New-Object System.Drawing.Bitmap 16,16
  $graphics = [System.Drawing.Graphics]::FromImage($bmp16)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($img, 0, 0, 16, 16)
  $bmp16.Save($targetIcon16, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics256.Dispose()
  $bmp256.Dispose()
  $graphics.Dispose()
  $bmp16.Dispose()
  $img.Dispose()

  $json = @"
{
  "RT_GROUP_ICON": {
    "#3": {
      "0000": [
        "icon.png",
        "icon16.png"
      ]
    }
  },
  "RT_MANIFEST": {
    "#1": {
      "0409": {
        "execution-level": "as invoker",
        "dpi-awareness": "permonitorv2",
        "use-common-controls-v6": true
      }
    }
  },
  "RT_VERSION": {
    "#1": {
      "0000": {
        "fixed": {
          "file_version": "$version",
          "product_version": "$version"
        },
        "info": {
          "0409": {
            "FileDescription": "$Description",
            "OriginalFilename": "$OriginalFilename",
            "ProductName": "AutoSync Studio",
            "FileVersion": "$version",
            "ProductVersion": "$version"
          }
        }
      }
    }
  }
}
"@
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($jsonPath, $json, $utf8NoBom)

  Push-Location $TargetDir
  try {
    & $goWinres make --in .\winres\winres.json --out rsrc | Out-Host
  } finally {
    Pop-Location
  }
}

Push-Location $root
try {
  Write-WinResources -TargetDir (Join-Path $root "cmd\studio-desktop") -Description "AutoSync Studio Desktop" -OriginalFilename "AutoSyncStudioDesktop.exe"
  Write-WinResources -TargetDir (Join-Path $root "cmd\render-server-desktop") -Description "AutoSync Studio Render Server" -OriginalFilename "AutoSyncRenderServerDesktop.exe"
} finally {
  Pop-Location
}
