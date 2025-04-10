-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2025 at 02:17 PM
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
-- Database: `bazadanych`
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
(1, 'Gadżet', 0, 0),
(2, 'Voucher Dzień bez pytania', 0, 0),
(3, 'Voucher na wycieczekę za free', 0, 1),
(4, 'Voucher na sprzęt elektroniczny', 0, 1),
(5, 'Voucher do sklepiku za 10zł', 0, 0),
(6, 'Vocher do sklepiku za 5zł', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `swieta`
--

CREATE TABLE `swieta` (
  `id` int(11) NOT NULL,
  `startMonth` int(11) NOT NULL,
  `startDay` int(11) NOT NULL,
  `forYear` int(11) DEFAULT NULL,
  `nazwa` varchar(255) DEFAULT NULL,
  `showWithDate` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `swieta`
--

INSERT INTO `swieta` (`id`, `startMonth`, `startDay`, `forYear`, `nazwa`, `showWithDate`) VALUES
(1, 1, 1, NULL, 'Nowy Rok', 1),
(2, 1, 6, NULL, 'Trzech Króli (Objawienie Pańskie)', 1),
(3, 1, 21, NULL, 'Dzień Babci', 1),
(4, 1, 22, NULL, 'Dzień Dziadka', 1),
(5, 2, 2, NULL, 'Ofiarowanie Pańskie (Matki Boskiej Gromnicznej)', 1),
(6, 2, 14, NULL, 'Dzień Zakochanych (Walentynki)', 1),
(7, 2, 12, 2026, 'Tłusty Czwartek', 1),
(8, 3, 1, NULL, 'Narodowy Dzień Pamięci Żołnierzy Wyklętych, Ostatnia sobota karnawału', 1),
(9, 2, 17, 2026, 'Ostatki', 1),
(10, 2, 18, 2026, 'Popielec', 1),
(11, 3, 8, NULL, 'Międzynarodowy Dzień Kobiet', 1),
(12, 3, 10, NULL, 'Dzień Mężczyzn', 1),
(13, 3, 20, NULL, 'Początek astronomicznej wiosny', 1),
(14, 3, 29, 2026, 'Zmiana czasu z zimowego na letni', 1),
(15, 4, 1, NULL, 'Prima Aprilis', 1),
(16, 4, 13, 2025, 'Niedziela Palmowa', 1),
(17, 4, 17, 2025, 'Wielki Czwartek', 1),
(18, 4, 18, 2025, 'Wielki Piątek', 1),
(19, 4, 19, 2025, 'Wielka Sobota', 1),
(20, 4, 20, 2025, 'Wielkanoc', 1),
(21, 4, 21, 2025, 'Poniedziałek Wielkanocny', 1),
(22, 4, 22, NULL, 'Międzynarodowy Dzień Ziemi', 1),
(23, 4, 27, NULL, 'Święto Bożego Miłosierdzia', 1),
(24, 5, 1, NULL, 'Międzynarodowe Święto Pracy', 1),
(25, 5, 2, NULL, 'Dzień Flagi Rzeczypospolitej Polskiej', 1),
(26, 5, 3, NULL, 'Święto Konstytucji 3 Maja', 1),
(27, 5, 26, NULL, 'Dzień Matki', 1),
(28, 6, 1, NULL, 'Międzynarodowy Dzień Dziecka, Wniebowstąpienie', 1),
(29, 6, 8, 2025, 'Zesłanie Ducha Świętego (Zielone Świątki)', 1),
(30, 6, 19, 2025, 'Boże Ciało', 1),
(31, 6, 21, NULL, 'Pierwszy Dzień Lata - najdłuższy dzień roku', 1),
(32, 6, 23, NULL, 'Dzień Ojca', 1),
(33, 8, 1, NULL, 'Narodowy Dzień Pamięci Powstania Warszawskiego', 1),
(34, 8, 15, NULL, 'Święto Wojska Polskiego, Wniebowzięcie Najświętszej Maryi Panny', 1),
(35, 8, 31, NULL, 'Dzień Solidarności i Wolności', 1),
(36, 9, 22, NULL, 'Początek Astronomicznej Jesieni', 1),
(37, 9, 30, NULL, 'Dzień Chłopaka', 1),
(38, 10, 14, NULL, 'Dzień Nauczyciela (Dzień Edukacji Narodowej)', 1),
(39, 10, 26, 2025, 'Zmiana czasu z letniego na zimowy', 1),
(40, 11, 1, NULL, 'Wszystkich Świętych', 1),
(41, 11, 2, NULL, 'Dzień zaduszny', 1),
(42, 11, 11, NULL, 'Narodowe Święto Niepodległości', 1),
(43, 11, 29, NULL, 'Andrzejki (w nocy z 29 na 30)', 1),
(44, 12, 4, NULL, 'Barbórka (Dzień Górnika, Naftowca i Gazownika)', 1),
(45, 12, 6, NULL, 'Dzień św. Mikołaja', 1),
(46, 12, 21, NULL, 'Początek astronomicznej zimy - najkrótszy dzień roku', 1),
(47, 12, 24, NULL, 'Wigilia Bożego Narodzenia', 1),
(48, 12, 25, NULL, 'Boże Narodzenie (pierwszy dzień)', 1),
(49, 12, 26, NULL, 'Boże Narodzenie (drugi dzień)', 1),
(50, 12, 27, NULL, 'Narodowy Dzień Zwycięskiego Powstania Wielkopolskiego', 1),
(51, 12, 31, NULL, 'Sylwester', 1),
(53, 5, 5, NULL, 'Matura', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `nagrody_pula`
--
ALTER TABLE `nagrody_pula`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `swieta`
--
ALTER TABLE `swieta`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nagrody_pula`
--
ALTER TABLE `nagrody_pula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `swieta`
--
ALTER TABLE `swieta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
