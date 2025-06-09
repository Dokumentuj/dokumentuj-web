// ===== Main Application Logic =====
let zakladniCena = 0;
let currentLanguage = 'cs';

// ===== WIZARD GLOBÁLNÍ PROMĚNNÉ A MAPOVÁNÍ =====
let wizardData = {
    step1: null,
    step2: null, 
    step3: null,
    step4: null,
    documentType: null,
    estimatedPrice: 299
};

// Mapování možností pro krok 3 podle předchozích voleb
const step3Options = {
    // Pro "obdržel dokument"
    'obdrzel-pokuta': [
        {value: 'odvolat', icon: '⚖', title: 'Podat odvolání', desc: 'Nesouhlasím s pokutou'},
        {value: 'splatky', icon: '💳', title: 'Požádat o splátkový kalendář', desc: 'Nemohu zaplatit najednou'},
        {value: 'odklad', icon: '⏰', title: 'Požádat o odklad', desc: 'Potřebuji více času'},
        {value: 'chyba', icon: '❌', title: 'Upozornit na chybu', desc: 'V pokutě je chyba'}
    ],
    'obdrzel-exekuce': [
        {value: 'namitka', icon: '🛡', title: 'Podat námitku', desc: 'Nesouhlasím s exekucí'},
        {value: 'splatky', icon: '💳', title: 'Navrhnout splátkový kalendář', desc: 'Chci postupně splácet'},
        {value: 'majetkove', icon: '🏠', title: 'Upozornit na chráněný majetek', desc: 'Mají chráněné věci'}
    ],
    'obdrzel-rozhodnuti': [
        {value: 'odvolat', icon: '📝', title: 'Podat odvolání', desc: 'Nesouhlasím s rozhodnutím'},
        {value: 'doplnit', icon: '📋', title: 'Doplnit podklady', desc: 'Chci dodat další dokumenty'},
        {value: 'vysvetlit', icon: '❓', title: 'Požádat o vysvětlení', desc: 'Nerozumím rozhodnutí'}
    ],
    'obdrzel-vyzva': [
        {value: 'dostavit', icon: '🏛', title: 'Omluvit se z jednání', desc: 'Nemohu se dostavit'},
        {value: 'doplnit', icon: '📋', title: 'Doplnit dokumenty', desc: 'Chci dodat požadované doklady'},
        {value: 'vysvetlit', icon: '❓', title: 'Požádat o vysvětlení', desc: 'Nerozumím požadavku'}
    ],
    'obdrzel-soudni': [
        {value: 'odvolat', icon: '⚖', title: 'Podat odvolání/opravný prostředek', desc: 'Nesouhlasím s rozhodnutím'},
        {value: 'doplnit', icon: '📋', title: 'Doplnit vyjádření', desc: 'Chci se vyjádřit k věci'},
        {value: 'zastoupeni', icon: '👨‍⚖️', title: 'Žádat o zastoupení', desc: 'Potřebuji právní pomoc'}
    ],

    // Pro "chci vyřídit" 
    'chci_vyridit-davky': [
        {value: 'pridat', icon: '💰', title: 'Požádat o dávky', desc: 'Nová žádost o sociální dávky'},
        {value: 'zvysit', icon: '📈', title: 'Požádat o zvýšení', desc: 'Změnily se mi podmínky'},
        {value: 'obnovit', icon: '🔄', title: 'Obnovit žádost', desc: 'Dávky mi byly ukončeny'}
    ],
    'chci_vyridit-prace': [
        {value: 'nezamestnanost', icon: '📋', title: 'Hlášení nezaměstnanosti', desc: 'Ztratil jsem práci'},
        {value: 'rekvalifikace', icon: '🎓', title: 'Žádost o rekvalifikaci', desc: 'Chci se přeškolit'},
        {value: 'spor', icon: '⚖', title: 'Pracovní spor', desc: 'Problém se zaměstnavatelem'}
    ],
    'chci_vyridit-zdravi': [
        {value: 'invalidita', icon: '🏥', title: 'Žádost o invalidní důchod', desc: 'Nemohu pracovat'},
        {value: 'posudek', icon: '📋', title: 'Žádost o posudek', desc: 'Potřebuji lékařské posouzení'},
        {value: 'odvolani', icon: '📝', title: 'Odvolání proti rozhodnutí', desc: 'Nesouhlasím s posudkem'}
    ],
    'chci_vyridit-bydleni': [
        {value: 'najem', icon: '🏠', title: 'Problém s nájmem', desc: 'Spor s pronajímatelem'},
        {value: 'reklamace', icon: '🔧', title: 'Reklamace bytových závad', desc: 'Něco je v bytě rozbité'},
        {value: 'sousede', icon: '👥', title: 'Sousedský spor', desc: 'Problém se sousedy'}
    ],
    'chci_vyridit-dane': [
        {value: 'priznani', icon: '📊', title: 'Daňové přiznání', desc: 'Potřebuji podat přiznání'},
        {value: 'splatky', icon: '💳', title: 'Splátkový kalendář', desc: 'Nemohu zaplatit najednou'},
        {value: 'odklad', icon: '⏰', title: 'Odklad platby', desc: 'Potřebuji odložit úhradu'}
    ],

    // Pro "mám problém"
    'mam_problem-nespravedlive': [
        {value: 'odvolani', icon: '📝', title: 'Podat odvolání', desc: 'Řádné odvolání k vyššímu orgánu'},
        {value: 'soud', icon: '⚖', title: 'Správní žaloba', desc: 'Obrátit se na soud'},
        {value: 'ombudsman', icon: '🛡', title: 'Stížnost ombudsmanovi', desc: 'Veřejný ochránce práv'}
    ],
    'mam_problem-diskriminace': [
        {value: 'stiznost', icon: '📝', title: 'Stížnost na chování', desc: 'Formální stížnost na úřad'},
        {value: 'ombudsman', icon: '🛡', title: 'Stížnost ombudsmanovi', desc: 'Veřejný ochránce práv'},
        {value: 'antidiskriminacni', icon: '⚖', title: 'Antidiskriminační zákon', desc: 'Ochrana před diskriminací'}
    ],
    'mam_problem-dluh': [
        {value: 'splatky', icon: '💳', title: 'Splátkový kalendář', desc: 'Postupné splácení'},
        {value: 'odklad', icon: '⏰', title: 'Odklad platby', desc: 'Dočasné pozastavení'},
        {value: 'insolvence', icon: '📋', title: 'Insolvence', desc: 'Řešení úpadku'}
    ],
    'mam_problem-chyba': [
        {value: 'oprava', icon: '🔧', title: 'Žádost o opravu', desc: 'Oprava chybných údajů'},
        {value: 'prepocet', icon: '🧮', title: 'Přepočet', desc: 'Nový výpočet částky'},
        {value: 'vysvetleni', icon: '❓', title: 'Vysvětlení postupu', desc: 'Jak došlo k chybě'}
    ],

    // Pro "nevím"
    'nevim-financni': [
        {value: 'davky', icon: '💰', title: 'Sociální dávky', desc: 'Hmotná nouze, příspěvky'},
        {value: 'dluh', icon: '💳', title: 'Řešení dluhů', desc: 'Splátkový kalendář, insolvence'},
        {value: 'poradna', icon: '🏢', title: 'Finanční poradna', desc: 'Odborná pomoc'}
    ],
    'nevim-zdravotni': [
        {value: 'invalidita', icon: '🏥', title: 'Invalidní důchod', desc: 'Nemohu pracovat'},
        {value: 'nemocenske', icon: '🩺', title: 'Nemocenské dávky', desc: 'Dočasná neschopnost'},
        {value: 'pece', icon: '🤲', title: 'Potřeba péče', desc: 'Příspěvek na péči'}
    ],
    'nevim-rodinne': [
        {value: 'alimenty', icon: '👶', title: 'Výživné', desc: 'Alimenty na dítě'},
        {value: 'opatrovna', icon: '👨‍👩‍👧‍👦', title: 'Opatrovnictví', desc: 'Péče o nezletilé'},
        {value: 'rozvod', icon: '💔', title: 'Rozvod', desc: 'Ukončení manželství'}
    ],
    'nevim-obecne': [
        {value: 'konzultace', icon: '💬', title: 'Obecná konzultace', desc: 'Potřebuji poradit'},
        {value: 'smerovani', icon: '🧭', title: 'Nasměrování na správný úřad', desc: 'Nevím kam se obrátit'},
        {value: 'prvni_pomoc', icon: '🆘', title: 'První pomoc', desc: 'Okamžitá rada'}
    ]
};

