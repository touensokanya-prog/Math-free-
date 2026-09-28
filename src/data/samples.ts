import { Category, SampleItem } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'math',
    nameKh: 'គណិតវិទ្យា',
    nameEn: 'General Math',
    iconName: 'Calculator',
    description: 'កន្សោមគណិតវិទ្យាទូទៅ ដេរីវេ អាំងតេក្រាល និងលីមីត',
    count: 3,
  },
  {
    id: 'equations',
    nameKh: 'សមីការ',
    nameEn: 'Equations',
    iconName: 'Variable',
    description: 'សមីការដឺក្រេទី២ ប្រព័ន្ធសមីការ និងវិសមីការ',
    count: 3,
  },
  {
    id: 'functions',
    nameKh: 'អនុគមន៍',
    nameEn: 'Functions',
    iconName: 'TrendingUp',
    description: 'អនុគមន៍សនិទាន អិចស្ប៉ូណង់ស្យែល និងលោការីត',
    count: 3,
  },
  {
    id: 'graphs',
    nameKh: 'ក្រាប',
    nameEn: 'Graphs & Plots',
    iconName: 'LineChart',
    description: 'ក្រាបអនុគមន៍ ប៉ារ៉ាបូល អ័ក្សកូអរដោនេ Oxy',
    count: 3,
  },
  {
    id: 'geometry',
    nameKh: 'ធរណីមាត្រ',
    nameEn: 'Geometry',
    iconName: 'Shapes',
    description: 'ត្រីកោណ រង្វង់ មុំ វ៉ិចទ័រ និងរូបធរណីមាត្រក្នុងលំហ',
    count: 3,
  },
  {
    id: 'tables',
    nameKh: 'តារាង',
    nameEn: 'Tables / BBT',
    iconName: 'TableProperties',
    description: 'តារាងអថេរភាព (BBT) តារាងសញ្ញា និងម៉ាទ្រីស',
    count: 3,
  },
  {
    id: 'statistics',
    nameKh: 'ស្ថិតិ',
    nameEn: 'Statistics',
    iconName: 'BarChart2',
    description: 'មធ្យមភាគ ម៉ូដ មេដ្យាន និងតារាងប្រេកង់',
    count: 2,
  },
  {
    id: 'probability',
    nameKh: 'ប្រូបាប',
    nameEn: 'Probability',
    iconName: 'Percent',
    description: 'បន្សំ ចម្រាស់ ដ្យាក្រាមដើមឈើ និងប្រូបាប',
    count: 2,
  },
  {
    id: 'tikz',
    nameKh: 'TikZ',
    nameEn: 'TikZ Graphics',
    iconName: 'PenTool',
    description: 'គំនូរ TikZ កម្រិតខ្ពស់ គំនូរប្លង់ និងវ៉ិចទ័រ 3D',
    count: 3,
  },
  {
    id: 'latex',
    nameKh: 'LaTeX',
    nameEn: 'Full XeLaTeX',
    iconName: 'FileCode2',
    description: 'ទម្រង់វិញ្ញាសាប្រឡងបាក់ឌុបពេញលេញ ភាសាខ្មែរ',
    count: 2,
  },
];

