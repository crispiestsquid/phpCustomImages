<?php

$string = $_GET['text'];

$hexColor = $_GET['color'];

$colorR = hexdec(substr($hexColor, 0, 2));

$colorG = hexdec(substr($hexColor, 2, 2));

$colorB = hexdec(substr($hexColor, 4, 2));

$size = $_GET['size'];

$font = "fonts/{$_GET['font']}.ttf";

$fname = $_GET['fname'];

$ext = $_GET['ext'];

$image = "images/{$fname}.{$ext}";

$xoffset = $_GET['x'];

$yoffset = $_GET['y'];

/*$myfile = fopen("images/newfile.txt", "w") or die("Unable to open file!");
$txt = "Hex: " . $hexColor . "\n";
fwrite($myfile, $txt);
$txt = "R: " . $colorR . "\n";
fwrite($myfile, $txt);
$txt = "G: " . $colorG . "\n";
fwrite($myfile, $txt);
$txt = "B: " . $colorB . "\n";
fwrite($myfile, $txt);
$txt = "Size: " . $size . "\n";
fwrite($myfile, $txt);
$txt = "File Name: " . $fname . "\n";
fwrite($myfile, $txt);
$txt = "File Ext: " . $ext . "\n";
fwrite($myfile, $txt);
$txt = "X: " . $xoffset . "\n";
fwrite($myfile, $txt);
$txt = "Y: " . $yoffset . "\n";
fwrite($myfile, $txt);
fclose($myfile);*/

$box = imagettfbbox($size, 0, $font, $string);

$width = abs($box[0] + $box[2]);

$height = abs($box[7] + $box[1]);

if ($ext == 'jpg'){
    
    $im = imagecreatefromjpeg($image);
    $contentType = 'image/jpeg';
}
else if ($ext == 'png') {
    
    $im = imagecreatefrompng($image);
    imagealphablending($im, true);
    imagesavealpha($im, true);
    $contentType = 'image/png';
}

$color = imagecolorallocate($im, $colorR, $colorG, $colorB);
if ($color === FALSE) {
    $color = imagecolorclosest($im, $colorR, $colorG, $colorB);
}

$grey = imagecolorallocate($im, 105, 105, 105);
if ($grey === FALSE) {
    $grey = imagecolorclosest($im, 105, 105, 105);
}

$x = (imagesx($im) / 2) - ($width / 2) + $xoffset;

$y = (imagesy($im) / 2) + ($height / 2) + $yoffset;

imagettftext($im, $size, 0, $x -3, $y -1, $grey, $font, $string);

imagettftext($im, $size, 0, $x, $y, $color, $font, $string);

header('Content-type: ' . $contentType);

if ($ext == 'jpg'){
    
    imagejpeg($im);
}
else if ($ext == 'png') {
    
    imagepng($im);
}

imagedestroy($im);

?>