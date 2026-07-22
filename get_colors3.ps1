Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Equip\OneDrive\Desktop\MarketMyn\logo.png")
$colors = @{}
for ($x = 0; $x -lt $bmp.Width; $x += 5) {
    for ($y = 0; $y -lt $bmp.Height; $y += 5) {
        $color = $bmp.GetPixel($x, $y)
        if ($color.A -gt 50 -and -not ($color.R -gt 230 -and $color.G -gt 230 -and $color.B -gt 230)) {
            $r = [int]([math]::Round($color.R / 32) * 32)
            $g = [int]([math]::Round($color.G / 32) * 32)
            $b = [int]([math]::Round($color.B / 32) * 32)
            $r = [math]::Min($r, 255)
            $g = [math]::Min($g, 255)
            $b = [math]::Min($b, 255)
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $r, $g, $b
            if (-not $colors.ContainsKey($hex)) {
                $colors[$hex] = 0
            }
            $colors[$hex]++
        }
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | Format-Table -AutoSize
