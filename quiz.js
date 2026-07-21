const steps = [
  {short:'Betrieb',q:'Für welchen Standort prüfen Sie das Einsparpotenzial?',hint:'Die Analyse richtet sich ausschließlich an Gewerbe- und Industriebetriebe.',answers:['Produktion / Industrie','Logistik / Lager','Handel / größeres Gewerbe','Hotel / Gastronomie','Immobilie / Quartier','Privathaushalt']},
  {short:'Stromkosten',q:'Wie hoch ist Ihre monatliche Stromrechnung?',hint:'Eine realistische Schätzung genügt. So erkennen wir schnell, ob ein Speichersystem wirtschaftlich relevant sein kann.',answers:['Unter 2.000 €','2.000 – 5.000 €','5.000 – 10.000 €','10.000 – 25.000 €','Über 25.000 €','Nicht sicher']},
  {short:'Verbrauch',q:'Wie hoch ist Ihr jährlicher Stromverbrauch?',hint:'Ab 100.000 kWh pro Jahr lohnt sich eine individuelle Prüfung in der Regel besonders.',answers:['Unter 100.000 kWh','100.000 – 250.000 kWh','250.000 – 500.000 kWh','500.000 – 1.000.000 kWh','Über 1.000.000 kWh','Nicht bekannt']},
  {short:'Kostenhebel',q:'Was treibt Ihre Energiekosten aktuell besonders?',hint:'Wählen Sie den Punkt, der Ihren Betrieb am besten beschreibt.',answers:['Hohe Lastspitzen / Leistungspreise','Hoher Stromverbrauch insgesamt','PV-Überschüsse bleiben ungenutzt','Neue Ladeinfrastruktur ist geplant','Schwankende Strompreise','Noch nicht eindeutig']},
  {short:'PV',q:'Wie ist Ihr Unternehmen bei Photovoltaik aufgestellt?',hint:'Eine PV-Anlage ist keine Voraussetzung, kann das Einsparpotenzial aber zusätzlich erhöhen.',answers:['PV-Anlage ist vorhanden','PV-Anlage ist konkret geplant','PV-Anlage wird geprüft','Keine PV-Anlage geplant']},
  {short:'Zeitraum',q:'Wann möchten Sie Ihre Energiekosten aktiv optimieren?',hint:'Je konkreter der Zeitrahmen, desto gezielter können wir den nächsten Schritt einordnen.',answers:['Innerhalb von 3 Monaten','In 3 bis 6 Monaten','In 6 bis 12 Monaten','Später als 12 Monate','Zunächst Potenzial verstehen']},
  {short:'Investition',q:'Wie konkret ist die Investitionsentscheidung?',hint:'Damit unterscheiden wir umsetzungsreife Projekte von einer ersten Orientierung.',answers:['Budget / Business Case ist grundsätzlich freigegeben','Budget und Anforderungen werden aktuell definiert','Wir benötigen belastbare Zahlen für die Entscheidung','Wir sammeln zunächst allgemeine Informationen']},
  {short:'Daten',q:'Welche Energiedaten liegen für den Standort vor?',hint:'Mit Lastgang und Abrechnung lässt sich das wirtschaftliche Potenzial genauer bewerten.',answers:['Lastgangdaten und aktuelle Stromabrechnung liegen vor','Stromabrechnung liegt vor, Lastgang kann beschafft werden','Daten können kurzfristig zusammengestellt werden','Aktuell liegen noch keine Daten vor']},
  {short:'Rolle',q:'Welche Rolle haben Sie bei der Entscheidung?',hint:'Damit das anschließende Gespräch auf der richtigen Ebene stattfindet.',answers:['Geschäftsführung / Inhaber','Technische Leitung / Energiemanagement','Einkauf / Finanzen','Projektverantwortung','Beratung / Planung','Keine direkte Projektverantwortung']},
  {short:'Kontakt',q:'Wohin dürfen wir Ihr Einsparpotenzial senden?',hint:'Ein Commeo-Experte prüft Ihre Angaben und ordnet die mögliche Stromkostenreduzierung persönlich in Euro und Prozent ein.',form:true}
];