// ===== WIZARD FUNKCE =====
// Funkce pro výběr možnosti v wizardu
function selectWizardOption(element, step) {
    // Zrušit předchozí výběr v rámci aktuálního kroku
    const currentStep = element.closest('.wizard-step');
    currentStep.querySelectorAll('.wizard-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Označit nový výběr
    element.classList.add('selected');
    
    // Uložit hodnotu
    const value = element.getAttribute('data-value');
    wizardData[`step${step}`] = value;
    
    // Aktivovat tlačítko Next pro aktuální krok
    const nextBtn = currentStep.querySelector('.wizard-btn.primary');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
    
    // Speciální logika pouze pro kroky kde je potřeba
    if (step === 2) {
        prepareStep3(wizardData.step1, value);
    } else if (step === 3) {
        // Aktualizovat cenu na základě typu dokumentu
        updateWizardPriceByDocumentType();
        updateWizardSummaryPrice();
    } else if (step === 4) {
        updateWizardPrice(value);
        updateWizardSummaryPrice();
    }
}

// Příprava kroku 2 podle volby v kroku 1
function prepareStep2(step1Value) {
    // Skrýt všechny step-2 varianty
    ['2a', '2b', '2c', '2d'].forEach(suffix => {
        const step = document.getElementById(`wizard-step-${suffix}`);
        if (step) {
            step.style.display = 'none';
            step.classList.remove('active');
        }
    });
    
    // Zobrazit správnou variantu
    let targetStep;
    switch(step1Value) {
        case 'obdrzel': targetStep = '2a'; break;
        case 'chci_vyridit': targetStep = '2b'; break;
        case 'mam_problem': targetStep = '2c'; break;
        case 'nevim': targetStep = '2d'; break;
    }
    
    if (targetStep) {
        const stepElement = document.getElementById(`wizard-step-${targetStep}`);
        stepElement.style.display = 'block';
        stepElement.classList.add('active');
    }
}

// Příprava kroku 3 podle předchozích voleb
function prepareStep3(step1Value, step2Value) {
    const optionsKey = `${step1Value}-${step2Value}`;
    const options = step3Options[optionsKey] || [
        {value: 'general', icon: '📝', title: 'Obecná odpověď', desc: 'Standardní dokument'}
    ];
    
    // Vygenerovat možnosti
    const optionsHtml = options.map(option => `
        <div class="wizard-option" data-value="${option.value}" onclick="selectWizardOption(this, 3)">
            <div class="option-icon">${option.icon}</div>
            <strong>${option.title}</strong>
            <p>${option.desc}</p>
        </div>
    `).join('');
    
    document.getElementById('step3-options').innerHTML = optionsHtml;
    
    // Aktualizovat otázku
    const question = getStep3Question(step1Value, step2Value);
    document.getElementById('step3-question').textContent = question;
}

// Generování otázky pro krok 3
function getStep3Question(step1, step2) {
    const questions = {
        'obdrzel': 'Jak chcete reagovat?',
        'chci_vyridit': 'Jaký typ žádosti potřebujete?',
        'mam_problem': 'Jakým způsobem se chcete bránit?',
        'nevim': 'Co by vám nejvíce pomohlo?'
    };
    return questions[step1] || 'Co chcete udělat?';
}

// Navigace mezi kroky wizardu
function nextWizardStep(stepNumber) {
    // Skrýt aktuální krok
    const currentStep = document.querySelector('.wizard-step.active, .wizard-step[style*="block"]');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Zobrazit cílový krok
    let targetStep;
    if (stepNumber === 2) {
        // Připravit a zobrazit správný krok 2 podle step1
        const step1Value = wizardData.step1;
        prepareStep2(step1Value);
        
        const suffixes = {
            'obdrzel': '2a',
            'chci_vyridit': '2b', 
            'mam_problem': '2c',
            'nevim': '2d'
        };
        targetStep = document.getElementById(`wizard-step-${suffixes[step1Value]}`);
    } else if (stepNumber === 3) {
        // Připravit možnosti pro krok 3
        prepareStep3(wizardData.step1, wizardData.step2);
        targetStep = document.getElementById(`wizard-step-${stepNumber}`);
    } else {
        targetStep = document.getElementById(`wizard-step-${stepNumber}`);
    }
    
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
    }
    
    // Aktualizovat progress indikátor
    updateProgressIndicator(stepNumber);
    
    // Speciální akce pro krok 4
    if (stepNumber === 4) {
        generateWizardSummary();
    }
}

