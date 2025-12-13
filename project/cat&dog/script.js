// Select DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const scanOverlay = document.getElementById('scan-overlay');
const loader = document.getElementById('loader');
const loadingText = document.getElementById('loading-text');
const resultCard = document.getElementById('result-card');
const resultLabel = document.getElementById('result-label');
const resultIcon = document.getElementById('result-icon');
const progressBar = document.getElementById('progress-bar');
const confidenceScore = document.getElementById('confidence-score');
const resetBtn = document.getElementById('reset-btn');
const soundWave = document.getElementById('sound-wave');

// --- ACTUAL SOUND ASSETS ---
// Using reliable CDN for clear Meow and Bark sounds
const catAudio = new Audio('file:///C:/Users/M-Haseeb/Downloads/Website/catsound.wave'); 
const dogAudio = new Audio('file:///C:/Users/M-Haseeb/Downloads/Website/dogsound.wave');   

// --- AI MODEL SETUP ---
let net;
let isModelLoaded = false;

// Load the MobileNet Model on startup
async function loadModel() {
    console.log("Loading model...");
    try {
        // Load model
        net = await mobilenet.load();
        isModelLoaded = true;
        console.log("Successfully loaded model");
        loadingText.innerText = "Model Ready";
    } catch (error) {
        console.error("Error loading model:", error);
        alert("Failed to load AI Model. Please check your internet connection.");
    }
}
loadModel(); // Trigger load immediately

// --- EVENT LISTENERS ---
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.add('active'), false));
['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.remove('active'), false));

dropArea.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', function() { handleFiles(this.files); });

function handleDrop(e) { handleFiles(e.dataTransfer.files); }

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                imagePreview.src = reader.result;
                showPreview();
            }
        } else {
            alert("Please upload an image file.");
        }
    }
}

function showPreview() {
    dropArea.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    resultCard.classList.add('hidden');
}

// --- ANALYZE LOGIC (REAL AI) ---
analyzeBtn.addEventListener('click', async () => {
    if (!isModelLoaded) {
        alert("Model is still loading. Please wait a moment...");
        return;
    }

    // UI Updates
    scanOverlay.classList.remove('hidden');
    analyzeBtn.classList.add('hidden');
    
    // Slight delay for visual effect
    setTimeout(async () => {
        scanOverlay.classList.add('hidden');
        previewContainer.classList.add('hidden');
        loader.classList.remove('hidden');
        loadingText.innerText = "Scanning Pixels...";

        try {
            // CALL TENSORFLOW CLASSIFY
            const result = await net.classify(imagePreview);
            console.log(result); 
            processResults(result);
        } catch (error) {
            console.error(error);
            loadingText.innerText = "Error analyzing image.";
        }
    }, 1500);
});

function processResults(predictions) {
    loader.classList.add('hidden');
    resultCard.classList.remove('hidden');
    soundWave.classList.remove('hidden');

    let isDog = false;
    let isCat = false;
    let bestPrediction = predictions[0];
    
    // Check top 3 predictions for specific keywords
    for (let i = 0; i < predictions.length; i++) {
        const className = predictions[i].className.toLowerCase();
        
        // Comprehensive Dog Keywords
        if (className.includes('dog') || className.includes('terrier') || className.includes('retriever') || className.includes('spaniel') || className.includes('shepherd') || className.includes('hound') || className.includes('beagle') || className.includes('corgi') || className.includes('husky') || className.includes('pug') || className.includes('poodle') || className.includes('bulldog') || className.includes('malamute') || className.includes('collie')) {
            isDog = true;
            bestPrediction = predictions[i];
            break;
        }
        
        // Comprehensive Cat Keywords
        if (className.includes('cat') || className.includes('tabby') || className.includes('siamese') || className.includes('kitten') || className.includes('lynx') || className.includes('tiger') || className.includes('persian') || className.includes('egyptian')) {
            isCat = true;
            bestPrediction = predictions[i];
            break;
        }
	
        
    }

    const confidenceVal = Math.floor(bestPrediction.probability * 100);

    if (isDog) {
        resultLabel.innerText = "It's a Dog!";
        resultLabel.style.color = "#ff0076"; // Pink
        resultIcon.innerHTML = '<i class="fas fa-dog" style="color: #ff0076;"></i>';
        
        dogAudio.currentTime =0;
        dogAudio.play().catch(e => console.log("Audio play failed", e));

    } else if (isCat) {
        resultLabel.innerText = "It's a Cat!";
        resultLabel.style.color = "#ff9f1a"; // Orange
        resultIcon.innerHTML = '<i class="fas fa-cat" style="color: #ff9f1a;"></i>';
        
        catAudio.currentTime =0;
        catAudio.play().catch(e => console.log("Audio play failed", e));

    } else {
        // Fallback
        resultLabel.innerText = "No Cat or Dog  identified...";
        resultLabel.style.color = "#636e72";
        resultIcon.innerHTML = '<i class="fas fa-question-circle" style="color: #636e72;"></i>';
        soundWave.classList.add('hidden');
        
        confidenceScore.innerText = `Looks like: 0%`;
       progressBar.style.width = `${confidenceVal}%`;
       return; 
    }

    // Animate Progress Bar
    setTimeout(() => {
        progressBar.style.width = `${confidenceVal}%`;
        confidenceScore.innerText = `${confidenceVal}% Confidence (${bestPrediction.className.split(',')[0]})`;
    }, 100);
}

// 4. Reset
resetBtn.addEventListener('click', () => {
    resultCard.classList.add('hidden');
    dropArea.classList.remove('hidden');
    fileInput.value = "";
    progressBar.style.width = "0%";
    analyzeBtn.classList.remove('hidden');
    soundWave.classList.add('hidden');
    
    // Stop Audio
    catAudio.pause();
    dogAudio.pause();
});