/**
 * Demo (offline) responses used when no AI endpoint is configured.
 * These keep every screen fully functional in development and demos.
 * Swap them out by setting VITE_AI_API_BASE_URL — see src/services/ai.js
 */

const SNIPPETS = {
  calculator: {
    Python: `# Simple Calculator — Code Genie demo output
def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def calculate(operation, a, b):
    operations = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
    }
    if operation not in operations:
        raise ValueError(f"Unknown operation: {operation}")
    return operations[operation](a, b)


if __name__ == "__main__":
    print("1) Add   2) Subtract   3) Multiply   4) Divide")
    choice = input("Choose an operation: ")
    first = float(input("First number: "))
    second = float(input("Second number: "))
    symbols = {"1": "+", "2": "-", "3": "*", "4": "/"}
    print("Result:", calculate(symbols.get(choice, "+"), first, second))`,
    JavaScript: `// Simple Calculator — Code Genie demo output
const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
  },
};

export function calculate(operation, a, b) {
  const handler = operations[operation];
  if (!handler) throw new Error(\`Unknown operation: \${operation}\`);
  return handler(a, b);
}

// --- Demo usage ---
try {
  const result = calculate("/", 10, 4);
  console.log("Result:", result); // 2.5
} catch (error) {
  console.error(error.message);
}`,
    Java: `// Simple Calculator — Code Genie demo output
import java.util.Scanner;

public class Calculator {

    public static double calculate(String op, double a, double b) {
        return switch (op) {
            case "+" -> a + b;
            case "-" -> a - b;
            case "*" -> a * b;
            case "/" -> {
                if (b == 0) throw new ArithmeticException("Cannot divide by zero");
                yield a / b;
            }
            default -> throw new IllegalArgumentException("Unknown operation: " + op);
        };
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter expression (+ - * /): ");
        String op = scanner.next();
        double a = scanner.nextDouble();
        double b = scanner.nextDouble();
        System.out.println("Result = " + calculate(op, a, b));
        scanner.close();
    }
}`,
    'C++': `// Simple Calculator — Code Genie demo output
#include <iostream>
#include <stdexcept>
using namespace std;

double calculate(char op, double a, double b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b == 0) throw runtime_error("Cannot divide by zero");
            return a / b;
        default: throw invalid_argument("Unknown operation");
    }
}

int main() {
    char op;
    double a, b;
    cout << "Enter (a op b): ";
    cin >> a >> op >> b;
    try {
        cout << "Result = " << calculate(op, a, b) << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
    }
    return 0;
}`,
  },

  todo: {
    Python: `# Todo List Manager — Code Genie demo output
from dataclasses import dataclass, field


@dataclass
class Task:
    title: str
    done: bool = False
    priority: int = 2


@dataclass
class TodoList:
    tasks: list = field(default_factory=list)

    def add(self, title, priority=2):
        task = Task(title.strip(), False, priority)
        self.tasks.append(task)
        return task

    def complete(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index].done = True
            return True
        return False

    def pending(self):
        return [t for t in self.tasks if not t.done]

    def render(self):
        for i, task in enumerate(self.tasks, start=1):
            mark = "x" if task.done else " "
            print(f"[{mark}] {i}. {task.title} (P{task.priority})")


if __name__ == "__main__":
    todo = TodoList()
    todo.add("Design the API contract", 1)
    todo.add("Write the React components")
    todo.add("Ship the first release", 1)
    todo.complete(1)
    todo.render()`,
    JavaScript: `// Todo List Manager — Code Genie demo output
export class TodoList {
  constructor() {
    this.tasks = [];
  }

  add(title, priority = 2) {
    const task = { id: Date.now(), title: title.trim(), done: false, priority };
    this.tasks.push(task);
    return task;
  }

  complete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) task.done = true;
    return task;
  }

  remove(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  pending() {
    return this.tasks.filter((t) => !t.done);
  }

  toJSON() {
    return { total: this.tasks.length, pending: this.pending().length, tasks: this.tasks };
  }
}

// Demo usage
const list = new TodoList();
list.add("Design the API contract", 1);
list.add("Write the React components");
console.log(JSON.stringify(list.toJSON(), null, 2));`,
  },

  sort: {
    Python: `# Sorting utilities — Code Genie demo output
def bubble_sort(values):
    """Return a new list sorted with bubble sort (O(n^2))."""
    data = list(values)
    n = len(data)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if data[j] > data[j + 1]:
                data[j], data[j + 1] = data[j + 1], data[j]
                swapped = True
        if not swapped:
            break
    return data


def quick_sort(values):
    """Pythonic quick sort using list comprehensions."""
    if len(values) <= 1:
        return list(values)
    pivot = values[len(values) // 2]
    left = [v for v in values if v < pivot]
    middle = [v for v in values if v == pivot]
    right = [v for v in values if v > pivot]
    return quick_sort(left) + middle + quick_sort(right)


if __name__ == "__main__":
    numbers = [42, 7, 19, 3, 88, 24, 1]
    print("Bubble:", bubble_sort(numbers))
    print("Quick :", quick_sort(numbers))`,
    JavaScript: `// Sorting utilities — Code Genie demo output
export function bubbleSort(input) {
  const data = [...input];
  for (let i = 0; i < data.length; i++) {
    let swapped = false;
    for (let j = 0; j < data.length - i - 1; j++) {
      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return data;
}

export const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((v) => v < pivot);
  const middle = arr.filter((v) => v === pivot);
  const right = arr.filter((v) => v > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
};

// Demo usage
const numbers = [42, 7, 19, 3, 88, 24, 1];
console.log("Bubble:", bubbleSort(numbers));
console.log("Quick :", quickSort(numbers));`,
  },
};