function prevWizardStep(stepNumber) {
    // Skrýt aktuální krok
    const currentStep = document.querySelector('.wizard-step.active, .wizard-step[style*="block"]');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.style.display = 'none';
    }
    
    // Zobrazit cílový krok
    let targetStep;
    if (stepNumber === 2) {
        // Návrat na krok 2 podle step1
        const step1Value = wizardData.step1;
        const suffixes = {
            'obdrzel': '2a',
            'chci_vyridit': '2b',
            'mam_problem': '2c', 
            'nevim': '2d'
        };
        targetStep = document.getElementById(`wizard-step-${suffixes[step1Value]}`);
    } else {
        targetStep = document.getElementById(`wizard-step-${stepNumber}`);
    }
    
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
    }
    
    updateProgressIndicator(stepNumber);
}

// Aktualizace progress indikátoru
function updateProgressIndicator(currentStep) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

// Aktualizace ceny podle typu dokumentu z wizardu
function updateWizardPriceByDocumentType() {
    const combination = `${wizardData.step1}-${wizardData.step2}-${wizardData.step3}`;
    
    // OPRAVENÉ mapování kombinací na správné ceny podle hlavní sekce
    const priceMap = {
        // Jednoduchá odpověď - 199 Kč
        'obdrzel-pokuta-splatky': 199,
        'obdrzel-pokuta-odklad': 199,
        'obdrzel-pokuta-chyba': 199,
        'obdrzel-vyzva-dostavit': 199,
        'obdrzel-vyzva-doplnit': 199,
        'obdrzel-vyzva-vysvetlit': 199,
        'obdrzel-rozhodnuti-doplnit': 199,
        'obdrzel-rozhodnuti-vysvetlit': 199,
        'chci_vyridit-davky-pridat': 199,
        'chci_vyridit-davky-zvysit': 199,
        'chci_vyridit-davky-obnovit': 199,
        'chci_vyridit-dane-splatky': 199,
        'chci_vyridit-dane-odklad': 199,
        'mam_problem-dluh-splatky': 199,
        'mam_problem-dluh-odklad': 199,
        'nevim-financni-davky': 199,
        'nevim-financni-dluh': 199,

        // Odvolání / Námitka - 399 Kč
        'obdrzel-pokuta-odvolat': 399,
        'obdrzel-exekuce-namitka': 399,
        'obdrzel-rozhodnuti-odvolat': 399,
        'obdrzel-soudni-odvolat': 399,
        'mam_problem-nespravedlive-odvolani': 399,
        'mam_problem-nespravedlive-soud': 399,
        'chci_vyridit-zdravi-odvolani': 399,

        // Žádost nebo stížnost - 299 Kč
        'obdrzel-exekuce-splatky': 299,
        'obdrzel-exekuce-majetkove': 299,
        'obdrzel-soudni-doplnit': 299,
        'obdrzel-soudni-zastoupeni': 299,
        'chci_vyridit-prace-nezamestnanost': 299,
        'chci_vyridit-prace-rekvalifikace': 299,
        'chci_vyridit-prace-spor': 299,
        'chci_vyridit-zdravi-invalidita': 299,
        'chci_vyridit-zdravi-posudek': 299,
        'chci_vyridit-bydleni-najem': 299,
        'chci_vyridit-bydleni-reklamace': 299,
        'chci_vyridit-bydleni-sousede': 299,
        'chci_vyridit-dane-priznani': 299,
        'mam_problem-diskriminace-stiznost': 299,
        'mam_problem-diskriminace-ombudsman': 299,
        'mam_problem-diskriminace-antidiskriminacni': 299,
        'mam_problem-chyba-oprava': 299,
        'mam_problem-chyba-prepocet': 299,
        'mam_problem-chyba-vysvetleni': 299,
        'mam_problem-dluh-insolvence': 299,
        'nevim-zdravotni-invalidita': 299,
        'nevim-zdravotni-nemocenske': 299,
        'nevim-zdravotni-pece': 299,
        'nevim-rodinne-alimenty': 299,
        'nevim-rodinne-opatrovna': 299,
        'nevim-rodinne-rozvod': 299,
        'nevim-obecne-konzultace': 299,
        'nevim-obecne-smerovani': 299,
        'nevim-obecne-prvni_pomoc': 299,
        'nevim-financni-poradna': 299
    };
    
    // Nastavit cenu podle mapování nebo výchozí 199
    wizardData.estimatedPrice = priceMap[combination] || 199;
}

