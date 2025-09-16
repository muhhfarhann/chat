<main class="w-screen h-[90vh] px-12">
    <section class="main flex">
        <aside class="w-1/4 h-[90vh] flex flex-col gap-1">
            <h1 class="text-sky-600 px-1 font-bold">List Chatt</h1>
            <div class="search-input text-[.75rem] flex flex-row gap-1 *:hover:cursor-pointer">
                <input type="text" class="bg-slate-300 px-2 outline-sky-300 rounded-[10px]" placeholder="Search User" id="search-input">
                <button class="bg-slate-200 px-1 rounded-[5px] hover:bg-slate-300">Search</button>
            </div>
            <div class="list-chat text-slate-600 *:hover:cursor-pointer overflow-y-auto flex flex-col gap-1" id="list-chat">
                <a href="<?= base_url();?>" class="w-full px-1 rounded-[5px] border border-slate-300 bg-slate-200 hover:bg-slate-300"></a>
            </div>
        </aside>

        <div id="chat-col" class="chat-column relative w-full h-[90vh] px-1 bg-slate-200 overflow-y-auto">
            <div class="form fixed bottom-8 right-12 max-w-[1010px] w-[calc(100%-6rem)] py-1 px-2 bg-slate-400 rounded-t-md">
                <form id="chat-form" class="w-full px-5 flex gap-1 justify-between">
                <input id="chat-input" type="text" class="w-full p-1 bg-slate-300 outline-slate-200 rounded-[10px]" placeholder="Type message here...">
                <button type="submit" class="bg-slate-300 rounded-full p-1 hover:scale-[.99] hover:bg-slate-100">Send</button>
                </form>
            </div>
        </div>
    </section>
</main>