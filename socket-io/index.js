const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    connectionStateRecovery: {}
});

// simpan daftar room (opsional, jika tidak ingin bergantung sepenuhnya pada database)
const rooms = new Set();

io.on('connection', (socket) => {

    // kirim daftar room ke admin saat connect
    socket.on('get_rooms', () => {
        if (socket.data.role === 'admin') {
            socket.emit('room list', Array.from(rooms));
        }
    })

    // join room
    socket.on('join', ({ room, userId, role }) => {
        console.log(`User ${socket.id} (role: ${role}) joined room ${room}`);
        socket.data.role = role;
        socket.join(room);
        rooms.add(room);
        // beri tahu client mereka berhasil join
        socket.emit('joined', { room, success: true });
    });

    // kirim pesan ke room
    socket.on('chat:send', ({ room, text }) => {
        if (!room && !text) return;
        console.log(`Message to room ${room}: ${text}`);
        io.to(room).emit('chat:new', { text, at: Date.now(), sender: socket.id });
    });

    // meninggalkan  room
    socket.on('leave', (room) => {
        console.log(`User ${socket.id} left room: ${room}`);
        socket.leave(room);
        socket.emit('left', { room, success: true });
    });

    // log untuk melihat id
    console.log(`a user connected : ${socket.id}`);

    // broadcast message (opsional, jika masih dibutuhkan)
    socket.on('chat message', (msg, cb) => {
        console.log(`Broadcast message : ${msg}`);
        io.emit('chat message', { id: socket.id, text: msg, at: Date.now() });
        if (typeof cb === 'function') cb({ ok: true });
    });

    socket.on('ping', (msg) => {
        socket.emit('pong', { ok: true, echo: msg })
    });

})

app.use(express.json());
app.post('/emit', (req, res) => {
    const { channel = 'broadcast', data = {} } = req.body || {};
    io.emit(channel, data);
    res.json({ ok: true });
});

server.listen(port, () => console.log(`Socket.IO running at http://localhost:${port}`));