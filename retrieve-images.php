<?php
    $files = glob("images/*.*");
    usort($files, function($b, $a) {
        return filemtime($a) - filemtime($b); 
    });
    $images = array();
     
    for ($i=0; $i<count($files); $i++)
    {
        $image = $files[$i];
        $imageData = array();
        $supported_file = array(
                'gif',
                'jpg',
                'jpeg',
                'png'
        );

        $ext = strtolower(pathinfo($image, PATHINFO_EXTENSION));
         
        if (in_array($ext, $supported_file)) {
             
             array_push($imageData, basename($image), $image);
             $images[] = $imageData;
             
        } else {
            continue;
        }
    }

    echo(json_encode($images));
?>