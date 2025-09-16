<header class="header relative flex flex-row justify-center z-50" id="header">
    <div class="container sticky top-0 bg-slate-900 py-2 px-5 flex flex-row justify-between items-center text-sky-400 rounded-[2.5px] shadow-md">
        <a href="<?= site_url() ?>" class="font-bold">Chatt APP</a>
        <nav class="nav-menu text-sky-200">
            <ul class="flex flex-row gap-5 *:hover:cursor-pointer">
                <li><a href="<?= site_url() ?>" class="hover:text-sky-400">Home</a></li>
                <li><a href="<?= site_url('about') ?>" class="hover:text-sky-400">About</a></li>
                <li><a href="<?= site_url('contact') ?>" class="hover:text-sky-400">Contact</a></li>
                <?php if($this->session->userdata('logged_in')): ?>
                    <li><p class="hover:text-sky-400" id="logout">Logout</p></li>
                <?php else: ?>
                    <li><a href="<?= site_url('auth/login') ?>" class="hover:text-sky-400">Login</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </div>
</header>