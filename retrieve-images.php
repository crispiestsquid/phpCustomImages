<?php
    $files = glob("images/*.*");
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
            //echo basename($image)."<br />"; // show only image name if you want to show full path then use this code // echo $image."<br />";
             //echo '<img src="'.$image .'" alt="Random image" style="max-width:100px; max-height:100px;" />'."<br /><br />";
             
             array_push($imageData, basename($image), $image);
             $images[] = $imageData;
             
        } else {
            continue;
        }
    }

    echo(json_encode($images));
?>