// Multi-language code example interface - Alag alag languages mein code
export interface CodeExample {
  javascript?: string;
  python?: string;
  cpp?: string;
  java?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  topics: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  price: number; // 0 means free, otherwise price in rupees
  funnyFact: string;
  content: {
    code: {
      title: string;
      languages: CodeExample; // Multi-language support
      explanation: string;
    }[];
    notes: string;
    animations: {
      title: string;
      description: string;
      type: 'css' | 'svg' | 'interactive';
      component?: string;
    }[];
    videos: {
      title: string;
      url: string;
      duration: string;
      description: string;
    }[];
  };
}

export const modules: Module[] = [
  {
    id: "javascript-basics",
    title: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript including variables, functions, and data types",
    category: "JavaScript",
    topics: 12,
    difficulty: "beginner",
    price: 0,
    funnyFact: "JavaScript was created in just 10 days by Brendan Eich in 1995! Imagine building the foundation of modern web in the time it takes to binge-watch a TV series! 😄",
    content: {
      code: [
        {
          title: "Variables and Data Types",
          languages: {
            javascript: `// Variable declarations - Yahan hum variables declare kar rahe hain
let name = "CodeMaster";  // let se variable declare karo jo change ho sakta hai
const age = 25;  // const se constant declare karo jo change nahi hoga
var isStudent = true;  // var use mat karo modern code mein

// Data types - JavaScript ke different data types
let number = 42;  // Number type - numerical values ke liye
let text = "Hello World";  // String type - text store karne ke liye
let isActive = false;  // Boolean type - true ya false values

// typeof operator se type check kar sakte hain
console.log(typeof number);  // Output: "number"
console.log(typeof text);  // Output: "string"`,
            python: `# Variable declarations - Yahan hum variables declare kar rahe hain
name = "CodeMaster"  # Python mein type specify nahi karna padta
age = 25  # Integer value
is_student = True  # Boolean value - Python mein True/False

# Data types - Python ke different data types
number = 42  # int type - integers ke liye
text = "Hello World"  # str type - text ke liye
is_active = False  # bool type - True ya False

# type() function se type check kar sakte hain
print(type(number))  # Output: <class 'int'>
print(type(text))  # Output: <class 'str'>`,
            cpp: `// Variable declarations - Yahan hum variables declare kar rahe hain
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "CodeMaster";  // string type - text ke liye
    int age = 25;  // int type - integers ke liye
    bool isStudent = true;  // bool type - true/false

    // Data types - C++ ke different data types
    int number = 42;  // Integer type
    double decimal = 3.14;  // Floating point
    char letter = 'A';  // Single character

    // typeid se type check kar sakte hain
    cout << typeid(number).name() << endl;  // Output: i (int)
    return 0;
}`,
            java: `// Variable declarations - Yahan hum variables declare kar rahe hain
public class DataTypes {
    public static void main(String[] args) {
        String name = "CodeMaster";  // String type - text ke liye
        int age = 25;  // int type - integers ke liye
        boolean isStudent = true;  // boolean type - true/false

        // Data types - Java ke different data types
        int number = 42;  // Integer type
        double decimal = 3.14;  // Double precision
        char letter = 'A';  // Single character

        // getClass() se type check kar sakte hain (for objects)
        System.out.println(((Object)number).getClass().getSimpleName());
    }
}`
          },
          explanation: "Variables store data values. Different languages have different syntax but concepts remain same."
        },
        {
          title: "Functions",
          languages: {
            javascript: `// Function declaration - Traditional tarika function banane ka
function greet(name) {
    return \`Hello, \${name}!\`;  // Template literal use karo
}

// Arrow function - Modern aur short syntax
const add = (a, b) => a + b;

// Function with default parameters
function createUser(name, role = "user") {
    return { name, role };
}

console.log(greet("Alice"));  // Output: "Hello, Alice!"
console.log(add(5, 3));  // Output: 8`,
            python: `# Function definition - def keyword se function banao
def greet(name):
    return f"Hello, {name}!"  # f-string use karo

# Lambda function - Short anonymous function
add = lambda a, b: a + b

# Function with default parameters
def create_user(name, role="user"):
    return {"name": name, "role": role}

print(greet("Alice"))  # Output: Hello, Alice!
print(add(5, 3))  # Output: 8`,
            cpp: `// Function declaration - Return type specify karo
#include <iostream>
#include <string>
using namespace std;

string greet(string name) {
    return "Hello, " + name + "!";
}

// Function with default parameters
int add(int a, int b = 0) {
    return a + b;
}

int main() {
    cout << greet("Alice") << endl;  // Output: Hello, Alice!
    cout << add(5, 3) << endl;  // Output: 8
    return 0;
}`,
            java: `// Method definition - Return type specify karo
public class Functions {
    // Static method - class ke saath call hoga
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }

    // Method overloading for default params
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(greet("Alice"));  // Output: Hello, Alice!
        System.out.println(add(5, 3));  // Output: 8
    }
}`
          },
          explanation: "Functions are reusable blocks of code. Each language has its own syntax for defining functions."
        },
        {
          title: "Arrays and Lists",
          languages: {
            javascript: `// Arrays - Multiple values ko store karne ka tarika
let fruits = ["apple", "banana", "orange"];

// Array methods
fruits.push("mango");  // End mein add karo
console.log(fruits);  // ["apple", "banana", "orange", "mango"]

// Modern array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);  // Har element ko 2x karo
const evenNumbers = numbers.filter(num => num % 2 === 0);  // Filter karo

console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(evenNumbers);  // [2, 4]`,
            python: `# Lists - Multiple values ko store karne ka tarika
fruits = ["apple", "banana", "orange"]

# List methods
fruits.append("mango")  # End mein add karo
print(fruits)  # ["apple", "banana", "orange", "mango"]

# List comprehensions - Pythonic way
numbers = [1, 2, 3, 4, 5]
doubled = [num * 2 for num in numbers]  # Har element ko 2x karo
even_numbers = [num for num in numbers if num % 2 == 0]  # Filter karo

print(doubled)  # [2, 4, 6, 8, 10]
print(even_numbers)  # [2, 4]`,
            cpp: `// Vectors - Dynamic arrays in C++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> fruits = {"apple", "banana", "orange"};
    
    // Vector methods
    fruits.push_back("mango");  // End mein add karo
    
    // Modern C++ with lambdas
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> doubled;
    
    // Transform - har element ko 2x karo
    transform(numbers.begin(), numbers.end(), 
              back_inserter(doubled), [](int n) { return n * 2; });
    
    for(int n : doubled) cout << n << " ";  // 2 4 6 8 10
    return 0;
}`,
            java: `// ArrayList - Dynamic arrays in Java
import java.util.*;
import java.util.stream.*;

public class ArraysExample {
    public static void main(String[] args) {
        ArrayList<String> fruits = new ArrayList<>(
            Arrays.asList("apple", "banana", "orange")
        );
        
        // ArrayList methods
        fruits.add("mango");  // End mein add karo
        System.out.println(fruits);
        
        // Stream API - Modern Java
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> doubled = numbers.stream()
            .map(n -> n * 2)  // Har element ko 2x karo
            .collect(Collectors.toList());
        
        System.out.println(doubled);  // [2, 4, 6, 8, 10]
    }
}`
          },
          explanation: "Arrays/Lists store ordered collections of data. Each language has its own methods for manipulation."
        },
        {
          title: "Loops and Iteration",
          languages: {
            javascript: `// For loop - Traditional counting loop
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// For...of loop - Array elements iterate karo
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
    console.log(fruit);  // apple, banana, orange
}

// forEach method - Callback function use karo
fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});

// While loop - Condition based
let count = 0;
while (count < 3) {
    console.log(count++);  // 0, 1, 2
}`,
            python: `# For loop - Range function se iterate karo
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# For loop - List elements iterate karo
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)  # apple, banana, orange

# Enumerate - Index ke saath iterate karo
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# While loop - Condition based
count = 0
while count < 3:
    print(count)
    count += 1  # 0, 1, 2`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // For loop - Traditional counting loop
    for (int i = 0; i < 5; i++) {
        cout << i << endl;  // 0, 1, 2, 3, 4
    }

    // Range-based for loop - Modern C++
    vector<string> fruits = {"apple", "banana", "orange"};
    for (const string& fruit : fruits) {
        cout << fruit << endl;
    }

    // While loop - Condition based
    int count = 0;
    while (count < 3) {
        cout << count++ << endl;  // 0, 1, 2
    }
    return 0;
}`,
            java: `public class LoopsExample {
    public static void main(String[] args) {
        // For loop - Traditional counting loop
        for (int i = 0; i < 5; i++) {
            System.out.println(i);  // 0, 1, 2, 3, 4
        }

        // Enhanced for loop - Array elements iterate karo
        String[] fruits = {"apple", "banana", "orange"};
        for (String fruit : fruits) {
            System.out.println(fruit);
        }

        // While loop - Condition based
        int count = 0;
        while (count < 3) {
            System.out.println(count++);  // 0, 1, 2
        }
    }
}`
          },
          explanation: "Loops allow you to repeat code. All languages support for, while, and enhanced iteration methods."
        }
      ],
      notes: `# JavaScript Fundamentals - Complete Guide

## 🎯 Overview
JavaScript is a **versatile, high-level programming language** that powers the modern web. Created in just 10 days by Brendan Eich in 1995, it has evolved into one of the most popular languages in the world.

> **Fun Fact**: JavaScript was originally called "Mocha", then "LiveScript", before finally becoming "JavaScript" as a marketing strategy to ride Java's popularity!

---

## 📦 Variables and Data Types

### Declaration Keywords
| Keyword | Scope | Reassignable | Hoisted | Best For |
|---------|-------|--------------|---------|----------|
| **let** | Block | ✅ Yes | ❌ No | Variables that change |
| **const** | Block | ❌ No | ❌ No | Constants, objects |
| **var** | Function | ✅ Yes | ✅ Yes | Avoid in modern code |

### Primitive Data Types
1. **String** - Text data: \`"Hello World"\`
2. **Number** - Integers and floats: \`42\`, \`3.14\`
3. **Boolean** - True/false: \`true\`, \`false\`
4. **Undefined** - Variable declared but not assigned
5. **Null** - Intentional absence of value
6. **Symbol** - Unique identifiers (ES6)
7. **BigInt** - Large integers (ES2020)

### Type Coercion
JavaScript automatically converts types in certain situations:
\`\`\`javascript
"5" + 3    // "53" (string concatenation)
"5" - 3    // 2 (numeric subtraction)
"5" == 5   // true (loose equality)
"5" === 5  // false (strict equality)
\`\`\`

---

## ⚡ Functions

### Function Types
1. **Function Declaration** - Hoisted, named
2. **Function Expression** - Not hoisted, can be anonymous
3. **Arrow Functions** - Concise syntax, lexical \`this\`
4. **IIFE** - Immediately Invoked Function Expression

### Parameters and Arguments
- **Default Parameters**: \`function greet(name = "Guest")\`
- **Rest Parameters**: \`function sum(...numbers)\`
- **Destructuring**: \`function user({ name, age })\`

### Closures
A closure gives access to an outer function's scope from an inner function:
\`\`\`javascript
function counter() {
  let count = 0;
  return () => ++count;
}
const increment = counter();
increment(); // 1
increment(); // 2
\`\`\`

---

## 📚 Arrays

### Common Array Methods
| Method | Purpose | Mutates? |
|--------|---------|----------|
| \`push()\` | Add to end | ✅ Yes |
| \`pop()\` | Remove from end | ✅ Yes |
| \`shift()\` | Remove from start | ✅ Yes |
| \`unshift()\` | Add to start | ✅ Yes |
| \`map()\` | Transform each element | ❌ No |
| \`filter()\` | Keep matching elements | ❌ No |
| \`reduce()\` | Reduce to single value | ❌ No |
| \`find()\` | Find first match | ❌ No |
| \`sort()\` | Sort elements | ✅ Yes |

### Spread and Destructuring
\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]
const [first, second, ...rest] = arr2;
\`\`\`

---

## 🔄 Loops and Iteration

| Loop Type | Best For |
|-----------|----------|
| \`for\` | Known number of iterations |
| \`while\` | Unknown iterations, condition-based |
| \`for...of\` | Iterating array values |
| \`for...in\` | Iterating object keys |
| \`forEach\` | Side effects on each element |

---

## 💡 Best Practices

1. ✅ Use \`const\` by default, \`let\` when reassignment needed
2. ✅ Use descriptive variable and function names
3. ✅ Keep functions small and focused (Single Responsibility)
4. ✅ Use strict equality (\`===\`) over loose equality (\`==\`)
5. ✅ Handle errors with try-catch
6. ❌ Avoid global variables
7. ❌ Don't use \`var\` in modern code
8. ❌ Avoid deeply nested callbacks (use async/await)

---

## 🔧 Debugging Tips

- Use \`console.log()\`, \`console.table()\`, \`console.dir()\`
- Browser DevTools are your best friend
- Use \`debugger\` statement for breakpoints
- Check for typos in variable names (case-sensitive!)`,
      animations: [
        {
          title: "Variable Scope Visualization",
          description: "Interactive animation showing how scope works - global, function, and block scope",
          type: "interactive",
          component: "scope-animation"
        },
        {
          title: "Event Loop Animation",
          description: "Visual representation of JavaScript's event loop",
          type: "interactive",
          component: "event-loop-animation"
        }
      ],
      videos: [
        {
          title: "Introduction to JavaScript",
          duration: "15:30",
          url: "https://www.youtube.com/embed/W6NZfCO5SIk",
          description: "A comprehensive introduction to JavaScript basics"
        }
      ]
    }
  },
  {
    id: "react-hooks",
    title: "React Hooks Mastery",
    description: "Learn useState, useEffect, useContext and custom hooks to build powerful React applications",
    category: "React",
    topics: 8,
    difficulty: "intermediate",
    price: 499,
    funnyFact: "React was created by Jordan Walke at Facebook. The first version was called 'FaxJS'! 📠😂",
    content: {
      code: [
        {
          title: "useState Hook",
          languages: {
            javascript: `// useState - State management ka hook
import { useState } from 'react';

function Counter() {
    // State declare karo with initial value
    const [count, setCount] = useState(0);
    
    // State update karne ke liye setter function use karo
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    
    // Functional update - Previous state use karo
    const incrementSafe = () => setCount(prev => prev + 1);
    
    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    );
}`
          },
          explanation: "useState lets you add state to functional components. It returns an array with the current value and a setter function."
        },
        {
          title: "useEffect Hook",
          languages: {
            javascript: `// useEffect - Side effects handle karne ka hook
import { useState, useEffect } from 'react';

function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // useEffect - Component mount hone pe run hoga
    useEffect(() => {
        // API call karo
        fetch('https://api.example.com/data')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            });
        
        // Cleanup function - Component unmount pe run hoga
        return () => {
            console.log('Cleanup!');
        };
    }, []);  // Empty array = sirf mount pe run karo
    
    if (loading) return <p>Loading...</p>;
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`
          },
          explanation: "useEffect lets you perform side effects like data fetching, subscriptions, or DOM manipulation."
        }
      ],
      notes: `# React Hooks Mastery - Complete Guide

## 🎯 What are Hooks?
React Hooks let you use state and lifecycle features in **functional components**. Introduced in React 16.8, they revolutionized how we write React code.

> **Rule of Hooks**: Only call Hooks at the top level. Only call Hooks from React functions.

---

## 📦 useState - State Management

### Basic Usage
\`\`\`javascript
const [state, setState] = useState(initialValue);
\`\`\`

### Key Points
- Returns an array: \`[currentValue, setterFunction]\`
- Triggers re-render when state changes
- State is preserved between renders
- Initial value only used on first render

### Patterns
| Pattern | Example | When to Use |
|---------|---------|-------------|
| Primitive | \`useState(0)\` | Simple values |
| Object | \`useState({ name: '', age: 0 })\` | Related values |
| Array | \`useState([])\` | Lists |
| Functional Update | \`setCount(prev => prev + 1)\` | When new state depends on old |
| Lazy Initialization | \`useState(() => expensiveCalc())\` | Expensive initial value |

---

## ⚡ useEffect - Side Effects

### Dependency Array Patterns
| Dependency | Behavior |
|------------|----------|
| \`[]\` (empty) | Run once on mount |
| \`[dep1, dep2]\` | Run when deps change |
| No array | Run on every render |

### Common Use Cases
1. **Data Fetching** - API calls on mount
2. **Subscriptions** - WebSocket, event listeners
3. **DOM Manipulation** - Direct DOM access
4. **Timers** - setInterval, setTimeout

### Cleanup Function
Always clean up subscriptions, timers, and event listeners:
\`\`\`javascript
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup!
}, []);
\`\`\`

---

## 🎨 Other Essential Hooks

### useContext
Share data without prop drilling:
\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

### useRef
- Persist values without re-renders
- Access DOM elements directly
\`\`\`javascript
const inputRef = useRef(null);
inputRef.current.focus();
\`\`\`

### useMemo
Memoize expensive calculations:
\`\`\`javascript
const result = useMemo(() => expensiveCalc(a, b), [a, b]);
\`\`\`

### useCallback
Memoize functions to prevent unnecessary re-renders:
\`\`\`javascript
const handleClick = useCallback(() => doSomething(), [dependency]);
\`\`\`

### useReducer
Complex state logic with actions:
\`\`\`javascript
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT' });
\`\`\`

---

## 🔧 Custom Hooks

Create reusable logic by extracting into custom hooks:
\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) ?? initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  
  return [value, setValue];
}
\`\`\`

---

## 💡 Best Practices

1. ✅ Keep hooks at the top of your component
2. ✅ Use multiple useState calls for unrelated state
3. ✅ Always include deps in useEffect dependency array
4. ✅ Use functional updates when state depends on previous
5. ✅ Extract reusable logic into custom hooks
6. ❌ Don't call hooks conditionally
7. ❌ Don't forget cleanup in useEffect
8. ❌ Don't overuse useMemo/useCallback (premature optimization)

---

## 🐛 Common Mistakes

| Mistake | Solution |
|---------|----------|
| Infinite loops in useEffect | Check dependency array |
| Stale closures | Use functional updates or useRef |
| Missing dependencies | Install ESLint plugin for hooks |
| State not updating | State updates are async, use callback |`,
      animations: [
        {
          title: "Component Lifecycle",
          description: "Visual representation of React component lifecycle with hooks",
          type: "interactive",
          component: "lifecycle-animation"
        }
      ],
      videos: [
        {
          title: "React Hooks Crash Course",
          duration: "45:00",
          url: "https://www.youtube.com/embed/O6P86uwfdR0",
          description: "Complete guide to React Hooks"
        }
      ]
    }
  },
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    description: "Add type safety to your JavaScript with TypeScript interfaces, generics, and advanced types",
    category: "TypeScript",
    topics: 10,
    difficulty: "intermediate",
    price: 599,
    funnyFact: "TypeScript was developed by Anders Hejlsberg, who also created C#! 🎯",
    content: {
      code: [
        {
          title: "Basic Types and Interfaces",
          languages: {
            javascript: `// TypeScript mein type annotations use karo
let name: string = "CodeMaster";
let age: number = 25;
let isActive: boolean = true;

// Interface - Object ka shape define karo
interface User {
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;  // Optional property
}

// Function with types
function greet(user: User): string {
    return \`Hello, \${user.name}!\`;
}

// Array types
let numbers: number[] = [1, 2, 3];
let users: User[] = [];

// Union types - Multiple types allow karo
let id: string | number = "abc123";
id = 123;  // Ye bhi valid hai`
          },
          explanation: "TypeScript adds static types to JavaScript, catching errors at compile time."
        }
      ],
      notes: `# TypeScript Essentials - Complete Guide

## 🎯 Why TypeScript?
TypeScript is a **statically typed superset of JavaScript** that compiles to plain JavaScript. Created by Microsoft in 2012, it adds optional static typing and class-based OOP.

### Benefits
| Benefit | Description |
|---------|-------------|
| 🐛 Early Error Detection | Catch bugs at compile time, not runtime |
| 📝 Better Documentation | Types serve as documentation |
| 🔧 IDE Support | Autocomplete, refactoring, navigation |
| 👥 Team Collaboration | Clearer contracts between code |
| 📦 Scalability | Essential for large codebases |

---

## 📦 Basic Types

### Primitive Types
\`\`\`typescript
let name: string = "Alice";
let age: number = 25;
let isActive: boolean = true;
let data: null = null;
let notDefined: undefined = undefined;
\`\`\`

### Arrays and Tuples
\`\`\`typescript
let numbers: number[] = [1, 2, 3];
let mixed: (string | number)[] = ["a", 1];
let tuple: [string, number] = ["hello", 42];
\`\`\`

### Special Types
| Type | Use Case |
|------|----------|
| \`any\` | Escape hatch (avoid!) |
| \`unknown\` | Type-safe any |
| \`void\` | No return value |
| \`never\` | Never returns (errors, infinite loops) |

---

## 🎨 Interfaces vs Types

### Interface
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;        // Optional
  readonly createdAt: Date; // Read-only
}
\`\`\`

### Type Alias
\`\`\`typescript
type Status = "pending" | "approved" | "rejected";
type Point = { x: number; y: number };
\`\`\`

### When to Use
| Use Interface | Use Type |
|---------------|----------|
| Object shapes | Union types |
| Extending/implementing | Intersection types |
| Declaration merging | Mapped types |

---

## 🔄 Union and Intersection

### Union Types (OR)
\`\`\`typescript
type Result = string | number;
type Status = "success" | "error" | "loading";
\`\`\`

### Intersection Types (AND)
\`\`\`typescript
type Employee = Person & { employeeId: number };
\`\`\`

---

## 📐 Generics

Generics allow you to write reusable, type-safe code:
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

interface Box<T> {
  value: T;
}

// Usage
identity<string>("hello");
const numberBox: Box<number> = { value: 42 };
\`\`\`

### Common Generic Patterns
| Pattern | Example |
|---------|---------|
| Array | \`Array<string>\` |
| Promise | \`Promise<User>\` |
| Record | \`Record<string, number>\` |
| Partial | \`Partial<User>\` |
| Pick | \`Pick<User, "name" | "email">\` |
| Omit | \`Omit<User, "password">\` |

---

## 🔧 Type Guards

### typeof Guard
\`\`\`typescript
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value * 2;
}
\`\`\`

### Custom Type Guards
\`\`\`typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string";
}
\`\`\`

---

## 💡 Best Practices

1. ✅ Enable strict mode in tsconfig.json
2. ✅ Prefer \`unknown\` over \`any\`
3. ✅ Use type inference when obvious
4. ✅ Make impossible states impossible with discriminated unions
5. ✅ Use readonly for immutable data
6. ❌ Don't use \`any\` unless absolutely necessary
7. ❌ Don't ignore TypeScript errors with \`@ts-ignore\`
8. ❌ Don't overtype - trust inference

---

## 📁 Configuration (tsconfig.json)

Key options to know:
\`\`\`json
{
  "strict": true,           // Enable all strict checks
  "noImplicitAny": true,    // Error on implicit any
  "strictNullChecks": true, // Null/undefined checks
  "esModuleInterop": true   // ES module compatibility
}
\`\`\``,
      animations: [
        {
          title: "Type Inference",
          description: "How TypeScript infers types automatically",
          type: "css",
          component: "type-inference-animation"
        }
      ],
      videos: [
        {
          title: "TypeScript Tutorial",
          duration: "60:00",
          url: "https://www.youtube.com/embed/BwuLxPH8IDs",
          description: "Complete TypeScript tutorial for beginners"
        }
      ]
    }
  },
  {
    id: "algorithms-sorting",
    title: "Sorting Algorithms",
    description: "Master bubble sort, merge sort, quick sort and understand time complexity",
    category: "Algorithms",
    topics: 6,
    difficulty: "advanced",
    price: 799,
    funnyFact: "Bogosort randomly shuffles until sorted. Average time: O(n × n!)! 🎲😱",
    content: {
      code: [
        {
          title: "Bubble Sort",
          languages: {
            javascript: `// Bubble Sort - Simple but slow O(n²)
function bubbleSort(arr) {
    const n = arr.length;
    // Outer loop - n-1 passes
    for (let i = 0; i < n - 1; i++) {
        // Inner loop - Compare adjacent elements
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap karo agar wrong order mein hai
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22]));
// Output: [12, 22, 25, 34, 64]`,
            python: `# Bubble Sort - Simple but slow O(n²)
def bubble_sort(arr):
    n = len(arr)
    # Outer loop - n-1 passes
    for i in range(n - 1):
        # Inner loop - Compare adjacent elements
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap karo agar wrong order mein hai
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22]))
# Output: [12, 22, 25, 34, 64]`,
            cpp: `// Bubble Sort - Simple but slow O(n²)
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    // Outer loop - n-1 passes
    for (int i = 0; i < n - 1; i++) {
        // Inner loop - Compare adjacent elements
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap karo agar wrong order mein hai
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";
    // Output: 12 22 25 34 64
    return 0;
}`,
            java: `// Bubble Sort - Simple but slow O(n²)
import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        // Outer loop - n-1 passes
        for (int i = 0; i < n - 1; i++) {
            // Inner loop - Compare adjacent elements
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap karo agar wrong order mein hai
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
        // Output: [12, 22, 25, 34, 64]
    }
}`
          },
          explanation: "Bubble Sort repeatedly swaps adjacent elements if they're in wrong order. Simple but O(n²) complexity."
        },
        {
          title: "Quick Sort",
          languages: {
            javascript: `// Quick Sort - Efficient O(n log n) average
function quickSort(arr) {
    // Base case - Array chhota hai
    if (arr.length <= 1) return arr;
    
    // Pivot element choose karo (last element)
    const pivot = arr[arr.length - 1];
    const left = [];   // Pivot se chhote elements
    const right = [];  // Pivot se bade elements
    
    // Partition karo
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    
    // Recursively sort karo aur merge karo
    return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([64, 34, 25, 12, 22]));`,
            python: `# Quick Sort - Efficient O(n log n) average
def quick_sort(arr):
    # Base case - Array chhota hai
    if len(arr) <= 1:
        return arr
    
    # Pivot element choose karo (last element)
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x < pivot]   # Chhote elements
    right = [x for x in arr[:-1] if x >= pivot]  # Bade elements
    
    # Recursively sort karo aur merge karo
    return quick_sort(left) + [pivot] + quick_sort(right)

print(quick_sort([64, 34, 25, 12, 22]))`,
            cpp: `// Quick Sort - Efficient O(n log n) average
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];  // Last element as pivot
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22};
    quickSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    return 0;
}`,
            java: `// Quick Sort - Efficient O(n log n) average
import java.util.Arrays;

public class QuickSort {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];  // Last element as pivot
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
    
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`
          },
          explanation: "Quick Sort uses divide-and-conquer with pivot partitioning. Average O(n log n) but worst case O(n²)."
        }
      ],
      notes: `# Sorting Algorithms - Complete Guide

## 🎯 Overview
Sorting is one of the most fundamental operations in computer science. Understanding sorting algorithms helps you grasp important concepts like time complexity, space complexity, and algorithm design paradigms.

---

## 📊 Comparison Table

| Algorithm | Best | Average | Worst | Space | Stable? |
|-----------|------|---------|-------|-------|---------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | ✅ Yes |

---

## 🔵 Bubble Sort

### How It Works
1. Compare adjacent elements
2. Swap if they're in wrong order
3. Repeat until no swaps needed

### Characteristics
- ✅ Simple to understand and implement
- ✅ In-place sorting (O(1) space)
- ✅ Stable sort
- ❌ Very slow for large datasets O(n²)

### Optimization
Add a "swapped" flag to exit early if array is already sorted.

---

## 🟢 Quick Sort

### How It Works
1. Choose a pivot element
2. Partition: elements < pivot go left, > pivot go right
3. Recursively sort left and right subarrays

### Pivot Selection Strategies
| Strategy | Pros | Cons |
|----------|------|------|
| Last element | Simple | Bad for sorted arrays |
| First element | Simple | Bad for sorted arrays |
| Random | Avoids worst case | Extra overhead |
| Median of three | Balanced | More complex |

### Characteristics
- ✅ Very fast in practice (cache-friendly)
- ✅ In-place (O(log n) stack space)
- ❌ Not stable
- ❌ O(n²) worst case (rare with good pivot)

---

## 🟣 Merge Sort

### How It Works
1. Divide array into two halves
2. Recursively sort each half
3. Merge sorted halves together

### Characteristics
- ✅ Guaranteed O(n log n)
- ✅ Stable sort
- ✅ Great for linked lists
- ❌ Requires O(n) extra space
- ❌ Not as cache-friendly as Quick Sort

---

## 🟡 Insertion Sort

### How It Works
1. Start from second element
2. Compare with previous elements
3. Insert in correct position

### Best Use Cases
- Small arrays (< 50 elements)
- Nearly sorted arrays
- Online sorting (streaming data)

---

## 🔧 Choosing the Right Algorithm

| Scenario | Best Choice |
|----------|-------------|
| Small array (< 50) | Insertion Sort |
| Nearly sorted | Insertion Sort |
| Guaranteed O(n log n) | Merge Sort |
| In-place, fast average | Quick Sort |
| Stability required | Merge Sort |
| Limited memory | Heap Sort |
| Integer keys, small range | Counting Sort |

---

## 💡 Key Concepts

### Stability
A stable sort maintains the relative order of equal elements. Important when sorting by multiple keys!

### In-Place
An in-place algorithm uses O(1) extra space (not counting the input).

### Divide and Conquer
Both Merge Sort and Quick Sort use this paradigm:
1. **Divide**: Break problem into subproblems
2. **Conquer**: Solve subproblems recursively
3. **Combine**: Merge solutions

---

## 🎓 Interview Tips

1. Know time/space complexity of major algorithms
2. Understand trade-offs between algorithms
3. Know when to use which algorithm
4. Be able to implement Quick Sort and Merge Sort
5. Understand stability and why it matters`,
      animations: [
        {
          title: "Sorting Visualization",
          description: "Watch how different sorting algorithms work step by step",
          type: "interactive",
          component: "sorting-animation"
        }
      ],
      videos: [
        {
          title: "Sorting Algorithms Explained",
          duration: "35:00",
          url: "https://www.youtube.com/embed/kPRA0W1kECg",
          description: "Visual guide to sorting algorithms"
        }
      ]
    }
  },
  {
    id: "nodejs-api",
    title: "Node.js REST API",
    description: "Build scalable backend APIs with Express.js, MongoDB, and authentication",
    category: "Backend",
    topics: 15,
    difficulty: "advanced",
    price: 899,
    funnyFact: "Node.js uses V8 engine, same as Chrome! Your server speaks browser! 🚀",
    content: {
      code: [
        {
          title: "Express Server Setup",
          languages: {
            javascript: `// Express server setup - REST API ka base
const express = require('express');
const app = express();

// Middleware - JSON body parse karo
app.use(express.json());

// Routes define karo
app.get('/api/users', (req, res) => {
    res.json([{ id: 1, name: 'Alice' }]);
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    // Database mein save karo
    res.status(201).json({ id: 2, name, email });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server Error!' });
});

// Server start karo
app.listen(3000, () => {
    console.log('Server running on port 3000');
});`
          },
          explanation: "Express.js makes building REST APIs simple with routing, middleware, and error handling."
        }
      ],
      notes: `# Node.js REST API - Complete Guide

## 🎯 What is REST?
REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods to perform CRUD operations.

---

## 🌐 HTTP Methods

| Method | Operation | Idempotent | Safe |
|--------|-----------|------------|------|
| GET | Read | ✅ Yes | ✅ Yes |
| POST | Create | ❌ No | ❌ No |
| PUT | Update (full) | ✅ Yes | ❌ No |
| PATCH | Update (partial) | ✅ Yes | ❌ No |
| DELETE | Delete | ✅ Yes | ❌ No |

---

## 📁 Project Structure

\`\`\`
project/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── models/          # Database models
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── app.js           # Express setup
├── config/              # Configuration files
├── tests/               # Test files
└── package.json
\`\`\`

---

## ⚡ Express.js Fundamentals

### Middleware Pipeline
Request flows through middleware in order:
\`\`\`
Request → Logging → Auth → Validation → Controller → Response
\`\`\`

### Common Middleware
| Middleware | Purpose |
|------------|---------|
| \`express.json()\` | Parse JSON bodies |
| \`express.urlencoded()\` | Parse URL-encoded bodies |
| \`cors()\` | Enable CORS |
| \`helmet()\` | Security headers |
| \`morgan()\` | HTTP logging |
| \`compression()\` | Gzip compression |

---

## 🔐 Authentication & Authorization

### JWT (JSON Web Tokens)
1. User logs in with credentials
2. Server returns signed JWT
3. Client sends JWT with each request
4. Server verifies JWT

### JWT Structure
\`\`\`
header.payload.signature
\`\`\`

### Middleware Pattern
\`\`\`javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

---

## 📊 Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Unexpected error |

---

## 🛡️ Error Handling

### Centralized Error Handler
\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
\`\`\`

### Custom Error Classes
\`\`\`javascript
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
\`\`\`

---

## ✅ Validation

### Using Joi
\`\`\`javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().min(18).max(120)
});
\`\`\`

---

## 💡 Best Practices

1. ✅ Use environment variables for secrets
2. ✅ Implement rate limiting
3. ✅ Validate all inputs
4. ✅ Use HTTPS in production
5. ✅ Log requests with correlation IDs
6. ✅ Version your API (\`/api/v1/...\`)
7. ❌ Don't expose stack traces in production
8. ❌ Don't store passwords in plain text
9. ❌ Don't trust client-side validation alone

---

## 🔧 Testing

| Type | Tools | Purpose |
|------|-------|---------|
| Unit | Jest, Mocha | Test individual functions |
| Integration | Supertest | Test API endpoints |
| E2E | Postman, Newman | Full workflow testing |

---

## 📈 Performance Tips

1. Use caching (Redis, in-memory)
2. Implement pagination for lists
3. Use database indexes
4. Enable gzip compression
5. Consider GraphQL for complex queries`,
      animations: [
        {
          title: "Request-Response Cycle",
          description: "How HTTP requests flow through Express middleware",
          type: "interactive",
          component: "request-cycle-animation"
        }
      ],
      videos: [
        {
          title: "Build REST API with Node.js",
          duration: "90:00",
          url: "https://www.youtube.com/embed/l8WPWK9mS5M",
          description: "Complete Node.js REST API tutorial"
        }
      ]
    }
  },
  {
    id: "css-layouts",
    title: "CSS Layouts Mastery",
    description: "Master Flexbox, Grid, and responsive design patterns for modern web layouts",
    category: "CSS",
    topics: 9,
    difficulty: "beginner",
    price: 399,
    funnyFact: "Centering a div used to be a nightmare. Now we have Flexbox! 😅",
    content: {
      code: [
        {
          title: "Flexbox Basics",
          languages: {
            javascript: `/* Flexbox - 1D layouts ke liye perfect */
.container {
    display: flex;
    justify-content: center;  /* Horizontal center */
    align-items: center;      /* Vertical center */
    gap: 1rem;                /* Items ke beech space */
}

/* Flex direction change karo */
.column-layout {
    display: flex;
    flex-direction: column;  /* Vertical stack */
}

/* Flex grow/shrink/basis */
.item {
    flex: 1;          /* Equal space lo */
    flex-grow: 2;     /* Double space lo */
    flex-shrink: 0;   /* Shrink mat karo */
    flex-basis: 200px; /* Starting size */
}

/* Responsive with flex-wrap */
.responsive-grid {
    display: flex;
    flex-wrap: wrap;  /* Next line pe wrap karo */
}`
          },
          explanation: "Flexbox provides powerful one-dimensional layout control for rows or columns."
        }
      ],
      notes: `# CSS Layouts Mastery - Complete Guide

## 🎯 Overview
Modern CSS provides two powerful layout systems: **Flexbox** for one-dimensional layouts and **CSS Grid** for two-dimensional layouts. Mastering both is essential for creating responsive, professional web layouts.

---

## 📐 Flexbox (1D Layouts)

### Container Properties

| Property | Values | Purpose |
|----------|--------|---------|
| \`display\` | \`flex\`, \`inline-flex\` | Enable flexbox |
| \`flex-direction\` | \`row\`, \`column\`, \`row-reverse\`, \`column-reverse\` | Main axis direction |
| \`justify-content\` | \`flex-start\`, \`center\`, \`space-between\`, \`space-around\`, \`space-evenly\` | Main axis alignment |
| \`align-items\` | \`flex-start\`, \`center\`, \`flex-end\`, \`stretch\`, \`baseline\` | Cross axis alignment |
| \`flex-wrap\` | \`nowrap\`, \`wrap\`, \`wrap-reverse\` | Allow wrapping |
| \`gap\` | Length values | Space between items |

### Item Properties

| Property | Purpose |
|----------|---------|
| \`flex-grow\` | How much item should grow |
| \`flex-shrink\` | How much item should shrink |
| \`flex-basis\` | Initial size before growing/shrinking |
| \`flex\` | Shorthand: \`grow shrink basis\` |
| \`align-self\` | Override container's align-items |
| \`order\` | Change visual order |

### Common Patterns
\`\`\`css
/* Center everything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Space between with wrap */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Sticky footer layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content { flex: 1; }
\`\`\`

---

## 📊 CSS Grid (2D Layouts)

### Container Properties

| Property | Values | Purpose |
|----------|--------|---------|
| \`display\` | \`grid\`, \`inline-grid\` | Enable grid |
| \`grid-template-columns\` | Length, \`fr\`, \`repeat()\` | Define columns |
| \`grid-template-rows\` | Length, \`fr\`, \`repeat()\` | Define rows |
| \`gap\` | Length values | Space between cells |
| \`grid-template-areas\` | Named areas | Layout regions |

### Item Properties

| Property | Purpose |
|----------|---------|
| \`grid-column\` | Column position/span |
| \`grid-row\` | Row position/span |
| \`grid-area\` | Named area placement |

### The \`fr\` Unit
The \`fr\` unit distributes available space proportionally:
\`\`\`css
.grid {
  grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 ratio */
}
\`\`\`

### Common Patterns
\`\`\`css
/* Responsive grid */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Holy grail layout */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}
\`\`\`

---

## 🔄 Flexbox vs Grid

| Use Case | Best Choice |
|----------|-------------|
| Navigation menu | Flexbox |
| Card layouts | Grid or Flexbox |
| Page layout | Grid |
| Centering content | Flexbox |
| Unknown number of items | Flexbox |
| Complex 2D layout | Grid |
| Alignment in one direction | Flexbox |

> **Pro Tip**: You can nest them! Use Grid for page layout and Flexbox for component internals.

---

## 📱 Responsive Design

### Media Queries
\`\`\`css
/* Mobile first approach */
.container { flex-direction: column; }

@media (min-width: 768px) {
  .container { flex-direction: row; }
}
\`\`\`

### Container Queries (Modern)
\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
\`\`\`

### Common Breakpoints
| Name | Width | Typical Devices |
|------|-------|-----------------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

---

## 💡 Best Practices

1. ✅ Use Flexbox for component layouts
2. ✅ Use Grid for page-level layouts
3. ✅ Prefer \`gap\` over margins for spacing
4. ✅ Use \`min()\`, \`max()\`, \`clamp()\` for fluid sizing
5. ✅ Start mobile-first
6. ✅ Use CSS custom properties for consistent spacing
7. ❌ Don't use floats for layout (old technique)
8. ❌ Don't overuse media queries when CSS can adapt

---

## 🔧 Debugging Tips

1. Use browser DevTools Grid/Flexbox inspectors
2. Add temporary borders to see element boundaries
3. Check for unintended overflow
4. Verify \`min-width\` and \`max-width\` constraints`,
      animations: [
        {
          title: "Flexbox Visual Guide",
          description: "Interactive demo of flexbox properties",
          type: "interactive",
          component: "flexbox-animation"
        }
      ],
      videos: [
        {
          title: "CSS Flexbox Tutorial",
          duration: "25:00",
          url: "https://www.youtube.com/embed/JJSoEo8JSnc",
          description: "Master Flexbox in one video"
        }
      ]
    }
  }
];