// Aktualizace ceny v wizardu (pro urgency v kroku 4)
function updateWizardPrice(urgency) {
    // Nejdříve získat základní cenu podle typu dokumentu
    updateWizardPriceByDocumentType();
    
    let basePrice = wizardData.estimatedPrice;
    
    // Přidat příplatek za rychlost
    switch(urgency) {
        case 'express': 
            wizardData.estimatedPrice = basePrice + 100; // +100 Kč za 24h
            break;
        case 'urgent': 
            wizardData.estimatedPrice = basePrice + 200; // +200 Kč za urgentní
            break;
        default: 
            // Zachovat základní cenu
            break;
    }
}

// Aktualizace ceny v shrnutí
function updateWizardSummaryPrice() {
    const summaryElement = document.getElementById('wizard-summary');
    if (summaryElement && summaryElement.innerHTML.trim() !== '') {
        generateWizardSummary();
    }
}

// Generování shrnutí v posledním kroku wizardu
function generateWizardSummary() {
    const summaryData = {
        situation: getSituationDescription(),
        documentType: getDocumentTypeDescription(),
        action: getActionDescription(),
        price: wizardData.estimatedPrice
    };
    
    const summaryHtml = `
        <div class="summary-card">
            <h4>📋 Shrnutí vaší objednávky:</h4>
            <div class="summary-item">
                <strong>Situace:</strong> ${summaryData.situation}
            </div>
            <div class="summary-item">
                <strong>Typ dokumentu:</strong> ${summaryData.documentType}
            </div>
            <div class="summary-item">
                <strong>Požadovaná akce:</strong> ${summaryData.action}
            </div>
            <div class="summary-item price-summary">
                <strong>Cena:</strong> <span class="price">${summaryData.price} Kč</span>
            </div>
        </div>
    `;
    
    document.getElementById('wizard-summary').innerHTML = summaryHtml;
}

