$url = "https://labs.google/fx/api/og-image/shared/7fb4d421-b380-49e1-9fbd-1fd2b82ab5aa"
$imgFile = "temp_img.jpg"
Invoke-WebRequest -Uri $url -OutFile $imgFile
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($imgFile)
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
Remove-Item $imgFile