let current = 0;
const data = {campaign:JSON.parse(sessionStorage.getItem('commeo_campaign') || '{}'),contact:{}};
const progress = document.querySelector('#progress'), q = document.querySelector('#question'), hint = document.querySelector('#hint'), answers = document.querySelector('#answers'), fields = document.querySelector('#formFields'), next = document.querySelector('#next'), back = document.querySelector('#back'), label = document.querySelector('#stepLabel');
progress.style.setProperty('--steps',steps.length);

function rejectionReason(index,answer){
  if(index===0 && answer==='Privathaushalt') return 'privathaushalt';
  if(index===1 && answer==='Unter 2.000 €') return 'stromkosten_unter_2000';
  if(index===2 && answer==='Unter 100.000 kWh') return 'verbrauch_unter_100000';
  return '';
}

function showRejection(reason){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event:'lead_disqualified',funnel:'commeo_stromkosten',reason,...data.campaign});
  progress.innerHTML = '';
  document.querySelector('.quiz-card').innerHTML = `<div class="success rejected"><span>i</span><p class="section-label">Aktuell noch keine passende Ausgangslage</p><h1>Vielen Dank für Ihre Angaben.</h1><p>Commeo-Systeme richten sich aktuell vor allem an Gewerbe- und Industriestandorte ab etwa 100.000 kWh Jahresverbrauch beziehungsweise einer entsprechend hohen Stromrechnung.</p><button class="back restart" type="button">← Angabe korrigieren</button><a class="btn" href="/">Zurück zur Startseite →</a></div>`;
  document.querySelector('.restart').onclick = () => location.reload();
}

function validateForm(){
  const required = [...fields.querySelectorAll('input[required]')], email = fields.querySelector('input[name="email"]'), zip = fields.querySelector('input[name="zip"]');
  const valid = required.every(x => x.type==='checkbox' ? x.checked : x.value.trim()) && (!email || email.validity.valid) && (!zip || /^\d{5}$/.test(zip.value.trim()));
  next.disabled = !valid;
}

function scoreLead(){
  let score = 0;
  const points = {
    '2.000 – 5.000 €':8,'5.000 – 10.000 €':15,'10.000 – 25.000 €':20,'Über 25.000 €':25,
    '100.000 – 250.000 kWh':20,'250.000 – 500.000 kWh':28,'500.000 – 1.000.000 kWh':34,'Über 1.000.000 kWh':40,
    'Hohe Lastspitzen / Leistungspreise':8,'PV-Überschüsse bleiben ungenutzt':7,'Neue Ladeinfrastruktur ist geplant':7,
    'PV-Anlage ist vorhanden':7,'PV-Anlage ist konkret geplant':5,
    'Innerhalb von 3 Monaten':18,'In 3 bis 6 Monaten':15,'In 6 bis 12 Monaten':10,
    'Budget / Business Case ist grundsätzlich freigegeben':20,'Budget und Anforderungen werden aktuell definiert':15,'Wir benötigen belastbare Zahlen für die Entscheidung':8,
    'Lastgangdaten und aktuelle Stromabrechnung liegen vor':12,'Stromabrechnung liegt vor, Lastgang kann beschafft werden':9,'Daten können kurzfristig zusammengestellt werden':5,
    'Geschäftsführung / Inhaber':20,'Technische Leitung / Energiemanagement':18,'Einkauf / Finanzen':15,'Projektverantwortung':13,'Beratung / Planung':5
  };
  Object.keys(data).filter(k => /^\d+$/.test(k)).forEach(k => {score += points[data[k]] || 0});
  return {score,tier:score>=100?'A':score>=65?'B':'C'};
}

