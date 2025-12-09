export type GradeBand = 'K-5' | '6-8' | '9-12';
export type SubjectKey = 'Math' | 'Science';

export type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export const QUIZ_BANK: Record<GradeBand, Record<SubjectKey, QuizQuestion[]>> = {
    'K-5': {
        Math: [
            {
                id: 'k5-m-1',
                question: 'What is 7 + 5?',
                options: ['10', '11', '12', '15'],
                correctIndex: 2,
                explanation: '7 + 5 = 12. A good way to see it is 7 plus 3 makes 10, plus 2 more makes 12.',
            },
            {
                id: 'k5-m-2',
                question: 'Which fraction is equal to one half?',
                options: ['1/3', '2/4', '3/5', '2/3'],
                correctIndex: 1,
                explanation: 'If you divide something into 4 equal parts and take 2, that is the same as half.',
            },
            {
                id: 'k5-m-3',
                question: 'A box has 9 apples. You eat 3. How many apples are left?',
                options: ['3', '5', '6', '9'],
                correctIndex: 2,
                explanation: '9 minus 3 is 6. Subtraction tells us how many are left.',
            },
        ],
        Science: [
            {
                id: 'k5-s-1',
                question: 'Which of these is a planet in our solar system?',
                options: ['Mars', 'Orion', 'Polaris', 'Big Dipper'],
                correctIndex: 0,
                explanation: 'Mars is a planet. Orion, Polaris and Big Dipper are names related to stars and constellations.',
            },
            {
                id: 'k5-s-2',
                question: 'Water turning into ice is a change of:',
                options: ['Shape', 'Color', 'State', 'Taste'],
                correctIndex: 2,
                explanation: 'Water changing to ice is a change of state from liquid to solid.',
            },
            {
                id: 'k5-s-3',
                question: 'Which one is a living thing?',
                options: ['Rock', 'Cloud', 'Tree', 'Chair'],
                correctIndex: 2,
                explanation: 'Trees are living. They grow, use energy and respond to their environment.',
            },
        ],
    },
    '6-8': {
        Math: [
            {
                id: '68-m-1',
                question: 'What is 3/4 of 20?',
                options: ['5', '10', '15', '18'],
                correctIndex: 2,
                explanation: 'One quarter of 20 is 5. Three quarters is 3 × 5 which is 15.',
            },
            {
                id: '68-m-2',
                question: 'Solve for x: 2x + 5 = 17',
                options: ['4', '6', '8', '11'],
                correctIndex: 1,
                explanation: 'Subtract 5 on both sides: 2x = 12. Then divide by 2: x = 6.',
            },
            {
                id: '68-m-3',
                question: 'Which is equivalent to 40 percent?',
                options: ['1/2', '2/5', '1/4', '4/5'],
                correctIndex: 1,
                explanation: 'Forty percent is 40 out of 100. That simplifies to 2 out of 5.',
            },
        ],
        Science: [
            {
                id: '68-s-1',
                question: 'Cells are often called the building blocks of:',
                options: ['Light', 'Sound', 'Matter', 'Life'],
                correctIndex: 3,
                explanation: 'Cells are the basic unit of life. All living things are made of cells.',
            },
            {
                id: '68-s-2',
                question: 'Which form of energy do plants use to make their own food?',
                options: ['Light energy', 'Sound energy', 'Nuclear energy', 'Electrical energy'],
                correctIndex: 0,
                explanation: 'Plants use light energy in photosynthesis to make food from carbon dioxide and water.',
            },
            {
                id: '68-s-3',
                question: 'What is the main gas we breathe in that keeps us alive?',
                options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Helium'],
                correctIndex: 1,
                explanation: 'We need oxygen for respiration. Air has mostly nitrogen but the oxygen part is what our bodies use.',
            },
        ],
    },
    '9-12': {
        Math: [
            {
                id: '912-m-1',
                question: 'The function f(x) = 2x + 3. What is f(4)?',
                options: ['7', '8', '10', '11'],
                correctIndex: 3,
                explanation: 'Substitute x = 4 into 2x + 3 which gives 2 × 4 + 3 = 11.',
            },
            {
                id: '912-m-2',
                question: 'Solve for x: x² - 5x + 6 = 0',
                options: ['2 and 3', '1 and 6', '3 and 4', '2 and 6'],
                correctIndex: 0,
                explanation: 'Factor as (x - 2)(x - 3) = 0. So x = 2 or x = 3.',
            },
            {
                id: '912-m-3',
                question: 'The line through (1, 2) and (3, 6) has slope:',
                options: ['1', '2', '3', '4'],
                correctIndex: 1,
                explanation: 'Slope is change in y over change in x: (6 - 2) / (3 - 1) = 4 / 2 = 2.',
            },
        ],
        Science: [
            {
                id: '912-s-1',
                question: 'Which statement describes an element?',
                options: [
                    'A substance made of only one type of atom',
                    'A mixture of two metals',
                    'A substance that can always be broken into simpler substances by physical means',
                    'A solution of salt in water',
                ],
                correctIndex: 0,
                explanation: 'An element is a pure substance made of only one type of atom.',
            },
            {
                id: '912-s-2',
                question: 'In physics, velocity is:',
                options: [
                    'Speed with direction',
                    'Distance times time',
                    'Mass divided by volume',
                    'Energy per unit charge',
                ],
                correctIndex: 0,
                explanation: 'Velocity is speed in a particular direction.',
            },
            {
                id: '912-s-3',
                question: 'Which organelle is often called the power house of the cell?',
                options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
                correctIndex: 2,
                explanation: 'Mitochondria release energy during cellular respiration so they are often called the power house of the cell.',
            },
        ],
    },
};