const DEFAULTS = {
  Python: `# Generated by Code Genie
"""Reusable module generated from your natural language requirement."""


class DataProcessor:
    """Loads, validates and transforms records."""

    def __init__(self, records=None):
        self.records = records or []

    def add(self, record):
        if not isinstance(record, dict):
            raise TypeError("Each record must be a dictionary")
        self.records.append(record)
        return self

    def filter_by(self, **criteria):
        result = self.records
        for key, value in criteria.items():
            result = [r for r in result if r.get(key) == value]
        return result

    def summary(self):
        return {
            "total": len(self.records),
            "keys": sorted({k for r in self.records for k in r}),
        }


def main():
    processor = DataProcessor()
    processor.add({"name": "Ada", "role": "engineer"})
    processor.add({"name": "Linus", "role": "maintainer"})
    print("Summary:", processor.summary())
    print("Engineers:", processor.filter_by(role="engineer"))


if __name__ == "__main__":
    main()`,

  JavaScript: `// Generated by Code Genie
/**
 * Builds a small utility layer from your natural language requirement.
 */

export class ApiService {
  constructor(baseUrl, { timeout = 8000 } = {}) {
    this.baseUrl = baseUrl.replace(/\\/$/, "");
    this.timeout = timeout;
  }

  async request(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(\`\${this.baseUrl}\${path}\`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        signal: controller.signal,
        ...options,
      });
      if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  get(path) {
    return this.request(path, { method: "GET" });
  }

  post(path, body) {
    return this.request(path, { method: "POST", body: JSON.stringify(body) });
  }
}

export function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return \`\${value.toFixed(1)} \${units[unit]}\`;
}`,

  Java: `// Generated by Code Genie
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TaskService {

    private final List<Task> tasks = new ArrayList<>();

    public Task create(String title, int priority) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        Task task = new Task(title.trim(), priority, false);
        tasks.add(task);
        return task;
    }

    public Optional<Task> find(long id) {
        return tasks.stream().filter(t -> t.getId() == id).findFirst();
    }

    public List<Task> pending() {
        return tasks.stream().filter(t -> !t.isDone()).toList();
    }

    public record Task(long id, String title, int priority, boolean done) {
        public Task(String title, int priority, boolean done) {
            this(System.nanoTime(), title, priority, done);
        }
    }
}`,

  C: `/* Generated by Code Genie */
#include <stdio.h>
#include <string.h>

#define MAX_ITEMS 100

typedef struct {
    char name[64];
    int quantity;
} Item;

int add_item(Item *items, int count, const char *name, int quantity) {
    if (count >= MAX_ITEMS) {
        printf("Inventory is full\\n");
        return count;
    }
    snprintf(items[count].name, sizeof(items[count].name), "%s", name);
    items[count].quantity = quantity;
    return count + 1;
}

void print_inventory(const Item *items, int count) {
    printf("%-20s %10s\\n", "ITEM", "QUANTITY");
    for (int i = 0; i < count; i++) {
        printf("%-20s %10d\\n", items[i].name, items[i].quantity);
    }
}

int main(void) {
    Item items[MAX_ITEMS];
    int count = 0;
    count = add_item(items, count, "Mechanical Keyboard", 12);
    count = add_item(items, count, "USB-C Cable", 40);
    print_inventory(items, count);
    return 0;
}`,

  'C++': `// Generated by Code Genie
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Product {
    std::string name;
    double price;
    int stock;
};

class Inventory {
public:
    void add(const Product& product) { products_.push_back(product); }

    void print() const {
        for (const auto& p : products_) {
            std::cout << p.name << " - $" << p.price
                      << " (" << p.stock << " in stock)\\n";
        }
    }

    std::vector<Product> low_stock(int threshold) const {
        std::vector<Product> result;
        std::copy_if(products_.begin(), products_.end(),
                     std::back_inserter(result),
                     [threshold](const Product& p) { return p.stock < threshold; });
        return result;
    }

private:
    std::vector<Product> products_;
};

int main() {
    Inventory inventory;
    inventory.add({"Mechanical Keyboard", 89.99, 3});
    inventory.add({"USB-C Cable", 12.49, 60});
    inventory.print();
    return 0;
}`,

  'C#': `// Generated by Code Genie
using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeGenie.Inventory;

public class InventoryService
{
    private readonly List<Product> _products = new();

    public Product Add(string name, decimal price, int stock)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));

        var product = new Product(Guid.NewGuid(), name, price, stock);
        _products.Add(product);
        return product;
    }

    public IReadOnlyList<Product> LowStock(int threshold = 10) =>
        _products.Where(p => p.Stock < threshold).ToList();

    public void PrintReport()
    {
        foreach (var p in _products.OrderBy(p => p.Name))
            Console.WriteLine($"{p.Name,-24} {p.Price,10:C} {p.Stock,6}");
    }

    public record Product(Guid Id, string Name, decimal Price, int Stock);
}`,

  HTML: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Genie — Landing Page</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <nav class="nav">
        <span class="brand">Code Genie</span>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a class="btn" href="#cta">Get Started</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section class="hero" id="top">
        <h1>Turn Your Ideas Into Code</h1>
        <p>Your AI-powered coding assistant for generating, explaining and transforming code.</p>
        <a class="btn btn-primary" href="/signup">Start Coding</a>
      </section>

      <section class="features" id="features">
        <article class="card">
          <h2>AI Code Generator</h2>
          <p>Generate code from natural-language requirements.</p>
        </article>
      </section>
    </main>

    <footer class="site-footer">
      <p>&copy; 2026 Code Genie. Made with ♥ for developers.</p>
    </footer>

    <script src="app.js"></script>
  </body>
</html>`,

  CSS: `/* Generated by Code Genie */
:root {
  --blue: #168df5;
  --navy: #173b63;
  --off-white: #edf7f6;
}

* {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: "Inter", system-ui, sans-serif;
  background: var(--off-white);
  color: var(--navy);
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 720px;
  margin: 6rem auto 0;
  padding: 0 1.5rem;
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  background: var(--blue);
  color: #fff;
  box-shadow: 0 10px 30px rgba(22, 141, 245, 0.28);
}

.btn-primary:hover {
  transform: translateY(-2px);
}`,

  SQL: `-- Generated by Code Genie
CREATE TABLE developers (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(190) NOT NULL UNIQUE,
    language    VARCHAR(40)  NOT NULL DEFAULT 'JavaScript',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    developer_id  INT NOT NULL,
    title         VARCHAR(160) NOT NULL,
    stars         INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_developer FOREIGN KEY (developer_id)
        REFERENCES developers(id) ON DELETE CASCADE
);

-- Most active developers with their project counts
SELECT
    d.name,
    d.language,
    COUNT(p.id)      AS project_count,
    SUM(p.stars)     AS total_stars
FROM developers d
LEFT JOIN projects p ON p.developer_id = d.id
GROUP BY d.id, d.name, d.language
HAVING COUNT(p.id) > 0
ORDER BY total_stars DESC
LIMIT 10;`,

  PHP: `<?php
// Generated by Code Genie
declare(strict_types=1);

class Mailer
{
    private array $queue = [];

    public function __construct(
        private string $fromAddress,
        private string $fromName = "Code Genie"
    ) {
    }

    public function queue(string $to, string $subject, string $body): void
    {
        $this->queue[] = compact("to", "subject", "body");
    }

    public function flush(): int
    {
        $sent = 0;
        foreach ($this->queue as $mail) {
            $headers = sprintf("From: %s <%s>", $this->fromName, $this->fromAddress);
            if (mail($mail["to"], $mail["subject"], $mail["body"], $headers)) {
                $sent++;
            }
        }
        $this->queue = [];
        return $sent;
    }
}

$mailer = new Mailer("hello@codegenie.dev");
$mailer->queue("dev@example.com", "Your code is ready", "Open Code Genie to review it.");
echo "Queued emails: 1\\n";`,
};

function pickTemplate(language, prompt = '') {
  const text = prompt.toLowerCase();
  const bank = /(calculat|arithmetic|add(ition)?\b|subtract|multiply|divide)/.test(text)
    ? SNIPPETS.calculator
    : /(todo|to-do|task list|checklist)/.test(text)
      ? SNIPPETS.todo
      : /(sort|bubble|quick.?sort|order.*list)/.test(text)
        ? SNIPPETS.sort
        : null;

  if (bank && bank[language]) return bank[language];
  return DEFAULTS[language] || DEFAULTS.JavaScript;
}

export function demoCode(language, requirement) {
  return pickTemplate(language, requirement);
}

/* ------------------------------------------------------------------ */
/* Code explanation demo                                               */
/* ------------------------------------------------------------------ */

export function demoExplanation(language, code = '') {
  const lines = code.split('\n').filter((l) => l.trim().length);
  const fnMatches = code.match(/^\s*(?:def|function|public|private|static|export|async)\s+\w+|\w+\s*\([^)]*\)\s*(?:=>|\{)/gm) || [];
  const hasClass = /\b(class|struct|interface|record)\b/.test(code);
  const name = language === 'Python' ? 'module' : language === 'SQL' ? 'query' : 'program';

  return {
    summary: `This ${name} is written in ${language} and contains ${lines.length} non-empty lines${
      hasClass ? ' organised around a class/struct that groups related data and behaviour' : ' organised as a small set of focused functions'
    }. In plain English: it takes some input, applies a few clear steps, and returns or prints a result. Nothing here requires advanced concepts — the logic is built from conditionals, loops and simple helper functions.`,
    steps: [
      {
        title: 'Set up the requirements',
        detail: `The file starts by importing or declaring what it needs, so the rest of the code can rely on those tools without re-defining them.`,
      },
      {
        title: 'Define the core helpers',
        detail: `Small functions/units are declared first. Each one does exactly one job, which keeps the logic easy to test and reuse.`,
      },
      {
        title: 'Apply the main logic',
        detail: `The main flow reads the input, runs a conditional check, then calls the matching helper to produce the result.`,
      },
      {
        title: 'Produce the output',
        detail: `Finally the result is returned to the caller (or printed to the console) so the caller can use it directly.`,
      },
    ],
    functions: fnMatches.slice(0, 5).map((raw, index) => {
      const clean = raw.replace(/^\s+/, '').replace(/\s*\([^)]*\).*$/, '').replace(/^(def|function|export|async|public|private|static)\s+/, '');
      return {
        name: clean || `helper_${index + 1}`,
        purpose: [
          'Validates the incoming data before any processing happens.',
          'Performs the main transformation requested by the caller.',
          'Formats the final result into a readable structure.',
        ][index % 3],
      };
    }),
    io: {
      inputs: [
        language === 'SQL' ? 'Rows already stored in the referenced tables' : 'Primary values passed as arguments (numbers, strings or objects)',
        'Optional configuration such as limits, flags or defaults',
      ],
      outputs: [
        language === 'SQL' ? 'A result set of matching rows with the selected columns' : 'The computed result returned to the caller',
        language === 'JavaScript' ? 'Console output when running the demo usage section' : 'Printed/printed-equivalent feedback during demo runs',
      ],
    },
    improvements: [
      'Add input validation with clear error messages for edge cases.',
      'Extract repeated logic into a single reusable helper.',
      `Add unit tests in ${language} covering the success and failure paths.`,
      'Document each public function with a short doc comment.',
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Project generator demo                                              */
/* ------------------------------------------------------------------ */

export function demoProject({ projectType, projectName, technology, features }) {
  const slug = (projectName || 'my-project')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'my-project';

  const featureLines = (features || '')
    .split(/[\n,]+/)
    .map((f) => f.trim())
    .filter(Boolean);

  const isReact = /react/i.test(technology || '') || /react/i.test(projectType || '');
  const isPython = /python/i.test(technology || '') || /python/i.test(projectType || '');
  const isMobile = /mobile/i.test(projectType || '');

  if (isReact || (!isPython && !isMobile)) {
    const structure = `${slug}/
├── public/
│   ├── favicon.svg
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests/
│   └── app.test.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vite.config.js`;

    const files = [
      {
        path: 'package.json',
        language: 'JSON',
        content: `{
  "name": "${slug}",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "lucide-react": "^0.454.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^3.4.17",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  }
}`,
      },
      {
        path: 'src/App.jsx',
        language: 'JavaScript',
        content: `import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}`,
      },
      {
        path: 'README.md',
        language: 'Markdown',
        content: `# ${projectName || slug}

