<div id="modalConfirm" class="absolute top-10 right-10 w-fit p-4 bg-slate-200 text-slate-600 rounded-[5px] shadow-md hover:border hover:border-slate-400 z-50">
  <h1>Ingin Keluar?</h1>
  <hr class="mb-2">
  <div class="direct flex justify-between items-center text-[.75rem] text-slate-100 *:rounded-full">
    <a href="<?= site_url('auth/logout') ?>" class="bg-slate-700 p-1 hover:border hover:border-slate-400 hover:bg-sky-950">Ya</a>
    <a href="<?= site_url() ?>" class="bg-slate-400 p-1 hover:bg-slate-500">Cancel</a>
  </div>
</div>