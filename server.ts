import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Body parser with 50mb limit for high-resolution math exam scans and multiple pages
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI instance server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are a world-class Grandmaster expert in LaTeX, TikZ, Mathematical OCR, High School & University Olympiad Exam Reconstruction, Coordinate Geometry, Function Graphing, and Khmer/English mathematical document typesetting.

Your mission is to reconstruct uploaded mathematical images, scanned exam papers, phone camera photos, screenshots, or PDF pages into 100% faithful, pristine, highly aesthetic, compile-ready LaTeX and TikZ code with ABSOLUTELY ZERO LOSS of information.

CRITICAL QUALITY DIRECTIVES:
1. 100% FIDELITY & ZERO LOSS:
   - Extract EVERY single mathematical formula, equation, fraction, exponent, index, coefficient, square root, limit, derivative, integral, matrix, and geometric label.
   - Do NOT abbreviate or truncate code with comments like '% repeat for others' or '% ...'. Write the COMPLETE, full code for all problems, questions, sub-questions (a, b, c, d), options (A, B, C, D), and answers.
   - Preserve all numerical values, variables, signs (+, -, ±, ∓, ×, ÷, ·), set notations (∈, ∉, ⊂, ∪, ∩, ∅, ℝ, ℕ, ℤ, ℂ), relations (=, ≠, <, >, ≤, ≥, ≈, ≡, ⊥, ∥, ∽, ≅), and geometry notation (ΔABC, ∠ABC, AB⃗, ||AB||, AB ⊥ CD, arc AB).

2. TIKZ GEOMETRY & GRAPH RECONSTRUCTION (PRECISE, BEAUTIFUL & PIXEL-ALIGNED):
   - When any geometry diagram, triangle, circle, tangent, coordinate system (Oxy), 3D figure, or function curve is present:
     * Reconstruct it in TikZ using \\begin{tikzpicture}[...]...\\end{tikzpicture}.
     * Compute and specify accurate relative coordinates:
       \\coordinate (O) at (0,0);
       \\coordinate (A) at (...);
     * Draw accurate geometric components:
       - Circles: \\draw[thick] (O) circle (2.5cm);
       - Line segments: \\draw[thick] (A) -- (B);
       - Dashed auxiliary/hidden lines: \\draw[dashed] (S) -- (H);
       - Tangents, secants, altitudes, angle bisectors with precise right-angle marks (e.g. \\draw pic[draw, angle radius=3mm] {right angle = B--H--A}; or using calc / small squares).
       - Prominent vertices & points: \\fill (A) circle (1.5pt) node[above left] {$A$};
       - Accurate label placement (node positions: above, below, left, right, above left, above right, below left, below right).
     * For coordinate graphs (Function graphs):
       - Axes: \\draw[->, thick] (-4,0) -- (4.5,0) node[right] {$x$}; \\draw[->, thick] (0,-3) -- (0,4.5) node[above] {$y$};
       - Origin: \\node[below left] at (0,0) {$O$};
       - Ticks & coordinates along axes with dotted projection lines to curves: \\draw[dotted] (x,0) |- (0,y);
       - Plot smooth curves using domain and exact function expressions, or smooth cubic/quadratic curves:
         \\draw[thick, blue, smooth, samples=100, domain=-2.5:2.5] plot (\\x, {\\x^3 - 3*\\x + 1});
     * For variation tables (BBT / Bảng biến thiên / តារាងអថេរភាព):
       - Reconstruct using standard TikZ matrices or tkz-tab with exact rows for $x$, $f'(x)$ (with +, -, 0, ||), and $f(x)$ with arrows.

3. KHMER & MULTILINGUAL SCRIPT PRESERVATION:
   - Khmer text (e.g. 'វិញ្ញាសាប្រឡងបាក់ឌុប', 'គណិតវិទ្យា', 'ថ្នាក់ទី១២', 'ប្រធាន', 'លំហាត់ទី១', 'គណនា', 'ស្រាយបំភ្លឺថា', 'រកកូអរដោនេ', 'សង់ក្រាប', 'ដំណោះស្រាយ') MUST BE FULLY PRESERVED in its authentic Khmer script without converting or translating.
   - For fullDocument mode, provide a completely compilable XeLaTeX preamble configured for Khmer and English:
     \\documentclass[12pt,a4paper]{article}
     \\usepackage[margin=2cm]{geometry}
     \\usepackage{amsmath,amssymb,amsfonts,amsthm}
     \\usepackage{tikz}
     \\usetikzlibrary{arrows.meta,calc,angles,quotes,intersections,positioning,patterns,decorations.pathreplacing}
     \\usepackage{fontspec}
     \\usepackage{polyglossia}
     \\setmainlanguage{khmer}
     \\setotherlanguage{english}
     \\newfontfamily\\khmerfont[Script=Khmer]{Khmer OS Content} % or Noto Sans Khmer
     \\newfontfamily\\khmerfonttitle[Script=Khmer]{Khmer OS Muol Light}
     \\begin{document}
     ...
     \\end{document}

