(function () {
  var $ = function (id) { return document.getElementById(id) };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GH = 'https://github.com/laxmanbirajdar057-dot/';

  /* nav, progress bar, active link */
  var nav = $('nav'), menu = $('menu'), burger = $('burger'), bar = $('progress');
  addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', scrollY > 8);
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }, { passive: true });
  burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o) });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false') } });
  var links = [].slice.call(menu.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id) }) }) }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s) });
  }

  var ok = $('ok');
  $('copy').onclick = function () {
    (navigator.clipboard ? navigator.clipboard.writeText($('mail').textContent) : Promise.reject()).then(function () { ok.textContent = 'Copied' }, function () { ok.textContent = 'Copy failed, use the link' });
    setTimeout(function () { ok.textContent = '' }, 2500);
  };

  /* project pipelines: every node and sentence below is taken from the existing site and repos */
  var P = [
    {
      tab: 'Two-tier app on AWS', repo: 'urlshortener',
      problem: 'Run an application and its database together on a cloud server in a repeatable way.',
      approach: 'Split the app into an application tier (Spring Boot) and a data tier (MySQL), both defined in one Docker Compose file and run on AWS EC2.',
      stack: 'Spring Boot, MySQL, Docker, Docker Compose, AWS EC2',
      nodes: [
        ['Browser', 'Client', 'Sends requests to the application running on the EC2 instance.'],
        ['AWS EC2', 'Host', 'The virtual server that runs the Docker Compose stack.'],
        ['Spring Boot', 'App tier', 'The URL shortener application, run as a container built from a Dockerfile.'],
        ['MySQL', 'Data tier', 'The database container, started by Compose alongside the application.']]
    },
    {
      tab: 'Terraform on AWS', repo: 'terraform-aws-infrastructure',
      problem: 'Create AWS infrastructure the same way every time instead of clicking through the console.',
      approach: 'Defined a VPC with public and private subnets across two AZs, an Ubuntu EC2 instance with security groups and IAM-based access, and CloudWatch monitoring. Split the code into networking, security, compute and monitoring modules.',
      stack: 'Terraform, AWS (VPC, EC2, IAM, CloudWatch, SNS), Bash, GitHub Actions',
      learned: 'Terraform state management, and using moved blocks to refactor into modules without recreating resources.',
      nodes: [
        ['Developer', 'Push or PR', 'Code changes are pushed to GitHub.'],
        ['GitHub Actions', 'CI only', 'Runs terraform fmt and validate on pushes and pull requests. terraform apply is run manually.'],
        ['Terraform', 'Modules', 'Four modules: networking, security, compute, monitoring.'],
        ['VPC', '2 AZs', 'Public and private subnets across two availability zones.'],
        ['EC2', 'Ubuntu + Nginx', 'Security groups and IAM-based access. A Bash user-data script installs and configures Nginx.'],
        ['CloudWatch + SNS', 'Alerting', 'A CPU alarm that sends email notifications through SNS.']]
    },
    {
      tab: 'URL shortener CI/CD', repo: 'urlshortener',
      problem: 'Get from a code change to a versioned container image without manual build steps.',
      approach: 'A GitHub Actions workflow tests and builds the application, then publishes the Docker image to GitHub Container Registry. The image runs on EC2 with Docker Compose.',
      stack: 'GitHub Actions, Docker, GHCR, AWS EC2, Spring Boot, MySQL',
      nodes: [
        ['Developer', 'Push to main', 'A push to the main branch starts the pipeline.'],
        ['GitHub', 'Source', 'Hosts the repository and triggers the workflow.'],
        ['GitHub Actions', 'Test, build', 'Tests the application and builds the Docker image.'],
        ['GHCR', 'latest + SHA', 'Stores the image, tagged latest and with the commit SHA.'],
        ['AWS EC2', 'Docker Compose', 'Runs the published image with Docker Compose.']]
    }
  ];
  var tabs = $('tabs'), flow = $('flow'), panel = $('panel'), meta = $('meta'), cur = 0;
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e }
  function pick(n) {
    [].forEach.call(flow.querySelectorAll('.node'), function (b, i) { b.setAttribute('aria-pressed', i === n) });
    var d = P[cur].nodes[n]; panel.innerHTML = '<h3>' + d[0] + '</h3><p>' + d[2] + '</p>';
  }
  function show(i) {
    cur = i;
    [].forEach.call(tabs.children, function (b, k) { b.setAttribute('aria-selected', k === i) });
    var p = P[i]; flow.innerHTML = '';
    p.nodes.forEach(function (n, k) {
      if (k) flow.appendChild(el('span', 'link'));
      var b = el('button', 'node', '<b>' + n[0] + '</b><small>' + n[1] + '</small>');
      b.type = 'button'; b.setAttribute('role', 'listitem'); b.onclick = function () { pick(k) }; flow.appendChild(b);
    });
    var m = '<div><h4>Problem</h4><p>' + p.problem + '</p></div><div><h4>Approach</h4><p>' + p.approach + '</p></div><div><h4>Technologies</h4><p>' + p.stack + '</p></div>';
    if (p.learned) m += '<div><h4>What I learned</h4><p>' + p.learned + '</p></div>';
    m += '<a class="btn sm" target="_blank" rel="noopener" href="' + GH + p.repo + '">View on GitHub</a>';
    meta.innerHTML = m; pick(0);
  }
  P.forEach(function (p, i) {
    var b = el('button', '', p.tab); b.type = 'button'; b.setAttribute('role', 'tab'); b.onclick = function () { show(i) }; tabs.appendChild(b);
  });
  show(0);

  /* terminal */
  var out = $('out'), cmd = $('cmd');
  var C = {
    whoami: 'laxman birajdar: entry-level DevOps & Cloud engineer, Mumbai',
    stack: 'AWS  Docker  Terraform  GitHub Actions  Linux  Bash  Git',
    targets: 'DevOps | Cloud | Infrastructure | Linux administration',
    projects: 'two-tier-aws/  terraform-aws-infrastructure/  urlshortener-ci-cd/',
    certs: 'AWS Certified Cloud Practitioner (2025)',
    resume: 'Download: <a href="assets/Laxman_Birajdar_DevOps_Resume.pdf" download>Laxman_Birajdar_Resume.pdf</a>',
    github: '<a href="' + GH.slice(0, -1) + '" target="_blank" rel="noopener">github.com/laxmanbirajdar057-dot</a>',
    help: 'commands: whoami  stack  targets  projects  certs  resume  github  clear'
  };
  function line(h) { var d = el('div', '', h); out.appendChild(d); out.scrollTop = out.scrollHeight }
  function run(c) {
    line('<span class="p">$</span> ' + c.replace(/</g, '&lt;'));
    if (c === 'clear') { out.innerHTML = ''; return }
    line(C[c] || 'command not found: ' + c.replace(/</g, '&lt;') + '. Try help.');
  }
  var intro = ['whoami', 'stack', 'help'], t = 0;
  function boot() { if (t >= intro.length) return; run(intro[t++]); setTimeout(boot, reduce ? 0 : 650) }
  boot();
  cmd.addEventListener('keydown', function (e) { if (e.key === 'Enter' && cmd.value.trim()) { run(cmd.value.trim().toLowerCase()); cmd.value = '' } });

  /* hero network background (static frame when reduced motion is on) */
  var cv = $('net'), g = cv.getContext('2d'), pts = [], W, H;
  function size() {
    W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
    pts = []; for (var i = 0, n = Math.min(40, W / 28); i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
  }
  function draw() {
    g.clearRect(0, 0, W, H);
    pts.forEach(function (a, i) {
      if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1 }
      for (var j = i + 1; j < pts.length; j++) {
        var b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { g.strokeStyle = 'rgba(0,123,167,' + (1 - d / 140) * .5 + ')'; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke() }
      }
      g.fillStyle = i % 9 ? '#007BA7' : '#FF2D75'; g.beginPath(); g.arc(a.x, a.y, 2, 0, 7); g.fill();
    });
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw(); addEventListener('resize', function () { size(); if (reduce) draw() });
})();
