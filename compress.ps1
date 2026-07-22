Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem -Filter promo_*.png
foreach ($img in $images) {
    $bmp = [System.Drawing.Bitmap]::new($img.FullName)
    $newPath = $img.FullName -replace '\.png$', '.jpg'
    
    # Set up JPEG compression (Quality: 60)
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 60)
    
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    $bmp.Save($newPath, $jpegCodec, $encoderParams)
    $bmp.Dispose()
    
    Remove-Item $img.FullName
}
