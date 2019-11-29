<?php
    $files = glob("fonts/*.*");
    usort($files, function($b, $a) {
        return filemtime($a) - filemtime($b); 
    });
    $fonts = array();
     
    for ($i=0; $i<count($files); $i++)
    {
        $font = $files[$i];
        $fontData = array();
        $supported_file = array(
                'ttf'
        );

        $ext = strtolower(pathinfo($font, PATHINFO_EXTENSION));
         
        if (in_array($ext, $supported_file)) {
             
             array_push($fontData, basename($font), $font);
             $fonts[] = $fontData;
             
        } else {
            continue;
        }
    }

    echo(json_encode($fonts));
?>