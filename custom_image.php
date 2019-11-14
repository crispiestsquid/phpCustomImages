<?php

$string = $_GET['text'];

$size = $_GET['size'];

$font = 'fonts/AndallanDemo.ttf';

$fname = $_GET['fname'];

$ext = $_GET['ext'];

$image = "images/{$fname}.{$ext}";

$xoffset = $_GET['x'];

$yoffset = $_GET['y'];

$checked = $_GET['checked'];

$box = imagettfbbox($size, 0, $font, $string);

$width = abs($box[0] + $box[2]);

$height = abs($box[7] + $box[1]);

if ($ext == 'jpg'){
    
    $im = imagecreatefromjpeg($image);
    $contentType = 'image/jpeg';
}
else if ($ext == 'png') {
    
    $im = imagecreatefrompng($image);
    $contentType = 'image/png';
}


$overlay = imagecreatefrompng('images/thanksgiving-overlay.png');

$white = imagecolorallocate($im, 255, 255, 255);

$grey = imagecolorallocate($im, 148, 107, 3);

$x = (imagesx($im) / 2) - ($width / 2) + $xoffset;

$y = (imagesy($im) / 2) + ($height / 2) + $yoffset;

imagettftext($im, $size, 0, $x -3, $y -1, $grey, $font, $string);

imagettftext($im, $size, 0, $x, $y, $white, $font, $string);

if ($checked == 'true') {
imagecopy($im, $overlay, 0, 0, 0, 0, imagesx($overlay), imagesy($overlay));
}

header('Content-type: ' . $contentType);

if ($ext == 'jpg'){
    
    imagejpeg($im);
}
else if ($ext == 'png') {
    
    imagepng($im);
}

imagedestroy($im);

?>