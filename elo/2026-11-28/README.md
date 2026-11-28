# Elo tournament 2026-11-28

Every bot model against every other, in every game mode, in the Rust engine. 30600 games, 9 agents. Made by `scripts/elo-tournament.ts` at commit 108fb50; reproduce with `npm run elo-tournament -- --out <new folder>` (the same seeds give the same games).

## Method

- Round robin: every pair of agents plays the same map seeds (1800000000 upward) in every mode. Every map is played twice, the two models swapping seats. In a game the two models take alternate seats of a free-for-all and every seat plays for itself, as in training.
- Who won: the side of the seat the engine declares winner; a game still running at the turn cap goes to the side of the highest-scoring seat.
- Rating: Bradley-Terry maximum likelihood over all games of a mode at once, so the order of games does not matter. Elo scale (400 points = 10:1 odds), greedy-v1 = 1200 in every table (where data/ratings.json puts it), so a rating says how far an agent is from greedy-v1 in that mode. "Overall" is one fit over the games of all modes, every mode counting the same (a game of a mode with fewer games per pair weighs more); its other columns are averaged the same way.
- Interval: 95%, from 1000 refits on map seeds drawn with replacement (all games on a map go in or out together), each centred on the mean of the learned agents.
- Points: the agent's share of all points in its games. Finish: the finish score of training (#124). Won by the mode's rule: games it won that ended by the mode's own rule (conquest in domination), not at the turn cap, as a share of all its games.
- An agent that never won is held at a finite rating only by the fit's prior (one virtual win and one virtual loss per agent, spread over the others); its rating is an upper bound and is marked "at most".

## Setup

