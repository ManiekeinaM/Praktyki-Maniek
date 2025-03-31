<?php
// Set json outcome
header('Content-Type: application/json');
$message = "Unknown error";
$success = false;

try {
    // Get the JSON payload from JavaScript
    $json = file_get_contents('php://input');
    $decreasedAmounts = json_decode($json, true);

    // Retrieve prize id
    if (!isset($decreasedAmounts['id']) || !is_numeric($decreasedAmounts['id'])) {
        throw new Exception("BLAD | Niepoprawne ID nagrody!");
    }
    $item_id = intval($decreasedAmounts['id']);

    // Create database connection
    $db_baza = new mysqli('localhost', 'root', '', 'baza_pula');

    // Check connection
    if ($db_baza->connect_error) {
        throw new Exception("Blad polaczenia z baza danych: " . $db_baza->connect_error);
    }

    // Get current amount of prize
    $sql = "SELECT iloscNagrody FROM nagrody_pula WHERE id = ? LIMIT 1";
    $stmt = $db_baza->prepare($sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $amount = null;
    if ($row = $result->fetch_assoc()) {
        $amount = $row['iloscNagrody'];
    } else {
        throw new Exception("BLAD | Nie ma nagrody o podanym id $item_id !");
    }

    // Decrement prize safely
    $new_amount = max($amount - 1, 0);

    // Change amount in database
    $sql = "UPDATE nagrody_pula SET iloscNagrody = ? WHERE id = ?";
    $stmt = $db_baza->prepare($sql);
    $stmt->bind_param("ii", $new_amount, $item_id);

    if ($stmt->execute()) {
        $message = "Nowa ilosc dla id: $item_id wynosi: $new_amount!";
        $success = true;
    } else {
        throw new Exception("Nie udalo sie zmienic wartosci nagrody o id: $item_id!");
    }
} catch (Throwable $e) {
    $message = $e->getMessage();
    $success = false;
}

// Print json 
echo json_encode(array('success' => $success, 'message' => $message));

if (isset($db_baza)) {
    $db_baza->close();
}
?>
