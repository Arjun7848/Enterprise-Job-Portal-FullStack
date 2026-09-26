import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getRecommendedJobs = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await db.get('SELECT skills FROM users WHERE id = ?', [userId]);
    if (!user || !user.skills) {
      // Fallback: Return latest jobs if no skills are set
      const latestJobs = await db.all(`
        SELECT j.*, c.name as company_name, c.logo as company_logo 
        FROM jobs j 
        LEFT JOIN companies c ON j.company_id = c.id 
        ORDER BY j.posted_at DESC LIMIT 5
      `);
      return res.json(latestJobs.map(j => ({ ...j, match_score: 50 })));
    }

    const userSkills = user.skills.split(',').map(s => s.trim().toLowerCase());
    const allJobs = await db.all(`
      SELECT j.*, c.name as company_name, c.logo as company_logo 
      FROM jobs j 
      LEFT JOIN companies c ON j.company_id = c.id
    `);

    const recommendations = allJobs.map(job => {
      let score = 0;
      const jobText = (job.title + ' ' + job.description + ' ' + (job.requirements || '')).toLowerCase();
      
      userSkills.forEach(skill => {
        if (jobText.includes(skill)) {
          score += 20; // Increase score for each skill match
        }
      });

      // Cap score at 98% for realism
      const finalScore = Math.min(score + 30, 98); 
      return { ...job, match_score: finalScore };
    });

    // Sort by match score and return top 6
    const topMatches = recommendations
      .filter(job => job.match_score > 40)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 6);

    res.json(topMatches);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};
