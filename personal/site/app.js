const PROGRESS_MS_PER_PERCENT = 4;

/* Content for panels */
const content = {
  whoami: [
    "Gal Ben | Mechanical Engineering Student",
    "Innovating the world of control systems",
    "",
    "Location: Tel-Aviv, Israel",
    'LinkedIn: <a href="https://www.linkedin.com/in/gal-ben" target="_blank" rel="noopener noreferrer">gal-ben</a>',
    'GitHub: <a href="https://github.com/GGAALL98" target="_blank" rel="noopener noreferrer">GGAALL98</a>',
    'CV: <a href="CV.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>',
  ],

  experience: [
    'Lab Assistant — <a href="https://www.active-wave-control-lab.com" target="_blank" rel="noopener noreferrer">Active Wave Control Lab</a> (2025–Present)',
    "  - Development, setup, support, HIL experiments, documentation",
    "",
    'Final Project Student — <a href="https://www.active-wave-control-lab.com" target="_blank" rel="noopener noreferrer">Active Wave Control Lab</a> (2025–Present)',
    "  - Real-time wave control, MATLAB/Simulink, Speedgoat HIL testing",
    "",
    'Ecommerce & IT Specialist — <a href="https://ranor-lighting.com/" target="_blank" rel="noopener noreferrer">Ranor Lighting Design</a> (2021–2022)',
    "  - Web / e-commerce ops, security, analytics, 3D design collaboration",
    "",
    'Radio Technician — <a href="https://www.idf.il/en/" target="_blank" rel="noopener noreferrer">Israel Defense Forces</a> (2017–2020)',
    "  - RF systems, IT support, inventory, drone mapping/videography",
  ],

  engineering: [
    { label: "Simulink", value: 100 },
    { label: "MATLAB / Octave", value: 100 },
    { label: "Real Time Control", value: 90 },
    { label: "Julia", value: 80 },
    { label: "Maxima", value: 100 },
  ],

  cad: [
    { label: "Siemens NX", value: 80 },
    { label: "SOLIDWORKS", value: 100 },
    { label: "Fusion 360 & Inventor", value: 80 },
    { label: "SketchUp", value: 80 },
    { label: "Cimatron", value: 80 },
    { label: "KiCad", value: 80 },
    { label: "Ansys Fluent", value: 60 },
    { label: "SimCenter", value: 60 },
    { label: "Nastran", value: 60 },
  ],

  programming: [
    { label: "Python", value: 80 },
    { label: "Linux / Shell", value: 100 },
    { label: "Arduino", value: 80 },
    { label: "C# / C", value: 50 },
    { label: "macOS / Windows", value: 100 },
  ],

  office: [
    "LaTeX / LyX",
    "Microsoft Office",
    "WordPress & WooCommerce",
    "Marketing & E-commerce",
  ],
};

/* Map DOM elements for panels */
const panels = {
  whoami: document.getElementById("whoami-panel"),
  experience: document.getElementById("experience-panel"),
  engineering: document.getElementById("engineering-panel"),
  cad: document.getElementById("cad-panel"),
  programming: document.getElementById("programming-panel"),
  office: document.getElementById("office-panel"),
};