// Pomocné funkce pro popis situace
function getSituationDescription() {
    const descriptions = {
        'obdrzel': 'Obdržel jste úřední dokument',
        'chci_vyridit': 'Chcete něco vyřídit u úřadu',
        'mam_problem': 'Máte problém, který chcete řešit',
        'nevim': 'Potřebujete poradit'
    };
    return descriptions[wizardData.step1] || 'Nespecifikováno';
}

function getDocumentTypeDescription() {
    // Kombinace step1 + step2 + step3 pro popis typu dokumentu
    const combinations = {
        // Jednoduchá odpověď - 199 Kč
        'obdrzel-pokuta-splatky': 'Žádost o splátkový kalendář k pokutě',
        'obdrzel-pokuta-odklad': 'Žádost o odklad platby pokuty',
        'obdrzel-pokuta-chyba': 'Upozornění na chybu v pokutě',
        'obdrzel-vyzva-dostavit': 'Omluva z úředního jednání',
        'obdrzel-vyzva-doplnit': 'Doplnění požadovaných dokumentů',
        'obdrzel-vyzva-vysvetlit': 'Žádost o vysvětlení výzvy',
        'obdrzel-rozhodnuti-doplnit': 'Doplnění podkladů k rozhodnutí',
        'obdrzel-rozhodnuti-vysvetlit': 'Žádost o vysvětlení rozhodnutí',
        'chci_vyridit-davky-pridat': 'Žádost o sociální dávky',
        'chci_vyridit-davky-zvysit': 'Žádost o zvýšení dávek',
        'chci_vyridit-davky-obnovit': 'Žádost o obnovení dávek',
        'chci_vyridit-dane-splatky': 'Žádost o splátkový kalendář pro daně',
        'chci_vyridit-dane-odklad': 'Žádost o odklad daňové platby',
        'mam_problem-dluh-splatky': 'Žádost o splátkový kalendář',
        'mam_problem-dluh-odklad': 'Žádost o odklad platby',

        // Odvolání / Námitka - 399 Kč
        'obdrzel-pokuta-odvolat': 'Odvolání proti pokutě',
        'obdrzel-exekuce-namitka': 'Námitka proti exekuci',
        'obdrzel-rozhodnuti-odvolat': 'Odvolání proti úřednímu rozhodnutí',
        'obdrzel-soudni-odvolat': 'Odvolání proti soudnímu verdiktu',
        'mam_problem-nespravedlive-odvolani': 'Odvolání proti nespravedlivému rozhodnutí',
        'mam_problem-nespravedlive-soud': 'Správní žaloba',
        'chci_vyridit-zdravi-odvolani': 'Odvolání proti zdravotnímu posudku',

        // Žádost nebo stížnost - 299 Kč
        'obdrzel-exekuce-splatky': 'Návrh splátkového kalendáře k exekuci',
        'obdrzel-exekuce-majetkove': 'Upozornění na chráněný majetek',
        'obdrzel-soudni-doplnit': 'Doplnění vyjádření k soudu',
        'obdrzel-soudni-zastoupeni': 'Žádost o právní zastoupení',
        'chci_vyridit-prace-nezamestnanost': 'Hlášení nezaměstnanosti',
        'chci_vyridit-prace-rekvalifikace': 'Žádost o rekvalifikaci',
        'chci_vyridit-prace-spor': 'Řešení pracovního sporu',
        'chci_vyridit-zdravi-invalidita': 'Žádost o invalidní důchod',
        'chci_vyridit-zdravi-posudek': 'Žádost o zdravotní posudek',
        'chci_vyridit-bydleni-najem': 'Řešení problému s nájmem',
        'chci_vyridit-bydleni-reklamace': 'Reklamace bytových závad',
        'chci_vyridit-bydleni-sousede': 'Řešení sousedského sporu',
        'chci_vyridit-dane-priznani': 'Pomoc s daňovým přiznáním',
        'mam_problem-diskriminace-stiznost': 'Stížnost na diskriminaci',
        'mam_problem-diskriminace-ombudsman': 'Stížnost ombudsmanovi',
        'mam_problem-diskriminace-antidiskriminacni': 'Využití antidiskriminačního zákona',
        'mam_problem-chyba-oprava': 'Žádost o opravu úřední chyby',
        'mam_problem-chyba-prepocet': 'Žádost o přepočet',
        'mam_problem-chyba-vysvetleni': 'Žádost o vysvětlení postupu',
        'mam_problem-dluh-insolvence': 'Insolvence - řešení úpadku',
        'nevim-zdravotni-invalidita': 'Konzultace k invaliditě',
        'nevim-zdravotni-nemocenske': 'Konzultace k nemocenským dávkám',
        'nevim-zdravotni-pece': 'Konzultace k příspěvku na péči',
        'nevim-rodinne-alimenty': 'Konzultace k výživnému',
        'nevim-rodinne-opatrovna': 'Konzultace k opatrovnictví',
        'nevim-rodinne-rozvod': 'Konzultace k rozvodu',
        'nevim-obecne-konzultace': 'Obecná právní konzultace',
        'nevim-obecne-smerovani': 'Nasměrování na správný úřad',
        'nevim-obecne-prvni_pomoc': 'Právní první pomoc',
        'nevim-financni-poradna': 'Konzultace s finanční poradnou'
    };
    
    const key = `${wizardData.step1}-${wizardData.step2}-${wizardData.step3}`;
    return combinations[key] || 'Individuální dokument';
}

