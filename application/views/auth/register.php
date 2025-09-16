<section class="login-container mx-40 py-2.5 bg-slate-200 rounded-[5px] flex justify-center items-center mt-20 box-border shadow-md">
    <h2 class="text-center w-1/3 text-sky-950 font-bold text-2xl mt-20">Register</h2>
    <form action="<?php echo site_url('auth/register'); ?>" method="post" class="w-1/2 flex flex-col justify-center items-center px-10">
        <i class="text-teal-600">&#9432; Info! <span id="info"><?php echo $this->session->flashdata('error'); ?></span></i>
        <div class="form-group w-[500px] flex flex-col justify-center items-start my-5 *:cursor-pointer text-[.9rem]">
            <label for="username">Username</label>
            <input type="email" class="form-control w-full px-4 bg-slate-100 outline-none focus:ring-2 focus:ring-sky-800" id="username" name="username" placeholder="@example.com" required>
        </div>
        <div class="form-group w-[500px] flex flex-col justify-center items-start my-5 *:cursor-pointer text-[.9rem]">
            <label for="display_name">Full Name</label>
            <input type="text" class="form-control w-full px-4 bg-slate-100 outline-none focus:ring-2 focus:ring-sky-800" id="display_name" name="display_name" placeholder="write Fullname Here" required>
        </div>
        <div class="form-group w-[500px] flex flex-col justify-center items-start my-5 *:cursor-pointer text-[.9rem]">
            <label for="password">Password</label>
            <input type="password" class="form-control w-full px-4 bg-slate-100 outline-none focus:ring-2 focus:ring-sky-800" id="password" name="password" placeholder="*****" required>
            <i class="text-slate-500" id="seen">Lihat</i>
        </div>
        <div class="link">
            <p class="text-[.8rem] text-sky-950"><a href="<?= site_url('auth/login'); ?>" class="text-[.8rem] text-sky-700 hover:underline mb-5"> Login here.</a></p>
        </div>
        <button type="submit" class="w-[500px] bg-sky-950 text-slate-200 cursor-pointer rounded-full hover:opacity-95 hover:scale-[.98]">Register</button>
    </form>
</section>
<script>
    document.querySelector('#seen').addEventListener('click', function() {
        this.innerHTML == 'Tutup' ? this.innerHTML = 'Lihat' : this.innerHTML = 'Tutup';
        this.innerHTML == 'Tutup' ? this.previousElementSibling.type = 'text' : this.previousElementSibling.type = 'password';
    })

    const infoEl = document.querySelector('#info');
    if(infoEl.textContent == 'Username already taken' || infoEl.textContent == 'Register failed') setTimeout(function() {
        infoEl.textContent = '';
    }, 2000);
</script>