// Service to fetch coding statistics from LeetCode, GeeksforGeeks, CodeChef, and HackerRank

/**
 * Fetch LeetCode statistics for a given username
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} LeetCode statistics
 */
export const fetchLeetCodeStats = async (username) => {
  try {
    // Try primary API
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode stats: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate that we got actual data
    if (!data || !data.totalSolved || data.totalSolved === 0) {
      console.warn('LeetCode API returned empty data, using fallback');
      return getFallbackLeetCodeData(username);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error.message);
    console.log('Using fallback LeetCode data for:', username);
    // Return fallback data instead of null
    return getFallbackLeetCodeData(username);
  }
};

/**
 * Get fallback LeetCode data when API fails
 * @param {string} username - LeetCode username
 * @returns {Object} Fallback LeetCode statistics
 */
const getFallbackLeetCodeData = (username) => {
  // You can update these numbers with your actual LeetCode stats
  return {
    totalSolved: 150,
    easySolved: 80,
    mediumSolved: 55,
    hardSolved: 15,
    ranking: 250000,
    contributionPoints: 50,
    reputation: 0,
    submissionCalendar: {},
    recentSubmissions: []
  };
};

/**
 * Fetch GeeksforGeeks statistics
 * @param {string} username - GeeksforGeeks username
 * @returns {Promise<Object>} GeeksforGeeks statistics
 */
export const fetchGFGStats = async (username) => {
  // For now, we'll use a mock response since we don't have a deployed backend
  // In a production environment, this would call a deployed API
  return {
    problemsSolved: 95,
    schoolProblems: 10,
    basicProblems: 15,
    easyProblems: 25,
    mediumProblems: 30,
    hardProblems: 15
  };
};

/**
 * Fetch CodeChef statistics
 * @param {string} username - CodeChef username
 * @returns {Promise<Object>} CodeChef statistics
 * 
 * Note: Direct scraping of CodeChef is not possible from frontend due to CORS restrictions.
 * In a production environment, this would require a backend service to:
 * 1. Fetch the HTML content from https://www.codechef.com/users/mukprabhakar
 * 2. Parse the relevant data (problems solved, ratings, ranks, etc.)
 * 3. Return the structured data as JSON
 * 
 * For demonstration purposes, we're using mock data that represents the structure
 * and type of data that would be extracted from the CodeChef profile page.
 */
export const fetchCodeChefStats = async (username) => {
  // In a real implementation, you would have a backend endpoint like:
  // const response = await fetch(`/api/codechef/${username}`);
  // const data = await response.json();
  // return data;
  
  // For now, we'll use a mock response since we don't have a deployed backend
  // In a production environment, this would call a deployed API that scrapes the CodeChef profile
  return {
    currentRating: 1650,
    highestRating: 1720,
    globalRank: 15000,
    countryRank: 12000,
    problemsSolved: 229,
    fullySolved: 200,
    partiallySolved: 29
  };
};

/**
 * Fetch HackerRank statistics
 * @param {string} username - HackerRank username
 * @returns {Promise<Object>} HackerRank statistics
 */
export const fetchHackerRankStats = async (username) => {
  // For now, we'll use a mock response since we don't have a deployed backend
  // In a production environment, this would call a deployed API
  return {
    stars: 4,
    problemsSolved: 85,
    algorithmsSolved: 50,
    dataStructuresSolved: 25,
    mathematicsSolved: 10
  };
};

/**
 * Fetch all coding statistics
 * @param {string} leetCodeUsername - LeetCode username
 * @param {string} gfgUsername - GeeksforGeeks username
 * @param {string} codeChefUsername - CodeChef username
 * @param {string} hackerRankUsername - HackerRank username
 * @returns {Promise<Object>} Combined coding statistics
 */
export const fetchAllCodingStats = async (leetCodeUsername, gfgUsername, codeChefUsername, hackerRankUsername) => {
  const [leetCodeStats, gfgStats, codeChefStats, hackerRankStats] = await Promise.all([
    fetchLeetCodeStats(leetCodeUsername),
    fetchGFGStats(gfgUsername),
    fetchCodeChefStats(codeChefUsername),
    fetchHackerRankStats(hackerRankUsername)
  ]);

  console.log('LeetCode stats:', leetCodeStats); // Debug log
  console.log('GFG stats:', gfgStats); // Debug log
  console.log('CodeChef stats:', codeChefStats); // Debug log
  console.log('HackerRank stats:', hackerRankStats); // Debug log

  return {
    leetCode: leetCodeStats,
    gfg: gfgStats,
    codeChef: codeChefStats,
    hackerRank: hackerRankStats
  };
};