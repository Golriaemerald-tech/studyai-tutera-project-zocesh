import type { ClassName, SubjectMeta, Topic } from "@/types";

const subjectDefs: Record<string, { icon: string; category: string }> = {
  Mathematics: { icon: "∑", category: "Core" },
  "English Language": { icon: "Aa", category: "Core" },
  Physics: { icon: "⚡", category: "Core" },
  Chemistry: { icon: "⚗", category: "Core" },
  Biology: { icon: "🧬", category: "Core" },
  Economics: { icon: "₦", category: "Social Sciences" },
  Government: { icon: "⚖", category: "Social Sciences" },
  Geography: { icon: "🌍", category: "Social Sciences" },
  Commerce: { icon: "▣", category: "Social Sciences" },
  Accounting: { icon: "₦", category: "Social Sciences" },
  "Literature in English": { icon: "📖", category: "Humanities" },
  "Civic Education": { icon: "◇", category: "Humanities" },
  History: { icon: "⌛", category: "Humanities" },
  "Computer Studies": { icon: "⌨", category: "Technology" },
  "Data Processing": { icon: "▤", category: "Technology" },
  "Information Technology": { icon: "◉", category: "Technology" },
};

type RawTopic = [string, string, string[], string | string[], string];

const topicSets: Record<string, RawTopic[]> = {
  Mathematics: [
    ["Number Bases", "Convert and perform operations in different bases", ["Understand bases", "Convert between bases", "Perform base arithmetic"], "Addition in base n follows carrying at n.", "Check that every digit is less than the base."],
    ["Algebraic Expressions", "Simplify, expand and factor algebraic expressions", ["Collect like terms", "Expand brackets", "Factor simple expressions"], "a(b+c)=ab+ac", "Do not combine unlike terms."],
    ["Linear Equations", "Solve equations and inequalities in one variable", ["Balance equations", "Solve brackets", "Represent solutions"], ["ax+b=c", "x=(c-b)/a"], "Reverse operations carefully."],
    ["Quadratic Equations", "Solve quadratic equations by factorisation and formula", ["Factor quadratics", "Use the quadratic formula", "Interpret roots"], "x=(-b±√(b²-4ac))/(2a)", "Use the correct signs for b and c."],
    ["Sequences and Series", "Arithmetic and geometric patterns", ["Find nth term", "Calculate sums", "Recognise patterns"], ["a_n=a+(n-1)d", "S_n=n/2(2a+(n-1)d)"], "Distinguish common difference from ratio."],
    ["Trigonometry", "Right-triangle ratios and applications", ["Use SOHCAHTOA", "Find unknown sides", "Solve angles"], ["sinθ=opposite/hypotenuse", "cosθ=adjacent/hypotenuse", "tanθ=opposite/adjacent"], "Check whether calculator is in degrees."],
    ["Statistics", "Collect, represent and interpret data", ["Mean/median/mode", "Tables and charts", "Range"], ["mean=sum/n"], "Order data before finding median."],
    ["Probability", "Basic probability and sample spaces", ["List outcomes", "Calculate probability", "Use complements"], ["P(E)=favourable/total"], "Probabilities lie between 0 and 1."],
    ["Mensuration", "Perimeter, area, surface area and volume", ["Choose formulas", "Apply units", "Solve composite shapes"], ["A_circle=πr²", "V_cylinder=πr²h"], "Keep units consistent."],
    ["Vectors", "Represent and operate on directed quantities", ["Column vectors", "Magnitude", "Addition"], ["|a|=√(x²+y²)"], "Vector direction matters."],
  ],
  "English Language": [
    ["Parts of Speech", "Identify and use major word classes", ["Nouns and pronouns", "Verbs and auxiliaries", "Adjectives and adverbs"], "A verb expresses action/state.", "Check a word's role in its sentence."],
    ["Tenses", "Use English tenses accurately", ["Present forms", "Past forms", "Perfect and progressive forms"], "Subject and verb must agree.", "Watch irregular past forms."],
    ["Concord", "Apply subject-verb agreement", ["Singular subjects", "Collective nouns", "Either/neither structures"], "Singular subjects generally take singular verbs.", "Ignore distracting phrases between subject and verb."],
    ["Comprehension", "Read, infer and answer questions", ["Main idea", "Inference", "Vocabulary in context"], "Answers should be supported by the passage.", "Do not import unsupported assumptions."],
    ["Summary Writing", "Extract key points concisely", ["Identify points", "Paraphrase", "Observe word limits"], "Use your own words.", "Avoid examples and repetition unless required."],
    ["Essay Writing", "Plan and produce effective essays", ["Introduction", "Paragraphing", "Conclusion"], "A paragraph should develop one main idea.", "Answer the exact question asked."],
    ["Figures of Speech", "Recognise common literary devices", ["Simile", "Metaphor", "Personification", "Irony"], "Simile commonly uses like/as.", "Name the device and explain its effect."],
    ["Vocabulary Development", "Build precision and context awareness", ["Synonyms", "Antonyms", "Context clues"], "Context determines meaning.", "Avoid choosing a synonym that changes tone."],
  ],
  Physics: [
    ["Measurement", "Physical quantities, units and instruments", ["SI units", "Accuracy", "Significant figures"], "SI base units include metre, kilogram and second.", "Distinguish accuracy from precision."],
    ["Motion", "Describe and calculate motion", ["Speed", "Velocity", "Acceleration"], ["v=u+at", "s=ut+½at²"], "Keep units consistent."],
    ["Forces", "Study force, mass and acceleration", ["Newton's laws", "Weight", "Friction"], ["F=ma", "W=mg"], "Mass and weight are different."],
    ["Work Energy Power", "Relate force, work and energy", ["Work done", "Kinetic energy", "Power"], ["W=Fd", "KE=½mv²", "P=W/t"], "Power measures rate, not total work."],
    ["Waves", "Understand wave properties and behaviour", ["Frequency", "Wavelength", "Reflection"], ["v=fλ"], "Frequency is not the same as speed."],
    ["Heat", "Thermal energy and transfer", ["Expansion", "Specific heat", "Conduction"], ["Q=mcΔT"], "Use the correct temperature difference."],
    ["Electricity", "Current, voltage, resistance and circuits", ["Ohm's law", "Series circuits", "Parallel circuits"], ["V=IR", "P=VI"], "Current is measured in amperes."],
    ["Magnetism", "Magnetic fields and electromagnetic effects", ["Fields", "Electromagnets", "Induction"], "Field lines indicate direction.", "Do not confuse magnetic and electric fields."],
  ],
  Chemistry: [
    ["Matter and Atomic Structure", "Particles, atoms, ions and isotopes", ["Atomic number", "Mass number", "Electronic structure"], "Atomic number equals proton number.", "Isotopes have the same proton number."],
    ["Chemical Bonding", "Explain ionic, covalent and metallic bonding", ["Ions", "Molecules", "Valency"], "Ionic bonding involves electron transfer.", "Use valency to build formulae."],
    ["Mole Concept", "Relate mass, amount and particles", ["Moles", "Molar mass", "Avogadro constant"], ["n=m/M", "N=nN_A"], "Use molar mass in g mol⁻¹."],
    ["Acids Bases Salts", "Properties and reactions of acids and bases", ["pH", "Indicators", "Neutralisation"], ["pH=-log[H⁺]"], "Strong and concentrated are not identical ideas."],
    ["Periodic Table", "Patterns in elements", ["Groups", "Periods", "Trends"], "Group number often relates to valence electrons for main-group elements.", "Check the period before discussing shells."],
    ["Organic Chemistry", "Introductory hydrocarbons and functional groups", ["Alkanes", "Alkenes", "Homologous series"], ["alkanes C_nH_(2n+2)", "alkenes C_nH_(2n)"], "Use correct general formula for the series."],
    ["Rates of Reaction", "Factors affecting reaction speed", ["Temperature", "Concentration", "Catalysts"], "Catalysts lower activation energy.", "Explain particle-collision reasoning."],
    ["Electrolysis", "Chemical changes caused by electric current", ["Electrolytes", "Electrodes", "Products"], "Positive ions move to the cathode.", "Identify ions before predicting products."],
  ],
  Biology: [
    ["Cell Structure", "Structure and functions of cells", ["Organelles", "Plant vs animal cells", "Microscopy"], "The nucleus contains genetic material in eukaryotic cells.", "Match each organelle to its function."],
    ["Nutrition", "Modes of nutrition and food tests", ["Photosynthesis", "Balanced diet", "Food tests"], ["CO₂+H₂O→glucose+O₂"], "Photosynthesis requires light and chlorophyll."],
    ["Transport Systems", "Movement of substances in organisms", ["Diffusion", "Osmosis", "Circulation"], "Osmosis is water movement through a selectively permeable membrane.", "Direction depends on water potential/concentration context."],
    ["Respiration", "Energy release in living cells", ["Aerobic", "Anaerobic", "ATP concept"], ["glucose+oxygen→carbon dioxide+water+energy"], "Respiration is not the same as breathing."],
    ["Reproduction", "Asexual and sexual reproduction", ["Gametes", "Fertilisation", "Puberty"], "Sexual reproduction involves fusion of gametes.", "Distinguish fertilisation from implantation."],
    ["Genetics", "Inheritance and variation", ["Genes", "Alleles", "Punnett squares"], ["dominant allele masks recessive allele in a heterozygote"], "Genotype and phenotype are different."],
    ["Ecology", "Interactions among organisms and environment", ["Food chains", "Populations", "Cycles"], "Energy decreases along food chains.", "Use arrows to show energy transfer."],
    ["Evolution", "Variation, selection and adaptation", ["Variation", "Natural selection", "Evidence"], "Selection acts on heritable variation.", "Adaptation is a population-level concept."],
  ],
  Economics: [
    ["Basic Economic Concepts", "Scarcity, choice and opportunity cost", ["Needs/wants", "Scarcity", "Scale of preference"], "Opportunity cost is the next best alternative forgone.", "Identify the actual alternative."],
    ["Demand and Supply", "Market forces and equilibrium", ["Demand curve", "Supply curve", "Equilibrium"], ["PED=%ΔQd/%ΔP"], "Price changes cause movement along a curve; other factors can shift it."],
    ["Production", "Factors and processes of production", ["Land", "Labour", "Capital", "Entrepreneur"], "Capital is a produced factor of production.", "Do not equate capital only with money."],
    ["National Income", "Measures of economic activity", ["GDP", "GNP", "Per capita"], ["per capita income=national income/population"], "Know what each measure includes."],
    ["Money and Banking", "Functions of money and financial institutions", ["Money functions", "Commercial banks", "Central bank"], "Money is a medium of exchange, unit of account and store of value.", "Separate commercial and central bank roles."],
  ],
  Government: [
    ["Constitution", "Basic principles of constitutional government", ["Constitution types", "Rule of law", "Separation of powers"], "A constitution provides the framework for government.", "Distinguish written from unwritten systems."],
    ["Democracy", "Principles and institutions of democracy", ["Elections", "Participation", "Accountability"], "Democracy involves participation and accountability.", "Free elections require credible processes."],
    ["Political Parties", "Roles and organisation of parties", ["Manifestos", "Party functions", "Opposition"], "Parties aggregate interests and contest elections.", "A party is not the same as government."],
    ["Citizenship", "Rights, duties and civic participation", ["Rights", "Responsibilities", "National identity"], "Rights operate alongside civic responsibilities.", "Use constitutional context where relevant."],
  ],
  Geography: [
    ["Map Reading", "Interpret maps and basic spatial information", ["Scale", "Direction", "Symbols"], ["scale=map distance/ground distance"], "Keep map and ground units consistent."],
    ["Weather and Climate", "Atmospheric conditions and climate patterns", ["Elements", "Instruments", "Climate zones"], "Weather is short-term; climate is long-term pattern.", "Use accurate instruments."],
    ["Population", "Population distribution and change", ["Density", "Migration", "Growth"], ["density=population/area"], "Density is not total population."],
    ["Rocks", "Rock types and the rock cycle", ["Igneous", "Sedimentary", "Metamorphic"], "Rock type depends on formation process.", "Explain processes, not just labels."],
  ],
  Commerce: [
    ["Trade", "Meaning, types and functions of trade", ["Home trade", "Foreign trade", "Retail"], "Trade facilitates exchange between producers and consumers.", "Separate trade from aids to trade."],
    ["Business Ownership", "Forms of business organisation", ["Sole trader", "Partnership", "Company"], "Ownership affects liability and control.", "Compare advantages and disadvantages."],
    ["Aids to Trade", "Services supporting trade", ["Banking", "Insurance", "Transport", "Communication"], "Aids to trade make exchange easier.", "Know the specific role of each aid."],
  ],
  Accounting: [
    ["Accounting Principles", "Basic concepts and conventions", ["Entity", "Going concern", "Consistency"], "Business records are separated from personal records.", "Apply concepts to transactions."],
    ["Double Entry", "Debit and credit recording", ["Ledger", "Accounts", "Trial balance"], "Every transaction has at least two entries.", "Debit does not simply mean increase."],
    ["Final Accounts", "Basic financial statements", ["Trading account", "Profit and loss", "Balance sheet"], ["gross profit=sales-cost of sales"], "Classify capital and revenue items correctly."],
  ],
  "Literature in English": [
    ["Literary Genres", "Drama, prose and poetry", ["Features", "Structure", "Themes"], "Genre affects how a work is constructed.", "Use textual evidence."],
    ["Poetry", "Language, sound and imagery in poems", ["Imagery", "Rhyme", "Persona"], "The persona is the speaking voice, not automatically the poet.", "Explain effect, not just identify device."],
    ["Drama", "Elements of dramatic writing", ["Plot", "Character", "Stage directions"], "Drama is designed for performance.", "Consider dialogue and stage action."],
    ["Prose", "Narrative techniques and analysis", ["Point of view", "Setting", "Characterisation"], "Narrative perspective shapes what readers know.", "Support interpretations with details."],
  ],
  "Civic Education": [
    ["Citizenship", "Rights, duties and responsible citizenship", ["Rights", "Duties", "National values"], "Responsible citizenship includes respect for law and others.", "Distinguish rights from duties."],
    ["Democracy and Rule of Law", "Participation and lawful governance", ["Rule of law", "Elections", "Accountability"], "Rule of law means law applies within an ordered legal system.", "Avoid treating democracy as elections alone."],
    ["Human Rights", "Fundamental rights and responsibilities", ["Equality", "Freedom", "Dignity"], "Rights are balanced with lawful limits and responsibilities.", "Use precise terminology."],
  ],
  History: [
    ["Historical Sources", "How historians build knowledge", ["Primary sources", "Secondary sources", "Bias"], "A primary source originates from the period studied.", "Source value depends on context."],
    ["Pre-colonial Societies", "Selected West African states and societies", ["Political systems", "Economy", "Culture"], "Compare societies using evidence.", "Avoid generalising all pre-colonial societies."],
    ["Colonial Rule", "Colonial administration and responses", ["Administration", "Resistance", "Nationalism"], "Colonial systems differed by territory and period.", "Separate policies from local responses."],
  ],
  "Computer Studies": [
    ["Computer Fundamentals", "Hardware, software and information systems", ["CPU", "Memory", "Input/output"], "Hardware is physical; software is instructions.", "Do not confuse RAM with storage."],
    ["Data Representation", "How computers represent information", ["Binary", "Bits", "Bytes"], ["1 byte=8 bits"], "Binary uses only 0 and 1."],
    ["Algorithms", "Step-by-step problem solving", ["Flowcharts", "Pseudocode", "Logic"], "An algorithm must be finite and unambiguous.", "Trace each branch carefully."],
  ],
  "Data Processing": [
    ["Data Concepts", "Data, information and processing", ["Data types", "Information", "Processing cycle"], "Information is processed data that has meaning.", "Classify examples accurately."],
    ["Spreadsheets", "Organise and calculate data", ["Cells", "Formulas", "Functions"], ["SUM", "AVERAGE", "COUNT"], "Formula references must be correct."],
    ["Databases", "Organise structured records", ["Tables", "Fields", "Records"], "A field is an attribute/column; a record is a row of related values.", "Choose suitable keys."],
  ],
  "Information Technology": [
    ["Internet and Web", "Networks and web concepts", ["Browser", "URL", "HTTP"], "The web is a service that operates over networks.", "Do not equate internet with web."],
    ["Digital Safety", "Safe and responsible technology use", ["Passwords", "Phishing", "Privacy"], "Never share sensitive credentials casually.", "Verify links and senders."],
    ["Productivity Tools", "Digital tools for school and work", ["Documents", "Presentations", "Collaboration"], "Choose tools based on task requirements.", "Keep files organised and backed up."],
  ],
};

