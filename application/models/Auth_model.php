<?php 

defined('BASEPATH') OR exit('No direct script access allowed');

class Auth_model extends CI_Model {

    public function register($username, $display_name, $password) {
        $data = array(
            'username' => $username,
            'display_name' => $display_name,
            'password' => password_hash($password, PASSWORD_BCRYPT)
        );
        return $this->db->insert('users', $data);
    }

    public function login($username, $password) {
        $this->db->where('username', $username);
        $query = $this->db->get('users');

        if ($query->num_rows() == 1) {
            $user = $query->row();
            if (password_verify($password, $user->password)) {
                return $user;
            }
        }
        return false;
    }

    public function user_exists($username) {
        $this->db->where('username', $username);
        $query = $this->db->get('users');
        return $query->num_rows() > 0;
    }

    public function get_all_users() {
        $query = $this->db->get('users');
        return $query->result();
    }
}