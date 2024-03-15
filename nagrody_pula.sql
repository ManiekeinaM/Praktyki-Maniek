-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2024 at 01:37 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `baza_pula`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `nagrody_pula`
--

CREATE TABLE `nagrody_pula` (
  `id` int(11) NOT NULL,
  `nazwaNagrody` varchar(60) DEFAULT NULL,
  `iloscNagrody` int(4) DEFAULT NULL,
  `typ_losowania` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nagrody_pula`
--

INSERT INTO `nagrody_pula` (`id`, `nazwaNagrody`, `iloscNagrody`, `typ_losowania`) VALUES
(1, 'Brelok', 250, 0),
(2, 'Przypinkę', 250, 0),
(3, 'Voucher Dzień bez pytania', 50, 0),
(4, 'Voucher na wycieczekę za free', 3, 1),
(5, 'Voucher na sprzęt elektroniczny', 6, 1),
(6, 'Voucher do sklepiku za 10zł', 10, 0),
(7, 'Vocher do sklepiku za 5zł', 10, 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `nagrody_pula`
--
ALTER TABLE `nagrody_pula`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nagrody_pula`
--
ALTER TABLE `nagrody_pula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