export const SAMPLES: SampleItem[] = [
  // 1. Math
  {
    id: 'sample-calc-integral',
    categoryId: 'math',
    titleKh: 'គណនាអាំងតេក្រាល និងលីមីត',
    titleEn: 'Definite Integral & Limit',
    description: 'ការគណនាអាំងតេក្រាលដោយផ្នែក និងលីមីតត្រីកោណមាត្រ',
    typeBadge: 'Calculus',
    promptSuggestion: 'បម្លែងរូបមន្តអាំងតេក្រាល និងលីមីតនេះទៅជា LaTeX ស្អាត',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{fontspec}
\\usepackage{polyglossia}
\\setmainlanguage{khmer}

\\begin{document}
\\section*{លំហាត់គណិតវិទ្យា៖ អាំងតេក្រាល និងលីមីត}

\\begin{enumerate}
    \\item គណនាអាំងតេក្រាលកំណត់ខាងក្រោម៖
    \\[
    I = \\int_{0}^{\\frac{\\pi}{2}} x^2 \\cos(2x) \\, dx
    \\]
    \\item គណនាលីមីតខាងក្រោម៖
    \\[
    L = \\lim_{x \\to 0} \\frac{\\sqrt{1+3x} - \\sqrt[3]{1+2x}}{\\sin(4x)}
    \\]
\\end{enumerate}
\\end{document}`,
    mathContent: `\\[
I = \\int_{0}^{\\frac{\\pi}{2}} x^2 \\cos(2x) \\, dx
\\]
\\[
L = \\lim_{x \\to 0} \\frac{\\sqrt{1+3x} - \\sqrt[3]{1+2x}}{\\sin(4x)}
\\]`,
    note: '• រកឃើញកន្សោមអាំងតេក្រាលដែលមានកន្សោមត្រីកោណមាត្រ\n• រកឃើញលីមីតរាងមិនកំណត់ 0/0\n• អត្ថបទខ្មែរ៖ "លំហាត់គណិតវិទ្យា", "គណនាអាំងតេក្រាល"',
  },
  {
    id: 'sample-math-derivatives',
    categoryId: 'math',
    titleKh: 'ដេរីវេ និងផលបូកគ្រួសារ',
    titleEn: 'Derivatives & Summation',
    description: 'ដេរីវេនៃអនុគមន៍ស្មុគស្មាញ និងផលបូករូបមន្ត',
    typeBadge: 'Analysis',
    promptSuggestion: 'បម្លែងដេរីវេ និងរូបមន្តបូកនេះទៅជា LaTeX',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
\\[
f'(x) = \\frac{d}{dx} \\left( \\frac{\\ln(x^2+1)}{\\sqrt{e^x + x}} \\right) = \\frac{\\frac{2x}{x^2+1}\\sqrt{e^x+x} - \\ln(x^2+1)\\frac{e^x+1}{2\\sqrt{e^x+x}}}{e^x+x}
\\]
\\[
S_n = \\sum_{k=1}^{n} \\frac{1}{k(k+1)} = \\sum_{k=1}^{n} \\left( \\frac{1}{k} - \\frac{1}{k+1} \\right) = 1 - \\frac{1}{n+1} = \\frac{n}{n+1}
\\]
\\end{document}`,
    mathContent: `\\[
f'(x) = \\frac{d}{dx} \\left( \\frac{\\ln(x^2+1)}{\\sqrt{e^x + x}} \\right)
\\]
\\[
S_n = \\sum_{k=1}^{n} \\frac{1}{k(k+1)} = \\frac{n}{n+1}
\\]`,
  },
  // 2. Equations
  {
    id: 'sample-eq-system',
    categoryId: 'equations',
    titleKh: 'ប្រព័ន្ធសមីការ និងម៉ាទ្រីស',
    titleEn: 'System of Linear Equations',
    description: 'ប្រព័ន្ធសមីការដឺក្រេទី១ មាន៣អញ្ញាត និងទម្រង់ម៉ាទ្រីស',
    typeBadge: 'Algebra',
    promptSuggestion: 'បម្លែងប្រព័ន្ធសមីការនេះជា LaTeX ដោយប្រើ pmatrix',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
\\[
\\begin{cases}
2x + 3y - z = 7 \\\\
4x - y + 5z = 18 \\\\
-x + 2y + 3z = 5
\\end{cases}
\\iff
\\begin{pmatrix}
2 & 3 & -1 \\\\
4 & -1 & 5 \\\\
-1 & 2 & 3
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y \\\\
z
\\end{pmatrix}
=
\\begin{pmatrix}
7 \\\\
18 \\\\
5
\\end{pmatrix}
\\]
\\end{document}`,
    mathContent: `\\[
\\begin{cases}
2x + 3y - z = 7 \\\\
4x - y + 5z = 18 \\\\
-x + 2y + 3z = 5
\\end{cases}
\\]`,
  },
  // 3. Functions
  {
    id: 'sample-func-rational',
    categoryId: 'functions',
    titleKh: 'អនុគមន៍សនិទាន និងអាស៊ីមតូត',
    titleEn: 'Rational Function & Asymptotes',
    description: 'សិក្សាអថេរភាពនៃអនុគមន៍ប្រភាគ និងកំណត់អាស៊ីមតូត',
    typeBadge: 'Rational Function',
    promptSuggestion: 'បម្លែងកន្សោមអនុគមន៍ និងការកំណត់អាស៊ីមតូត',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
\\[
y = f(x) = \\frac{2x^2 - 3x + 1}{x - 2} = 2x + 1 + \\frac{3}{x - 2}
\\]
\\text{អាស៊ីមតូតឈរ៖ } x = 2 \\quad \\text{ពីព្រោះ } \\lim_{x \\to 2^\\pm} f(x) = \\pm \\infty
\\\\[6pt]
\\text{អាស៊ីមតូតទ្រេត៖ } y = 2x + 1 \\quad \\text{ពីព្រោះ } \\lim_{x \\to \\pm\\infty} [f(x) - (2x+1)] = 0
\\end{document}`,
    mathContent: `\\[
y = f(x) = \\frac{2x^2 - 3x + 1}{x - 2} = 2x + 1 + \\frac{3}{x - 2}
\\]`,
  },
  // 4. Graphs
  {
    id: 'sample-graph-cubic',
    categoryId: 'graphs',
    titleKh: 'ក្រាបអនុគមន៍ដឺក្រេទី៣ (Cubic Graph)',
    titleEn: 'Cubic Function Graph with Oxy',
    description: 'ក្រាបអនុគមន៍ $y=x^3-3x+1$ មានអ័ក្សកូអរដោនេ និងចំណុចរបត់',
    typeBadge: 'TikZ Graph',
    promptSuggestion: 'បម្លែងរូបភាពក្រាបនេះជា TikZ ដោយមានអ័ក្ស Oxy ច្បាស់លាស់',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta,calc}

\\begin{document}
\\begin{center}
\\begin{tikzpicture}[scale=1.2, line cap=round, line join=round]
    % Axes
    \\draw[-{Stealth[length=2.5mm]}, thick] (-2.5,0) -- (2.5,0) node[right] {$x$};
    \\draw[-{Stealth[length=2.5mm]}, thick] (0,-2.5) -- (0,3.5) node[above] {$y$};
    \\node[below left] at (0,0) {$O$};
    
    % Grid marks
    \\foreach \\x in {-2,-1,1,2}
        \\draw (\\x,2pt) -- (\\x,-2pt) node[below, font=\\footnotesize] {$\\x$};
    \\foreach \\y in {-2,-1,1,2,3}
        \\draw (2pt,\\y) -- (-2pt,\\y) node[left, font=\\footnotesize] {$\\y$};
        
    % Cubic curve y = x^3 - 3x + 1
    \\draw[domain=-2.1:2.1, samples=150, smooth, thick, blue!80!black] 
        plot (\\x, {\\x^3 - 3*\\x + 1}) node[above right] {$(C): y = x^3 - 3x + 1$};
        
    % Critical points
    \\filldraw[red] (-1, 3) circle (2pt) node[above left, font=\\small] {$A(-1,3)$};
    \\filldraw[red] (1, -1) circle (2pt) node[below right, font=\\small] {$B(1,-1)$};
    \\filldraw[black] (0, 1) circle (2pt) node[above right, font=\\small] {$I(0,1)$};
    
    % Dashed lines
    \\draw[dashed, gray] (-1,0) -- (-1,3) -- (0,3);
    \\draw[dashed, gray] (1,0) -- (1,-1) -- (0,-1);
\\end{tikzpicture}
\\end{center}
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[scale=1.2, line cap=round, line join=round]
    \\draw[-{Stealth[length=2.5mm]}, thick] (-2.5,0) -- (2.5,0) node[right] {$x$};
    \\draw[-{Stealth[length=2.5mm]}, thick] (0,-2.5) -- (0,3.5) node[above] {$y$};
    \\node[below left] at (0,0) {$O$};
    
    \\foreach \\x in {-2,-1,1,2}
        \\draw (\\x,2pt) -- (\\x,-2pt) node[below, font=\\footnotesize] {$\\x$};
    \\foreach \\y in {-2,-1,1,2,3}
        \\draw (2pt,\\y) -- (-2pt,\\y) node[left, font=\\footnotesize] {$\\y$};
        
    \\draw[domain=-2.1:2.1, samples=150, smooth, thick, blue!80!black] 
        plot (\\x, {\\x^3 - 3*\\x + 1}) node[above right] {$(C): y = x^3 - 3x + 1$};
        
    \\filldraw[red] (-1, 3) circle (2pt) node[above left, font=\\small] {$A(-1,3)$};
    \\filldraw[red] (1, -1) circle (2pt) node[below right, font=\\small] {$B(1,-1)$};
    \\filldraw[black] (0, 1) circle (2pt) node[above right, font=\\small] {$I(0,1)$};
    
    \\draw[dashed, gray] (-1,0) -- (-1,3) -- (0,3);
    \\draw[dashed, gray] (1,0) -- (1,-1) -- (0,-1);
\\end{tikzpicture}`,
  },
  // 5. Geometry
  {
    id: 'sample-geom-pyramid',
    categoryId: 'geometry',
    titleKh: 'ពីរ៉ាមីត និងបន្ទាត់កែងក្នុងលំហ',
    titleEn: 'Space Geometry - Pyramid S.ABCD',
    description: 'រូបធរណីមាត្រក្នុងលំហ ពីរ៉ាមីតមានបាតជាការ៉េ និងបន្ទាត់ដាច់-ជាប់',
    typeBadge: 'Geometry 3D',
    promptSuggestion: 'បម្លែងរូបធរណីមាត្រលំហនេះជា TikZ ដោយរក្សាខ្សែកំបាំង (dashed lines)',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usetikzlibrary{calc,angles,quotes}

\\begin{document}
\\begin{center}
\\begin{tikzpicture}[scale=1.1, line join=round]
    % Coordinates
    \\coordinate (A) at (0,0);
    \\coordinate (B) at (3,-1);
    \\coordinate (C) at (6,0);
    \\coordinate (D) at (3,1);
    \\coordinate (S) at (3,4.5);
    \\coordinate (O) at (3,0); % Center of base
    
    % Visible lines
    \\draw[thick] (S)--(A) (S)--(B) (S)--(C) (A)--(B)--(C);
    
    % Hidden lines (dashed)
    \\draw[dashed, thick] (S)--(D) (A)--(D)--(C) (S)--(O);
    \\draw[dashed] (A)--(C) (B)--(D);
    
    % Points & Labels
    \\fill (S) circle (1.5pt) node[above] {$S$};
    \\fill (A) circle (1.5pt) node[left] {$A$};
    \\fill (B) circle (1.5pt) node[below] {$B$};
    \\fill (C) circle (1.5pt) node[right] {$C$};
    \\fill (D) circle (1.5pt) node[above right] {$D$};
    \\fill (O) circle (1.5pt) node[below] {$O$};
    
    % Right angle marker
    \\draw[dashed] (3,0.3) -- (3.3,0.3) -- (3.3,0);
\\end{tikzpicture}
\\end{center}
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[scale=1.1, line join=round]
    \\coordinate (A) at (0,0);
    \\coordinate (B) at (3,-1);
    \\coordinate (C) at (6,0);
    \\coordinate (D) at (3,1);
    \\coordinate (S) at (3,4.5);
    \\coordinate (O) at (3,0);
    
    \\draw[thick] (S)--(A) (S)--(B) (S)--(C) (A)--(B)--(C);
    \\draw[dashed, thick] (S)--(D) (A)--(D)--(C) (S)--(O);
    \\draw[dashed] (A)--(C) (B)--(D);
    
    \\fill (S) circle (1.5pt) node[above] {$S$};
    \\fill (A) circle (1.5pt) node[left] {$A$};
    \\fill (B) circle (1.5pt) node[below] {$B$};
    \\fill (C) circle (1.5pt) node[right] {$C$};
    \\fill (D) circle (1.5pt) node[above right] {$D$};
    \\fill (O) circle (1.5pt) node[below] {$O$};
\\end{tikzpicture}`,
  },
  {
    id: 'sample-geom-triangle',
    categoryId: 'geometry',
    titleKh: 'ត្រីកោណ និងបន្ទាត់ពុះមុំ',
    titleEn: 'Triangle & Incircle / Angle Bisector',
    description: 'ត្រីកោណ $ABC$ មានកម្ពស់ មេដ្យាន និងមុំកែង',
    typeBadge: '2D Geometry',
    promptSuggestion: 'បម្លែងរូបត្រីកោណនេះជា TikZ រក្សាមុំ និងឈ្មោះចំណុច',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{tikz}
\\usetikzlibrary{calc,angles,quotes}
\\begin{document}
\\begin{center}
\\begin{tikzpicture}[scale=1.2]
    \\coordinate (A) at (2,3.5);
    \\coordinate (B) at (0,0);
    \\coordinate (C) at (5,0);
    \\coordinate (H) at (2,0);
    \\coordinate (M) at (2.5,0);
    
    \\draw[thick] (A) -- (B) -- (C) -- cycle;
    \\draw[thick, blue] (A) -- (H);
    \\draw[thick, dashed, red] (A) -- (M);
    
    \\fill (A) circle (1.5pt) node[above] {$A$};
    \\fill (B) circle (1.5pt) node[below left] {$B$};
    \\fill (C) circle (1.5pt) node[below right] {$C$};
    \\fill (H) circle (1.5pt) node[below] {$H$};
    \\fill (M) circle (1.5pt) node[below] {$M$};
    
    % Right angle marker
    \\draw (2,0.3) -- (2.3,0.3) -- (2.3,0);
\\end{tikzpicture}
\\end{center}
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[scale=1.2]
    \\coordinate (A) at (2,3.5);
    \\coordinate (B) at (0,0);
    \\coordinate (C) at (5,0);
    \\coordinate (H) at (2,0);
    \\coordinate (M) at (2.5,0);
    
    \\draw[thick] (A) -- (B) -- (C) -- cycle;
    \\draw[thick, blue] (A) -- (H);
    \\draw[thick, dashed, red] (A) -- (M);
    
    \\fill (A) circle (1.5pt) node[above] {$A$};
    \\fill (B) circle (1.5pt) node[below left] {$B$};
    \\fill (C) circle (1.5pt) node[below right] {$C$};
    \\fill (H) circle (1.5pt) node[below] {$H$};
    \\fill (M) circle (1.5pt) node[below] {$M$};
    \\draw (2,0.3) -- (2.3,0.3) -- (2.3,0);
\\end{tikzpicture}`,
  },
  // 6. Tables / BBT
  {
    id: 'sample-table-bbt',
    categoryId: 'tables',
    titleKh: 'តារាងអថេរភាព (BBT / Variation Table)',
    titleEn: 'Table of Variation (BBT)',
    description: 'តារាងអថេរភាពនៃអនុគមន៍ដឺក្រេទី៣ មានសញ្ញាដេរីវេ និងព្រួញឡើងចុះ',
    typeBadge: 'BBT Table',
    promptSuggestion: 'បម្លែងតារាងអថេរភាព BBT នេះជា TikZ ឬ tabular ស្អាត',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{tikz}
\\begin{document}
\\begin{center}
\\begin{tikzpicture}[scale=1]
    % Border
    \\draw[thick] (0,0) rectangle (9,2.5);
    \\draw[thick] (0,1.7) -- (9,1.7);
    \\draw[thick] (0,0.9) -- (9,0.9);
    \\draw[thick] (1.5,0) -- (1.5,2.5);
    
    % Column 1
    \\node at (0.75,2.1) {$x$};
    \\node at (0.75,1.3) {$f'(x)$};
    \\node at (0.75,0.45) {$f(x)$};
    
    % Values of x
    \\node at (2.2,2.1) {$-\\infty$};
    \\node at (4,2.1) {$-1$};
    \\node at (6.5,2.1) {$1$};
    \\node at (8.3,2.1) {$+\\infty$};
    
    % Signs of f'(x)
    \\node at (3.1,1.3) {$+$};
    \\node at (4,1.3) {$0$};
    \\node at (5.25,1.3) {$-$};
    \\node at (6.5,1.3) {$0$};
    \\node at (7.4,1.3) {$+$};
    
    % Variations of f(x)
    \\node (minf) at (2.2,0.2) {$-\\infty$};
    \\node (max1) at (4,0.7) {$3$};
    \\node (min1) at (6.5,0.2) {$-1$};
    \\node (pinf) at (8.3,0.7) {$+\\infty$};
    
    \\draw[->, thick] (minf) -- (max1);
    \\draw[->, thick] (max1) -- (min1);
    \\draw[->, thick] (min1) -- (pinf);
\\end{tikzpicture}
\\end{center}
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[scale=1]
    \\draw[thick] (0,0) rectangle (9,2.5);
    \\draw[thick] (0,1.7) -- (9,1.7);
    \\draw[thick] (0,0.9) -- (9,0.9);
    \\draw[thick] (1.5,0) -- (1.5,2.5);
    
    \\node at (0.75,2.1) {$x$};
    \\node at (0.75,1.3) {$f'(x)$};
    \\node at (0.75,0.45) {$f(x)$};
    
    \\node at (2.2,2.1) {$-\\infty$};
    \\node at (4,2.1) {$-1$};
    \\node at (6.5,2.1) {$1$};
    \\node at (8.3,2.1) {$+\\infty$};
    
    \\node at (3.1,1.3) {$+$};
    \\node at (4,1.3) {$0$};
    \\node at (5.25,1.3) {$-$};
    \\node at (6.5,1.3) {$0$};
    \\node at (7.4,1.3) {$+$};
    
    \\node (minf) at (2.2,0.2) {$-\\infty$};
    \\node (max1) at (4,0.7) {$3$};
    \\node (min1) at (6.5,0.2) {$-1$};
    \\node (pinf) at (8.3,0.7) {$+\\infty$};
    
    \\draw[->, thick] (minf) -- (max1);
    \\draw[->, thick] (max1) -- (min1);
    \\draw[->, thick] (min1) -- (pinf);
\\end{tikzpicture}`,
  },
  // 7. Statistics
  {
    id: 'sample-stat-table',
    categoryId: 'statistics',
    titleKh: 'តារាងប្រេកង់ស្ថិតិ និងមធ្យមភាគ',
    titleEn: 'Frequency Table & Mean Calculation',
    description: 'តារាងទិន្នន័យស្ថិតិជាថ្នាក់ និងរូបមន្តគណនាមធ្យមភាគ',
    typeBadge: 'Statistics',
    promptSuggestion: 'បម្លែងតារាងស្ថិតិនេះជា LaTeX tabular និងរូបមន្តមធ្យម',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{array}
\\begin{document}
\\begin{center}
\\begin{tabular}{|c|c|c|c|}
\\hline
\\textbf{ថ្នាក់ពិន្ទុ} & \\textbf{តម្លៃកណ្តាល ($x_i$)} & \\textbf{ប្រេកង់ ($n_i$)} & \\textbf{$n_i \\cdot x_i$} \\\\
\\hline
$[10, 20)$ & $15$ & $4$ & $60$ \\\\
$[20, 30)$ & $25$ & $8$ & $200$ \\\\
$[30, 40)$ & $35$ & $12$ & $420$ \\\\
$[40, 50)$ & $45$ & $6$ & $270$ \\\\
\\hline
\\textbf{សរុប} & & $N = 30$ & $\\sum n_i x_i = 950$ \\\\
\\hline
\\end{tabular}
\\end{center}
\\[
\\bar{x} = \\frac{\\sum_{i=1}^{k} n_i x_i}{N} = \\frac{950}{30} \\approx 31.67
\\]
\\end{document}`,
    mathContent: `\\[
\\bar{x} = \\frac{\\sum_{i=1}^{k} n_i x_i}{N} = \\frac{950}{30} \\approx 31.67
\\]`,
  },
  // 8. Probability
  {
    id: 'sample-prob-tree',
    categoryId: 'probability',
    titleKh: 'ដ្យាក្រាមដើមឈើប្រូបាប (Tree Diagram)',
    titleEn: 'Probability Tree Diagram',
    description: 'ដ្យាក្រាមដើមឈើប្រូបាបមានមែក និងការគណនាបន្សំ $C_n^k$',
    typeBadge: 'Probability',
    promptSuggestion: 'បម្លែងដ្យាក្រាមដើមឈើប្រូបាបនេះទៅជា TikZ',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usetikzlibrary{trees}
\\begin{document}
\\begin{center}
\\begin{tikzpicture}[level distance=2.5cm,
  level 1/.style={sibling distance=3cm},
  level 2/.style={sibling distance=1.5cm}]
  \\coordinate
    child {node {$A$}
      child {node {$B$} edge from parent node[above left] {$P(B|A)=0.7$}}
      child {node {$\\bar{B}$} edge from parent node[below left] {$P(\\bar{B}|A)=0.3$}}
      edge from parent node[above left] {$P(A)=0.6$}
    }
    child {node {$\\bar{A}$}
      child {node {$B$} edge from parent node[above right] {$P(B|\\bar{A})=0.4$}}
      child {node {$\\bar{B}$} edge from parent node[below right] {$P(\\bar{B}|\\bar{A})=0.6$}}
      edge from parent node[below right] {$P(\\bar{A})=0.4$}
    };
\\end{tikzpicture}
\\end{center}
\\[
P(B) = P(A) \\cdot P(B|A) + P(\\bar{A}) \\cdot P(B|\\bar{A}) = (0.6)(0.7) + (0.4)(0.4) = 0.58
\\]
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[level distance=2.5cm,
  level 1/.style={sibling distance=3cm},
  level 2/.style={sibling distance=1.5cm}]
  \\coordinate
    child {node {$A$}
      child {node {$B$} edge from parent node[above left] {$0.7$}}
      child {node {$\\bar{B}$} edge from parent node[below left] {$0.3$}}
      edge from parent node[above left] {$0.6$}
    }
    child {node {$\\bar{A}$}
      child {node {$B$} edge from parent node[above right] {$0.4$}}
      child {node {$\\bar{B}$} edge from parent node[below right] {$0.6$}}
      edge from parent node[below right] {$0.4$}
    };
\\end{tikzpicture}`,
  },
  // 9. TikZ
  {
    id: 'sample-tikz-trig-circle',
    categoryId: 'tikz',
    titleKh: 'រង្វង់ត្រីកោណមាត្រ (Trigonometric Circle)',
    titleEn: 'Trigonometric Unit Circle',
    description: 'រង្វង់ឯកតា ស្វែងយល់ពីតម្លៃស៊ីនុស កូស៊ីនុស និងមុំសំខាន់ៗ',
    typeBadge: 'TikZ Art',
    promptSuggestion: 'បម្លែងរង្វង់ត្រីកោណមាត្រជា TikZ ដោយបង្ហាញមុំ pi/3',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{tikz}
\\usetikzlibrary{angles,quotes,calc}
\\begin{document}
\\begin{center}
\\begin{tikzpicture}[scale=2.2, cap=round, >=latex]
    % Coordinate axes
    \\draw[->] (-1.3,0) -- (1.4,0) node[right] {$\\cos \\alpha$};
    \\draw[->] (0,-1.3) -- (0,1.4) node[above] {$\\sin \\alpha$};
    \\draw (0,0) circle (1cm);
    
    \\node[below left] at (0,0) {$O$};
    \\node[below right] at (1,0) {$1$};
    \\node[above left] at (0,1) {$1$};
    
    % Angle alpha = 60 deg
    \\coordinate (O) at (0,0);
    \\coordinate (P) at (60:1cm);
    \\coordinate (Px) at ({cos(60)},0);
    \\coordinate (Py) at (0,{sin(60)});
    
    \\draw[thick, blue] (O) -- (P);
    \\draw[dashed, red] (P) -- (Px) node[below] {$\\frac{1}{2}$};
    \\draw[dashed, green!60!black] (P) -- (Py) node[left] {$\\frac{\\sqrt{3}}{2}$};
    
    \\fill[blue] (P) circle (1pt) node[above right] {$M(\\cos\\alpha, \\sin\\alpha)$};
    \\draw[->, thick, purple] (0.3,0) arc (0:60:0.3) node[midway, right] {$\\alpha = \\frac{\\pi}{3}$};
\\end{tikzpicture}
\\end{center}
\\end{document}`,
    tikzCode: `\\begin{tikzpicture}[scale=2.2, cap=round, >=latex]
    \\draw[->] (-1.3,0) -- (1.4,0) node[right] {$\\cos \\alpha$};
    \\draw[->] (0,-1.3) -- (0,1.4) node[above] {$\\sin \\alpha$};
    \\draw (0,0) circle (1cm);
    \\node[below left] at (0,0) {$O$};
    
    \\coordinate (O) at (0,0);
    \\coordinate (P) at (60:1cm);
    \\coordinate (Px) at ({cos(60)},0);
    \\coordinate (Py) at (0,{sin(60)});
    
    \\draw[thick, blue] (O) -- (P);
    \\draw[dashed, red] (P) -- (Px) node[below] {$\\frac{1}{2}$};
    \\draw[dashed, green!60!black] (P) -- (Py) node[left] {$\\frac{\\sqrt{3}}{2}$};
    \\fill[blue] (P) circle (1pt) node[above right] {$M$};
    \\draw[->, thick, purple] (0.3,0) arc (0:60:0.3) node[midway, right] {$\\frac{\\pi}{3}$};
\\end{tikzpicture}`,
  },
  // 10. LaTeX
  {
    id: 'sample-latex-bacii',
    categoryId: 'latex',
    titleKh: 'វិញ្ញាសាប្រឡងបាក់ឌុបពេញលេញ (XeLaTeX)',
    titleEn: 'Cambodia BacII National Exam Paper',
    description: 'ទម្រង់វិញ្ញាសាគណិតវិទ្យាថ្នាក់ទី១២ បាក់ឌុប រួមបញ្ចូលភាសាខ្មែរ',
    typeBadge: 'Exam Template',
    promptSuggestion: 'បម្លែងវិញ្ញាសាប្រឡងបាក់ឌុបខ្មែរនេះជា XeLaTeX document ពេញលេញ',
    latexCode: `\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{mathtools}
\\usepackage{tikz}
\\usepackage{geometry}
\\geometry{margin=2cm}

% XeLaTeX Khmer Support
\\usepackage{fontspec}
\\usepackage{polyglossia}
\\setmainlanguage{khmer}

\\begin{document}

\\begin{center}
    \\textbf{\\large ព្រះរាជាណាចក្រកម្ពុជា}\\\\
    \\textbf{\\large ជាតិ សាសនា ព្រះមហាក្សត្រ}\\\\[10pt]
    \\textbf{\\Large វិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)}\\\\
    \\textbf{សម័យប្រឡង៖ ២០២៦ \\quad សមាសភាព៖ គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្ត្រ)}
