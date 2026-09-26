import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const checkAtsCompatibility = async (req, res) => {
  const { resumeText, jobId } = req.body;
  
  if (!resumeText || !jobId) {
    return res.status(400).json({ message: 'Resume text and Job ID are required' });
  }

  try {
    const job = await db.get('SELECT title, description, requirements FROM jobs WHERE id = ?', [jobId]);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const jobFullText = (job.title + ' ' + job.description + ' ' + (job.requirements || '')).toLowerCase();
    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    
    // Extract potential keywords from job description (simplified logic)
    const keywords = ['react', 'node.js', 'sql', 'javascript', 'typescript', 'python', 'aws', 'docker', 'kubernetes', 'ui/ux', 'agile', 'scrum', 'leadership', 'communication', 'problem solving', 'remote', 'full stack', 'backend', 'frontend', 'mobile'];
    
    const foundKeywords = [];
    const missingKeywords = [];
    
    keywords.forEach(kw => {
      if (jobFullText.includes(kw)) {
        if (resumeWords.includes(kw) || resumeText.toLowerCase().includes(kw)) {
          foundKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      }
    });

    // Calculate score
    const totalRelevantKeywords = foundKeywords.length + missingKeywords.length;
    let score = totalRelevantKeywords > 0 ? (foundKeywords.length / totalRelevantKeywords) * 100 : 50;
    
    // Adjust score based on length and structure stubs
    if (resumeText.length < 500) score -= 10;
    if (resumeText.length > 3000) score -= 5;
    
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Generate feedback
    const feedback = [];
    if (finalScore < 60) {
      feedback.push('Your resume is lacking critical keywords for this role.');
      feedback.push('Consider tailoring your experience section to highlight skills like: ' + missingKeywords.slice(0, 3).join(', '));
    } else if (finalScore < 85) {
      feedback.push('Great start! Your resume is quite relevant.');
      feedback.push('To reach the top 10%, add more details about: ' + missingKeywords.slice(0, 2).join(', '));
    } else {
      feedback.push('Excellent alignment! You have a high chance of passing the ATS screening.');
    }

    res.json({
      score: finalScore,
      foundKeywords,
      missingKeywords,
      feedback,
      jobTitle: job.title
    });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};