function render(){
  const s = steps[current];
  progress.innerHTML = steps.map((x,i)=>`<div class="prog ${i<=current?'active':''}"><i>${i+1}</i><span>${x.short}</span></div>`).join('');
  label.textContent = `Schritt ${current+1} von ${steps.length}`; q.textContent = s.q; hint.textContent = s.hint; answers.innerHTML = ''; fields.innerHTML = '';
  back.style.visibility = current ? 'visible' : 'hidden'; next.textContent = current===steps.length-1 ? 'Einsparpotenzial anfordern →' : 'Weiter →'; next.disabled = !data[current];
  if(s.form){
    fields.innerHTML = `<div class="field-row"><label>Vorname<input name="first" autocomplete="given-name" required></label><label>Nachname<input name="last" autocomplete="family-name" required></label></div><label>Unternehmen<input name="company" autocomplete="organization" required></label><div class="field-row"><label>Geschäftliche E-Mail<input name="email" type="email" autocomplete="email" required></label><label>Telefon für Rückfragen<input name="phone" type="tel" autocomplete="tel" required></label></div><div class="field-row"><label>PLZ des Standorts<input name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" pattern="[0-9]{5}" required></label><label>Website <span>(optional)</span><input name="website" type="url" placeholder="https://"></label></div><label class="consent"><input name="consent" type="checkbox" required><span>Ich stimme zu, dass Commeo meine Angaben zur Bearbeitung der Potenzialanalyse und zur persönlichen Kontaktaufnahme verwendet. Hinweise zum Datenschutz habe ich zur Kenntnis genommen.</span></label>`;
    fields.querySelectorAll('input').forEach(input => {
      if(input.type==='checkbox') input.checked = Boolean(data.contact[input.name]); else input.value = data.contact[input.name] || '';
      const save = () => {data.contact[input.name] = input.type==='checkbox' ? input.checked : input.value; validateForm()};
      input.addEventListener('input',save); input.addEventListener('change',save);
    });
    validateForm();
  } else {
    s.answers.forEach(a => {const b=document.createElement('button'); b.className='answer'+(data[current]===a?' selected':''); b.textContent=a; b.onclick=()=>{data[current]=a; const reason=rejectionReason(current,a); if(reason) showRejection(reason); else render()}; answers.appendChild(b)});
  }
}

next.onclick = () => {
  if(current < steps.length-1){current++;render();return}
  const fit = scoreLead(), contact = {...data.contact}, event = `qualified_lead_${fit.tier.toLowerCase()}`;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event,funnel:'commeo_stromkosten',lead_score:fit.score,lead_tier:fit.tier,answers:steps.slice(0,-1).map((s,i)=>({question:s.short,answer:data[i]})),...data.campaign});
  if(typeof window.fbq==='function') window.fbq('track',fit.tier==='C'?'CompleteRegistration':'Lead',{lead_tier:fit.tier,lead_score:fit.score});
  const result = fit.tier==='A' ? {label:'Sehr hohe Projektpassung',title:'Ihr Projekt passt sehr gut zu Commeo.',copy:'Ihre Angaben zeigen ein konkretes und wirtschaftlich relevantes Projekt. Ein Commeo-Experte priorisiert Ihre Anfrage und meldet sich persönlich bei Ihnen.'} : fit.tier==='B' ? {label:'Gute Projektpassung',title:'Ihre Ausgangslage ist vielversprechend.',copy:'Ein Commeo-Experte prüft jetzt Ihre Angaben und die stärksten Einsparhebel. Sie erhalten anschließend eine persönliche Einschätzung.'} : {label:'Individuelle Prüfung erforderlich',title:'Wir prüfen Ihre Ausgangslage genauer.',copy:'Einige Angaben benötigen eine fachliche Einordnung. Commeo prüft, ob und mit welchem Ansatz ein wirtschaftliches Einsparpotenzial besteht.'};
  document.querySelector('.quiz-card').innerHTML = `<div class="success"><span>✓</span><p class="section-label">${result.label}</p><h1>${result.title}</h1><p>${result.copy}</p><a class="btn" href="/">Zurück zur Startseite →</a></div>`;
};

back.onclick = () => {if(current){current--;render()}};
render();