export type LearningCode = 'V' | 'A' | 'K';

export type LearningQuestion = {
    id: string;
    question: string;
    options: { label: string; code: LearningCode }[];
};

export const LEARNING_QUESTIONS: LearningQuestion[] = [
    {
        id: 'lq1',
        question: 'When you are learning something new, what helps you most?',
        options: [
            { label: 'Seeing diagrams, pictures or charts', code: 'V' },
            { label: 'Listening to someone explain it step by step', code: 'A' },
            { label: 'Trying it myself and learning by doing', code: 'K' },
        ],
    },
    {
        id: 'lq2',
        question: 'How do you usually remember what you studied?',
        options: [
            { label: 'I picture the notes, pages or slides in my head', code: 'V' },
            { label: 'I remember what the teacher or tutor sounded like when they explained it', code: 'A' },
            { label: 'I remember the activity, experiment or problem I worked through', code: 'K' },
        ],
    },
    {
        id: 'lq3',
        question: 'If you get stuck on a hard problem, what do you prefer?',
        options: [
            { label: 'Seeing one more worked example or a step by step solution written out', code: 'V' },
            { label: 'Talking it through with someone while they guide me', code: 'A' },
            { label: 'Using blocks, drawing on a whiteboard or manipulating something to understand', code: 'K' },
        ],
    },
    {
        id: 'lq4',
        question: 'What kind of homework feels easiest to you?',
        options: [
            { label: 'Reading and highlighting notes or textbooks', code: 'V' },
            { label: 'Listening to explanations or recordings and then answering questions', code: 'A' },
            { label: 'Projects, experiments, building or creating something', code: 'K' },
        ],
    },
    {
        id: 'lq5',
        question: 'In an online class, which feature do you use most?',
        options: [
            { label: 'Screenshare, slides and on screen notes', code: 'V' },
            { label: 'Voice of the teacher or tutor and class discussions', code: 'A' },
            { label: 'Interactive tools like whiteboards, drag and drop activities or coding along', code: 'K' },
        ],
    },
    {
        id: 'lq6',
        question: 'Which compliment would make you happiest?',
        options: [
            { label: 'You spot patterns and see the big picture quickly', code: 'V' },
            { label: 'You listen carefully and explain ideas clearly in your own words', code: 'A' },
            { label: 'You learn fast when you can experiment and try things out', code: 'K' },
        ],
    },
];

export type LearningResult = {
    code: LearningCode;
    title: string;
    subtitle: string;
    description: string;
    suggestions: string[];
};

export const LEARNING_RESULTS: Record<LearningCode, LearningResult> = {
    V: {
        code: 'V',
        title: 'Your learning superpower: Visual Explorer',
        subtitle: 'You understand ideas best when you can see them',
        description:
            'You are strong at turning information into mental pictures. Diagrams, color coded notes and step by step worked examples help you move quickly from confusion to clarity.',
        suggestions: [
            'Ask your tutor to use diagrams and sketches when explaining new topics',
            'Use color coding and simple mind maps when you take notes',
            'Replay session recordings and pause to rewrite key steps in your own visual style',
        ],
    },
    A: {
        code: 'A',
        title: 'Your learning superpower: Sound Focused Learner',
        subtitle: 'You learn best by listening and speaking',
        description:
            'You remember explanations, stories and conversations. When you can talk through a problem or explain it back in your own words, ideas really stick.',
        suggestions: [
            'Ask your tutor to talk things through slowly and check in often',
            'Read definitions and solutions out loud when you revise',
            'Record short voice notes summarizing what you learned after each lesson',
        ],
    },
    K: {
        code: 'K',
        title: 'Your learning superpower: Hands On Builder',
        subtitle: 'You understand by doing and experimenting',
        description:
            'You like to move, build and experiment. You learn fastest when you can try examples yourself, interact with tools and see how ideas work in practice.',
        suggestions: [
            'Ask your tutor to give you lots of practice problems and interactive tasks',
            'Use the whiteboard and drawing tools actively in every session',
            'Turn abstract ideas into concrete examples or mini projects whenever you can',
        ],
    },
};
