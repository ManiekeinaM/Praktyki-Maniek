<?php
    function GetMonthDaysAmount(int $monthnumber, int $year) : int {
        if ($monthnumber == 2) {
            // Luty jest przestepny
            return $year % 4 == 0 ? 29 : 28;
        }

        // 31 28/29 31 30 31 30 ...
        return $monthnumber % 2 == 0 ? 30 : 31; 
    }

    const DAY_IN_THE_FUTURE = 20;
    function GetEndDate(int $startDay, int $startMonth, int $startYear, int $daysInMonth) : array {
        $newDate = array();

        // Jezeli przechodzi na nastepny miesiac
        if ($startDay + DAY_IN_THE_FUTURE > $daysInMonth) {
            $newDate["dayEnd"] = DAY_IN_THE_FUTURE - ($daysInMonth - $startDay);
            $newDate["dayStart"] = 1;
            // Przechodzi na nastepny rok
            if ($startMonth + 1 > 12) {
                $newDate["month"] = 1;
                $newDate["year"] = $startYear + 1;
            } else {
                $newDate["month"] = $startMonth + 1;
                $newDate["year"] = $startYear;
            }
        } 
        // Ten sam miesiac
        else {
            $newDate["dayStart"] = $startDay;
            $newDate["dayEnd"] = $startDay + DAY_IN_THE_FUTURE;
            $newDate["year"] = $startYear;
            $newDate["month"] = $startMonth;
        }

        return $newDate;
    }
    header('Content-Type: application/json');
    $success = false;
    $message = "Unknown error";
    $holidays = [];

    
    try {
        // Create database connection
        $db_baza = new mysqli('localhost', 'root', '', 'swieta');

        // Check connection
        if ($db_baza->connect_error) {
            throw new Exception("Blad polaczenia z baza danych: " . $db_baza->connect_error);
        }

        $date = getdate();
        $day = $date["mday"];
        $month = $date["mon"];
        $year = $date["year"];
        $daysInMonth = GetMonthDaysAmount($month, $year);

        $stopAt = GetEndDate($day, $month, $year, $daysInMonth);
        $sql = "SELECT * FROM `swieta` WHERE ((startMonth = ? AND startDay BETWEEN ? AND ?) AND (forYear = ? OR forYear IS NULL)) OR ((startMonth = ? AND startDay BETWEEN ? AND ?) AND (forYear = ? OR forYear IS NULL))";

        $stmt = $db_baza->prepare($sql);
        $stmt->bind_param("iiiiiiii", $month, $day, min($day + DAY_IN_THE_FUTURE, $daysInMonth), $year, $stopAt["month"], $stopAt["dayStart"], $stopAt["dayEnd"], $stopAt["year"]);
        $stmt->execute();
        $result = $stmt->get_result();

        while(($row = $result->fetch_assoc())) {
            array_push($holidays, $row);
        }

        $success = true;
        $message = "Success";
    } catch (Throwable $e) {
        $success = false;
        $message = $e->getMessage();
        $holidays = [];
    }

    echo json_encode(array("success" => $success, "message" => $message, "holidays" => $holidays));
?>