| mode | players | map | map type | turn cap | games per pair | games played |
|---|--:|---|---|--:|--:|--:|
| perfection | 4 | 16x16 | continents | 30 (the mode's own end) | 200 | 7200 |
| glory | 4 | 16x16 | drylands | 150 | 200 | 7200 |
| might | 4 | 16x16 | drylands | 150 | 200 | 7200 |
| domination | 4 | 16x16 | drylands | 150 | 200 | 7200 |
| creative | 8 | 20x20 | drylands | 150 | 50 | 1800 |

Left out: nobody.

## Rating by mode

Rating, with the place in that mode in brackets. Every column is its own fit with greedy-v1 at 1200: compare places and gaps across columns, not levels.

| agent | overall | perfection | glory | might | domination | creative |
|---|--:|--:|--:|--:|--:|--:|
| rl-econ-level | 1849 (1) | 1658 (1) | 1793 (1) | 2071 (2) | 2079 (3) | 2089 (3) |
| greedy-full-probe-perf-r15 | 1848 (2) | 1639 (2) | 1790 (2) | 2074 (1) | 2083 (1) | 2099 (2) |
| greedy-full-probe-perf | 1842 (3) | 1608 (3) | 1779 (4) | 2068 (3) | 2083 (2) | 2115 (1) |
| greedy-full-combo-perf | 1830 (4) | 1603 (4) | 1781 (3) | 2058 (4) | 2076 (4) | 2076 (5) |
| greedy-full-probe | 1827 (5) | 1595 (5) | 1770 (5) | 2056 (5) | 2072 (5) | 2089 (4) |
| greedy-full-combo | 1741 (6) | 1552 (6) | 1678 (6) | 1949 (6) | 1963 (6) | 2005 (6) |
| greedy-full-economy | 1701 (7) | 1502 (7) | 1668 (7) | 1915 (7) | 1932 (7) | 1927 (7) |
| greedy-v1 | 1200 (8) | 1200 (8) | 1200 (8) | 1200 (8) | 1200 (8) | 1200 (8) |
| random-v1 | 245 (9) | 463 (9) | at most 233 (9) | at most 269 (9) | at most 270 (9) | at most 514 (9) |

## Overall

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | rl-econ-level | 1849 | 1834 to 1865 | 6800 | 67.5% | 59.1% | 63.1% | 60.3% | 51 |  |
| 2 | greedy-full-probe-perf-r15 | 1848 | 1837 to 1861 | 6800 | 67.4% | 59.2% | 63.2% | 60.4% | 50 |  |
| 3 | greedy-full-probe-perf | 1842 | 1831 to 1852 | 6800 | 66.6% | 59.2% | 62.5% | 59.4% | 50 |  |
| 4 | greedy-full-combo-perf | 1830 | 1816 to 1844 | 6800 | 65.1% | 58.4% | 61.7% | 58.9% | 49 |  |
| 5 | greedy-full-probe | 1827 | 1817 to 1839 | 6800 | 64.8% | 58.3% | 61.2% | 57.5% | 50 |  |
| 6 | greedy-full-combo | 1741 | 1727 to 1755 | 6800 | 54.1% | 53.2% | 53.2% | 49.8% | 48 |  |
| 7 | greedy-full-economy | 1701 | 1684 to 1717 | 6800 | 49.3% | 50.7% | 49.7% | 45.6% | 48 |  |
| 8 | greedy-v1 | 1200 | 1164 to 1232 | 6800 | 15.2% | 32.7% | 23.3% | 14.8% | 45 | 1147 |
| 9 | random-v1 | 245 | 59 to 354 | 6800 | 0.1% | 19.1% | 12.0% | 0.1% | 45 | 192 |

## perfection

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | rl-econ-level | 1658 | 1641 to 1678 | 1600 | 69.6% | 55.9% | 59.8% | 69.6% | 30 |  |
| 2 | greedy-full-probe-perf-r15 | 1639 | 1623 to 1656 | 1600 | 67.1% | 55.6% | 58.5% | 67.1% | 30 |  |
| 3 | greedy-full-probe-perf | 1608 | 1592 to 1626 | 1600 | 63.1% | 55.1% | 56.6% | 63.1% | 30 |  |
| 4 | greedy-full-combo-perf | 1603 | 1586 to 1622 | 1600 | 62.5% | 55.3% | 56.3% | 62.5% | 30 |  |
| 5 | greedy-full-probe | 1595 | 1579 to 1614 | 1600 | 61.4% | 55.0% | 55.7% | 61.4% | 30 |  |
| 6 | greedy-full-combo | 1552 | 1532 to 1572 | 1600 | 55.8% | 53.5% | 52.9% | 55.8% | 30 |  |
| 7 | greedy-full-economy | 1502 | 1477 to 1526 | 1600 | 49.5% | 51.6% | 49.8% | 49.5% | 30 |  |
| 8 | greedy-v1 | 1200 | 1155 to 1240 | 1600 | 20.8% | 41.5% | 35.4% | 20.8% | 30 | 1147 |
| 9 | random-v1 | 463 | 286 to 570 | 1600 | 0.3% | 26.5% | 25.1% | 0.3% | 30 | 192 |

## glory

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | rl-econ-level | 1793 | 1769 to 1818 | 1600 | 67.2% | 56.4% | 65.7% | 67.2% | 25 |  |
| 2 | greedy-full-probe-perf-r15 | 1790 | 1770 to 1812 | 1600 | 66.9% | 56.3% | 65.5% | 66.9% | 25 |  |
| 3 | greedy-full-combo-perf | 1781 | 1764 to 1797 | 1600 | 65.7% | 56.1% | 64.4% | 65.7% | 25 |  |
| 4 | greedy-full-probe-perf | 1779 | 1762 to 1798 | 1600 | 65.5% | 56.5% | 64.2% | 65.5% | 25 |  |
| 5 | greedy-full-probe | 1770 | 1750 to 1791 | 1600 | 64.3% | 55.9% | 63.1% | 64.3% | 25 |  |
| 6 | greedy-full-combo | 1678 | 1656 to 1700 | 1600 | 52.8% | 52.8% | 52.5% | 52.8% | 26 |  |
| 7 | greedy-full-economy | 1668 | 1648 to 1688 | 1600 | 51.6% | 51.8% | 51.4% | 51.6% | 26 |  |
| 8 | greedy-v1 | 1200 | 1135 to 1252 | 1600 | 16.1% | 39.4% | 18.8% | 16.1% | 26 | 1147 |
| 9 | random-v1 | at most 233 | never won | 1600 | 0.0% | 24.7% | 4.4% | 0.0% | 26 | 192 |

## might

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | greedy-full-probe-perf-r15 | 2074 | 2055 to 2098 | 1600 | 68.1% | 60.5% | 65.3% | 62.4% | 50 |  |
| 2 | rl-econ-level | 2071 | 2048 to 2096 | 1600 | 67.6% | 60.5% | 64.8% | 61.3% | 51 |  |
| 3 | greedy-full-probe-perf | 2068 | 2051 to 2091 | 1600 | 67.4% | 60.4% | 64.9% | 62.5% | 50 |  |
| 4 | greedy-full-combo-perf | 2058 | 2040 to 2080 | 1600 | 66.1% | 59.7% | 63.9% | 61.1% | 50 |  |
| 5 | greedy-full-probe | 2056 | 2037 to 2080 | 1600 | 65.8% | 59.4% | 63.4% | 60.5% | 50 |  |
| 6 | greedy-full-combo | 1949 | 1927 to 1979 | 1600 | 52.8% | 52.6% | 52.9% | 49.9% | 48 |  |
| 7 | greedy-full-economy | 1915 | 1891 to 1944 | 1600 | 49.0% | 50.4% | 49.4% | 46.4% | 48 |  |
| 8 | greedy-v1 | 1200 | 1078 to 1277 | 1600 | 13.2% | 30.0% | 18.4% | 12.8% | 42 | 1147 |
| 9 | random-v1 | at most 269 | never won | 1600 | 0.0% | 16.5% | 7.1% | 0.0% | 41 | 192 |

## domination

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | greedy-full-probe-perf-r15 | 2083 | 2063 to 2110 | 1600 | 67.5% | 61.5% | 64.7% | 61.3% | 55 |  |
| 2 | greedy-full-probe-perf | 2083 | 2065 to 2105 | 1600 | 67.4% | 61.3% | 64.3% | 60.2% | 55 |  |
| 3 | rl-econ-level | 2079 | 2055 to 2106 | 1600 | 67.0% | 61.1% | 64.1% | 59.6% | 56 |  |
| 4 | greedy-full-combo-perf | 2076 | 2057 to 2099 | 1600 | 66.6% | 60.8% | 64.0% | 60.8% | 54 |  |
| 5 | greedy-full-probe | 2072 | 2055 to 2097 | 1600 | 66.2% | 60.3% | 63.3% | 59.6% | 54 |  |
| 6 | greedy-full-combo | 1963 | 1941 to 1987 | 1600 | 52.9% | 52.6% | 52.7% | 48.5% | 54 |  |
| 7 | greedy-full-economy | 1932 | 1910 to 1957 | 1600 | 49.3% | 50.2% | 49.5% | 45.1% | 54 |  |
| 8 | greedy-v1 | 1200 | 1090 to 1274 | 1600 | 13.1% | 27.3% | 19.3% | 12.7% | 48 | 1147 |
| 9 | random-v1 | at most 270 | never won | 1600 | 0.0% | 14.9% | 8.1% | 0.0% | 47 | 192 |

## creative

| # | agent | rating | 95% interval | games | won | points | finish | won by the mode's rule | mean turns | data/ratings.json |
|--:|---|--:|---|--:|--:|--:|--:|--:|--:|--:|
| 1 | greedy-full-probe-perf | 2115 | 2086 to 2148 | 400 | 69.5% | 62.8% | 62.3% | 45.5% | 87 |  |
| 2 | greedy-full-probe-perf-r15 | 2099 | 2072 to 2133 | 400 | 67.5% | 62.3% | 62.2% | 44.5% | 89 |  |
| 3 | rl-econ-level | 2089 | 2059 to 2123 | 400 | 66.3% | 61.5% | 61.2% | 44.0% | 89 |  |
| 4 | greedy-full-probe | 2089 | 2059 to 2123 | 400 | 66.3% | 61.0% | 60.7% | 41.5% | 92 |  |
| 5 | greedy-full-combo-perf | 2076 | 2039 to 2119 | 400 | 64.8% | 60.1% | 60.0% | 44.5% | 86 |  |
| 6 | greedy-full-combo | 2005 | 1974 to 2037 | 400 | 56.0% | 54.7% | 55.0% | 41.8% | 84 |  |
| 7 | greedy-full-economy | 1927 | 1880 to 1976 | 400 | 47.0% | 49.6% | 48.6% | 35.5% | 82 |  |
| 8 | greedy-v1 | 1200 | 1123 to 1287 | 400 | 12.8% | 25.1% | 24.5% | 11.8% | 80 | 1147 |
| 9 | random-v1 | at most 514 | never won | 400 | 0.0% | 12.9% | 15.4% | 0.0% | 83 | 192 |

The last column is the rating in data/ratings.json when this run was made (mostly 2-player games on 11x11, another method of counting; see scripts/elo.ts). The pairwise results are in ratings.json (`matrix`) and on the dashboard (`npm run elo-dashboard`).
