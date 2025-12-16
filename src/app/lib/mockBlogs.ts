export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string; // Markdown or HTML
    author: string;
    date: string;
    image: string;
    category: string;
    readTime: string;
}

export const MOCK_BLOGS: BlogPost[] = [
    {
        id: '1',
        title: 'The Future of Online Learning: What to Expect in 2026',
        excerpt: 'Explore the emerging trends in EdTech, from AI-driven personalized tutoring to immersive VR classrooms.',
        content: `
# The Future of Online Learning

Online education has evolved rapidly over the last decade. As we look towards 2026, several key trends are emerging that promise to reshape how students learn and interact with material.

## 1. AI-Driven Personalization
Artificial Intelligence is no longer just a buzzword. In 2026, AI tutors will be standard, providing real-time feedback and adapting curriculum to each student's learning pace.

## 2. Immersive VR Classrooms
Imagine stepping into a virtual biology lab or walking through ancient Rome. VR technology is becoming more accessible, allowing for experiential learning from the comfort of home.

## 3. Micro-Learning
Attention spans are changing. Education is shifting towards "micro-learning"—bite-sized lessons that are easy to digest and retain.

Stay tuned as we continue to innovate at K12!
        `,
        author: 'Dr. Sarah Mitchell',
        date: '2025-12-10',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'EdTech',
        readTime: '5 min read'
    },
    {
        id: '2',
        title: '5 Tips for Aceing Your Math Finals',
        excerpt: 'Struggling with Calculus or Algebra? Here are field-tested strategies to boost your confidence and your grades.',
        content: `
# 5 Tips for Aceing Your Math Finals

Math finals can be daunting, but with the right preparation, you can conquer them.

1. **Practice Problems**: Don't just read the textbook. Solve problems.
2. **Understand the "Why"**: Don't memorize formulas; understand how they are derived.
3. **Teach It**: Try explaining a concept to a friend. If you can teach it, you know it.
4. **Sleep**: Your brain needs rest to consolidate memory.
5. **Stay Positive**: Confidence is half the battle.

Good luck!
        `,
        author: 'James Wilson',
        date: '2025-11-28',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'Study Tips',
        readTime: '3 min read'
    },
    {
        id: '3',
        title: 'Understanding the New SAT Format',
        excerpt: 'Everything you need to know about the digital SAT changes and how to prepare effectively.',
        content: `
# Understanding the New SAT Format

The SAT has gone digital, and with it come some significant changes.

- **Shorter Duration**: The test is now shorter, lasting just over 2 hours.
- **Adaptive Testing**: The difficulty of the second module depends on your performance in the first.
- **Calculator Allowed**: You can uses a calculator for the entire math section.

### How to Prepare
Familiarize yourself with the Bluebook app and take practice tests in the new digital format.
        `,
        author: 'K12 Team',
        date: '2025-10-15',
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'Test Prep',
        readTime: '4 min read'
    }
];
