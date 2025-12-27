$root = Join-Path -Path $PSScriptRoot -ChildPath "..\dist\oss-frontend\browser"
if (-not (Test-Path $root)) {
  Write-Error "Dist folder not found: $root"
  exit 1
}
Get-ChildItem -Path $root -Recurse -File | ForEach-Object {
  $path = $_.FullName
  try {
    $text = Get-Content -Raw -Encoding UTF8 -ErrorAction Stop $path
  } catch {
    Write-Warning ("Failed reading {0}: {1}" -f $path, $_.Exception.Message)
    return
  }
  $new = $text -replace 'http://localhost:8080/api', 'http://localhost:9090/api'
  if ($new -ne $text) {
    Copy-Item -Path $path -Destination ($path + '.bak') -Force
    Set-Content -Path $path -Value $new -Encoding UTF8
    Write-Output "Patched: $path"
  }
}
Write-Output "Done patching dist files."