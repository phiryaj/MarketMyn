Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Equip\OneDrive\Desktop\MarketMyn\logo.png")
$colors = @{}
for ($x = 0; $x -lt $bmp.Width; $x += 10) {
    for ($y = 0; $y -lt $bmp.Height; $y += 10) {
        $color = $bmp.GetPixel($x, $y)
        if ($color.A -gt 100 -and -not ($color.R -gt 240 -and $color.G -gt 240 -and $color.B -gt 240)) {
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $color.R, $color.G, $color.B
            if (-not $colors.ContainsKey($hex)) {
                $colors[$hex] = 0
            }
            $colors[$hex]++
        }
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5 | Format-Table -AutoSize