function buildClass(className: ClassName): Record<string, SubjectMeta> {
  const multiplier = className === "SS1" ? 0 : className === "SS2" ? 1 : 2;
  const out: Record<string, SubjectMeta> = {};
  for (const [subject, meta] of Object.entries(subjectDefs)) {
    let topics: Topic[] = (topicSets[subject] || []).map((t, i) => ({
      id: `${className}-${subject.replace(/\W/g, "")}-${i}`,
      subject,
      className,
      title: t[0],
      description: t[1],
      objectives: t[2],
      formulas: Array.isArray(t[3]) ? t[3] : [t[3]],
      commonMistakes: [t[4]],
      examTips: [
        "Define key terms precisely.",
        "Show working where applicable.",
        "Check the question before submitting.",
      ],
      difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Challenging",
      minutes: 25 + ((i + multiplier) % 4) * 10,
      examRelevance: className === "SS3" ? "High" : i % 2 ? "Medium" : "High",
    }));
    if (className !== "SS1" && topics.length) {
      topics = topics.concat(
        topics.slice(0, 2).map((x) => ({
          ...x,
          id: x.id + "-adv",
          title: x.title + " — Advanced Practice",
          difficulty: "Challenging",
          minutes: x.minutes + 15,
        }))
      );
    }
    out[subject] = { ...meta, topics };
  }
  return out;
}

export const classes: Record<ClassName, Record<string, SubjectMeta>> = {
  SS1: buildClass("SS1"),
  SS2: buildClass("SS2"),
  SS3: buildClass("SS3"),
};

export function allSubjectNames(): string[] {
  return Object.keys(subjectDefs);
}

export function subjectCategory(name: string): string {
  return subjectDefs[name]?.category ?? "Other";
}

export function subjectIcon(name: string): string {
  return subjectDefs[name]?.icon ?? "•";
}

export function getSubject(name: string, className: ClassName): SubjectMeta | null {
  return classes[className]?.[name] ?? null;
}

export function findTopic(className: ClassName, subject: string, title: string): Topic | null {
  return getSubject(subject, className)?.topics.find((t) => t.title === title) ?? null;
}
