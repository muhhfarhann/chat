<script>
    window.USER_ROLE = '<?php echo $this->session->userdata('role'); ?>';
    // window.BASE_URL = '<?php echo base_url(); ?>';
</script>
<main class="w-screen h-[90vh] px-12">
    <section class="main flex">
        <aside class="w-1/4 h-[90vh] flex flex-col gap-1">
            <h1 class="text-sky-600 px-1 font-bold">List Chat</h1>

            <div class="search-input text-[.75rem] flex flex-row gap-1 *:hover:cursor-pointer">
                <input type="text" class="bg-slate-300 px-2 outline-sky-300 rounded-[10px]" placeholder="Search User" id="search-input">
                <button class="bg-slate-200 text-slate-500 px-1 rounded-[5px] hover:bg-slate-300">Search</button>
            </div>

            <!-- input untuk membuat room baru -->
            <div class="create-room text-[.75rem] flex flex-row gap-1 *:hover:cursor-pointer">
                <input type="text" class="bg-slate-300 px-2 outline-sky-300 rounded-[10px]" placeholder="Enter new room name" id="room-input">
                <button id="create-room" class="bg-slate-200 text-slate-500 px-1 rounded-[5px] hover:bg-slate-300">+ Room</button>
            </div>

            <?php if ($this->session->userdata('role') === 'user'): ?>
            <div class="join-room text-[.75rem] flex flex-row gap-1 *:hover:cursor-pointer">
                <input type="text" class="bg-slate-300 px-2 outline-sky-300 rounded-[10px]" placeholder="Enter room ID" id="join-room-input">
                <button id="join-room" class="bg-slate-200 text-slate-500 px-1 rounded-[5px] hover:bg-slate-300">Join Room</button>
            </div>
            <?php endif; ?>

            <!-- list chat / room -->
            <div class="list-chat text-slate-600 *:hover:cursor-pointer overflow-y-auto flex flex-col gap-1" id="list-chat">
                <a href="#" class="w-full px-1 rounded-[5px] border border-slate-300 bg-slate-200 hover:bg-slate-300">Data Kosong Bro!</a>
            </div>
        </aside>

        <!-- kolom chat -->
        <div id="chat-col" class="chat-column relative w-full h-[90vh] px-1 bg-slate-200 overflow-y-auto">
            <!-- Tampilkan room aktif -->
            <div class="current-room p-2 text-center text-slate-400 font-bold" id="current-room">No room selected</div>
            <div class="form fixed bottom-8 right-12 max-w-[1010px] w-[calc(100%-6rem)] py-1 px-2 bg-slate-400 rounded-t-md">
                <form id="chat-form" class="w-full px-5 flex gap-1 justify-between">
                    <input id="chat-input" type="text" class="w-full p-1 bg-slate-300 outline-slate-200 rounded-[10px]" placeholder="Type message here...">
                    <button type="submit" class="bg-slate-300 rounded-full p-1 hover:scale-[.99] hover:bg-slate-100">Send</button>
                </form>
            </div>
        </div>

    </section>
</main>