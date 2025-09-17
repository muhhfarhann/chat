window.addEventListener('DOMContentLoaded', () => {
    // ambil url murni
    const BASE_URL = window.BASE_URL || '';
    console.log(BASE_URL);

    // inisialisasi api socket
    const socket = io('http://localhost:3000'); // kalau pakai reverse-proxy: io();

    // state untuk menyimpan room aktif
    let currentRoom = null;

    // jika ada socket
    if (socket) {
        socket.on('connect', () => console.log(`connected on ${socket.id}`));
    } else { //jika tidak ada socket
        socket.on('connect_error', (e) => console.error(`socket connection_error : ${e}`));
    }

    // konfirmasi join room 
    socket.on('joined', ({ room, success }) => {
        if (success) {
            currentRoom = room;
            console.log(`Joined room: ${room}`);
            // update ui untuk menunjukan room aktif 
            document.querySelector('#current-room').textContent = `Room : ${room}`;
        };
    });

    // terima pesan dari room
    socket.on('chat:new', ({ text, at, sender }) => {
        appendMsg({ text, at, sender });
    });

    // konfirmasi leave room
    socket.on('left', ({ room, success }) => {
        if (success) {
            console.log(`Left room: ${room}`);
            currentRoom = null;
            document.querySelector('#current-room').textContent = `No room selected`;
        }
    });

    // emit atau beri event word kirim object hello value world
    socket.emit('word', { hello: 'world' });

    // log isi dari pong
    socket.on('pong', (data) => console.log(`Pong => `, data));

    // fungsi untuk render modal confirm logout
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
    };

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
    };

    // list room chat
    function chatListRender() {
        const chatListContainer = document.querySelector('#list-chat');
        if (!chatListContainer) return;

        // Sembunyikan daftar chat untuk user biasa
        if (window.USER_ROLE !== 'admin') {
            chatListContainer.innerHTML = '<p class="text-slate-600">You cannot view chat rooms.</p>';
            return;
        }

        fetch(`${BASE_URL}/chat/main/getAllRooms`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(({ data }) => {
                if (!Array.isArray(data)) return;

                chatListContainer.innerHTML = data.map(room => `
                <a href="#" data-room="${room.id}" class="block w-full px-2 py-1 rounded-[5px] border border-slate-300 bg-slate-200 hover:bg-slate-300">
                    ${room.title ?? 'Unnamed Room'}
                </a>
            `).join('');

                // Event listener untuk join room
                chatListContainer.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const room = link.dataset.room;
                        if (currentRoom) {
                            socket.emit('leave', currentRoom);
                        }
                        socket.emit('join', { room, userId: socket.id, role: window.USER_ROLE });
                    });
                });
            })
            .catch(err => console.error('getAllRooms error:', err));
    }

    // panggil fungsi saat load
    window.addEventListener('load', () => chatListRender());

    const createRoomButton = document.querySelector('#create-room');
    const roomInput = document.querySelector('#room-input');
    // modifikasi create room (hanya untuk admin)
    if (createRoomButton && roomInput) {
        if (window.USER_ROLE === 'admin') {
            createRoomButton.addEventListener('click', () => {
                const title = roomInput.value.trim();
                if (!title) return;

                fetch(`${BASE_URL}/chat/main/createRoom`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                })
                    .then(r => r.ok ? r.json() : Promise.reject(r.status))
                    .then(({ data }) => {
                        if (currentRoom) {
                            socket.emit('leave', currentRoom);
                        }
                        socket.emit('join', { room: data.id, userId: socket.id, role: window.USER_ROLE });
                        roomInput.value = '';
                        chatListRender(); // Refresh daftar room
                    })
                    .catch(err => console.error('createRoom error:', err));
            });
        } else {
            createRoomButton.disabled = true;
            roomInput.disabled = true;
        }
    }

    const joinRoomButton = document.querySelector('#join-room');
    const joinRoomInput = document.querySelector('#join-room-input');
    if (joinRoomButton && joinRoomInput) {
        joinRoomButton.addEventListener('click', () => {
            const room = joinRoomInput.value.trim();
            if (!room) return;
            if (currentRoom) {
                socket.emit('leave', currentRoom);
            }
            socket.emit('join', { room, userId: socket.id, role: window.USER_ROLE });
            joinRoomInput.value = '';
        });
    }

    // FORM KIRIM PESAN
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#chat-input');
    const chatCol = document.querySelector('#chat-col');

    // form kirim pesan
    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || !currentRoom) {
                console.log('No room selected or empty message');
                return;
            }
            socket.emit('chat:send', { room: currentRoom, text });
            input.value = '';
        });
    }

    // fungsi untuk isi kolom chat dengan bubble
    function appendMsg({ text, at, sender }) {
        const chatCol = document.querySelector('#chat-col');
        if (!chatCol) return;

        const divContainerBubble = document.createElement('div');
        const p = document.createElement('p');
        const span = document.createElement('span');

        divContainerBubble.className = `w-full h-fit bg-slate-700 flex flex-row justify-end items-center`;
        p.className = 'w-fit px-3 py-1 mb-2 bg-slate-100 rounded-full';
        span.className = 'm-5 text-[.5rem] text-slate-500';
        const time = at ? new Date(at).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        }) : '';

        p.textContent = text;
        span.textContent = (time ? `${time}` : '');

        p.appendChild(span);
        divContainerBubble.appendChild(p);
        chatCol.appendChild(divContainerBubble);
        chatCol.scrollTop = chatCol.scrollHeight;
    };

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
    };

    // TERIMA BROADCAST DARI SERVER
    socket.on('chat message', (payload) => {
        // payload: {text, at}
        appendMsg(payload);
    });

});