${projectType || 'Web Application'} built with ${technology || 'React + Vite + Tailwind CSS'}.

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features
${featureLines.length ? featureLines.map((f) => `- ${f}`).join('\n') : '- Generated automatically by Code Genie'}
`,
      },
    ];

    return { structure, files, slug };
  }

  if (isPython) {
    const structure = `${slug}/
├── ${slug.replace(/-/g, '_')}/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── services.py
│   ├── utils.py
│   └── config.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── requirements.txt
├── pyproject.toml
├── .env.example
├── .gitignore
└── README.md`;

    const files = [
      {
        path: 'requirements.txt',
        language: 'Text',
        content: `fastapi==0.115.0
uvicorn[standard]==0.30.6
pydantic==2.9.2
pytest==8.3.3`,
      },
      {
        path: `${slug.replace(/-/g, '_')}/main.py`,
        language: 'Python',
        content: `"""Entry point for ${projectName || slug}."""
from services import process


def run() -> None:
    result = process({"source": "codegenie"})
    print("Result:", result)


if __name__ == "__main__":
    run()`,
      },
      {
        path: 'README.md',
        language: 'Markdown',
        content: `# ${projectName || slug}

${projectType} built with ${technology || 'Python'}.

## Getting started
\`\`\`bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python -m ${slug.replace(/-/g, '_')}.main
\`\`\`

## Features
${featureLines.length ? featureLines.map((f) => `- ${f}`).join('\n') : '- Generated automatically by Code Genie'}
`,
      },
    ];

    return { structure, files, slug };
  }

  // Mobile / other
  const structure = `${slug}/
├── app/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   └── Card.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── theme.js
├── assets/
│   └── images/
├── android/
├── ios/
├── package.json
└── README.md`;

  const files = [
    {
      path: 'package.json',
      language: 'JSON',
      content: `{
  "name": "${slug}",
  "version": "1.0.0",
  "main": "app/App.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "@react-navigation/native": "^6.1.18"
  }
}`,
    },
  ];

  return { structure, files, slug };
}