function getActionDescription() {
    const actions = {
        'odvolat': 'Podat odvolání',
        'splatky': 'Požádat o splátkový kalendář',
        'namitka': 'Podat námitku',
        'pridat': 'Nová žádost',
        'stiznost': 'Podat stížnost',
        'zadat': 'Nová žádost',
        'prodlouzit': 'Požádat o prodloužení',
        'mop': 'Požádat o mimořádnou pomoc',
        'odklad': 'Požádat o odklad',
        'doplnit': 'Doplnit podklady',
        'vysvetlit': 'Požádat o vysvětlení',
        'dostavit': 'Omluvit se z jednání',
        'nezamestnanost': 'Hlášení nezaměstnanosti',
        'rekvalifikace': 'Žádost o rekvalifikaci',
        'invalidita': 'Žádost o invalidní důchod',
        'posudek': 'Žádost o posudek',
        'najem': 'Řešení problému s nájmem',
        'reklamace': 'Reklamace závad',
        'priznani': 'Daňové přiznání',
        'oprava': 'Žádost o opravu',
        'prepocet': 'Žádost o přepočet',
        'konzultace': 'Konzultace',
        'davky': 'Žádost o dávky',
        'alimenty': 'Věc výživného',
        'chyba': 'Upozornění na chybu',
        'zvysit': 'Žádost o zvýšení',
        'obnovit': 'Obnovení žádosti',
        'spor': 'Řešení sporu',
        'sousede': 'Sousedský spor',
        'majetkove': 'Chráněný majetek',
        'zastoupeni': 'Právní zastoupení',
        'soud': 'Správní žaloba',
        'ombudsman': 'Stížnost ombudsmanovi',
        'antidiskriminacni': 'Antidiskriminační zákon',
        'insolvence': 'Insolvence',
        'nemocenske': 'Nemocenské dávky',
        'pece': 'Příspěvek na péči',
        'opatrovna': 'Opatrovnictví',
        'rozvod': 'Rozvod',
        'smerovani': 'Nasměrování',
        'prvni_pomoc': 'První pomoc',
        'poradna': 'Finanční poradna'
    };
    return actions[wizardData.step3] || 'Individuální řešení';
}

// Dokončení wizardu
function finishWizard() {
    // Uložit data wizardu pro další zpracování
    sessionStorage.setItem('wizardData', JSON.stringify(wizardData));
    
    // Skrýt wizard
    hideWizard();
    
    // Předvyplnit hlavní formulář podle wizardu
    prefillMainForm();
    
    // Scroll na hlavní formulář
    document.getElementById('objednavka').scrollIntoView({behavior: 'smooth'});
}

// Funkce pro určení typu dokumentu podle ceny
function getDocumentTypeFromPrice(basePrice) {
    if (basePrice <= 199) return 'Jednoduchá odpověď';
    if (basePrice >= 399) return 'Odvolání / Námitka'; 
    return 'Žádost nebo stížnost'; // 299 a ostatní
}

// Předvyplnění hlavního formuláře
function prefillMainForm() {
    const documentType = getDocumentTypeDescription();
    const situation = generateSituationText();
    
    // Získat základní cenu bez příplatků
    updateWizardPriceByDocumentType();
    const basePrice = wizardData.estimatedPrice;
    
    // Určit správný typ dokumentu podle ceny
    const mainDocumentType = getDocumentTypeFromPrice(basePrice);
    
    // Automaticky zakliknout správný typ dokumentu
    const targetOption = [...document.querySelectorAll('.option')].find(option => {
        const h3 = option.querySelector('h3');
        return h3 && h3.textContent.trim() === mainDocumentType;
    });
    
    if (targetOption) {
        selectOption(targetOption, mainDocumentType, basePrice);
    }
    
    // Předvyplnit popis situace
    const descriptionField = document.getElementById('popis');
    if (descriptionField) {
        descriptionField.value = situation;
    }
    
    // Nastavit expresní/urgentní vyřízení pokud bylo zvoleno v wizardu
    if (wizardData.step4 === 'express') {
        const expresCheckbox = document.getElementById('expres');
        if (expresCheckbox) {
            expresCheckbox.checked = true;
            updateCena();
        }
    } else if (wizardData.step4 === 'urgent') {
        const urgentCheckbox = document.getElementById('urgent');
        if (urgentCheckbox) {
            urgentCheckbox.checked = true;
            updateCena();
        }
    }
}

