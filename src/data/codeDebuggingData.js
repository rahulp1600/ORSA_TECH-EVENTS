/* ========= DEBUG CHALLENGES BANK ========= */

/**
 * Normalizes code by removing comments and extra whitespace.
 * For Python, we preserve indentation, for others we collapse.
 */
export const normalizeCode = (code, lang) => {
    // Remove comments
    let clean = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    if (lang === 'PYTHON') {
        // Just remove comments and trim lines
        return clean.split('\n').map(line => line.trimEnd()).join('\n').trim();
    }

    // For C/Java, collapse all whitespace
    return clean.replace(/\s+/g, ' ').trim();
};

export const DEBUG_CHALLENGES = {
    BASIC: { // Year 1: Syntax & Basic Flow
        C: [
            {
                level: 1,
                title: "Simple Interest",
                code: `#include <stdio.h>\n\nint main() {\n    float p, t, r, si\n    \n    printf("Enter p, t, r: ")\n    scanf("%f %f %f", &p, &t, r)\n    \n    si = (p * t * r) 100\n    \n    printf("SI = %f\\n", si)\n    \n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(\s*".*?"\s*,\s*&\w+\s*,\s*&\w+\s*,\s*&\w+\s*\)\s*;/i.test(code);
                    const siCheck = /si\s*=\s*\(?\s*p\s*\*\s*t\s*\*\s*r\s*\)?\s*\/\s*100\s*;/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return scanfCheck && siCheck && semicolons;
                },
                expectedOutput: "SI = 100.000000"
            },
            {
                level: 2,
                title: "Largest of Two",
                code: `#include <stdio.h>\n\nint main() {\n    int a, b\n    scanf("%d %d", &a &b)\n    \n    if a > b\n        printf("A")\n    else\n        printf("B")\n    \n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(\s*".*?"\s*,\s*&\w+\s*,\s*&\w+\s*\)\s*;/i.test(code);
                    const ifCheck = /if\s*\(\s*a\s*>\s*b\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 4;
                    return scanfCheck && ifCheck && semicolons;
                },
                expectedOutput: "A"
            },
            {
                level: 3,
                title: "Even or Odd",
                code: `#include <stdio.h>\n\nint main() {\n    int n\n    scanf("%d", n)\n    if(n % 2 = 0)\n        printf("Even")\n    else\n        printf("Odd")\n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(\s*".*?"\s*,\s*&\w+\s*\)\s*;/i.test(code);
                    const ifCheck = /if\s*\(\s*n\s*%\s*2\s*==\s*0\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 4;
                    return scanfCheck && ifCheck && semicolons;
                },
                expectedOutput: "Even"
            },
            {
                level: 4,
                title: "Sum of N Natural",
                code: `#include <stdio.h>\n\nint main() {\n    int n=5, i, s=0\n    for(i=1, i<=n, i++)\n        s = s + i\n    printf("%d", s)\n    return 0\n}`,
                validate: (code) => {
                    const forCheck = /for\s*\(\s*i\s*=\s*1\s*;\s*i\s*<=\s*n\s*;\s*i\+\+\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return forCheck && semicolons;
                },
                expectedOutput: "15"
            },
            {
                level: 5,
                title: "Array Sum",
                code: `#include <stdio.h>\n\nint main() {\n    int a[5], i, s=0\n    for(i=0; i<5; i++)\n        scanf("%d", a[i])\n    for(i=0; i<5; i++)\n        s += a[i]\n    printf("%d", s)\n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(\s*".*?"\s*,\s*&a\s*\[\s*i\s*\]\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 6;
                    return scanfCheck && semicolons;
                },
                expectedOutput: "15"
            },
            {
                level: 6,
                title: "Reverse String",
                code: `#include <stdio.h>\n\nint main() {\n    char s[50] = "ORSA"\n    int i, len = strlen(s)\n    for(i=len-1; i>=0; i--)\n        printf("%c", s[i])\n    return 0\n}`,
                validate: (code) => {
                    const headCheck = /#include\s*<string\.h>/i.test(code);
                    const semicolon = (code.match(/;/g) || []).length >= 4;
                    return headCheck && semicolon;
                },
                expectedOutput: "ASRO"
            },
            {
                level: 7,
                title: "Function Square",
                code: `#include <stdio.h>\n\nint sq(n) {\n    return n * n\n}\n\nint main() {\n    printf("%d", sq(5))\n    return 0\n}`,
                validate: (code) => {
                    const funcCheck = /int\s+sq\s*\(\s*int\s+n\s*\)/i.test(code);
                    const semicolon = (code.match(/;/g) || []).length >= 3;
                    return funcCheck && semicolon;
                },
                expectedOutput: "25"
            },
            {
                level: 8,
                title: "Structure Access",
                code: `#include <stdio.h>\n\nstruct Node {\n    int val\n}\n\nint main() {\n    struct Node n\n    n.val = 10\n    printf("%d", n.val)\n    return 0\n}`,
                validate: (code) => {
                    const structCheck = /struct\s+Node\s*{[\s\S]*?};\s*(int|void)/i.test(code);
                    const semicolon = (code.match(/;/g) || []).length >= 4;
                    return structCheck && semicolon;
                },
                expectedOutput: "10"
            },
            {
                level: 9,
                title: "Factorial Logic",
                code: `#include <stdio.h>\n\nint main() {\n    int n = 5, fact = 1\n    for(int i=1; i<=n i++)\n        fact = fact * i;\n    printf("Factorial: %d", fact);\n    return 0\n}`,
                validate: (code) => {
                    const vars = (code.match(/;/g) || []).length >= 4;
                    const forLoop = /for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*n\s*;\s*i\+\+\s*\)/.test(code);
                    return vars && forLoop;
                },
                expectedOutput: "Factorial: 120"
            },
            {
                level: 10,
                title: "Swap Numbers",
                code: `#include <stdio.h>\n\nint main() {\n    int a=10, b=20, temp\n    printf("Before: %d %d\\n", a, b);\n    temp = a\n    a = b;\n    b = temp;\n    printf("After: %d %d", a, b);\n    return 0\n}`,
                validate: (code) => {
                    const vars = (code.match(/;/g) || []).length >= 7;
                    const printf = /printf\s*\(\s*".*?"\s*,\s*a\s*,\s*b\s*\)\s*;/i.test(code);
                    return vars && printf;
                },
                expectedOutput: "After: 20 10"
            }
        ],
        JAVA: [
            {
                level: 1,
                title: "Simple Interest",
                code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        float p, t, r, si;\n        Scanner sc = new Scanner(System.out);\n        \n        p = sc.nextFloat()\n        t = sc.nextFloat();\n        r = sc.nextFloat();\n        \n        si = (p * t * r) 100\n        \n        System.out.println("Simple Interest = " + si)\n    }\n}`,
                validate: (code) => {
                    const scCheck = /new\s+Scanner\s*\(\s*System\.in\s*\)/i.test(code);
                    const siCheck = /si\s*=\s*\(?\s*p\s*\*\s*t\s*\*\s*r\s*\)?\s*\/\s*100\s*;/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 7;
                    const println = /println\s*\(.*?\)\s*;/i.test(code);
                    return scCheck && siCheck && semicolons && println;
                },
                expectedOutput: "Simple Interest = 100.0"
            },
            {
                level: 2,
                title: "Largest of Two",
                code: `public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 20;\n        \n        if a > b {\n            System.out.println("A")\n        }\n        else\n            System.out.println("B")\n    }\n}`,
                validate: (code) => {
                    const ifCheck = /if\s*\(\s*a\s*>\s*b\s*\)/i.test(code);
                    const braceCheck = /else\s*{\s*System/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 4;
                    return ifCheck && braceCheck && semicolons;
                },
                expectedOutput: "B"
            },
            {
                level: 3,
                title: "Even or Odd",
                code: `public class Main {\n    public static void main(String[] args) {\n        int n = 10\n        if(n % 2 = 0) \n            System.out.println("Even")\n        else\n            System.out.println("Odd")\n    }\n}`,
                validate: (code) => {
                    const ifCheck = /if\s*\(\s*n\s*%\s*2\s*==\s*0\s*\)/i.test(code);
                    const semicolonCheck = (code.match(/;/g) || []).length >= 4;
                    const braceCheck = /if\s*\(.*?\)\s*{\s*System/i.test(code);
                    return ifCheck && semicolonCheck && braceCheck;
                },
                expectedOutput: "Even"
            },
            {
                level: 4,
                title: "Sum of N Natural",
                code: `public class Main {\n    public static void main(String[] args) {\n        int n = 5, sum = 0;\n        for(int i = 1, i <= n, i++)\n            sum = sum + i\n            \n        System.out.println("Sum = " + sum)\n    }\n}`,
                validate: (code) => {
                    const forCheck = /for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*n\s*;\s*i\+\+\s*\)/i.test(code);
                    const sumCheck = /sum\s*(\+=\s*i|=\s*sum\s*\+\s*i)\s*;/i.test(code);
                    const println = /println\s*\(.*?\)\s*;/i.test(code);
                    return forCheck && sumCheck && println;
                },
                expectedOutput: "Sum = 15"
            },
            {
                level: 5,
                title: "Array Sum",
                code: `public class Main {\n    public static void main(String[] args) {\n        int arr[] = new int(5)\n        int sum = 0;\n        for(int i = 0; i < 5; i++) {\n            arr(i) = i + 1;\n            sum += arr[i]\n        }\n        System.out.println("Sum = " + sum);\n    }\n}`,
                validate: (code) => {
                    const initCheck = /new\s+int\s*\[\s*5\s*\]\s*;/i.test(code);
                    const assignCheck = /arr\s*\[\s*i\s*\]\s*=\s*i\s*\+\s*1\s*;/i.test(code);
                    const sumCheck = /sum\s*\+=\s*arr\s*\[\s*i\s*\]\s*;/i.test(code);
                    return initCheck && assignCheck && sumCheck;
                },
                expectedOutput: "Sum = 15"
            },
            {
                level: 6,
                title: "Reverse String",
                code: `public class Main {\n    public static void main(String[] args) {\n        String s = "ORSA";\n        String r = ""\n        for(int i = s.length(); i >= 0; i--) {\n            r = r + s.charAt(i)\n        }\n        System.out.println(r)\n    }\n}`,
                validate: (code) => {
                    const loopCheck = /i\s*=\s*s\.length\s*\(\s*\)\s*-\s*1/i.test(code);
                    const rCheck = /r\s*=\s*r\s*\+\s*s\.charAt\s*\(\s*i\s*\)\s*;/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return loopCheck && rCheck && semicolons;
                },
                expectedOutput: "ASRO"
            },
            {
                level: 7,
                title: "Static Square",
                code: `public class Main {\n    int sq(int n) {\n        return n * n\n    }\n    public static void main(String[] args) {\n        System.out.println(sq(5))\n    }\n}`,
                validate: (code) => {
                    const staticCheck = /static\s+int\s+sq/i.test(code);
                    const returnCheck = /return\s+n\s*\*\s*n\s*;/i.test(code);
                    const semicolon = (code.match(/;/g) || []).length >= 3;
                    return staticCheck && returnCheck && semicolon;
                },
                expectedOutput: "25"
            },
            {
                level: 8,
                title: "Constructor Logic",
                code: `class Student {\n    String name\n    Student(String n) {\n        name = n\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Student s = new Student("ORSA")\n        System.out.println(s.name)\n    }\n}`,
                validate: (code) => {
                    const nameCheck = /String\s+name\s*;/i.test(code);
                    const assignCheck = /name\s*=\s*n\s*;/i.test(code);
                    const newCheck = /new\s+Student\s*\(\s*".*?"\s*\)\s*;/i.test(code);
                    const printCheck = /println\s*\(.*?\)\s*;/i.test(code);
                    return nameCheck && assignCheck && newCheck && printCheck;
                },
                expectedOutput: "ORSA"
            },
            {
                level: 9,
                title: "Factorial Calc",
                code: `public class Main {\n    public static void main(String[] args) {\n        int n = 5\n        int fact = 1;\n        for(int i=1; i<=n i++) {\n            fact *= i;\n        }\n        System.out.printl(fact);\n    }\n}`,
                validate: (code) => {
                    const semi = (code.match(/;/g) || []).length >= 4;
                    const loop = /for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*n\s*;\s*i\+\+\s*\)/.test(code);
                    const print = /System\.out\.println/.test(code);
                    return semi && loop && print;
                },
                expectedOutput: "120"
            },
            {
                level: 10,
                title: "Swap Values",
                code: `public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 20;\n        int temp  a;\n        a = b;\n        b = temp;\n        System.out.println(a + " " + b\n    }\n}`,
                validate: (code) => {
                    const temp = /int\s+temp\s*=\s*a\s*;/.test(code);
                    const print = /System\.out\.println\(.*?\);/.test(code);
                    return temp && print;
                },
                expectedOutput: "20 10"
            }
        ],
        PYTHON: [
            {
                level: 1,
                title: "Simple Interest",
                code: `p = input("Principal: ")\nt = 2\nr = 10\nsi = (p * t * r) 100\nprint "SI is", si`,
                validate: (code) => {
                    const pCheck = /p\s*=\s*(float|int)\s*\(\s*input/i.test(code);
                    const siCheck = /si\s*=\s*.*?\/\s*100/i.test(code);
                    const printCheck = /print\s*\(.*?\)/i.test(code);
                    return pCheck && siCheck && printCheck;
                },
                expectedOutput: "SI is 100.0"
            },
            {
                level: 2,
                title: "Largest of Two",
                code: `a = 10\nb = 20\nif a > b\nprint("A")\nelse\nprint("B")`,
                validate: (code) => {
                    const ifColon = /if\s*a\s*>\s*b\s*:/i.test(code);
                    const elseColon = /else\s*:/i.test(code);
                    const indents = code.split('\n').filter(l => l.includes('print')).every(l => l.startsWith('    ') || l.startsWith('\t'));
                    return ifColon && elseColon && indents;
                },
                expectedOutput: "B"
            },
            {
                level: 3,
                title: "Even or Odd",
                code: `n = int(input())\nif n % 2 = 0:\n    print "Even"\nelse\n    print "Odd"`,
                validate: (code) => {
                    const ifCheck = /if\s*n\s*%\s*2\s*==\s*0\s*:/i.test(code);
                    const elseCheck = /else\s*:/i.test(code);
                    const printCheck = (code.match(/print\s*\(.*?\)/g) || []).length >= 2;
                    return ifCheck && elseCheck && printCheck;
                },
                expectedOutput: "Even"
            },
            {
                level: 4,
                title: "Sum of N Natural",
                code: `n = 5\ns = 0\nfor i in range n:\ns = s + i\nprint(s)`,
                validate: (code) => {
                    const forCheck = /for\s*i\s*in\s*range\s*\(\s*1\s*,\s*n\s*\+\s*1\s*\)\s*:/i.test(code);
                    const sAssign = /s\s*=\s*s\s*\+\s*i/i.test(code);
                    const indent = /^\s+s\s*=\s*/m.test(code);
                    return forCheck && sAssign && indent;
                },
                expectedOutput: "15"
            },
            {
                level: 5,
                title: "List Sum",
                code: `arr = [1, 2, 3]\nt = 0\nfor i in range(3)\nt += arr(i)\nprint(t)`,
                validate: (code) => {
                    const forCheck = /for\s*i\s*in\s*range\s*\(\s*3\s*\)\s*:/i.test(code);
                    const tCheck = /t\s*\+=\s*arr\s*\[\s*i\s*\]/i.test(code);
                    const indents = code.split('\n').filter(l => l.includes('t +=')).every(l => l.startsWith('    ') || l.startsWith('\t'));
                    return forCheck && tCheck && indents;
                },
                expectedOutput: "6"
            },
            {
                level: 6,
                title: "Reverse String",
                code: `s = "ORSA"\nrev = s[::1]\nprint rev`,
                validate: (code) => {
                    const sliceCheck = /rev\s*=\s*s\s*\[\s*:\s*:\s*-1\s*\]/i.test(code);
                    const printCheck = /print\s*\(\s*rev\s*\)/i.test(code);
                    return sliceCheck && printCheck;
                },
                expectedOutput: "ASRO"
            },
            {
                level: 7,
                title: "Function Result",
                code: `def sq(n)\nres = n * n\nprint(sq(5))`,
                validate: (code) => {
                    const defCheck = /def\s+sq\s*\(\s*n\s*\)\s*:/i.test(code);
                    const returnCheck = /return\s+res/i.test(code);
                    const indent = /^\s+res\s*=\s*/m.test(code);
                    return defCheck && returnCheck && indent;
                },
                expectedOutput: "25"
            },
            {
                level: 8,
                title: "Class Init",
                code: `class Student:\n    def init(self, n):\n    self.name = n\n\ns = Student("ORSA")\nprint s.name`,
                validate: (code) => {
                    const initCheck = /def\s+__init__\s*\(.*?\)\s*:/i.test(code);
                    const nameCheck = /self\.name\s*=\s*n/i.test(code);
                    const printCheck = /print\s*\(\s*s\.name\s*\)/i.test(code);
                    const indents = code.split('\n').filter(l => l.includes('self.')).every(l => l.startsWith('    ') || l.startsWith('\t'));
                    return initCheck && nameCheck && printCheck && indents;
                },
                expectedOutput: "ORSA"
            },
            {
                level: 9,
                title: "Factorial Loop",
                code: `int n = 5\nfact = 1\nfor i in range(1, n+1)\n    fact = fact * i\nprint fact`,
                validate: (code) => {
                    const nDecl = /n\s*=\s*5/.test(code) && !/int\s+n/.test(code);
                    const rangeColon = /range\(.*?\):/.test(code);
                    const printParen = /print\s*\(.*?\)/.test(code);
                    return nDecl && rangeColon && printParen;
                },
                expectedOutput: "120"
            },
            {
                level: 10,
                title: "Swap Check",
                code: `x = 10\ny = 20\nif x > 0\n    temp = x\n    x = y\n    y = temp\n    print(x, y`,
                validate: (code) => {
                    const ifColon = /if\s+x\s*>\s*0\s*:/.test(code);
                    const printParen = /print\s*\(.*?\)/.test(code);
                    return ifColon && printParen;
                },
                expectedOutput: "20 10"
            }
        ]
    },
    INTERMEDIATE: { // Year 2: Control & Data Structures (Basic)
        C: [
            {
                level: 1,
                title: "Matrix Multiplication",
                code: `#include <stdio.h>\n\nint main() {\n    int a[2][3], b[3][2], c[2][2], i, j, k\n    for(i=0; i<2; i++)\n        for(j=0; j<3; j++)\n            scanf("%d" a[i][j])\n    \n    for(i=0; i<3; i++)\n        for(j=0; j<2; j++)\n            scanf("%d", &b[i][j]);\n    \n    for(i=0; i<2; i++)\n        for(j=0; j<2; j++) {\n            c[i][j] = 0;\n            for(k=0; k<3; k++)\n                c[i][j] += a[i][k]*b[k][j\n        }\n    \n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(\s*".*?"\s*,\s*&a\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*\)\s*;/i.test(code);
                    const indexCheck = /c\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*\+=\s*a\s*\[\s*i\s*\]\s*\[\s*k\s*\]\s*\*\s*b\s*\[\s*k\s*\]\s*\[\s*j\s*\]\s*;/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return scanfCheck && indexCheck && semicolons;
                },
                expectedOutput: "Matrix multiplied"
            },
            {
                level: 2,
                title: "String Palindrome",
                code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[50]\n    int i, len, flag = 1\n    printf("Enter string: ")\n    gets(str)\n    \n    len = strlen(str\n    for(i=0; i<len/2 i++)\n        if(str[i] != str[len-i-1])\n            flag = 0\n    \n    if(flag = 1)\n        printf("Palindrome\\n")\n    else\n        printf("Not Palindrome\\n");\n    return 0;\n}`,
                validate: (code) => {
                    const lenCheck = /strlen\s*\(\s*str\s*\)\s*;/i.test(code);
                    const forCheck = /for\s*\(.*?;.*?;.*?\)/i.test(code);
                    const operatorCheck = /if\s*\(\s*flag\s*==\s*1\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 8;
                    return lenCheck && forCheck && operatorCheck && semicolons;
                },
                expectedOutput: "Palindrome"
            },
            {
                level: 3,
                title: "Find Maximum",
                code: `#include <stdio.h>\n\nint main() {\n    int arr[5], i, max\n    for(i=0; i<5; i++)\n        scanf("%d", arr[i])\n    \n    max = arr[0]\n    for(i=1; i<5; i++)\n        if(arr[i] > max)\n            max = arr[i]\n    \n    printf("Maximum: %d\\n", max)\n    return 0\n}`,
                validate: (code) => {
                    const scanfCheck = /scanf\s*\(.*?,.*?&arr\s*\[\s*i\s*\]\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 6;
                    return scanfCheck && semicolons;
                },
                expectedOutput: "Maximum found"
            },
            {
                level: 4,
                title: "Reverse Array",
                code: `#include <stdio.h>\n\nint main() {\n    int arr[5], i, temp\n    for(i=0; i<5; i++)\n        scanf("%d" arr[i])\n    \n    for(i=0; i<5/2 i++)\n        temp = arr[i]\n        arr[i] = arr[4-i]\n        arr[4-i] = temp\n    \n    printf("Reversed array: ")\n    for(i=0; i<5; i++)\n        printf("%d ", arr[i])\n    return 0\n}`,
                validate: (code) => {
                    const braceCheck = /for\s*\(.*?\)\s*{\s*temp\s*=.+?}/s.test(code);
                    const scanfCheck = /scanf\s*\(.*?,.*?&arr/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 6;
                    return braceCheck && scanfCheck && semicolons;
                },
                expectedOutput: "Array reversed"
            },
            {
                level: 5,
                title: "Linear Search",
                code: `#include <stdio.h>\n\nint search(int arr[], int n, int key) {\n    int i\n    for(i=0; i<n; i++)\n        if(arr[i] = key)\n            return i\n    return -1\n}\n\nint main() {\n    int arr[5], i, key\n    for(i=0; i<5; i++)\n        scanf("%d", arr[i])\n    \n    scanf("%d", &key)\n    int pos = search(arr,5,key)\n    printf("%d\\n", pos)\n    return 0\n}`,
                validate: (code) => {
                    const ifCheck = /if\s*\(.*?==\s*key\s*\)/i.test(code);
                    const scanfCheck = /scanf\s*\(.*?,.*?&arr/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 8;
                    return ifCheck && scanfCheck && semicolons;
                },
                expectedOutput: "Index found"
            },
            {
                level: 6,
                title: "Structure Marks",
                code: `#include <stdio.h>\n\nstruct student {\n    int m1, m2, m3\n};\n\nint main() {\n    struct student s\n    scanf("%d %d %d", s.m1, &s.m2, &s.m3)\n    int total = s.m1 + s.m2 + s.m3\n    printf("%d\\n", total)\n    return 0\n}`,
                validate: (code) => {
                    const structCheck = /int\s+m1\s*,\s*m2\s*,\s*m3\s*;/i.test(code);
                    const scanfCheck = /scanf\s*\(.*?,.*?&s\.m1/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return structCheck && scanfCheck && semicolons;
                },
                expectedOutput: "Sum calculated"
            },
            {
                level: 7,
                title: "Count Spaces",
                code: `#include <stdio.h>\n\nint main() {\n    char str[100]\n    int i, count = 0\n    \n    gets(str)\n    \n    for(i=0; str[i] != '\\0'; i++)\n        if(str[i] = ' ')\n            count++\n    \n    printf("%d\\n", count)\n    return 0\n}`,
                validate: (code) => {
                    const ifCheck = /if\s*\(.*?==\s*['"]\s+['"]\s*\)/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 6;
                    return ifCheck && semicolons;
                },
                expectedOutput: "Spaces counted"
            },
            {
                level: 8,
                title: "String Concat",
                code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str1[50], str2[50]\n    \n    gets(str1)\n    gets(str2)\n    \n    strcat(str1 str2)\n    printf("%s\\n", str1)\n    return 0\n}`,
                validate: (code) => {
                    const concatCheck = /strcat\s*\(\s*\w+\s*,\s*\w+\s*\)\s*;/i.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 5;
                    return concatCheck && semicolons;
                },
                expectedOutput: "Concatenated"
            },
            {
                level: 9,
                title: "Array Search",
                code: `#include <stdio.h>\n\nint main() {\n    int a[] = {1, 2, 3};\n    int k = 2;\n    for(int i=0; i<3 i++) {\n        if(a[i] == k)\n            printf("Found")\n    }\n    return 0;\n}`,
                validate: (code) => {
                    const forSemi = /for\s*\(.*?;.*?;.*?\)/.test(code);
                    const printSemi = /printf\s*\(\s*".*?"\s*\)\s*;/i.test(code);
                    return forSemi && printSemi;
                },
                expectedOutput: "Found"
            },
            {
                level: 10,
                title: "Matrix Logic",
                code: `#include <stdio.h>\n\nint main() {\n    int m[2][2] = {{1, 2}, {3, 4}};\n    int r, c\n    for(r=0; r<2; r++)\n        for(c=0; c<2 c++)\n            printf("%d ", m[r][c]);\n    return 0\n}`,
                validate: (code) => {
                    const varsSemi = /int\s+r\s*,\s*c\s*;/i.test(code);
                    const forOp = /c\s*\+\+\s*\)/.test(code);
                    const returnSemi = /return\s+0\s*;/i.test(code);
                    return varsSemi && forOp && returnSemi;
                },
                expectedOutput: "1 2 3 4 "
            }
        ],
        JAVA: [
            {
                level: 1,
                title: "Hello World",
                code: `public class Program1 {\n    public static void main(String[] args)\n        System.out.println("Hello World")\n}`,
                validate: (code) => {
                    const braceCheck = /main\s*\(.*?\)\s*{/.test(code);
                    const semicolonCheck = /println\s*\(.*?\)\s*;/.test(code);
                    return braceCheck && semicolonCheck;
                },
                expectedOutput: "Hello World"
            },
            {
                level: 2,
                title: "Add Two Numbers",
                code: `import java.util.Scanner;\npublic class Program2 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter first number: ")\n        int a = sc.nextInt()\n        System.out.print("Enter second number: ");\n        int b = sc.nextInt();\n        int sum = a + b\n        System.out.println("Sum is: " + sum)\n    }\n}`,
                validate: (code) => {
                    const scCheck = /new\s+Scanner\s*\(.*?System\.in\s*\)\s*;/.test(code);
                    const printCheck = /print\s*\(.*?\)\s*;/.test(code);
                    const aCheck = /int\s+a\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const sumCheck = /sum\s*=\s*a\s*\+\s*b\s*;/.test(code);
                    const finalPrint = /println\s*\(.*?\)\s*;/.test(code);
                    return scCheck && printCheck && aCheck && sumCheck && finalPrint;
                },
                expectedOutput: "Sum is: 30"
            },
            {
                level: 3,
                title: "Check Even/Odd",
                code: `import java.util.Scanner;\npublic class Program3 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter a number: ");\n        int n = sc.nextInt()\n        if(n % 2 == 0)\n            System.out.println("Even")\n        else\n            System.out.println("Odd")\n    }\n}`,
                validate: (code) => {
                    const nCheck = /int\s+n\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const ifBrace = /if\s*\(.*?\)\s*{/.test(code);
                    const elseBrace = /else\s*{/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 6;
                    return nCheck && ifBrace && elseBrace && semicolons;
                },
                expectedOutput: "Even"
            },
            {
                level: 4,
                title: "Maximum of 3",
                code: `import java.util.Scanner;\npublic class Program4 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter three numbers: ");\n        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt()\n        int max = a\n        if(b > max)\n            max = b\n        if(c > max)\n            max = c\n        System.out.println("Maximum is: " + max)\n    }\n}`,
                validate: (code) => {
                    const initCheck = /int\s+a\s*=\s*sc\.nextInt\s*\(.*?\)\s*,\s*b\s*=\s*sc\.nextInt\s*\(.*?\)\s*,\s*c\s*=\s*sc\.nextInt\s*\(.*?\)\s*;/.test(code);
                    const maxInit = /int\s+max\s*=\s*a\s*;/.test(code);
                    const ifBraces = (code.match(/if\s*\(.*?\)\s*{/g) || []).length >= 2;
                    const finalPrint = /println\s*\(.*?\)\s*;/.test(code);
                    return initCheck && maxInit && ifBraces && finalPrint;
                },
                expectedOutput: "Maximum is: 20"
            },
            {
                level: 5,
                title: "Reverse Array",
                code: `import java.util.Scanner;\npublic class Program5 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int arr[] = new int[5]\n        for(int i=0; i<5; i++)\n            arr[i] = sc.nextInt()\n        for(int i=0; i<5/2; i++)\n            int temp = arr[i]\n            arr[i] = arr[4-i]\n            arr[4-i] = temp\n        System.out.println("Reversed array:")\n        for(int i=0; i<5; i++)\n            System.out.println(arr[i] + " ")\n    }\n}`,
                validate: (code) => {
                    const arrInit = /int\s+arr\[\s*\]\s*=\s*new\s+int\s*\[\s*5\s*\]\s*;/.test(code);
                    const loopBraces = (code.match(/for\s*\(.*?\)\s*{/g) || []).length >= 3;
                    const scLine = /arr\s*\[\s*i\s*\]\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 8;
                    return arrInit && loopBraces && scLine && semicolons;
                },
                expectedOutput: "5 4 3 2 1"
            },
            {
                level: 6,
                title: "Linear Search",
                code: `import java.util.Scanner;\npublic class Program6 {\n    static int search(int arr[], int key) {\n        for(int i=0; i<arr.length; i++)\n            if(arr[i] = key)\n                return i\n        return -1\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int arr[] = new int[5]\n        for(int i=0; i<5; i++)\n            arr[i] = sc.nextInt()\n        System.out.print("Enter key: ")\n        int key = sc.nextInt()\n        int pos = search(arr,key)\n        System.out.println("Position: " + pos)\n    }\n}`,
                validate: (code) => {
                    const opCheck = /arr\s*\[\s*i\s*\]\s*==\s*key/.test(code);
                    const searchBraces = /for\s*\(.*?\)\s*{\s*if/.test(code) || /if\s*\(.*?\)\s*{/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 9;
                    const posCheck = /int\s+pos\s*=\s*search\s*\(.*?\)\s*;/.test(code);
                    return opCheck && searchBraces && semicolons && posCheck;
                },
                expectedOutput: "Position: 2"
            },
            {
                level: 7,
                title: "Count Spaces",
                code: `import java.util.Scanner;\npublic class Program7 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter string: ")\n        String str = sc.nextLine()\n        int count = 0\n        for(int i=0; i<str.length(); i++)\n            if(str.charAt(i) = ' ')\n                count++\n        System.out.println("Spaces: " + count)\n    }\n}`,
                validate: (code) => {
                    const scCheck = /new\s+Scanner\s*\(.*?System\.in\s*\)\s*;/.test(code);
                    const opCheck = /str\.charAt\s*\(\s*i\s*\)\s*==\s*['"]\s+['"]/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 7;
                    return scCheck && opCheck && semicolons;
                },
                expectedOutput: "Spaces: 2"
            },
            {
                level: 8,
                title: "Multi Table Menu",
                code: `import java.util.Scanner;\npublic class Program8 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter number: ")\n        int n = sc.nextInt(\n        System.out.print("Ascending or Descending (a/d)? ")\n        String choice = sc.nextLine()\n        if(choice.equals("a"))\n            for(int i=1; i<=10; i++)\n                System.out.println(n + " x " + i + " = " + n*i;\n        else if(choice.equals("d"))\n            for(int i=10; i>=1; i--)\n                System.out.println(n + " x " + i + " = " + n*i);\n        else\n            System.out.println("Invalid choice"\n        System.out.println("Thank you!")\n    }\n}`,
                validate: (code) => {
                    const scCheck = /new\s+Scanner\s*\(.*?System\.in\s*\)\s*;/.test(code);
                    const nCheck = /int\s+n\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const consumeCheck = /sc\.nextLine\s*\(\s*\)\s*;/.test(code);
                    const choiceCheck = /String\s+choice\s*=\s*sc\.nextLine\s*\(\s*\)\s*;/.test(code);
                    const loopBraces = (code.match(/for\s*\(.*?\)\s*{/g) || []).length >= 2;
                    const finalPrint = /println\s*\(.*?"Thank you!"\s*\)\s*;/.test(code);
                    return scCheck && nCheck && consumeCheck && choiceCheck && loopBraces && finalPrint;
                },
                expectedOutput: "Table printed"
            },
            {
                level: 9,
                title: "Object Array",
                code: `class Item { int val; }\npublic class Main {\n    public static void main(String[] args) {\n        Item[] i = new Item[2];\n        i[0] = new Item()\n        i[0].val = 5;\n        System.out.println(i[0].val\n    }\n}`,
                validate: (code) => {
                    const newSemi = /new\s+Item\s*\(\s*\)\s*;/.test(code);
                    const printParen = /println\s*\(.*?\)\s*;/.test(code);
                    return newSemi && printParen;
                },
                expectedOutput: "5"
            },
            {
                level: 10,
                title: "Loop Logic",
                code: `public class Main {\n    public static void main(String[] args) {\n        int i = 0\n        while i < 5 {\n            System.out.println(i);\n            i++;\n        }\n    }\n}`,
                validate: (code) => {
                    const iSemi = /int\s+i\s*=\s*0\s*;/.test(code);
                    const whileParen = /while\s*\(.*?\)\s*\{/.test(code);
                    return iSemi && whileParen;
                },
                expectedOutput: "0...4"
            }
        ],
        PYTHON: [
            {
                level: 1,
                title: "Matrix Addition",
                code: `rows = 2\ncols = 2\nA = [[0,0],[0,0]]\nB = [[0,0],[0,0]]\nC = [[0,0],[0,0]]\nprint("Enter elements of matrix A")\nfor i in range(rows\n    for j in range(cols)\n        A[i][j] = int(input()\nprint("Enter elements of matrix B:")\nfor i in range(rows):\n    for j in range(cols\n        B[i][j] = int(input())\nfor i in range(rows):\n    for j in range(cols):\n        C[i][j] = A[i][j] + B[i][j\nprint("Result:")\nfor i in range(rows):\n    for j in range(cols):\n        print(C[i][j], end=" ")\n    print()`,
                validate: (code) => {
                    const rangeCount = (code.match(/range\(.*?\)\s*:/g) || []).length >= 5;
                    const inputCheck = /int\s*\(\s*input\s*\(\s*\)\s*\)/.test(code);
                    const indexCheck = /B\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*\+/.test(code);
                    const mathCheck = /C\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*=\s*A\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*\+\s*B\s*\[\s*i\s*\]\s*\[\s*j\s*\]/.test(code);
                    return rangeCount && inputCheck && indexCheck && mathCheck;
                },
                expectedOutput: "Matrix added"
            },
            {
                level: 2,
                title: "Student Grade Report",
                code: `students = 3\nmarks = []\nfor i in range(students):\n    print("Enter marks for student", i+1)\n    m = []\n    for j in range(3\n        m.append(int(input())\n    marks.append(m)\nfor i in range(students)\n    total = sum(marks[i])\n    avg = total /3\n    print("Student", i+1, "Total:", total, "Average:", avg)\n    if avg >= 90\n        print("Grade: A")\n    elif avg >= 75\n        print("Grade: B")\n    elif avg >= 60\n        print("Grade: C")\n    else\n        print("Grade: F")`,
                validate: (code) => {
                    const colons = (code.match(/:/g) || []).length >= 7;
                    const nestedInput = /m\.append\s*\(\s*int\s*\(\s*input\s*\(\s*\)\s*\)\s*\)/.test(code);
                    const ifElseCheck = /if\s+.*?:.*elif\s+.*?:.*else\s*:/s.test(code);
                    return colons && nestedInput && ifElseCheck;
                },
                expectedOutput: "Report generated"
            },
            {
                level: 3,
                title: "String Palindrome",
                code: `s = input("Enter string: "\nrev = ""\nfor i in range(len(s)-1, -1, -1\n    rev += s[i\nprint("Reversed:", rev\nif rev = s:\n    print("Palindrome")\nelse\n    print("Not Palindrome")`,
                validate: (code) => {
                    const inputCheck = /input\s*\(\s*".*?"\s*\)/.test(code);
                    const loopCheck = /range\s*\(.*?\)\s*:/i.test(code);
                    const indexCheck = /s\s*\[\s*i\s*\]/.test(code);
                    const opCheck = /if\s+rev\s*==\s*s\s*:/i.test(code);
                    const printCheck = /print\s*\(\s*".*?"\s*,\s*rev\s*\)/.test(code);
                    return inputCheck && loopCheck && indexCheck && opCheck && printCheck;
                },
                expectedOutput: "Palindrome"
            },
            {
                level: 4,
                title: "Vowel Count",
                code: `s = input("Enter string: ")\nvowels = "aeiouAEIOU"\nv_count = 0\nc_count = 0\nfor ch in s\n    if ch in vowels\n        v_count += 1\n    elif ch.isalpha()\n        c_count += 1\nprint("Vowels:", v_count\nprint("Consonants:", c_count)`,
                validate: (code) => {
                    const colonCount = (code.match(/:/g) || []).length >= 4;
                    const printCheck = /print\s*\(\s*".*?"\s*,\s*v_count\s*\)/.test(code);
                    return colonCount && printCheck;
                },
                expectedOutput: "Counts calculated"
            },
            {
                level: 5,
                title: "Matrix Multiply",
                code: `A = [[1,2,3],[4,5,6]]\nB = [[1,2],[3,4],[5,6]]\nC = [[0,0],[0,0]]\nfor i in range(2)\n    for j in range(2):\n        C[i][j] = 0\n        for k in range(3\n            C[i][j] += A[i][k]*B[k][j\nprint("Result:")\nfor i in range(2):\n    for j in range(2)\n        print(C[i][j], end=" ")\n    print()`,
                validate: (code) => {
                    const colons = (code.match(/:/g) || []).length >= 5;
                    const rangeMatch = (code.match(/range\s*\(\s*\d+\s*\)\s*:/g) || []).length >= 4;
                    const indexMatch = /C\s*\[\s*i\s*\]\s*\[\s*j\s*\]\s*\+=\s*A\s*\[\s*i\s*\]\s*\[\s*k\s*\]\s*\*\s*B\s*\[\s*k\s*\]\s*\[\s*j\s*\]/.test(code);
                    return colons && rangeMatch && indexMatch;
                },
                expectedOutput: "Multiplied"
            },
            {
                level: 6,
                title: "Fibonacci Series",
                code: `n = int(input("Enter number of terms: "))\na, b = 0, 1\nprint(a, b\nfor i in range(2, n\n    c = a + b\n    print(c, end=" "\n    a, b = b, c`,
                validate: (code) => {
                    const printBrackets = (code.match(/print\s*\(.*?\)/g) || []).length >= 2;
                    const loopBracket = /range\s*\(.*?\)\s*:/.test(code);
                    return printBrackets && loopBracket;
                },
                expectedOutput: "Series printed"
            },
            {
                level: 7,
                title: "Prime Check",
                code: `n = int(input("Enter number: "))\nif n < 2\n    print("Not Prime")\nelse:\n    for i in range(2, n\n        if n%i == 0\n            print("Not Prime")\n            break\n    else\n        print("Prime")`,
                validate: (code) => {
                    const colons = (code.match(/:/g) || []).length >= 5;
                    const loopBracket = /range\s*\(.*?\)\s*:/.test(code);
                    return colons && loopBracket;
                },
                expectedOutput: "Prime checked"
            },
            {
                level: 8,
                title: "Multi Table Generator",
                code: `print("Welcome to the Multiplication Table Generator")\nn = int(input("Enter number for table: ")\nchoice = input("Do you want ascending or descending table? (a/d): ")\n\nif choice == "a"\n    for i in range(1 11)\n        print(f"{n} x {i} = {n*i}")\nelif choice == "d"\n    for i in range(10, 0, -1)\n        print(f"{n} x {i} = {n*i}"\nelse\n    print("Invalid choice")\n\nprint("Thank you for using the table generator!"`,
                validate: (code) => {
                    const inputBracket = /int\s*\(\s*input\s*\(.*?\)\s*\)/.test(code);
                    const rangeComma = /range\s*\(\s*1\s*,\s*11\s*\)/.test(code);
                    const colons = (code.match(/:/g) || []).length >= 4;
                    const prints = (code.match(/print\s*\(.*?\)/g) || []).length >= 4;
                    return inputBracket && rangeComma && colons && prints;
                },
                expectedOutput: "Table generated"
            },
            {
                level: 9,
                title: "Dict Iteration",
                code: `d = {'a': 1, 'b': 2\nfor k, v in d.items()\n    print(k, v`,
                validate: (code) => {
                    const dictClose = /\}/.test(code);
                    const forColon = /for\s+k\s*,\s*v\s+in\s+d\.items\s*\(\s*\)\s*:/.test(code);
                    const printParen = /print\s*\(.*?\)/.test(code);
                    return dictClose && forColon && printParen;
                },
                expectedOutput: "a 1"
            },
            {
                level: 10,
                title: "Nested Loops",
                code: `adj = ["red", "big"]\nfruits = ["apple", "banana"]\nfor x in adj\n    for y in fruits\n        print(x, y`,
                validate: (code) => {
                    const forColon1 = /for\s+x\s+in\s+adj\s*:/.test(code);
                    const forColon2 = /for\s+y\s+in\s+fruits\s*:/.test(code);
                    const printParen = /print\s*\(.*?\)/.test(code);
                    return forColon1 && forColon2 && printParen;
                },
                expectedOutput: "red apple..."
            }
        ],
    },
    ADVANCED: { // Year 3 & 4: Logic & Modular Programming
        C: [
            {
                level: 1,
                title: "Pointer Basics",
                code: `#include <stdio.h>\n\nint main() {\n    int a = 10\n    int *p = &a\n    printf("%d", *p)\n    return 0\n}`,
                validate: (code) => {
                    const ptrDecl = /int\s*\*\s*p\s*=\s*&a\s*;/i.test(code);
                    const printfCheck = /printf\s*\(.*?\*p\s*\)\s*;/i.test(code);
                    return ptrDecl && printfCheck && (code.match(/;/g) || []).length >= 4;
                },
                expectedOutput: "10"
            },
            {
                level: 2,
                title: "Pointer Arithmetic",
                code: `#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int *ptr = arr\n    ptr++\n    printf("%d", *ptr)\n    return 0\n}`,
                validate: (code) => {
                    const incCheck = /ptr\s*\+\+\s*;/i.test(code);
                    const printCheck = /printf\s*\(.*?\*ptr\s*\)\s*;/i.test(code);
                    return incCheck && printCheck && (code.match(/;/g) || []).length >= 4;
                },
                expectedOutput: "20"
            },
            {
                level: 3,
                title: "Linked List Node",
                code: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n}\n\nint main() {\n    struct Node* head = (struct Node*)malloc(sizeof(struct Node))\n    head.data = 10;\n    head.next = NULL;\n    printf("%d", head.data);\n    return 0\n}`,
                validate: (code) => {
                    const structEnd = /};\s*int\s+main/i.test(code) || /};\s*$/m.test(code);
                    const arrowOp = /head->data/i.test(code);
                    const mallocCheck = /malloc\s*\(.*?\)\s*;/i.test(code);
                    return structEnd && arrowOp && mallocCheck;
                },
                expectedOutput: "10"
            },
            {
                level: 4,
                title: "String Pointer",
                code: `#include <stdio.h>\n\nint main() {\n    char *str = "Hello";\n    str[0] = 'M';\n    printf("%s", str);\n    return 0;\n}`,
                validate: (code) => {
                    const arrayDecl = /char\s+str\s*\[\s*\]\s*=\s*"Hello"/i.test(code);
                    const modCheck = /str\[0\]\s*=\s*['"]M['"]/.test(code);
                    return arrayDecl && modCheck;
                },
                expectedOutput: "Mello"
            },
            {
                level: 5,
                title: "File Read",
                code: `#include <stdio.h>\n\nint main() {\n    FILE *fp = fopen("t.txt", "r")\n    char ch;\n    while((ch = fgetc(fp)) != EOF)\n        printf("%c", ch);\n    fclose(fp\n    return 0;\n}`,
                validate: (code) => {
                    const openSemi = /fopen\s*\(\s*".*?"\s*,\s*".*?"\s*\)\s*;/i.test(code);
                    const closeParen = /fclose\s*\(\s*fp\s*\)\s*;/i.test(code);
                    return openSemi && closeParen;
                },
                expectedOutput: "Content"
            },
            {
                level: 6,
                title: "Macro Logic",
                code: `#include <stdio.h>\n#define SQ(x) x*x\n\nint main() {\n    int a = 5;\n    printf("%d", SQ(a+1)\n    return 0;\n}`,
                validate: (code) => {
                    const printParen = /printf\s*\(.*?\)\s*;/i.test(code);
                    return printParen;
                },
                expectedOutput: "36"
            },
            {
                level: 7,
                title: "Bitwise Swap",
                code: `#include <stdio.h>\n\nint main() {\n    int x=10, y=5\n    x = x ^ y;\n    y = x ^ y;\n    x = x ^ y\n    printf("%d %d", x, y);\n    return 0;\n}`,
                validate: (code) => {
                    const declSemi = /int\s+x\s*=\s*10\s*,\s*y\s*=\s*5\s*;/i.test(code);
                    const lastXorSemi = /x\s*=\s*x\s*\^\s*y\s*;/i.test(code);
                    return declSemi && lastXorSemi;
                },
                expectedOutput: "5 10"
            },
            {
                level: 8,
                title: "Void Pointer",
                code: `#include <stdio.h>\n\nint main() {\n    int a = 10;\n    void *ptr = &a;\n    printf("%d", *ptr);\n    return 0;\n}`,
                validate: (code) => {
                    const castCheck = /printf\s*\(.*?\*\(\s*int\s*\*\s*\)\s*ptr\s*\)\s*;/i.test(code);
                    return castCheck;
                },
                expectedOutput: "10"
            },
            {
                level: 9,
                title: "Command Line",
                code: `#include <stdio.h>\n\nint main(int argc, char argv[]) {\n    if(argc > 1)\n        printf("%s", argv[1]);\n    return 0;\n}`,
                validate: (code) => {
                    const ptrArg = /char\s*\*\s*argv\s*\[\s*\]/i.test(code);
                    return ptrArg;
                },
                expectedOutput: "Arg printed"
            },
            {
                level: 10,
                title: "Union Usage",
                code: `#include <stdio.h>\n\nunion Data {\n    int i;\n    float f;\n}\n\nint main() {\n    union Data d;\n    d.i = 10\n    printf("%d", d.i);\n    return 0;\n}`,
                validate: (code) => {
                    const unionSemi = /}\s*;/i.test(code);
                    const assignSemi = /d\.i\s*=\s*10\s*;/i.test(code);
                    return unionSemi && assignSemi;
                },
                expectedOutput: "10"
            }
        ],
        JAVA: [
            {
                level: 1,
                title: "Factorial Loop",
                code: `import java.util.Scanner;\npublic class Program1 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter number: ")\n        int n = sc.nextInt();\n        int fact = 1\n        for(int i=1; i<=n; i++)\n            fact *= i\n        System.out.println("Factorial: " + fact)\n    }\n}`,
                validate: (code) => {
                    const sc = /Scanner\s*\(.*?\)\s*;/.test(code);
                    const print = /print\s*\(.*?\)\s*;/.test(code);
                    const fact = /int\s+fact\s*=\s*1\s*;/.test(code);
                    const loopBody = /fact\s*\+=\s*i\s*;/i.test(code) || /fact\s*\*=\s*i\s*;/.test(code);
                    const finalPrint = /println\s*\(.*?\)\s*;/.test(code);
                    return sc && print && fact && (loopBody || code.includes('{')) && finalPrint;
                },
                expectedOutput: "Factorial: 120"
            },
            {
                level: 2,
                title: "Fibonacci Series",
                code: `import java.util.Scanner;\npublic class Program2 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter terms: ")\n        int n = sc.nextInt()\n        int a=0, b=1\n        System.out.println("Fibonacci:")\n        for(int i=0; i<n; i++)\n            System.out.println(a)\n            int c = a + b\n            a = b\n            b = c\n    }\n}`,
                validate: (code) => {
                    const nCheck = /int\s+n\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const abCheck = /int\s+a\s*=\s*0\s*,\s*b\s*=\s*1\s*;/.test(code);
                    const loopBraces = (code.match(/for\s*\(.*?\)\s*{/g) || []).length >= 1;
                    const semicolons = (code.match(/;/g) || []).length >= 10;
                    return nCheck && abCheck && loopBraces && semicolons;
                },
                expectedOutput: "Fibonacci Series"
            },
            {
                level: 3,
                title: "Palindrome Number",
                code: `import java.util.Scanner;\npublic class Program3 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter number: ")\n        int num = sc.nextInt()\n        int temp = num, rev=0\n        while(temp>0)\n            int digit = temp % 10\n            rev = rev*10 + digit\n            temp = temp/10\n        if(rev = num)\n            System.out.println("Palindrome")\n        else\n            System.out.println("Not Palindrome")\n    }\n}`,
                validate: (code) => {
                    const scCheck = /Scanner\s*\(.*?\)\s*;/.test(code);
                    const numCheck = /int\s+num\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const whileBraces = (code.match(/while\s*\(.*?\)\s*{/g) || []).length >= 1;
                    const ifCheck = /if\s*\(\s*rev\s*==\s*num\s*\)/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 8;
                    return scCheck && numCheck && whileBraces && ifCheck && semicolons;
                },
                expectedOutput: "Palindrome"
            },
            {
                level: 4,
                title: "Multiplication Table",
                code: `import java.util.Scanner;\npublic class Program4 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter number: ")\n        int n = sc.nextInt()\n        for(int i=1; i<=10; i++)\n            System.out.println(n + " x " + i + " = " + n*i\n    }\n}`,
                validate: (code) => {
                    const scCheck = /Scanner\s*\(.*?\)\s*;/.test(code);
                    const printCheck = /print\s*\(.*?\)\s*;/.test(code);
                    const nCheck = /int\s+n\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const printlnCheck = /println\s*\(.*?\)\s*;/.test(code);
                    return scCheck && printCheck && nCheck && printlnCheck;
                },
                expectedOutput: "Table printed"
            },
            {
                level: 5,
                title: "Check Prime",
                code: `import java.util.Scanner;\npublic class Program5 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter number: ")\n        int n = sc.nextInt()\n        boolean prime = true\n        for(int i=2; i<=n/2; i++)\n            if(n % i == 0)\n                prime = false\n        if(prime = true)\n            System.out.println(n + " is prime")\n        else\n            System.out.println(n + " is not prime")\n    }\n}`,
                validate: (code) => {
                    const printCheck = /print\s*\(.*?\)\s*;/.test(code);
                    const nCheck = /int\s+n\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const boolCheck = /boolean\s+prime\s*=\s*true\s*;/.test(code);
                    const ifLogic = /if\s*\(\s*prime\s*(==\s*true)?\s*\)/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 8;
                    return printCheck && nCheck && boolCheck && ifLogic && semicolons;
                },
                expectedOutput: "Prime checked"
            },
            {
                level: 6,
                title: "Sum of Array",
                code: `import java.util.Scanner;\npublic class Program6 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int arr[] = new int[5]\n        int sum = 0\n        for(int i=0; i<5; i++)\n            arr[i] = sc.nextInt()\n        for(int i=0; i<5; i++)\n            sum += arr[i\n        System.out.println("Sum: " + sum)\n    }\n}`,
                validate: (code) => {
                    const arrDecl = /int\s+arr\[\s*\]\s*=\s*new\s+int\s*\[\s*5\s*\]\s*;/.test(code);
                    const sumDecl = /int\s+sum\s*=\s*0\s*;/.test(code);
                    const inputLoop = /arr\s*\[\s*i\s*\]\s*=\s*sc\.nextInt\s*\(\s*\)\s*;/.test(code);
                    const sumLoop = /sum\s*\+=\s*arr\s*\[\s*i\s*\]\s*;/.test(code);
                    const finalPrint = /println\s*\(.*?\)\s*;/.test(code);
                    return arrDecl && sumDecl && inputLoop && sumLoop && finalPrint;
                },
                expectedOutput: "Sum calculated"
            },
            {
                level: 7,
                title: "Reverse String",
                code: `import java.util.Scanner;\npublic class Program7 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter string: ")\n        String str = sc.nextLine()\n        String rev = ""\n        for(int i=str.length()-1; i>=0; i--)\n            rev += str.charAt(i)\n        System.out.println("Reversed string: " + rev)\n    }\n}`,
                validate: (code) => {
                    const scCheck = /Scanner\s*\(.*?\)\s*;/.test(code);
                    const printCheck = /print\s*\(.*?\)\s*;/.test(code);
                    const strCheck = /String\s+str\s*=\s*sc\.nextLine\s*\(\s*\)\s*;/.test(code);
                    const revCheck = /String\s+rev\s*=\s*""\s*;/.test(code);
                    const loopBody = /rev\s*\+=\s*str\.charAt\s*\(\s*i\s*\)\s*;/.test(code);
                    const finalPrint = /println\s*\(.*?\)\s*;/.test(code);
                    return scCheck && printCheck && strCheck && revCheck && loopBody && finalPrint;
                },
                expectedOutput: "Reversed string"
            },
            {
                level: 8,
                title: "Simple Calculator",
                code: `import java.util.Scanner;\npublic class Program8 {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in)\n        System.out.print("Enter first number: ")\n        int a = sc.nextInt()\n        System.out.print("Enter second number: ")\n        int b = sc.nextInt()\n        System.out.print("Enter operation (+,-,*,/): ")\n        char op = sc.next().charAt(0)\n        switch(op) {\n            case '+':\n                System.out.println("Result: " + (a + b))\n                break;\n            case '-':\n                System.out.println("Result: " + (a - b))\n                break;\n            case '*':\n                System.out.println("Result: " + (a * b))\n                break;\n            case '/':\n                System.out.println("Result: " + (a / b))\n                break;\n            default:\n                System.out.println("Invalid operation")\n        }\n    }\n}`,
                validate: (code) => {
                    const scCheck = /Scanner\s*\(.*?\)\s*;/.test(code);
                    const glbCheck = /print\s*\(.*?\)\s*;/.test(code);
                    const opCheck = /char\s+op\s*=\s*sc\.next\s*\(\s*\)\.charAt\s*\(\s*0\s*\)\s*;/.test(code);
                    const caseCheck = /println\s*\(.*?\)\s*;/.test(code);
                    const semicolons = (code.match(/;/g) || []).length >= 15;
                    return scCheck && glbCheck && opCheck && caseCheck && semicolons;
                },
                expectedOutput: "Result calculated"
            },
            {
                level: 9,
                title: "Interface Impl",
                code: `interface I { void show(); }\nclass A implements I {\n    public void show() {\n        System.out.println("Show");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        I obj = new A()\n        obj.show();\n    }\n}`,
                validate: (code) => {
                    const newSemi = /new\s+A\s*\(\s*\)\s*;/i.test(code);
                    return newSemi;
                },
                expectedOutput: "Show"
            },
            {
                level: 10,
                title: "Try Catch",
                code: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int a = 10/0;\n        } catch(ArithmeticException e) \n            System.out.println(e);\n        \n    }\n}`,
                validate: (code) => {
                    const catchBrace = /catch\s*\(.*?\)\s*\{/.test(code);
                    return catchBrace;
                },
                expectedOutput: "Exception"
            }
        ],
        PYTHON: [
            {
                level: 1,
                title: "List Comprehension",
                code: `nums = [1, 2, 3, 4, 5]\nsq = [x**2 for x in nums if x%2 == 0\nprint(sq)`,
                validate: (code) => {
                    const compCheck = /\[\s*x\s*\*\*\s*2\s+for\s+x\s+in\s+nums\s+if\s+x\s*%\s*2\s*==\s*0\s*\]/.test(code);
                    const printCheck = /print\s*\(\s*sq\s*\)/.test(code);
                    return compCheck && printCheck;
                },
                expectedOutput: "[4, 16]"
            },
            {
                level: 2,
                title: "Generators",
                code: `def my_gen(n):\n    i = 0\n    while i < n\n        yield i\n        i += 1\n\nfor val in my_gen(3):\n    print(val)`,
                validate: (code) => {
                    const whileColon = /while\s+i\s*<\s*n\s*:/.test(code);
                    const yieldCheck = /yield\s+i/.test(code);
                    return whileColon && yieldCheck;
                },
                expectedOutput: "0\n1\n2"
            },
            {
                level: 3,
                title: "Decorators",
                code: `def my_decorator(func):\n    def wrapper():\n        print("Before")\n        func()\n        print("After")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello")\n\nsay_hello`,
                validate: (code) => {
                    const callCheck = /say_hello\s*\(\s*\)/.test(code);
                    const decoratorCheck = /@my_decorator/.test(code);
                    return callCheck && decoratorCheck;
                },
                expectedOutput: "Before\nHello\nAfter"
            },
            {
                level: 4,
                title: "Class Inheritance",
                code: `class Animal:\n    def speak(self):\n        print("Animal speaks")\n\nclass Dog(Animal):\n    def speak(self):\n        super.speak()\n        print("Dog barks")\n\nd = Dog()\nd.speak()`,
                validate: (code) => {
                    const superCheck = /super\s*\(\s*\)\.speak\s*\(\s*\)/.test(code);
                    const classCheck = /class\s+Dog\s*\(\s*Animal\s*\)\s*:/.test(code);
                    return superCheck && classCheck;
                },
                expectedOutput: "Animal speaks\nDog barks"
            },
            {
                level: 5,
                title: "Lambda Func",
                code: `x = lambda a : a + 10\nprint(x(5)`,
                validate: (code) => {
                    const printParen = /print\s*\(.*?\)/.test(code);
                    return printParen;
                },
                expectedOutput: "15"
            },
            {
                level: 6,
                title: "Regex Match",
                code: `import re\ntxt = "The rain"\nx = re.search("^The.*Spain$", txt\nif x\n    print("YES")\nelse\n    print("NO")`,
                validate: (code) => {
                    const searchParen = /re\.search\s*\(.*?\)/.test(code);
                    const ifColon = /if\s+x\s*:/.test(code);
                    const elseColon = /else\s*:/.test(code);
                    return searchParen && ifColon && elseColon;
                },
                expectedOutput: "NO"
            },
            {
                level: 7,
                title: "Try Except",
                code: `try:\n    print(x)\nexcept NameError\n    print("Variable x is not defined")\nexcept:\n    print("Something else went wrong")`,
                validate: (code) => {
                    const exceptColon = /except\s+NameError\s*:/.test(code);
                    return exceptColon;
                },
                expectedOutput: "Variable x is not defined"
            },
            {
                level: 8,
                title: "File Write",
                code: `f = open("demofile2.txt", "a")\nf.write("Now the file has more content!")\nf.close(\n\nf = open("demofile2.txt", "r")\nprint(f.read())`,
                validate: (code) => {
                    const closeParen = /f\.close\s*\(\s*\)/.test(code);
                    return closeParen;
                },
                expectedOutput: "Content"
            },
            {
                level: 9,
                title: "Map Filter",
                code: `nums = [1, 2, 3, 4]\ndoubled = map(lambda x x*2, nums)\nprint(list(doubled))`,
                validate: (code) => {
                    const lambdaColon = /lambda\s+x\s*:\s*x\s*\*\s*2/.test(code);
                    return lambdaColon;
                },
                expectedOutput: "[2, 4, 6, 8]"
            },
            {
                level: 10,
                title: "Set Operations",
                code: `thisset = {"apple", "banana", "cherry"}\nthisset.add "orange"\nprint(thisset)`,
                validate: (code) => {
                    const addParen = /thisset\.add\s*\(\s*"orange"\s*\)/.test(code);
                    return addParen;
                },
                expectedOutput: "{'orange', ...}"
            }
        ]
    }
};