4. OUTPUT FORMATTING:
   - Provide clean, elegant LaTeX equations:
     * Inline math: $...$
     * Display formulas: \\[ ... \\] or \\begin{align*} ... \\end{align*}
     * Clean systems of equations: \\begin{cases} ... \\end{cases}
     * Tables: \\begin{tabular} ... \\end{tabular}

You must respond ONLY with a valid JSON object matching the following structure (raw valid JSON):
{
  "detectedType": "Short category description in Khmer & English (e.g. រូបធរណីមាត្រ & អនុគមន៍ (Geometry & Function Graph))",
  "fullDocument": "Complete compilable XeLaTeX document including documentclass, all TikZ libraries, packages, Khmer font specifications, and full content",
  "tikzOnly": "Complete pure TikZ snippet \\\\begin{tikzpicture}[...]...\\\\end{tikzpicture} reproducing the diagram faithfully, or empty string if purely text/formulas",
  "mathContent": "Extracted mathematical content, equations, problem statements, and solutions formatted cleanly in LaTeX",
  "note": "Detailed verification notes in Khmer and English: list of detected questions, points, coordinates, formulas, and guidance for compiling with XeLaTeX",
  "normalized": "Canonical cleaned math expressions line by line without document headers"
}`;

app.post('/api/convert', async (req, res) => {
  try {
    const { images, prompt, mode = 'full', options = {} } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one image or PDF page.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    // Prepare contents parts
    const parts: any[] = [];

    // Add each uploaded image / PDF page
    for (const img of images) {
      let base64Data = img.data;
      let mimeType = img.mimeType || 'image/png';

      // Strip data URI prefix if present
      if (base64Data.includes(';base64,')) {
        const split = base64Data.split(';base64,');
        base64Data = split[1];
        if (!img.mimeType && split[0].includes(':')) {
          mimeType = split[0].replace('data:', '');
        }
      }

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    // Build user instruction prompt
    const userPromptLines: string[] = [
      'CRITICAL OBJECTIVE: Reconstruct ALL content from the provided mathematical image(s) or document into ultra-high-fidelity LaTeX and TikZ with ABSOLUTELY ZERO DETAILS OMITTED.',
      `Target primary output mode: ${mode.toUpperCase()} (FULL = full compilable XeLaTeX document, TIKZ = standalone TikZ diagram, MATH = pure mathematical formulas).`,
      'Rules:',
      '1. NEVER skip, truncate, or summarize any part of the problem statement, choices, formulas, or steps.',
      '2. Reconstruct any geometrical figures, function curves, coordinate systems, or tables into elegant, pixel-precise TikZ code in "tikzOnly" and embed it directly into "fullDocument".',
      '3. Recreate all geometric labels (points A, B, C, D, O, angles, dashed lines, circle radius, tangent lines) exactly as shown.',
      '4. Preserve original language (Khmer script, English, or Vietnamese) faithfully.',
    ];

    if (options.bbt) {
      userPromptLines.push('Focus on Variation Table (BBT / តារាងអថេរភាព / Sign Table) with complete signs, arrows, and limits.');
    }
    if (options.dthi) {
      userPromptLines.push('Focus on Function Graph (Đồ thị / ក្រាបអនុគមន៍) with exact coordinate axes, curves, asymptotes, and extrema.');
    }
    if (options.hve) {
      userPromptLines.push('Focus on Geometric Figure (Hình vẽ / រូបធរណីមាត្រ) with exact points, segments, circles, angle markers, and labels.');
    }
    if (options.tikz) {
      userPromptLines.push('Generate high-fidelity TikZ code using appropriate TikZ libraries (arrows.meta, calc, angles, etc.).');
    }

    if (prompt && prompt.trim()) {
      userPromptLines.push(`User Custom Prompt / Specification: "${prompt.trim()}"`);
    }

    userPromptLines.push(
      'Respond with a valid JSON object matching the required schema with keys: detectedType, fullDocument, tikzOnly, mathContent, note, normalized.'
    );

    parts.push({
      text: userPromptLines.join('\n\n'),
    });

    // Call Gemini with high-throughput, vision-capable models
    // Primary: 'gemini-3.8-flash' (multimodal workhorse)
    // Secondary: 'gemini-3.1-flash-lite' (separate lightweight quota pool)
    // Tertiary: 'gemini-flash-latest' (alias for latest stable flash)
    // Note: Pro models on free-tier projects frequently have limit: 0 for input tokens
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ];

    let lastError: any = null;
    let response: any = null;

    for (const modelName of candidateModels) {
      // Try current model
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          });
          if (response && response.text) {
            break; // Succeeded!
          }
        } catch (err: any) {
          lastError = err;
          const errStr = String(err?.message || '');
          console.warn(`Model ${modelName} attempt ${attempt} failed:`, errStr);

          // Check if rate limited / quota exhausted
          const isQuota =
            errStr.includes('429') ||
            errStr.includes('RESOURCE_EXHAUSTED') ||
            errStr.includes('quota') ||
            errStr.includes('limit: 0');
          const isHighDemand =
            errStr.includes('503') ||
            errStr.includes('high demand') ||
            errStr.includes('UNAVAILABLE');

          if (isQuota) {
            // When free tier per-model quota is reached or limit is 0, immediately switch to the next fallback candidate model
            break;
          }

          if (isHighDemand && attempt < 2) {
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          break; // Move to next model
        }
      }
      if (response && response.text) {
        break;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Server busy. All candidate models are temporarily unavailable.');
    }

    const rawText = response.text || '{}';
    let parsed: any = {};
    try {
      // Direct parse or strip markdown code fences
      const cleanJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Initial JSON parse failed, extracting fields with regex:', parseErr);
      // Fallback regex extraction if model wrapped extra text
      const extractField = (fieldName: string) => {
        const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([\\s\\S]*?)(?<!\\\\)"`, 'i');
        const match = rawText.match(regex);
        if (match) {
          return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
        }
        return '';
      };

      parsed = {
        detectedType: extractField('detectedType') || 'Mathematical Document',
        fullDocument: extractField('fullDocument') || rawText,
        tikzOnly: extractField('tikzOnly') || '',
        mathContent: extractField('mathContent') || '',
        note: extractField('note') || 'OCR extraction completed.',
        normalized: extractField('normalized') || '',
      };
    }

    // Determine the primary code based on selected mode
    let primaryCode = parsed.fullDocument || '';
    if (mode === 'tikz' && parsed.tikzOnly) {
      primaryCode = parsed.tikzOnly;
    } else if (mode === 'math' && parsed.mathContent) {
      primaryCode = parsed.mathContent;
    } else if (!primaryCode) {
      primaryCode = parsed.tikzOnly || parsed.mathContent || rawText;
    }

    res.json({
      success: true,
      latexCode: primaryCode,
      fullDocument: parsed.fullDocument || primaryCode,
      tikzOnly: parsed.tikzOnly || '',
      mathContent: parsed.mathContent || '',
      note: parsed.note || 'Analysis completed successfully.',
      normalized: parsed.normalized || '',
      detectedType: parsed.detectedType || 'Mathematical Document',
    });
  } catch (error: any) {
    console.error('Gemini OCR Error:', error);
    let msg = error?.message || 'Failed to process mathematical image.';
    try {
      // If error message is serialized JSON from Google API
      if (typeof msg === 'string' && msg.trim().startsWith('{')) {
        const parsedErr = JSON.parse(msg);
        if (parsedErr?.error?.message) {
          msg = parsedErr.error.message;
        }
      }
    } catch {
      // keep msg as is
    }

    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      msg = 'ម៉ាស៊ីនបច្ចុប្បន្នកំពុងមានអ្នកប្រើច្រើន (High demand)។ សូមចុចប៊ូតុង "ព្យាយាមម្តងទៀត (Retry)" ដើម្បីដំណើរការឡើងវិញ។';
    } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
      // Look for retryDelay or seconds in error string
      const secMatch = msg.match(/retry in\s+([\d.]+)\s*s/i) || msg.match(/retryDelay"?\s*:\s*"?(\d+)s?"?/i);
      const seconds = secMatch ? Math.ceil(parseFloat(secMatch[1])) : 15;
      msg = `បានឈានដល់កម្រិតកំណត់សំណើ (Free Tier Quota Limit)។ សូមរង់ចាំប្រហែល ${seconds} វិនាទី រួចចុច "ព្យាយាមម្តងទៀត (Retry)"។`;
    }

    res.status(500).json({
      error: msg,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