// Generování textu situace pro formulář
function generateSituationText() {
    const templates = {
        // Jednoduchá odpověď
        'obdrzel-pokuta-splatky': 'Obdržel jsem pokutu a potřebuji požádat o splátkový kalendář, protože nejsem schopen uhradit celou částku najednou.',
        'obdrzel-pokuta-odklad': 'Obdržel jsem pokutu a potřebuji požádat o odklad platební lhůty z důvodu aktuální finanční situace.',
        'obdrzel-pokuta-chyba': 'Obdržel jsem pokutu, ve které se nachází chyba, kterou je třeba opravit.',
        'obdrzel-vyzva-dostavit': 'Obdržel jsem výzvu k osobnímu jednání, ale nemohu se z vážných důvodů dostavit v uvedeném termínu.',
        'obdrzel-vyzva-doplnit': 'Obdržel jsem výzvu k doplnění dokumentů a chci požádat o poskytnutí potřebných podkladů.',
        'obdrzel-vyzva-vysvetlit': 'Obdržel jsem výzvu, které nerozumím, a potřebuji vysvětlení postupu.',
        'chci_vyridit-davky-pridat': 'Chci požádat o sociální dávky kvůli změně mé finanční situace a potřebuji pomoc s vyplněním žádosti.',
        'chci_vyridit-davky-zvysit': 'Chci požádat o zvýšení sociálních dávek, protože se změnily mé životní podmínky.',
        'chci_vyridit-davky-obnovit': 'Chci obnovit žádost o sociální dávky, které mi byly ukončeny.',
        'chci_vyridit-dane-splatky': 'Potřebuji požádat o splátkový kalendář pro úhradu daní, protože nejsem schopen zaplatit celou částku najednou.',
        'chci_vyridit-dane-odklad': 'Potřebuji požádat o odklad daňové platby z důvodu momentální finanční situace.',

        // Odvolání / Námitka
        'obdrzel-pokuta-odvolat': 'Obdržel jsem pokutu, se kterou zásadně nesouhlasím a chci podat odvolání. Považuji pokutování za nesprávné.',
        'obdrzel-exekuce-namitka': 'Byl mi doručen exekuční příkaz, proti kterému chci podat námitku, protože považuji exekuci za neodůvodněnou.',
        'obdrzel-rozhodnuti-odvolat': 'Obdržel jsem úřední rozhodnutí, se kterým nesouhlasím a chci podat odvolání.',
        'mam_problem-nespravedlive-odvolani': 'Považuji rozhodnutí úřadu za nespravedlivé a chci se proti němu odvolat.',
        'mam_problem-nespravedlive-soud': 'Chci podat správní žalobu proti nesprávnému postupu úřadu.',
        'obdrzel-soudni-odvolat': 'Nesouhlasím se soudním verdiktem a chci podat odvolání.',

        // Žádost nebo stížnost
        'mam_problem-diskriminace-stiznost': 'Chci podat stížnost na nevhodné chování úředníka nebo nesprávný postup úřadu.',
        'chci_vyridit-bydleni-reklamace': 'Chci podat stížnost na špatné podmínky v ubytovně nebo reklamovat bytové závady.',
        'chci_vyridit-prace-nezamestnanost': 'Chci se přihlásit na úřad práce jako nezaměstnaný a požádat o podporu.',
        'chci_vyridit-zdravi-invalidita': 'Chci požádat o invalidní důchod z důvodu zdravotního stavu, který mi neumožňuje práci.',
        'mam_problem-chyba-oprava': 'Úřad udělal chybu v dokumentu nebo výpočtu a potřebuji požádat o nápravu.',
        'nevim-obecne-konzultace': 'Potřebuji poradit s mojí situací a nasměrování na správný úřad nebo postup.',
        'chci_vyridit-prace-rekvalifikace': 'Chci požádat o rekvalifikační kurz, abych se mohl přeškolit na jinou profesi.',
        'chci_vyridit-zdravi-posudek': 'Potřebuji požádat o zdravotní posudek pro posouzení mé pracovní schopnosti.',
        'chci_vyridit-bydleni-najem': 'Mám problém s pronajímatelem a potřebuji pomoc s řešením nájemní smlouvy.',
        'chci_vyridit-dane-priznani': 'Potřebuji pomoc s vyplněním a podáním daňového přiznání.',
        'mam_problem-chyba-prepocet': 'Úřad udělal chybu ve výpočtu a potřebuji požádat o přepočet částky.'
    };
    
    const key = `${wizardData.step1}-${wizardData.step2}-${wizardData.step3}`;
    return templates[key] || `Potřebuji pomoc s dokumentem typu: ${getDocumentTypeDescription()}. Má situace: ${getSituationDescription()}.`;
}

