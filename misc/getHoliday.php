<?php
    function GetMonthDaysAmount(int $monthnumber, int $year) : int {
        if ($monthnumber == 2) {
            // Luty jest przestepny
            return $year % 4 == 0 ? 29 : 28;
        }

        // 31 28/29 31 30 31 30 ...
        return $monthnumber % 2 == 0 ? 30 : 31; 
    }

    header('Content-Type: application/json');
    $success = false;
    $message = "Unknown error";
    $holidays = [];

    try {
        $date = getdate();
        $day = $date["mday"];
        $month = $date["mon"];
        $year = $date["year"];
        $daysInMonth = GetMonthDaysAmount($month, $year);

        // $stopAt = GetEndDate($day, $month, $year);

        // Dla zmieniajacego sie miesiaca
        // SELECT * FROM `swieta` WHERE (startMonth = 4 AND startDay BETWEEN 20 AND 31) OR (startMonth = 5 AND startDay BETWEEN 1 AND 9) AND forYear = 2025;
        // Dla zmieniajacego sie roku 
        // SELECT * FROM `swieta` WHERE ((startMonth = 12 AND startDay BETWEEN 20 AND 31) AND (forYear = 2025 OR forYear IS NULL)) OR ((startMonth = 1 AND startDay BETWEEN 1 AND 9) AND (forYear = 2026 OR forYear IS NULL));
        
        $sql = "";

    } catch (Throwable $e) {
        $success = false;
        $message = $e->getMessage();
        $holidays = [];
    }

    echo json_encode(array("success" => $success, "message" => $message, "holidays" => $holidays));
?>