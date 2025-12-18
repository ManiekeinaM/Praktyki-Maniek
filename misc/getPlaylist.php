<?php
include_once "videoUtils.php";

$usb = GetFirstUSBDriveLetter();
CopyVideosFromUSBDrive($usb);

list($priorityVideos, $regularVideos) = GetAllVideos();
$playlist = GetPlaylist($priorityVideos, $regularVideos);

$projectRoot = realpath(__DIR__ . "/..") . DIRECTORY_SEPARATOR;
$publicPath  = '/videos';

$baseUrl = dirname($_SERVER['SCRIPT_NAME']);   // /Praktyki-Maniek/misc
$baseUrl = dirname($baseUrl);                 // /Praktyki-Maniek

$relativePlaylist = array_map(function($absPath) use ($projectRoot, $baseUrl) {
    $rel = str_replace($projectRoot, '', $absPath); 
    $rel = str_replace('\\', '/', $rel);
    return $baseUrl . '/' . $rel;
}, $playlist);


header('Content-Type: application/json');
echo json_encode($relativePlaylist);