import bcrypt from 'bcrypt';

export const seedDatabase = async (db) => {
  try {
    // Check if jobs or companies already exist
    const companyCount = await db.get('SELECT COUNT(*) as count FROM companies');
    if (companyCount && companyCount.count > 0) {
      return; // Already seeded
    }

    console.log('🌱 Seeding database with comprehensive demo data...');

    // 1. Seed Recruiter & Seeker users
    const recruiterPass = await bcrypt.hash('recruiter123', 10);
    const seekerPass = await bcrypt.hash('seeker123', 10);

    const recruiterResult = await db.run(
      `INSERT OR IGNORE INTO users (name, email, password, role, skills, bio) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Sarah Jenkins',
        'recruiter@techcorp.com',
        recruiterPass,
        'recruiter',
        'Talent Acquisition, Technical Recruiting, HR',
        'Head of Technical Talent at TechCorp Global. Helping engineers find their dream roles.'
      ]
    );

    const seekerResult = await db.run(
      `INSERT OR IGNORE INTO users (name, email, password, role, skills, bio, video_resume_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Alex Rivera',
        'alex.dev@gmail.com',
        seekerPass,
        'seeker',
        'react, node.js, typescript, sql, tailwind css, aws, docker',
        'Passionate Full-Stack Engineer with 4+ years of experience building performant web apps.',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      ]
    );

    const recruiterId = recruiterResult.lastID || 2;
    const seekerId = seekerResult.lastID || 3;

    // 2. Seed Companies
    await db.run(`
      INSERT INTO companies (name, description, website, location, logo, industry, employee_count, founded_at, culture, recruiter_id)
      VALUES 
      (
        'TechCorp Global',
        'Leading enterprise cloud and software solutions empowering Fortune 500 enterprises.',
        'https://techcorp.io',
        'San Francisco, CA (Remote Friendly)',
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=200&auto=format&fit=crop&q=60',
        'Software & Cloud',
        '1000-5000',
        '2014',
        'Transparent, engineering-led culture with annual learning stipends and remote autonomy.',
        ${recruiterId}
      ),
      (
        'NovaAI Labs',
        'Pioneering artificial general intelligence, machine learning agents, and NLP tools.',
        'https://novaai.ai',
        'New York, NY',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60',
        'Artificial Intelligence',
        '250-500',
        '2021',
        'Fast-paced research environment prioritizing breakthroughs, curiosity, and rapid prototyping.',
        ${recruiterId}
      ),
      (
        'StripeWave Fintech',
        'Next-generation cross-border payment gateway and financial API infrastructure.',
        'https://stripewave.com',
        'Austin, TX (Hybrid)',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=60',
        'Financial Technology',
        '500-1000',
        '2018',
        'High-trust, security-first mindset with competitive equity packages and flexible hours.',
        ${recruiterId}
      ),
      (
        'CyberShield Security',
        'Zero-trust cloud infrastructure protection and real-time threat intelligence solutions.',
        'https://cybershield.net',
        'Seattle, WA',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=60',
        'Cybersecurity',
        '100-250',
        '2019',
        'Mission-driven defenders committed to privacy, resilience, and open-source contributions.',
        ${recruiterId}
      )
    `);

    // 3. Seed Jobs
    await db.run(`
      INSERT INTO jobs (title, description, type, location, salary_range, company_id, recruiter_id, requirements)
      VALUES
      (
        'Senior Full Stack Developer',
        'We are seeking a seasoned Senior Full Stack Developer to lead development on our core enterprise microservices. You will work closely with product and infrastructure teams to design scalable APIs and slick user interfaces.',
        'full-time',
        'San Francisco, CA (Remote)',
        '$130,000 - $160,000',
        1,
        ${recruiterId},
        'react, node.js, typescript, sql, aws, docker, microservices, 4+ years experience'
      ),
      (
        'Lead React & UI Engineer',
        'Shape the front-end architecture of our AI agent dashboard. Work with cutting-edge design systems, Framer Motion animations, and WebSockets for real-time telemetry.',
        'full-time',
        'New York, NY (Hybrid)',
        '$140,000 - $175,000',
        2,
        ${recruiterId},
        'react, typescript, tailwind css, state management, web sockets, ui/ux design'
      ),
      (
        'Cloud DevOps & Infrastructure Engineer',
        'Automate deployment pipelines and manage multi-region Kubernetes clusters on AWS. Ensure 99.99% uptime and bulletproof security across our high-throughput payment rails.',
        'full-time',
        'Austin, TX (Remote)',
        '$120,000 - $150,000',
        3,
        ${recruiterId},
        'docker, kubernetes, aws, terraform, ci/cd, linux, monitoring'
      ),
      (
        'AI / Machine Learning Engineer',
        'Train and fine-tune large language models and neural recommendation engines. Implement retrieval-augmented generation (RAG) pipelines and real-time inference APIs.',
        'full-time',
        'New York, NY',
        '$150,000 - $190,000',
        2,
        ${recruiterId},
        'python, pytorch, transformers, llms, rag, vector databases, api design'
      ),
      (
        'Junior Backend Developer',
        'Join our core payments engineering squad. You will write clean, well-tested REST APIs, optimize SQL database queries, and contribute to production releases.',
        'full-time',
        'Remote',
        '$75,000 - $95,000',
        1,
        ${recruiterId},
        'node.js, express, sql, javascript, rest api, git'
      ),
      (
        'Security Operations Analyst',
        'Monitor cloud events, investigate potential anomalies, conduct vulnerability assessments, and help automate incident response protocols.',
        'full-time',
        'Seattle, WA (Hybrid)',
        '$90,000 - $115,000',
        4,
        ${recruiterId},
        'cybersecurity, siem, linux, python, network protocols, incident response'
      )
    `);

    // 4. Seed Courses
    await db.run(`
      INSERT INTO courses (title, description, instructor, price, thumbnail, category, duration, lessons_count)
      VALUES
      (
        'Modern Full Stack Web Mastery 2026',
        'Master modern web development from zero to production using React, Node.js, Express, and SQLite/PostgreSQL.',
        'Sarah Jenkins & TechCorp Academy',
        0,
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
        'Web Development',
        '24 Hours',
        36
      ),
      (
        'System Design & Distributed Architectures',
        'Learn how tech giants design systems to handle millions of requests per second. Includes load balancing, caching, and sharding.',
        'David Chen, Principal Architect',
        499,
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
        'Architecture',
        '18 Hours',
        24
      ),
      (
        'Cracking the ATS & Behavioral Interview',
        'Optimize your technical resume for keyword parsers and master the STAR method for recruiter interviews.',
        'Elena Rostova, Executive Coach',
        0,
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60',
        'Career Prep',
        '8 Hours',
        12
      )
    `);

    // 5. Seed Blogs
    await db.run(`
      INSERT INTO blogs (title, content, author_id, thumbnail)
      VALUES
      (
        'Navigating the 2026 Tech Job Market: What Recruiters Actually Want',
        'The engineering hiring landscape has evolved dramatically with the rise of AI tools and automated screening. In this comprehensive breakdown, we analyze over 10,000 job descriptions to reveal the key traits top tech companies prioritize: solid fundamentals, end-to-end ownership, and system design comprehension.',
        1,
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60'
      ),
      (
        'How to Build an ATS-Optimized Resume That Gets 3x More Callbacks',
        'Applicant Tracking Systems parse thousands of resumes every day before a human ever reviews them. Learn the common formatting traps to avoid, how to align your skill keywords seamlessly with job descriptions, and why quantifiable metrics on your achievements make all the difference.',
        1,
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60'
      )
    `);

    // 6. Seed Reviews
    await db.run(`
      INSERT INTO reviews (company_id, user_id, rating, comment)
      VALUES
      (1, 1, 5, 'Exceptional engineering culture with great mentorship, transparent leadership, and realistic deadlines.'),
      (2, 1, 5, 'Incredible pace of innovation. Working on cutting edge AI models with the smartest team in the industry.'),
      (3, 1, 4, 'Great compensation, strong work-life balance, and top-tier tooling for developers.')
    `);

    console.log('✅ Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};
