<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TV Player</title>
    <link rel="stylesheet" href="./css/tv.css">
</head>
<body>
    <video id="vidplayer" autoplay muted>
        <source id="vidsource" src="./example-videos/LEGO1.mp4" type="video/mp4">
    </video>

    <div id="data-pass"><?php
            $dir = './example-videos';
            $videos = scandir($dir,1);
            foreach ($videos as $video) {
                if($video == ".." || $video == ".") continue;
                echo "$video ";
            }
    ?></div>

    <script>
        let dir = '/example-videos';
        let passed_data = document.getElementById("data-pass").innerHTML;
        let VideosList = passed_data.split(' ');
        VideosList.pop();
        console.log(VideosList);

        let VideoPlayer = document.getElementById("vidplayer");
        let VideoSource = document.getElementById("vidsource");
        VideoPlayer.addEventListener("ended", (event) => {
            let previousSource = VideoSource.src;
            let nextSource;
            do{
                nextSource = `${dir}/${VideosList[Math.floor(Math.random()*(VideosList.length)+0)]}`;
                console.log(`P:${previousSource}`);
                console.log(`N:${nextSource}`); 
            }while(previousSource.includes(nextSource));
            VideoSource.src = "."+nextSource;
            
            VideoPlayer.load();
            VideoPlayer.play();
        });
    </script>
</body>
</html>