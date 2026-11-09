/**
 * Shivam's Portfolio - Interactive Terminal Playground
 * Simulates an authentic Unix-like terminal environment
 */

(function () {
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const terminalOutput = document.getElementById('terminalOutput');
  const chipButtons = document.querySelectorAll('.terminal-chip-btn');

  if (!terminalInput || !terminalBody || !terminalOutput) return;

  const commands = {
    help: () => `
<div class="term-accent">Available Commands:</div>
  <span class="term-green">about</span>     - Learn about Shivam & Chitkara University (AI & ML)
  <span class="term-green">skills</span>    - View technical arsenal & tools
  <span class="term-green">cert</span>      - Microsoft Azure AI-901 certification details
  <span class="term-green">wispr</span>     - Info on Wispr Flow productivity workflow
  <span class="term-green">repo</span>      - View official GitHub repository link
  <span class="term-green">contact</span>   - Get direct phone number, email & links
  <span class="term-green">clear</span>     - Clear terminal screen
  <span class="term-green">sudo hire</span> - Executive recruit authorization
  <span class="term-green">date</span>      - Show current date & academic calendar
`,
    about: () => `
<div class="term-accent">🧑‍💻 Developer Profile:</div>
Name: <span class="term-green">Shivam</span>
Status: <span class="term-green">B.Tech Computer Science & Engineering - AI & ML (1st Year)</span>
Institution: <span class="term-green">Chitkara University</span>
Focus: Artificial Intelligence & Machine Learning, Wispr Flow, Rapid Prototyping
Philosophy: "Relentless curiosity + execution = real impact."
`,
    skills: () => `
<div class="term-accent">🛠️ Technical Stack:</div>
• <span class="term-green">AI & Cloud:</span> Azure AI Services, Computer Vision, NLP, Prompt Engineering
• <span class="term-green">Languages:</span> Python, C/C++, Modern JavaScript (ES6+), HTML5/CSS3
• <span class="term-green">Productivity & Dev Tools:</span> Wispr Flow, Git & GitHub, VS Code, Linux Shell
• <span class="term-green">Foundations:</span> Data Structures, Algorithmic Thinking, Computer Architecture
`,
    cert: () => `
<div class="term-accent">🏆 Verified Certification:</div>
Badge: <span class="term-green">Microsoft Certified: Azure AI Fundamentals</span>
Code: <span class="term-green">Exam AI-901 / AI-900</span>
Credential ID: <span class="term-green">MS-AI-901-SHIVAM</span>
Verified Domains: Computer Vision, Natural Language Processing, Conversational AI, Azure ML
Status: <span class="term-green">Active & Authenticated</span>
`,
    wispr: () => `
<div class="term-accent">🎙️ Wispr Flow Exploration:</div>
Currently leveraging and experimenting with <span class="term-green">Wispr Flow</span> for lightning-fast voice-driven development, frictionless prompt structuring, and multimodal workflow automation.
`,
    repo: () => `
<div class="term-accent">📂 GitHub Repository:</div>
URL: <a href="https://github.com/shivamhanda277-prog/Shivam" target="_blank" class="term-green" style="text-decoration: underline;">https://github.com/shivamhanda277-prog/Shivam</a>
Live Pages: <a href="https://shivamhanda277-prog.github.io/Shivam/" target="_blank" class="term-green" style="text-decoration: underline;">https://shivamhanda277-prog.github.io/Shivam/</a>
`,
    contact: () => `
<div class="term-accent">📬 Direct Contact Channels:</div>
• Direct Phone: <a href="tel:925183000" class="term-green" style="text-decoration: underline;">+91 925183000</a>
• WhatsApp: <a href="https://wa.me/91925183000" target="_blank" class="term-green" style="text-decoration: underline;">Chat on WhatsApp (+91 925183000)</a>
• Location: Chitkara University (CSE AI & ML), Punjab / India
• Email: <a href="mailto:shivamhanda277@gmail.com" class="term-green" style="text-decoration: underline;">shivamhanda277@gmail.com</a>
`,
    'sudo hire': () => `
<div style="color: #F59E0B; font-weight: bold;">[ACCESS GRANTED] Authorization Level: Sudo</div>
<div class="term-green">🚀 Match Found! Shivam brings relentless energy, foundational AI skills, and rapid learning ability.</div>
<div class="term-accent">Call Shivam immediately at +91 925183000 or email shivamhanda277@gmail.com!</div>
`,
    hire: () => `
<div class="term-muted">Tip: Try running 'sudo hire' for root recruiter privilege! 😉</div>
`,
    date: () => `
<div class="term-green">🕒 ${new Date().toLocaleString('en-US', { timeZoneName: 'short' })}</div>
<div class="term-muted">Academic Term: B.Tech CSE (AI & ML) Year 1 • Chitkara University</div>
`,
    clear: () => {
      terminalOutput.innerHTML = '';
      return null;
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    // Create entry in output
    const commandLog = document.createElement('div');
    commandLog.className = 'terminal-log-entry';
    commandLog.innerHTML = `
      <div class="terminal-prompt-line" style="margin-top: 0.5rem;">
        <span class="prompt-symbol">shivam@chitkara:~$</span>
        <span style="color: #F8FAFC;">${escapeHtml(rawCmd)}</span>
      </div>
    `;
    terminalOutput.appendChild(commandLog);

    let outputHtml = '';
    if (commands[trimmed]) {
      outputHtml = commands[trimmed]();
    } else {
      outputHtml = `<div style="color: #EF4444;">command not found: ${escapeHtml(rawCmd)}. Type <span class="term-green">help</span> to see available commands.</div>`;
    }

    if (outputHtml !== null) {
      const responseLog = document.createElement('div');
      responseLog.className = 'terminal-response';
      responseLog.innerHTML = outputHtml;
      terminalOutput.appendChild(responseLog);
    }

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  // Handle Input Keypress
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  // Handle Chip Clicks
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // Focus input when clicking inside terminal body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
})();
