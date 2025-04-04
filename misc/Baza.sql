-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2025 at 02:12 PM
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
  `endMonth` int(11) DEFAULT NULL,
  `endDay` int(11) DEFAULT NULL,
  `forYear` int(11) DEFAULT NULL,
  `nazwa` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `swieta`
--

INSERT INTO `swieta` (`id`, `startMonth`, `startDay`, `endMonth`, `endDay`, `forYear`, `nazwa`) VALUES
(1, 1, 1, NULL, NULL, NULL, 'Nowy Rok'),
(2, 1, 6, NULL, NULL, NULL, 'Trzech Króli (Objawienie Pańskie)'),
(3, 1, 21, NULL, NULL, NULL, 'Dzień Babci'),
(4, 1, 22, NULL, NULL, NULL, 'Dzień Dziadka'),
(5, 2, 2, NULL, NULL, NULL, 'Ofiarowanie Pańskie (Matki Boskiej Gromnicznej)'),
(6, 2, 14, NULL, NULL, NULL, 'Dzień Zakochanych (Walentynki)'),
(7, 2, 12, NULL, NULL, 2026, 'Tłusty Czwartek'),
(8, 3, 1, NULL, NULL, NULL, 'Narodowy Dzień Pamięci Żołnierzy Wyklętych, Ostatnia sobota karnawału'),
(9, 2, 17, NULL, NULL, 2026, 'Ostatki'),
(10, 2, 18, NULL, NULL, 2026, 'Popielec'),
(11, 3, 8, NULL, NULL, NULL, 'Międzynarodowy Dzień Kobiet'),
(12, 3, 10, NULL, NULL, NULL, 'Dzień Mężczyzn'),
(13, 3, 20, NULL, NULL, NULL, 'Początek astronomicznej wiosny'),
(14, 3, 29, NULL, NULL, 2026, 'Zmiana czasu z zimowego na letni'),
(15, 4, 1, NULL, NULL, NULL, 'Prima Aprilis'),
(16, 4, 13, NULL, NULL, 2025, 'Niedziela Palmowa'),
(17, 4, 17, NULL, NULL, 2025, 'Wielki Czwartek'),
(18, 4, 18, NULL, NULL, 2025, 'Wielki Piątek'),
(19, 4, 19, NULL, NULL, 2025, 'Wielka Sobota'),
(20, 4, 20, NULL, NULL, 2025, 'Wielkanoc'),
(21, 4, 21, NULL, NULL, 2025, 'Poniedziałek Wielkanocny'),
(22, 4, 22, NULL, NULL, NULL, 'Międzynarodowy Dzień Ziemi'),
(23, 4, 27, NULL, NULL, NULL, 'Święto Bożego Miłosierdzia'),
(24, 5, 1, NULL, NULL, NULL, 'Międzynarodowe Święto Pracy'),
(25, 5, 2, NULL, NULL, NULL, 'Dzień Flagi Rzeczypospolitej Polskiej'),
(26, 5, 3, NULL, NULL, NULL, 'Święto Konstytucji 3 Maja'),
(27, 5, 26, NULL, NULL, NULL, 'Dzień Matki'),
(28, 6, 1, NULL, NULL, NULL, 'Międzynarodowy Dzień Dziecka, Wniebowstąpienie'),
(29, 6, 8, NULL, NULL, 2025, 'Zesłanie Ducha Świętego (Zielone Świątki)'),
(30, 6, 19, NULL, NULL, 2025, 'Boże Ciało'),
(31, 6, 21, NULL, NULL, NULL, 'Pierwszy Dzień Lata - najdłuższy dzień roku'),
(32, 6, 23, NULL, NULL, NULL, 'Dzień Ojca'),
(33, 8, 1, NULL, NULL, NULL, 'Narodowy Dzień Pamięci Powstania Warszawskiego'),
(34, 8, 15, NULL, NULL, NULL, 'Święto Wojska Polskiego, Wniebowzięcie Najświętszej Maryi Panny'),
(35, 8, 31, NULL, NULL, NULL, 'Dzień Solidarności i Wolności'),
(36, 9, 22, NULL, NULL, NULL, 'Początek Astronomicznej Jesieni'),
(37, 9, 30, NULL, NULL, NULL, 'Dzień Chłopaka'),
(38, 10, 14, NULL, NULL, NULL, 'Dzień Nauczyciela (Dzień Edukacji Narodowej)'),
(39, 10, 26, NULL, NULL, 2025, 'Zmiana czasu z letniego na zimowy'),
(40, 11, 1, NULL, NULL, NULL, 'Wszystkich Świętych'),
(41, 11, 2, NULL, NULL, NULL, 'Dzień zaduszny'),
(42, 11, 11, NULL, NULL, NULL, 'Narodowe Święto Niepodległości'),
(43, 11, 29, NULL, NULL, NULL, 'Andrzejki (w nocy z 29 na 30)'),
(44, 12, 4, NULL, NULL, NULL, 'Barbórka (Dzień Górnika, Naftowca i Gazownika)'),
(45, 12, 6, NULL, NULL, NULL, 'Dzień św. Mikołaja'),
(46, 12, 21, NULL, NULL, NULL, 'Początek astronomicznej zimy - najkrótszy dzień roku'),
(47, 12, 24, NULL, NULL, NULL, 'Wigilia Bożego Narodzenia'),
(48, 12, 25, NULL, NULL, NULL, 'Boże Narodzenie (pierwszy dzień)'),
(49, 12, 26, NULL, NULL, NULL, 'Boże Narodzenie (drugi dzień)'),
(50, 12, 27, NULL, NULL, NULL, 'Narodowy Dzień Zwycięskiego Powstania Wielkopolskiego'),
(51, 12, 31, NULL, NULL, NULL, 'Sylwester');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
