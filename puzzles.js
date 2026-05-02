// puzzles.js — Telugu Movie Timeline Puzzle Database
// Each puzzle has 3 movies. They will be sorted by year automatically.
// Add new puzzles to keep the game going!

const PUZZLES = [
  // Puzzle 1
  [
    { name: "Magadheera", director: "S. S. Rajamouli", year: 2009 },
    { name: "Baahubali: The Beginning", director: "S. S. Rajamouli", year: 2015 },
    { name: "RRR", director: "S. S. Rajamouli", year: 2022 },
  ],
  // Puzzle 2
  [
    { name: "Jalsa", director: "Trivikram Srinivas", year: 2008 },
    { name: "Arjun Reddy", director: "Sandeep Reddy Vanga", year: 2017 },
    { name: "Pushpa: The Rise", director: "Sukumar", year: 2021 },
  ],
  // Puzzle 3
  [
    { name: "Okkadu", director: "Gunasekhar", year: 2003 },
    { name: "Magadheera", director: "S. S. Rajamouli", year: 2009 },
    { name: "Ala Vaikunthapurramuloo", director: "Trivikram Srinivas", year: 2020 },
  ],
  // Puzzle 4
  [
    { name: "Kushi", director: "Mani Ratnam", year: 2001 },
    { name: "Pokiri", director: "Puri Jagannadh", year: 2006 },
    { name: "Rangasthalam", director: "Sukumar", year: 2018 },
  ],
  // Puzzle 5
  [
    { name: "Nuvvu Nenu", director: "Radhakrishna Jagarlamudi", year: 2001 },
    { name: "Athadu", director: "Trivikram Srinivas", year: 2005 },
    { name: "Eega", director: "S. S. Rajamouli", year: 2012 },
  ],
  // Puzzle 6
  [
    { name: "Chitram", director: "Vasu Varma", year: 2000 },
    { name: "Sainikudu", director: "Srinu Vaitla", year: 2006 },
    { name: "Aravinda Sametha", director: "Trivikram Srinivas", year: 2018 },
  ],
  // Puzzle 7
  [
    { name: "Premam", director: "Chandoo Mondeti", year: 2015 },
    { name: "Fidaa", director: "Sekhar Kammula", year: 2017 },
    { name: "Uppena", director: "Buchi Babu Sana", year: 2021 },
  ],
  // Puzzle 8
  [
    { name: "Khaidi No. 150", director: "V. V. Vinayak", year: 2017 },
    { name: "Sye Raa Narasimha Reddy", director: "Surender Reddy", year: 2019 },
    { name: "Waltair Veerayya", director: "Bobby Kolli", year: 2023 },
  ],
  // Puzzle 9
  [
    { name: "Bommarillu", director: "Bhaskar", year: 2006 },
    { name: "Josh", director: "Vasu Varma", year: 2009 },
    { name: "Ye Maaya Chesave", director: "Gautham Menon", year: 2010 },
  ],
  // Puzzle 10
  [
    { name: "Indra", director: "S. S. Rajamouli", year: 2002 },
    { name: "Vikramarkudu", director: "S. S. Rajamouli", year: 2006 },
    { name: "Maryada Ramanna", director: "S. S. Rajamouli", year: 2010 },
  ],
  // Puzzle 11
  [
    { name: "Nuvvostanante Nenoddantana", director: "Prabhu Deva", year: 2005 },
    { name: "Happy Days", director: "Shekar Kammula", year: 2007 },
    { name: "Ishq", director: "Vikram Kumar", year: 2012 },
  ],
  // Puzzle 12
  [
    { name: "Nuvvu Naaku Nachav", director: "G. Nageswara Reddy", year: 2001 },
    { name: "Dookudu", director: "Sreenu Vaitla", year: 2011 },
    { name: "Julayi", director: "Trivikram Srinivas", year: 2012 },
  ],
  // Puzzle 13
  [
    { name: "Shankar Dada Zindabad", director: "Sreenu Vaitla", year: 2007 },
    { name: "Julayi", director: "Trivikram Srinivas", year: 2012 },
    { name: "A Aa", director: "Trivikram Srinivas", year: 2016 },
  ],
  // Puzzle 14
  [
    { name: "Bujjigadu", director: "Puri Jagannadh", year: 2008 },
    { name: "Mirchi", director: "Koratala Siva", year: 2013 },
    { name: "Baahubali 2: The Conclusion", director: "S. S. Rajamouli", year: 2017 },
  ],
  // Puzzle 15
  [
    { name: "Tagore", director: "V. V. Vinayak", year: 2003 },
    { name: "Simha", director: "S. S. Rajamouli", year: 2010 },
    { name: "Srimanthudu", director: "Koratala Siva", year: 2015 },
  ],
  // Puzzle 16
  [
    { name: "Anand", director: "Vikram Kumar", year: 2004 },
    { name: "Pournami", director: "Prabhu Deva", year: 2006 },
    { name: "Julayi", director: "Trivikram Srinivas", year: 2012 },
  ],
  // Puzzle 17
  [
    { name: "Gharana Mogudu", director: "K. Raghavendra Rao", year: 1992 },
    { name: "Pokiri", director: "Puri Jagannadh", year: 2006 },
    { name: "Pushpa: The Rise", director: "Sukumar", year: 2021 },
  ],
  // Puzzle 18
  [
    { name: "Kirayi Kotigadu", director: "B. Vittalacharya", year: 1973 },
    { name: "Magadheera", director: "S. S. Rajamouli", year: 2009 },
    { name: "Vikram Vedha", director: "Pushkar-Gayathri", year: 2017 },
  ],
  // Puzzle 19
  [
    { name: "Mayabazar", director: "K. V. Reddy", year: 1957 },
    { name: "Shobbai", director: "Dasari Narayana Rao", year: 1980 },
    { name: "Okkadu", director: "Gunasekhar", year: 2003 },
  ],
  // Puzzle 20
  [
    { name: "Pelli Chesi Choodu", director: "L. V. Prasad", year: 1952 },
    { name: "Khaidi", director: "A. Kodandarami Reddy", year: 1983 },
    { name: "Bommarillu", director: "Bhaskar", year: 2006 },
  ],
  // Puzzle 21
  [
    { name: "Gundamma Katha", director: "B. Vittalacharya", year: 1962 },
    { name: "Swayamkrushi", director: "K. Viswanath", year: 1987 },
    { name: "Arjun Reddy", director: "Sandeep Reddy Vanga", year: 2017 },
  ],
  // Puzzle 22
  [
    { name: "Devadasu", director: "Vedantam Raghavaiah", year: 1953 },
    { name: "Nuvvu Nenu", director: "Radhakrishna Jagarlamudi", year: 2001 },
    { name: "Eega", director: "S. S. Rajamouli", year: 2012 },
  ],
  // Puzzle 23
  [
    { name: "Missamma", director: "L. V. Prasad", year: 1955 },
    { name: "Sankarabharanam", director: "K. Viswanath", year: 1980 },
    { name: "Ala Vaikunthapurramuloo", director: "Trivikram Srinivas", year: 2020 },
  ],
  // Puzzle 24
  [
    { name: "Patala Bhairavi", director: "K. V. Reddy", year: 1951 },
    { name: "Rowdy Alludu", director: "Raghunath Reddy", year: 1991 },
    { name: "RRR", director: "S. S. Rajamouli", year: 2022 },
  ],
  // Puzzle 25
  [
    { name: "Brahmachari", director: "B. Vittalacharya", year: 1968 },
    { name: "Gharana Mogudu", director: "K. Raghavendra Rao", year: 1992 },
    { name: "Rangasthalam", director: "Sukumar", year: 2018 },
  ],
  // Puzzle 26
  [
    { name: "Lava Kusa", director: "Vedantam Raghavaiah", year: 1963 },
    { name: "Khaidi No. 150", director: "V. V. Vinayak", year: 2017 },
    { name: "Uppena", director: "Buchi Babu Sana", year: 2021 },
  ],
  // Puzzle 27
  [
    { name: "Daag", director: "Dasari Narayana Rao", year: 1985 },
    { name: "Ye Maaya Chesave", director: "Gautham Menon", year: 2010 },
    { name: "Srimanthudu", director: "Koratala Siva", year: 2015 },
  ],
  // Puzzle 28
  [
    { name: "Nartanasala", director: "Vedantam Raghavaiah", year: 1963 },
    { name: "Kushi", director: "Mani Ratnam", year: 2001 },
    { name: "Baahubali 2: The Conclusion", director: "S. S. Rajamouli", year: 2017 },
  ],
  // Puzzle 29
  [
    { name: "Bhale Mithrulu", director: "K. B. Tilak", year: 1993 },
    { name: "Okkadu", director: "Gunasekhar", year: 2003 },
    { name: "Aravinda Sametha", director: "Trivikram Srinivas", year: 2018 },
  ],
  // Puzzle 30
  [
    { name: "Sardar Paapineni", director: "A. Kodandarami Reddy", year: 1987 },
    { name: "Athadu", director: "Trivikram Srinivas", year: 2005 },
    { name: "Pushpa: The Rise", director: "Sukumar", year: 2021 },
  ],
];
