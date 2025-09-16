<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('Auth_model');
        $this->load->helper(['url']);
        $this->load->library(['session']);
        $this->load->database();
    }

    public function index() {
        $data = [
            "page" => $this->session->userdata('logged_in') ? 'mains/main' : 'auth/login'
        ];
        $this->load->view('layout', $data);
    }

    public function login() {
        if ($this->input->method() === 'post') {
            $username = $this->input->post("username", TRUE);
            $password = $this->input->post("password", TRUE);

            $user = $this->Auth_model->login($username, $password);
            if ($user) {
                $this->session->sess_regenerate(TRUE);
                $this->session->set_userdata([
                    'logged_in'    => TRUE,
                    'id'           => $user->id,
                    'username'     => $user->username,
                    'display_name' => $user->display_name
                ]);
                $this->session->set_flashdata('success', 'Login success!');
                return redirect('auth/index');
            }
            $this->session->set_flashdata('error', 'Invalid username or password');
            return redirect('auth/login');
        }

        $data = ['title' => 'Login', 'page' => 'auth/login'];
        $this->load->view('layout', $data);
    }

    public function register() {
        if ($this->input->method() === 'post') {
            $username     = $this->input->post('username', TRUE);
            $display_name = $this->input->post('display_name', TRUE);
            $password     = $this->input->post('password', TRUE);

            if ($this->Auth_model->user_exists($username)) {
                $this->session->set_flashdata('error', 'Username already taken');
                return redirect('auth/register');
            }

            if ($this->Auth_model->register($username, $display_name, $password)) {
                $this->session->set_flashdata('success', 'Register success, please login');
                return redirect('auth/login');
            }

            $this->session->set_flashdata('error', 'Register failed');
            return redirect('auth/register');
        }

        $data = ['title' => 'Register Page', 'page' => 'auth/register'];
        $this->load->view('layout', $data);
    }

    public function logout() {
        $this->session->sess_destroy();
        redirect('auth/login');
    }
}
