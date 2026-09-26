import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getCompletionScore = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    const resume = await db.get('SELECT id FROM resumes WHERE user_id = ? LIMIT 1', [userId]);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const steps = [
      { id: 'name', label: 'Full Name', weight: 10, completed: !!user.name },
      { id: 'email', label: 'Email Verified', weight: 10, completed: !!user.email },
      { id: 'skills', label: 'Add Skills', weight: 20, completed: !!user.skills },
      { id: 'bio', label: 'Professional Bio', weight: 15, completed: !!user.bio },
      { id: 'resume', label: 'Create/Upload Resume', weight: 30, completed: !!resume },
      { id: 'video', label: 'Video Introduction', weight: 15, completed: !!user.video_resume_url }
    ];

    const completedWeight = steps.reduce((acc, step) => acc + (step.completed ? step.weight : 0), 0);
    const missingSteps = steps.filter(s => !s.completed);

    res.json({
      score: completedWeight,
      steps,
      nextSteps: missingSteps.slice(0, 3),
      video_resume_url: user.video_resume_url
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating score', error: error.message });
  }
};

export const updateVideoResume = async (req, res) => {
  const { video_resume_url } = req.body;
  try {
    await db.run('UPDATE users SET video_resume_url = ? WHERE id = ?', [video_resume_url, req.user.id]);
    res.json({ message: 'Video resume updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating video resume', error: error.message });
  }
};

export const updateBioSkills = async (req, res) => {
  const { bio, skills } = req.body;
  try {
    await db.run('UPDATE users SET bio = ?, skills = ? WHERE id = ?', [bio, skills, req.user.id]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