// Skrytí wizardu
function hideWizard() {
    document.getElementById('wizard').classList.add('hidden');
}

// Zobrazení wizardu (volané z hlavního CTA tlačítka)
function showWizard() {
    document.getElementById('wizard').classList.remove('hidden');
    
    // Reset wizardu na začátek
    wizardData = {step1: null, step2: null, step3: null, step4: null, estimatedPrice: 199};
    
    // Skrýt všechny kroky
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Zobrazit první krok
    const firstStep = document.getElementById('wizard-step-1');
    firstStep.classList.add('active');
    firstStep.style.display = 'block';
    
    // Reset progress indikátoru
    updateProgressIndicator(1);
    
    // Scroll na wizard
    document.getElementById('wizard').scrollIntoView({behavior: 'smooth'});
}

// ===== PŮVODNÍ FUNKCE STRÁNKY =====
// Načtení uloženého jazyka z localStorage
window.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('dokumentuj-language');
    if (savedLanguage && savedLanguage !== 'cs') {
        switchLanguage(savedLanguage);
    }
});

// Funkce pro přepínání jazyků
function switchLanguage(lang) {
    currentLanguage = lang;
    // Aktualizace aktivního tlačítka
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('lang-' + lang).classList.add('active');

    // Aktualizace všech textů
    document.querySelectorAll('[data-cs]').forEach(element => {
        const csText = element.getAttribute('data-cs');
        const uaText = element.getAttribute('data-ua');
        if (lang === 'ua' && uaText) {
            element.innerHTML = uaText;
        } else if (lang === 'cs' && csText) {
            element.innerHTML = csText;
        }
    });

    // Aktualizace title stránky
    const titleElement = document.querySelector('title');
    const titleCs = titleElement.getAttribute('data-cs');
    const titleUa = titleElement.getAttribute('data-ua');
    if (lang === 'ua' && titleUa) {
        titleElement.textContent = titleUa;
    } else if (lang === 'cs' && titleCs) {
        titleElement.textContent = titleCs;
    }

    // Uložení jazyka do localStorage
    localStorage.setItem('dokumentuj-language', lang);
    // Aktualizace jazyka dokumentu
    document.documentElement.lang = lang;
}

function selectOption(element, typ, cena) {
    document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Překlad názvu služby podle aktuálního jazyka
    let serviceNameCs = typ;
    let serviceNameUa = typ;

    if (typ === 'Jednoduchá odpověď') {
        serviceNameUa = 'Проста відповідь';
    } else if (typ === 'Odvolání / Námitka') {
        serviceNameUa = 'Апеляція / Заперечення';
    } else if (typ === 'Žádost nebo stížnost') {
        serviceNameUa = 'Заява або скарга';
    }

    document.getElementById('typDokumentu').value = currentLanguage === 'ua' ? serviceNameUa : serviceNameCs;
    document.getElementById('zakladniCena').value = cena;

    const serviceName = currentLanguage === 'ua' ? serviceNameUa : serviceNameCs;
    const priceText = currentLanguage === 'ua' ? 
        `Обрана послуга: ${serviceName} – ${cena} крон` : 
        `Zvolená služba: ${serviceName} – ${cena} Kč`;

    document.getElementById('priceInfo').innerText = priceText;
    document.getElementById('docForm').style.display = 'block';
    zakladniCena = cena;
    updateCena();
    document.getElementById('docForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleKeyPress(event, element, typ, cena) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOption(element, typ, cena);
    }
}

function updateCena() {
    const expres = document.getElementById('expres').checked;
    const urgent = document.getElementById('urgent').checked;
    let cena = zakladniCena;
    
    // Zajistit, že jen jedna možnost rychlosti je aktivní
    if (urgent && expres) {
        document.getElementById('expres').checked = false;
    }
    
    if (expres) cena += 100;
    if (urgent) cena += 200;

    const priceText = currentLanguage === 'ua' ? 
        `Загальна ціна: ${cena} крон` : 
        `Celková cena: ${cena} Kč`;

    document.getElementById('finalPrice').innerText = priceText;
}

// Accordion functionality
function toggleAccordion(header) {
    const item = header.parentElement;
    const wasActive = item.classList.contains('active');

    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!wasActive) {
        item.classList.add('active');
    }
}

function handleAccordionKey(event, header) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleAccordion(header);
    }
}

// Tabs functionality
function switchTab(event, tabName) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Smooth scrolling pro CTA tlačítka a navigaci
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Speciální handling pro wizard link
            if (this.getAttribute('href') === '#wizard') {
                showWizard();
                return;
            }

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
