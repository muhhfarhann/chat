window.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = window.BASE_URL || '';
    const currentUrl = window.location.href;

    const socket = io('http://localhost:3000'); // kalau pakai reverse-proxy: io();

    if (socket) {
        socket.on('connect', () => console.log(`connected on ${socket.id}`));
    } else {
        socket.on('connect_error', (e) => console.error(`socket connection_error : ${e}`));
    }
    socket.emit('word', { hello: 'world' });
    socket.on('pong', (data) => console.log(`Pong => `, data));

    // fungsi untuk render modal confirm
    function modal() {
        if (document.getElementById('modalConfirm')) return;

        const divContainerModal = document.createElement('div');
        const h1 = document.createElement('h1');
        const hr = document.createElement('hr');
        const divButton = document.createElement('div');
        const buttonYes = document.createElement('a');
        const buttonCancel = document.createElement('a');

        divContainerModal.id = 'modalConfirm';
        divContainerModal.className = 'absolute top-10 right-10 w-fit p-4 bg-slate-200 text-slate-600 rounded-[5px] shadow-md hover:border hover:border-slate-400 z-50';

        h1.textContent = 'Ingin Keluar?';
        hr.className = 'mb-2';

        divButton.className = 'direct flex justify-between items-center text-[.75rem] text-slate-100 *:rounded-full *:hover:cursor-pointer';

        buttonYes.id = 'buttonYes';
        buttonYes.href = `${BASE_URL}/auth/logout`;
        buttonYes.className = 'bg-slate-700 p-1 hover:border hover:border-slate-400 hover:bg-sky-950';
        buttonYes.textContent = 'Ya';

        // buttonCancel.href = `${BASE_URL}`;
        buttonCancel.className = 'bg-slate-400 p-1 hover:bg-slate-500';
        buttonCancel.textContent = 'cancel';
        buttonCancel.addEventListener('click', () => {
            divContainerModal.remove();
        })

        divButton.appendChild(buttonYes);
        divButton.appendChild(buttonCancel);

        divContainerModal.appendChild(h1);
        divContainerModal.appendChild(hr);
        divContainerModal.appendChild(divButton);

        document.getElementById('header').after(divContainerModal);
    }

    // trigger click logout
    if (document.getElementById('logout')) {
        document.addEventListener('click', function (e) {
            // klik tombol logout -> munculkan modal
            if (e.target.id === 'logout') {
                e.preventDefault();
                modal();
            }

            // Klik tombol "Ya" di modal -> redirect
            if (e.target.id === 'buttonYes') {
                e.preventDefault();
                window.location.href = `${BASE_URL}/chat/auth/logout`;
            }

            // Klik di luar modal -> tutup modal
            const modalConfirm = document.getElementById('modalConfirm');
            if (
                modalConfirm &&
                e.target.id !== 'logout' &&
                e.target.id !== 'modalConfirm' &&
                !modalConfirm.contains(e.target)
            ) {
                modalConfirm.remove();
            }
        });
    }

    // list room chat
    const chatListContainer = document.querySelector('#list-chat');
    if (chatListContainer) {
        fetch(`${BASE_URL}/chat/main/getAllUser`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(({ data }) => {
                if (!Array.isArray(data)) return;
                chatListContainer.innerHTML = data.map(u => `
                <a href="#" class="block w-full px-2 py-1 rounded-[5px] border border-slate-300 bg-slate-200 hover:bg-slate-300">
                    ${u.display_name ?? '(no name)'}
                </a>
                `).join('');
            })
            .catch(err => console.error('getAllUser error:', err));
    }

    // FORM KIRIM PESAN
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#chat-input');
    const chatCol = document.querySelector('#chat-col');

    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            socket.emit('chat message', input.value);
            input.value = '';
        })
    }

    function appendMsg({ text, at }) {
        const divContainerBubble = document.createElement('div');
        const p = document.createElement('p');
        const span = document.createElement('span');

        divContainerBubble.className = 'w-full h-fit bg-slate-700 flex flex-row justify-end items-center';
        p.className = 'w-fit px-3 py-1 mb-2 bg-slate-100 rounded-full';
        span.className = 'm-5 text-[.5rem] text-slate-500';
        const time = at ? new Date(at).toLocaleTimeString(undefined,
            {
                hour: '2-digit',
                minute: '2-digit'
            }) : '';

        p.textContent = text;
        span.textContent = (time ? `${time}` : '');

        p.appendChild(span);
        divContainerBubble.textContent = p;
        chatCol.appendChild(p);
        chatCol.scrollTop = chatCol.scrollHeight;
    }

    if (form && input && chatCol) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            socket.emit('chat message', text, (ack) => {
                // ACK dari server, optional buat debug
                console.log('server ack:', ack);
            });
            input.value = '';
        });
    }

    // TERIMA BROADCAST DARI SERVER
    socket.on('chat message', (payload) => {
        // payload: {text, at}
        appendMsg(payload);
    });

});
