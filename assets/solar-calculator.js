/**
 * SK SOLAR BIKANER - PM Surya Ghar Subsidy & Solar Savings Calculator
 * Factors in central government subsidies (1kW: ₹33k, 2kW: ₹66k, 3kW+: ₹78k).
 * Connects directly to WhatsApp (+91 90013 19866).
 */
(() => {
  const form = document.querySelector('#solarCalculator');
  if (!form) return;

  const error = document.querySelector('#calculatorError');
  const outputs = {
    size: document.querySelector('#resultSize'),
    roofNote: document.querySelector('#resultRoofNote'),
    generation: document.querySelector('#resultGeneration'),
    monthlySaving: document.querySelector('#resultMonthlySaving'),
    netCost: document.querySelector('#resultNetCost'),
    costNote: document.querySelector('#resultCostNote'),
    payback: document.querySelector('#resultPayback'),
    emi: document.querySelector('#resultEmi'),
    loanNote: document.querySelector('#resultLoanNote'),
    lifetime: document.querySelector('#resultLifetime'),
    annualSaving: document.querySelector('#resultAnnualSaving'),
    offset: document.querySelector('#resultOffset'),
    grossCost: document.querySelector('#resultGrossCost'),
    subsidy: document.querySelector('#resultSubsidy'),
    whatsapp: document.querySelector('#solarWhatsApp')
  };

  const number = (name) => Number(form.elements[name]?.value || 0);
  const money = (val) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  // Government PM Surya Ghar Subsidy Slab Formula
  function calculatePMSuryaGharSubsidy(kw, systemType) {
    if (systemType !== 'grid' && systemType !== 'hybrid') {
      return 0; // Off-grid systems are generally outside residential PM Surya Ghar subsidy
    }
    if (kw <= 0) return 0;
    if (kw <= 1) return 33000;
    if (kw <= 2) return 66000;
    return 78000; // Flat ₹78,000 for 3kW and above
  }

  function calculate() {
    const bill = number('bill');
    const units = number('units');
    const tariff = number('tariff') || 7.5;
    const roofArea = number('roof') || 400;
    const mode = form.elements.mode ? form.elements.mode.value : 'grid';
    const costPerKw = number('cost') || 60000;
    const batteryKwh = number('battery') || 0;
    const batteryCostPerKwh = number('batteryCost') || 18000;
    const manualSubsidy = form.elements.subsidy ? Number(form.elements.subsidy.value) : -1;
    const tenure = number('tenure') || 5;
    const interest = number('interest') || 8.5;

    // Roof constraint: ~100 sq ft per 1 kW
    const roofCapacity = roofArea / 100;
    // Consumption sizing: ~120 units per 1 kW per month in Rajasthan sun conditions
    const recommendedSizeFromUnits = units > 0 ? units / 120 : (bill / tariff) / 120;
    
    // User manual preferred size or auto
    const rawPreferred = form.elements.size && form.elements.size.value.trim() !== ''
      ? Number(form.elements.size.value)
      : recommendedSizeFromUnits;

    const systemSize = Math.max(0.5, Math.min(rawPreferred, Math.max(roofCapacity, 0.5)));
    const roofLimited = rawPreferred > roofCapacity;

    // Generation in Rajasthan (avg 4 to 4.5 kWh/kW/day -> ~120 to 130 kWh/month)
    const monthlyGenUnits = systemSize * 125;
    const selfUseRatio = mode === 'grid' ? 0.85 : 0.95;
    const monthlySavings = Math.min(bill > 0 ? bill : (monthlyGenUnits * tariff), monthlyGenUnits * selfUseRatio * tariff);
    const annualSavings = monthlySavings * 12;

    // Costs
    const solarPlantCost = systemSize * costPerKw;
    const grossCost = solarPlantCost + (batteryKwh * batteryCostPerKwh);

    // Subsidy: Auto-calc PM Surya Ghar if user left blank or kept 0, otherwise use manual entry
    let appliedSubsidy = 0;
    if (manualSubsidy > 0) {
      appliedSubsidy = Math.min(manualSubsidy, grossCost);
    } else {
      appliedSubsidy = calculatePMSuryaGharSubsidy(systemSize, mode);
      if (form.elements.subsidy && document.activeElement !== form.elements.subsidy) {
        form.elements.subsidy.value = appliedSubsidy;
      }
    }

    const netCost = Math.max(0, grossCost - appliedSubsidy);

    // Maintenance (0.5% of solar cost/year)
    const annualMaint = solarPlantCost * 0.005;
    const firstYearNetSaving = Math.max(1, annualSavings - annualMaint);
    const paybackYears = netCost > 0 ? (netCost / firstYearNetSaving) : 0;

    // 25-Year Lifetime benefit with 4% tariff escalation and 0.5% degradation
    let lifetimeBenefit = -netCost;
    for (let yr = 1; yr <= 25; yr++) {
      const yrSave = annualSavings * Math.pow(1.04, yr - 1) * Math.pow(0.995, yr - 1);
      lifetimeBenefit += (yrSave - annualMaint);
    }

    // Loan EMI calculation
    const monthlyRate = interest / 1200;
    const months = tenure * 12;
    const emi = netCost > 0 && monthlyRate > 0
      ? (netCost * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : (netCost / months);

    // Update UI elements
    if (outputs.size) outputs.size.textContent = `${systemSize.toFixed(1)} kW`;
    if (outputs.roofNote) {
      outputs.roofNote.textContent = roofLimited
        ? `⚠️ Roof space limits system to ~${roofCapacity.toFixed(1)} kW (${roofArea} sq ft).`
        : `Ideal fit for ${roofArea} sq ft shadow-free rooftop.`;
    }
    if (outputs.generation) outputs.generation.textContent = `${Math.round(monthlyGenUnits).toLocaleString('en-IN')} units`;
    if (outputs.monthlySaving) outputs.monthlySaving.textContent = money(monthlySavings);
    if (outputs.netCost) outputs.netCost.textContent = money(netCost);
    if (outputs.grossCost) outputs.grossCost.textContent = money(grossCost);
    if (outputs.subsidy) outputs.subsidy.textContent = money(appliedSubsidy);
    if (outputs.payback) outputs.payback.textContent = paybackYears > 0 ? `${paybackYears.toFixed(1)} Years` : 'Immediate';
    if (outputs.emi) outputs.emi.textContent = `${money(emi)}/mo`;
    if (outputs.loanNote) outputs.loanNote.textContent = `${tenure} Years @ ${interest}% interest`;
    if (outputs.lifetime) outputs.lifetime.textContent = money(lifetimeBenefit);
    if (outputs.annualSaving) outputs.annualSaving.textContent = money(annualSavings);

    // WhatsApp Message Formulation
    if (outputs.whatsapp) {
      const msg = [
        '☀️ *SOLAR ESTIMATE FROM SK SOLAR WEBSITE*',
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        `⚡ *Recommended System:* ${systemSize.toFixed(1)} kW (${mode.toUpperCase()})`,
        `💰 *Estimated Total Cost:* ${money(grossCost)}`,
        `🏛️ *PM Surya Ghar Subsidy:* ${money(appliedSubsidy)}`,
        `🏷️ *Net Investment:* ${money(netCost)}`,
        `📉 *Monthly Electricity Saved:* ${money(monthlySavings)} (${Math.round(monthlyGenUnits)} units)`,
        `⏱️ *Payback Period:* ~${paybackYears.toFixed(1)} years`,
        `🏡 *Rooftop Area:* ${roofArea} sq ft`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Hello SK Solar Bikaner team, please share an official quotation and schedule a rooftop site visit for my home/business in Bikaner.'
      ].join('\n');

      outputs.whatsapp.href = `https://wa.me/919001319866?text=${encodeURIComponent(msg)}`;
    }
  }

  // Bind events
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
  });

  calculate();
})();
