 function toggleMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }

    function showPage(pageId, element) {
        document.querySelectorAll('.feature-page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        element.classList.add('active');
        
        // Close menu on mobile after selection
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('open');
        }
    }

    const gaugeData = [
        {g: 3, nom: 6.07, min: 5.70, max: 6.45}, {g: 4, nom: 5.69, min: 5.32, max: 6.07}, 
        {g: 5, nom: 5.31, min: 4.95, max: 5.68}, {g: 6, nom: 4.94, min: 4.58, max: 5.30}, 
        {g: 7, nom: 4.55, min: 4.22, max: 4.89}, {g: 8, nom: 4.18, min: 3.86, max: 4.49},
        {g: 9, nom: 3.80, min: 3.51, max: 4.10}, {g: 10, nom: 3.42, min: 3.14, max: 3.69}, 
        {g: 11, nom: 3.04, min: 2.79, max: 3.29}, {g: 12, nom: 2.66, min: 2.44, max: 2.88}, 
        {g: 13, nom: 2.28, min: 2.08, max: 2.48}, {g: 14, nom: 1.90, min: 1.73, max: 2.07},
        {g: 15, nom: 1.71, min: 1.55, max: 1.87}, {g: 16, nom: 1.52, min: 1.37, max: 1.67}, 
        {g: 17, nom: 1.37, min: 1.23, max: 1.51}, {g: 18, nom: 1.21, min: 1.09, max: 1.34}, 
        {g: 19, nom: 1.06, min: 0.95, max: 1.17}, {g: 20, nom: 0.91, min: 0.81, max: 1.01},
        {g: 21, nom: 0.84, min: 0.74, max: 0.93}, {g: 22, nom: 0.76, min: 0.67, max: 0.85}, 
        {g: 23, nom: 0.68, min: 0.60, max: 0.77}, {g: 24, nom: 0.61, min: 0.53, max: 0.68}, 
        {g: 25, nom: 0.53, min: 0.46, max: 0.60}, {g: 26, nom: 0.45, min: 0.39, max: 0.52},
        {g: 27, nom: 0.42, min: 0.36, max: 0.47}, {g: 28, nom: 0.38, min: 0.33, max: 0.43}, 
        {g: 29, nom: 0.34, min: 0.30, max: 0.39}, {g: 30, nom: 0.30, min: 0.27, max: 0.34}
    ];

    // GAUGE CONVERSION FUNCTIONS
    function runGaugeConvert() {
        const gInput = parseInt(document.getElementById('gaugeInput').value);
        document.getElementById('mmGaugeInput').value = ""; 
        const resVal = document.getElementById('gaugeRes');
        const rangeInfo = document.getElementById('gaugeRange');
        
        const match = gaugeData.find(item => item.g === gInput);
        if (match) {
            resVal.innerText = match.nom + " mm";
            rangeInfo.innerHTML = `Standard: ${match.nom} mm <br> <strong>Allowed Range: ${match.min} mm - ${match.max} mm</strong>`;
        } else {
            resVal.innerText = "---";
            rangeInfo.innerText = "Please enter gauge between 3 and 30";
        }
    }

    function runMMToGauge() {
        const mmVal = parseFloat(document.getElementById('mmGaugeInput').value);
        document.getElementById('gaugeInput').value = ""; 
        const resVal = document.getElementById('gaugeRes');
        const rangeInfo = document.getElementById('gaugeRange');

        if (isNaN(mmVal) || mmVal <= 0) {
            resVal.innerText = "---";
            rangeInfo.innerText = "";
            return;
        }

        let closest = gaugeData.reduce((prev, curr) => {
            return (Math.abs(curr.nom - mmVal) < Math.abs(prev.nom - mmVal) ? curr : prev);
        });

        resVal.innerText = closest.g + " Gauge";
        rangeInfo.innerHTML = `Closest Match: ${closest.g} Gauge <br> Range: ${closest.min} mm - ${closest.max} mm`;
    }

    function runInchToMM() {
        const inches = parseInt(document.getElementById('inPart').value) || 0;
        const sootars = parseInt(document.getElementById('sootarPart').value) || 0;
        const sootPart = parseFloat(document.getElementById('halfPart').value) || 0;
        
        // Clear the MM input
        document.getElementById('mmSootarInput').value = "";

        const totalInches = inches + (sootars / 8) + (sootPart / 8);
        const mmVal = totalInches * 25.4;
        
        if (totalInches === 0) {
            document.getElementById('sootarRes').innerText = "---";
            document.getElementById('sootarDetail').innerText = "";
            return;
        }

        document.getElementById('sootarRes').innerText = mmVal.toFixed(2) + " mm";
        document.getElementById('sootarDetail').innerText = `Total: ${totalInches.toFixed(3)}" inches`;
    }

    function runSootarConvert() {
        let inputVal = parseFloat(document.getElementById('mmSootarInput').value);
        const unit = document.getElementById('unitType').value;
        
        // Clear the Sootar-to-MM inputs
        document.getElementById('inPart').value = "";
        document.getElementById('sootarPart').value = "";
        document.getElementById('halfPart').value = "0";

        if(!inputVal || inputVal <= 0) { 
            document.getElementById('sootarRes').innerText = "---"; 
            document.getElementById('sootarDetail').innerText = "";
            return; 
        }

        // Convert input to total inches regardless of unit
        let totalInches = (unit === 'mm') ? (inputVal / 25.4) : inputVal;

        const inches = Math.floor(totalInches);
        const fraction = totalInches - inches;
        
        // 32 quarter-sootars in an inch (8 sootars * 4 parts)
        const totalQuarterSoots = Math.round(fraction * 32);
        const sootars = Math.floor(totalQuarterSoots / 4);
        const part = totalQuarterSoots % 4;

        let output = "";
        if (inches > 0) output += `${inches}" `;
        if (sootars > 0) output += `${sootars} Sootar `;
        
        if (part === 1) output += `¼ (Sawa) Sootar`;
        else if (part === 2) output += `½ (Half) Sootar`;
        else if (part === 3) output += `¾ (Pona) Sootar`;
        
        document.getElementById('sootarRes').innerText = output || "0 Sootar";
        
        // Show the opposite unit in detail
        if (unit === 'mm') {
            document.getElementById('sootarDetail').innerText = `Exact: ${totalInches.toFixed(3)}" inches`;
        } else {
            document.getElementById('sootarDetail').innerText = `Exact: ${(inputVal * 25.4).toFixed(2)} mm`;
        }
    }

    // CUTTING CALCULATOR FUNCTIONS
    function convertToInches(inches, sootars, parts) {
        const p = parseFloat(parts) || 0;
        const s = parseInt(sootars) || 0;
        const i = parseInt(inches) || 0;
        
        // 1 inch = 8 sootars
        return i + (s / 8) + (p / 8);
    }

    function convertFromInches(decimalInches) {
        if (decimalInches <= 0) return { inches: 0, sootars: 0, parts: 0 };
        
        const inches = Math.floor(decimalInches);
        const fraction = decimalInches - inches;
        
        // Convert fraction to quarter-sootars (32 per inch)
        const totalQuarterSoots = Math.round(fraction * 32);
        const sootars = Math.floor(totalQuarterSoots / 4);
        const partsCount = totalQuarterSoots % 4;
        
        let parts = 0;
        if (partsCount === 1) parts = 0.25;
        else if (partsCount === 2) parts = 0.5;
        else if (partsCount === 3) parts = 0.75;
        
        return { inches, sootars, parts };
    }

    function formatSootarDisplay(obj) {
        let output = "";
        if (obj.inches > 0) output += `${obj.inches}"`;
        if (obj.sootars > 0) output += ` ${obj.sootars} S`;
        
        if (obj.parts === 0.25) output += ` ¼`;
        else if (obj.parts === 0.5) output += ` ½`;
        else if (obj.parts === 0.75) output += ` ¾`;
        
        return output.trim() || "0";
    }

    function calculateCutting() {
        // Get sheet length
        const sheetLength = convertToInches(
            document.getElementById('sheetLengthInch').value,
            document.getElementById('sheetLengthSootar').value,
            document.getElementById('sheetLengthHalf').value
        );

        // Get piece length
        const pieceLength = convertToInches(
            document.getElementById('pieceLengthInch').value,
            document.getElementById('pieceLengthSootar').value,
            document.getElementById('pieceLengthHalf').value
        );

        // Clear results if not enough data
        if (sheetLength <= 0 || pieceLength <= 0) {
            document.getElementById('totalPieces').innerText = "0";
            document.getElementById('scrapResult').innerText = "---";
            document.getElementById('cuttingDetails').innerHTML = "";
            return;
        }

        // Calculate pieces
        const totalPieces = Math.floor(sheetLength / pieceLength);
        
        // Calculate leftover length
        const usedLength = totalPieces * pieceLength;
        const scrapLength = sheetLength - usedLength;

        // Display results
        document.getElementById('totalPieces').innerText = totalPieces;
        
        if (totalPieces > 0) {
            const scrapObj = convertFromInches(scrapLength);
            const scrapDisplay = formatSootarDisplay(scrapObj);
            document.getElementById('scrapResult').innerText = scrapDisplay || "Minimal";
            
            let details = `<strong>Breakdown:</strong><br>`;
            details += `• Sheet length: ${formatSootarDisplay(convertFromInches(sheetLength))}<br>`;
            details += `• Piece length: ${formatSootarDisplay(convertFromInches(pieceLength))}<br>`;
            details += `• Total pieces: ${totalPieces}<br>`;
            details += `• Used length: ${formatSootarDisplay(convertFromInches(usedLength))}<br>`;
            details += `• Scrap length: ${formatSootarDisplay(convertFromInches(scrapLength))}<br>`;
            details += `• Scrap %: ${((scrapLength / sheetLength) * 100).toFixed(1)}%`;
            
            document.getElementById('cuttingDetails').innerHTML = details;
        } else {
            document.getElementById('scrapResult').innerText = "0";
            document.getElementById('cuttingDetails').innerHTML = `<strong style="color: #e67e22;">⚠ Piece length is larger than sheet length!</strong>`;
        }
    }