/* Type a single panel, char-by-char. Lines containing <a> are inserted instantly. */
function typeLine(panelEl, lines, index = 0, charIndex = 0) {
  if (index >= lines.length) return;
  const current = lines[index];
  const div = document.createElement("div");
  div.className = "console-line";
  panelEl.appendChild(div);

  // If string contains anchor tag, render as HTML (instant)
  if (typeof current === "string" && current.includes("<a")) {
    div.innerHTML = current;
    setTimeout(() => typeLine(panelEl, lines, index + 1, 0), 90);
    return;
  }

  // Normal string -> type character-by-character
  if (typeof current === "string") {
    function stepChar() {
      if (charIndex < current.length) {
        div.textContent += current[charIndex++];
        setTimeout(stepChar, 6);
      } else {
        setTimeout(() => typeLine(panelEl, lines, index + 1, 0), 80);
      }
    }
    stepChar();
    return;
  }

  // Progress bar object -> use CSS transition for smooth deterministic fill
  if (typeof current === "object" && current.label) {
    div.textContent = current.label;

    const barContainer = document.createElement("div");
    barContainer.className = "progress-bar-container";

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    barContainer.appendChild(bar);

    const percentLabel = document.createElement("span");
    percentLabel.className = "progress-percent";
    percentLabel.textContent = "0%";
    barContainer.appendChild(percentLabel);

    div.appendChild(barContainer);

    const target = Math.max(0, Math.min(100, current.value));
    const duration = Math.max(60, Math.round(target * PROGRESS_MS_PER_PERCENT));

    bar.style.transition = `width ${duration}ms linear`;

    const colors = ["#f00", "#f60", "#ff0", "#6f0", "#0f0"]; // red to yellow to green

    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = target + "%";
      }, 8);

      // Animate percentage + color
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const perc = Math.round(progress * target);
        percentLabel.textContent = perc + "%";

        // Map percentage to palette index
        const colorIndex = Math.floor((perc / 100) * (colors.length - 1));
        bar.style.background = colors[colorIndex];

        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });

    setTimeout(() => typeLine(panelEl, lines, index + 1, 0), duration + 60);
    return;
  }

  // Fallback: convert to string and move on
  div.textContent = String(current);
  setTimeout(() => typeLine(panelEl, lines, index + 1, 0), 80);
}

/* Start concurrent typing in all panels with a tiny randomized stagger */
Object.keys(panels).forEach((key) => {
  if (panels[key] && content[key]) {
    setTimeout(
      () => typeLine(panels[key], content[key], 0, 0),
      Math.random() * 80,
    );
  }
});

