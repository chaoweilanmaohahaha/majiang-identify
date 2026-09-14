# Fetch and normalize 42 mahjong tile PNGs into src/static/mahjong/
# Sources:
#   - 34 tiles (wan/tiao/tong/feng/dragons): samoheen/mahjong-tiles (Hong Kong set, Public Domain)
#     https://github.com/samoheen/mahjong-tiles
#   - 8 flower tiles (chun/xia/qiu/dong/mei/lan/zhu/ju): Cangjie6 SVG Oblique set
#     (Wikimedia Commons, CC BY-SA 4.0, see ATTRIBUTION.md)
# Run: powershell -ExecutionPolicy Bypass -File scripts/fetch-tiles.ps1 [-Proxy http://127.0.0.1:6789]

param(
    [string]$Proxy = "http://127.0.0.1:6789"
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = [System.IO.Path]::GetFullPath((Join-Path $scriptDir "..\src\static\mahjong"))
if (-not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$base = "https://raw.githubusercontent.com/samoheen/mahjong-tiles/master/hongkong/png"

$map = @{
    "zhong"     = "03-red-dragon.png"
    "fa"        = "02-green-dragon.png"
    "bai"       = "01-white-dragon.png"
    "feng_dong" = "04-east-wind.png"
    "feng_nan"  = "05-south-wind.png"
    "feng_xi"   = "06-west-wind.png"
    "feng_bei"  = "07-north-wind.png"
}
for ($i = 1; $i -le 9; $i++) {
    $map["wan_$i"] = ("{0:d2}-characters-{1}.png" -f (7 + $i), $i)
    $map["tong_$i"] = ("{0:d2}-circles-{1}.png" -f (16 + $i), $i)
    $map["tiao_$i"] = ("{0:d2}-bamboos-{1}.png" -f (25 + $i), $i)
}

# Flower tiles from Cangjie6 oblique SVG set (rendered to PNG via Commons thumbnail service)
$flowerMap = @{
    "chun" = "MJh1-.svg"
    "xia"  = "MJh2-.svg"
    "qiu"  = "MJh3-.svg"
    "dong" = "MJh4-.svg"
    "mei"  = "MJh5-.svg"
    "lan"  = "MJh6-.svg"
    "zhu"  = "MJh8-.svg"
    "ju"   = "MJh7-.svg"
}

$TARGET_W = 200
$TARGET_H = 280

$tmp = Join-Path $env:TEMP ("mj-tiles-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

function Download-File([string]$url, [string]$dest) {
    for ($attempt = 1; $attempt -le 5; $attempt++) {
        if ($Proxy) {
            curl.exe -s --proxy $Proxy -o $dest $url
        } else {
            curl.exe -s -o $dest $url
        }
        if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $dest) -and (Get-Item -LiteralPath $dest).Length -gt 0) {
            return
        }
        Start-Sleep -Seconds 3
    }
    throw "download failed: $url"
}

try {
    foreach ($entry in $map.GetEnumerator() | Sort-Object Name) {
        $srcUrl = "$base/$($entry.Value)"
        $tmpFile = Join-Path $tmp $entry.Value
        Download-File $srcUrl $tmpFile

        $srcImg = [System.Drawing.Image]::FromFile($tmpFile)
        $bmp = New-Object System.Drawing.Bitmap($TARGET_W, $TARGET_H)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $g.DrawImage($srcImg, 0, 0, $TARGET_W, $TARGET_H)
        $g.Dispose()

        $outFile = Join-Path $outDir ($entry.Key + ".png")
        $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        $srcImg.Dispose()

        Write-Output ("saved " + $outFile)
    }

    # Flower tiles: render via Commons thumbnail service, then center onto target canvas
    foreach ($entry in $flowerMap.GetEnumerator() | Sort-Object Name) {
        $srcUrl = "https://commons.wikimedia.org/w/thumb.php?f=$($entry.Value)&w=$TARGET_W"
        $tmpFile = Join-Path $tmp $entry.Value
        Download-File $srcUrl $tmpFile

        $srcImg = [System.Drawing.Image]::FromFile($tmpFile)
        $bmp = New-Object System.Drawing.Bitmap($TARGET_W, $TARGET_H)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $dy = [int](($TARGET_H - $srcImg.Height) / 2)
        $g.DrawImage($srcImg, 0, $dy, $srcImg.Width, $srcImg.Height)
        $g.Dispose()

        $outFile = Join-Path $outDir ($entry.Key + ".png")
        $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        $srcImg.Dispose()

        Write-Output ("saved " + $outFile)
    }
} finally {
    Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output "done"
