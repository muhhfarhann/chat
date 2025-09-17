<?php 

class List_user_model extends CI_Model {
    public function getAllUser () {
        
        return $this->db->select('id, display_name')->from('users')->get()->result_array();
        
    }

    public function getAllRooms() {
        return $this->db->select('id, title')->from('conversations')->get()->result_array();
    }
}

?>