/* Graduation countdown (1 Oct 2026) */
const gradCountdownEl = document.getElementById("grad-countdown");
const gradDate = new Date("2026-10-01T00:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = gradDate - now;
  if (diff <= 0) {
    gradCountdownEl.textContent = "🎓 Graduated! Congratulations! 🎓";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  gradCountdownEl.textContent = `Time until graduation: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* Bottom terminal auto-type loop */
const bottomCmd = document.querySelector(".bottom-terminal .cmd-text");
const cmds = [
  // General / System
  "ls ~/projects",
  "top -n 1",
  "htop",
  "neofetch",
  "df -h",
  "free -m",
  "cat /etc/os-release",
  "uptime",
  "dmesg | tail -n 20",
  "journalctl -xe | tail -n 50",
  'echo "System check complete"',
  "sleep 1",
  "clear",

  // Git / Project workflow
  "git status",
  "git add .",
  'git commit -m "Update portfolio"',
  "git push origin main",
  "tar -czvf backup.tar.gz ~/projects",
  "unzip archive.zip",
  "ls -lha",
  'find . -name "*.c"',
  'grep "main" main.c',
  "./deploy.sh",

  // Python / scripting / virtual environments
  "python3 -m venv env",
  "source env/bin/activate",
  "pip install -r requirements.txt",
  "python3 main.py",
  "python3 log_to_csv.py",
  "python3 test_actuators.py",
  "python3 actuator_response.py",
  "python3 run_control_loop.py",
  "python3 tune_pid.py",

  // MATLAB / Simulink / SLRt
  "matlab -batch \"run('simulink_model.mdl')\"",
  "matlab -batch \"run('inverted_pendulum.slx')\"",
  'slrt_build_project("HIL_test_project")',
  "speedgoat --run hil_test.slx",
  "matlab -batch \"sim('real_time_controller')\"",

  // Julia / Octave
  "julia script.jl",
  "octave --silent calc.m",
  'octave --eval "inverted_pendulum()"',

  // C / Make
  "make build",
  "gcc main.c -o main",
  "./main",
  "cargo build --release",

  // Node / JS
  "npm install",
  "npm run dev",

  // Docker / K8s
  "docker build -t gobyos .",
  "docker run --rm gobyos",
  "kubectl get pods",

  // MCU / Embedded / Control Systems
  'echo "Initializing MCU..."',
  "gpio mode 12 pwm",
  "gpio pwm 12 1024",
  "adc read 0",
  "dac write 0 512",
  "i2cdetect -y 1",
  "i2cget -y 1 0x48 0x00",
  "i2cset -y 1 0x48 0x01 0x60",
  "spi-devices",
  "stm32flash -w firmware.bin -v -g 0x0 /dev/ttyUSB0",
  "avrdude -c usbasp -p m328p -U flash:w:blink.hex",
  "arduino-cli compile --fqbn arduino:avr:uno sketch",
  "arduino-cli upload -p /dev/ttyUSB0",
  "arduino-cli compile --fqbn esp32:esp32:esp32dev sketch",
  "arduino-cli upload -p /dev/ttyUSB1",
  'echo "PWM outputs active"',
  'echo "Actuator test running..."',
  'echo "Logging sensor data..."',
  "tail -f sensors.log",
  'watch -n 1 "vcgencmd measure_temp"',
  'echo "Reading encoder values..."',
  "cat /dev/ttyUSB0",
  'echo "Performing stability test..."',
  "./stability_check.sh",
  'echo "Starting closed-loop control..."',
  "python3 run_control_loop.py",
  'echo "Monitoring loop performance..."',
  "tail -f control.log",

  // Projects / Engineering Fun
  'echo "Simulating inverted pendulum..."',
  "matlab -batch \"run('inverted_pendulum.slx')\"",
  "python3 inverted_pendulum_sim.py",
  "julia inverted_pendulum.jl",
  'echo "Testing DC motor control..."',
  "python3 dc_motor_control.py",
  'echo "Running quadcopter simulation..."',
  "python3 quadcopter.py",
  'echo "Running HIL test on Speedgoat..."',
  "speedgoat --run hil_quadcopter.slx",
  'echo "Reading IMU data..."',
  "python3 imu_read.py",
  'echo "Calibrating sensors..."',
  "python3 sensor_calibration.py",
  'echo "Control systems ready..."',

  // Misc / Networking
  "ping -c 4 google.com",
  "traceroute github.com",
  "wget https://example.com/file.zip",
  "scp user@server:~/file.txt .",
  "ssh user@server",
  "chmod +x deploy.sh",
  'echo "All systems nominal"',
  "sleep 1",
  "clear",
];
let cmdIndex = 0,
  charIndex = 0;

// Make a randomized copy of the commands, but start with welcome
let randomizedCmds = [
  'echo "Welcome to GobyOS 2025!"',
  ...cmds.filter((c) => c !== 'echo "Welcome to GobyOS 2025!"'),
];

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the commands except the first one
randomizedCmds = [randomizedCmds[0], ...shuffle(randomizedCmds.slice(1))];

// Insert additional welcome messages every 5–8 commands randomly
function injectWelcome(arr) {
  let i = 1; // start after first command
  while (i < arr.length) {
    const step = 5 + Math.floor(Math.random() * 4); // 5–8 commands
    i += step;
    if (i < arr.length) arr.splice(i, 0, 'echo "Welcome to GobyOS 2025!"');
    i++;
  }
  return arr;
}

randomizedCmds = injectWelcome(randomizedCmds);

function typeBottom() {
  const current = randomizedCmds[cmdIndex];
  if (charIndex < current.length) {
    bottomCmd.textContent += current[charIndex++];
    setTimeout(typeBottom, 30);
  } else {
    setTimeout(() => {
      bottomCmd.textContent = "";
      charIndex = 0;
      cmdIndex = (cmdIndex + 1) % randomizedCmds.length;
      setTimeout(typeBottom, 600);
    }, 700);
  }
}

typeBottom();

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});