\\end{center}

\\hrule
\\vspace{10pt}

\\textbf{លំហាត់ទី១ (២៥ ពិន្ទុ)}
\\begin{enumerate}
    \\item ដោះស្រាយសមីការឌីផេរ៉ង់ស្យែល៖ $(E): y'' - 4y' + 3y = 0$
    \\item រកចម្លើយពិសេស $y(x)$ នៃសមីការ $(E)$ បើ $y(0) = 2$ និង $y'(0) = 4$។
\\end{enumerate}

\\textbf{លំហាត់ទី២ (៣៥ ពិន្ទុ)}
\\begin{enumerate}
    \\item គណនាចំនួនកុំផ្លិច៖ $z = \\frac{(1+i\\sqrt{3})^6}{(1-i)^4}$
    \\item សរសេរ $z$ ជាទម្រង់ត្រីកោណមាត្រ និងទម្រង់ពិជគណិត។
\\end{enumerate}

\\textbf{លំហាត់ទី៣ (៤០ ពិន្ទុ)}
គេឱ្យអនុគមន៍ $f(x) = \\frac{x^2 - x + 1}{x - 1}$ មានក្រាបតំណាង $(C)$។
\\begin{enumerate}
    \\item រកដែនកំណត់នៃអនុគមន៍ $f$។
    \\item គណនាលីមីតត្រង់ចុងដែនកំណត់ និងកូអរដោនេអាស៊ីមតូត។
    \\item គណនាដេរីវេ $f'(x)$ និងសង់តារាងអថេរភាព។
\\end{enumerate}

\\end{document}`,
    mathContent: `$(E): y'' - 4y' + 3y = 0$
\\[
z = \\frac{(1+i\\sqrt{3})^6}{(1-i)^4}
\\]
\\[
f(x) = \\frac{x^2 - x + 1}{x - 1}
\\]`,
    note: '• គំរូវិញ្ញាសាប្រឡងបាក់ឌុបជាតិកម្ពុជា\n• កូដ XeLaTeX គាំទ្រពុម្ពអក្សរខ្មែរតាម polyglossia & fontspec\n• បែងចែកតាមកម្រិតលំហាត់ទី១ ទី២ និងទី៣',
  },
];
