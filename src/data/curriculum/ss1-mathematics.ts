import type { CurriculumTopic } from '../curriculum';

export const ss1MathematicsTopics: CurriculumTopic[] = [
  {
    id: 'ss1-maths-number-bases',
    title: 'Number Bases',
    name: 'Number Bases',
    description: 'Understanding different number systems and conversion between bases.',
    objectives: [
      'Explain the meaning of a number base.',
      'Convert numbers from one base to another.',
      'Perform basic arithmetic operations in different bases.',
    ],
    formulas: [],
    commonMistakes: [
      'Using digits that are not valid in the selected base.',
      'Confusing place values between different bases.',
    ],
    examTips: [
      'Always write the base clearly when working with non-decimal numbers.',
      'Check your answer by converting it back to base 10.',
    ],
    difficulty: 'Medium',
    minutes: 35,
    estimatedMinutes: 35,
    examRelevance: 'High',
    subtopics: [
      'Meaning of number bases',
      'Conversion from one base to base 10',
      'Conversion from base 10 to another base',
      'Conversion between other bases',
      'Arithmetic operations in number bases',
    ],
  },

  {
    id: 'ss1-maths-modular-arithmetic',
    title: 'Modular Arithmetic',
    name: 'Modular Arithmetic',
    description: 'Working with remainders and arithmetic under a given modulus.',
    objectives: [
      'Explain modular arithmetic.',
      'Find remainders using modular notation.',
      'Perform basic operations involving congruence.',
    ],
    formulas: [
      'a ≡ b (mod n)',
    ],
    commonMistakes: [
      'Confusing the modulus with the remainder.',
      'Forgetting that the remainder must be smaller than the modulus.',
    ],
    examTips: [
      'Identify the modulus before beginning the calculation.',
    ],
    difficulty: 'Medium',
    minutes: 30,
    estimatedMinutes: 30,
    examRelevance: 'Medium',
    subtopics: [
      'Remainders',
      'Congruence',
      'Modular addition',
      'Modular subtraction',
      'Modular multiplication',
    ],
  },

  {
    id: 'ss1-maths-indices',
    title: 'Indices',
    name: 'Indices',
    description: 'Laws and applications of indices and powers.',
    objectives: [
      'Apply the laws of indices.',
      'Simplify expressions involving powers.',
      'Solve simple equations involving indices.',
    ],
    formulas: [
      'aᵐ × aⁿ = aᵐ⁺ⁿ',
      'aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
      '(aᵐ)ⁿ = aᵐⁿ',
    ],
    commonMistakes: [
      'Adding indices when multiplying different bases.',
      'Forgetting that a zero index gives 1 for a non-zero base.',
    ],
    examTips: [
      'Look for a common base before applying the laws of indices.',
    ],
    difficulty: 'Medium',
    minutes: 40,
    estimatedMinutes: 40,
    examRelevance: 'High',
    subtopics: [
      'Positive integral indices',
      'Zero indices',
      'Negative indices',
      'Fractional indices',
      'Laws of indices',
    ],
  },

  {
    id: 'ss1-maths-logarithms',
    title: 'Logarithms',
    name: 'Logarithms',
    description: 'Understanding logarithms and their relationship with indices.',
    objectives: [
      'Explain the relationship between logarithms and indices.',
      'Apply basic laws of logarithms.',
      'Solve simple logarithmic equations.',
    ],
    formulas: [
      'logₐ(xy) = logₐx + logₐy',
      'logₐ(x/y) = logₐx − logₐy',
    ],
    commonMistakes: [
      'Using an invalid logarithm base.',
      'Applying logarithm laws to addition incorrectly.',
    ],
    examTips: [
      'Rewrite logarithmic expressions using the laws before calculating.',
    ],
    difficulty: 'Hard',
    minutes: 45,
    estimatedMinutes: 45,
    examRelevance: 'High',
    subtopics: [
      'Meaning of logarithms',
      'Relationship between indices and logarithms',
      'Laws of logarithms',
      'Common logarithms',
      'Simple logarithmic equations',
    ],
  },

  {
    id: 'ss1-maths-sequences',
    title: 'Sequences and Series',
    name: 'Sequences and Series',
    description: 'Patterns, arithmetic sequences and geometric sequences.',
    objectives: [
      'Identify patterns in sequences.',
      'Find the nth term of an arithmetic sequence.',
      'Calculate sums of arithmetic sequences.',
    ],
    formulas: [
      'Tₙ = a + (n − 1)d',
      'Sₙ = n/2[2a + (n − 1)d]',
    ],
    commonMistakes: [
      'Confusing the common difference with the first term.',
      'Using the wrong value of n.',
    ],
    examTips: [
      'Write down a, d and n before applying the formula.',
    ],
    difficulty: 'Medium',
    minutes: 45,
    estimatedMinutes: 45,
    examRelevance: 'High',
    subtopics: [
      'Number patterns',
      'Arithmetic progression',
      'Common difference',
      'Nth term',
      'Sum of an arithmetic progression',
    ],
  },
];
