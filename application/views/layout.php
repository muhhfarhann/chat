<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($title)? $title : 'App'; ?></title>

  <!-- Pastikan nama file CSS sesuai hasil build (tailwind.css atau output.css) -->
  <link rel="stylesheet" href="<?= base_url('assets/css/output.css') ?>">
</head>
<body class="w-screen overflow-x-hidden">

  <?php $this->load->view('headers/header'); ?>

  <?php
    // Ambil view dari $page; fallback ke main/login jika belum diset
    $view = isset($page)
      ? $page
      : ($this->session->userdata('logged_in') ? 'mains/main' : 'auth/login');
    $this->load->view($view);
  ?>

  <?php $this->load->view('footers/footer'); ?>

<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<script src="<?php echo base_url(''); ?>assets/js/script.js?v=<?= time(); ?>"></script>
</body>
</html>
