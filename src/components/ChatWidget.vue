<template>
<div>
<button
class="btn btn-success rounded-circle shadow position-fixed d-flex align-items-center justify-content-center"
style="bottom: 20px; right: 20px; width: 60px; height: 60px; z-index: 9999;"
@click="toggleChat">
</button>
<div
v-1f="open"
class="card shadow position-fixed"
style="bottom: 90px; right: 20px; width: 320px; height: 450px; z-index: 9999; animation: slideup .3s;"></div>
<div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
<span>Chat IA</span>
<button class="btn-close btn-close-white" @click="toggleChat"></button>
</div>
<div class="card-body overflow-auto" style="height: 330px;" ref="messageContainer">
<div v-for="(msg, index) in messages" key="index" class="b-2">
<div v-if="msg.from=user" class="d-Flex justify-content-end">
<div class="p-2 px-3 bg-success text-white rounded-pill w-75 text-end">
{{ msg.text}}
</div>
</div>
<div v-else class="d-flex align-items-start">
<div class="p-2 px-3 bg-light border rounded-p111 w-75">
{{ msg.text}}
</div>
</div>
</div>
<div v-if="typing" class="text-muted small ms-2">El bot está escribiendo...</div>
</div>
<div class="card-footer d-flex">
<input
type="text"
class="form-control me-2"
placeholder="Escribe un mensaje..."
v-model="input"
@keyup.enter="send">
<button class="btn btn-success" @click="send">Enviar</button>
</div>
</div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";
const open = ref(false);
const input = ref("");
const typing = ref(false);
const messages = ref([]);
const messageContainer = ref(null);
const toggleChat = () => {
    open.value = !open.value;
};
const scrollBottom = () => {
nextTick(() => {
if(messageContainer.value){
messageContainer.value.scrollTop = messageContainer.value.scrollHeight; 
}
});
};
const send = async () => {
if(linput.value.trim()) return;

// Mensaje usuario
messages.value.push({ text: input.value, from: "user"}); 
scrollBottom();

const textToSend = input.value;
input.value = "";
typing.value = true;

try {
const res = await axios.post("http://localhost:5000/ia", {message: textToSend});

setTimeout(() => {
messages.value.push({text: res.data.reply, from: "bot" });
typing.value = false;
scrollBottom();
}, 600);

} catch (error) {
messages.value.push({ text: "Error al enviar el mensaje", from: "bot" });
typing.value = false;
scrollBottom();
}
};

</script>


<style>
@keyframes slideup {
from { transform: translateY(30px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
 </style>