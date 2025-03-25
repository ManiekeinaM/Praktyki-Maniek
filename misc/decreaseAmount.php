<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amount decrease</title>
</head>
<body>
<?php
// Get the JSON payload from JavaScript
$json = file_get_contents('php://input');
$decreasedAmounts = json_decode($json, true);

$item_id = $decreasedAmounts['id'];
$amount = $decreasedAmounts['amount'];

$db_baza = new mysqli('localhost', 'root', '', 'baza_pula');

if ($result = $db_baza -> query("UPDATE nagrody_pula SET iloscNagrody = $amount WHERE id = $item_id")){
    echo "dziala";
}else {echo "nie";}


$db_baza -> close();

echo "Amount updated successfully: Item ID $item_id, New Amount $amount";
?>
</body>
</html>