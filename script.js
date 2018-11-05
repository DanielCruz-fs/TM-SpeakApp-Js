//Let's init SpeechSynth API
const synth = window.speechSynthesis;
//Get all DOM elements
const mainButton = document.querySelector('#btn-app');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const pitch = document.querySelector('#pitch');

//We just init voices array
let voices = [];

const populateVoices = () => {
    voices = synth.getVoices();
    console.log(voices);
    //loop through voices and append 'em
    voices.forEach(voice => {
        let option = `<option value="" data-icon="images/voice.png"
                      data-lang="${voice.lang}" data-name="${voice.name}">${voice.name} (${voice.lang})</option>`; 
        voiceSelect.insertAdjacentHTML('beforeend', option);
    });
};
/** With Chrome however, you have to wait for the event to fire before populating the array voices,
 * hence the bottom if statement seen below. */
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}
/**Speak Functionality*/
const speak = () => {
    /** testing */
    // const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    // console.log(selectedVoice);
    //console.log(rate.value, pitch.value);

    //We check if our app's speaking
    if(synth.speaking) {
        console.log('already speaking');
        M.toast({html: "I'm just speaking...", displayLength: 1000});
        return;
    }
    if(textInput.value !== '') {
        //Get speak text from the text-area
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        //App ends Speaking
        speakText.onend = e => {
            console.log('Done speaking...');
            M.toast({html: "I'm done speaking...", displayLength: 1000});
        };
        //App throws some error
        speakText.onerror = e => {
            console.error('Ups... something went wrong.');
        };
        //The selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        //We loop through voices array
        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
       
        //Let's set the rate and pitch forr our voice
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;
        // speakText.volume = 0.5;
        //App's speak method 
        synth.speak(speakText);
        //console.log(speakText);
    }
};

/** Event Listeners */
mainButton.addEventListener('click', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});
voiceSelect.addEventListener('change', e => speak());
