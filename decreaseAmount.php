<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amount decrease</title>
</head>
<body>
<?php

// Assuming you're using PDO for database connection
$db = new PDO('mysql:host=localhost;dbname=baza_pula', 'root', '');

// Get the JSON payload from JavaScript
$json = file_get_contents('php://input');
$decreasedAmounts = json_decode($json, true);

$item_id = $decreasedAmounts['id'];
$item_id++;
$amount = $decreasedAmounts['amount'];

// Prepare SQL statement for updating amounts
$stmt = $db->prepare("UPDATE nagrody_pula SET iloscNagrody = :amount WHERE id = :item_id");

foreach ($updatedAmounts as $item_id => $amount) {
    // Bind parameters and execute SQL statement
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);
    $stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
    $stmt->execute();
}

$db_baza = new mysqli('localhost', 'root', '', 'baza_pula');

if ($result = $db_baza -> query("UPDATE nagrody_pula SET iloscNagrody = $amount WHERE id = $item_id")){
    echo "dziala";
}else {echo "nie";}


$db_baza -> close();

echo "Amount updated successfully: Item ID $item_id, New Amount $amount";
?>
</body>
</html>