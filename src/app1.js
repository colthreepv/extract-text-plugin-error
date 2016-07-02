import { createH, fillText } from './vendor';

const bodyEl = document.body;

const helloWorld = fillText(createH('1'), 'Hello World');
const otherText = fillText(createH('3'), 'App1 has been run!');
bodyEl.appendChild(helloWorld);
bodyEl.appendChild(otherText);
