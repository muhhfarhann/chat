<?php 

class List_user_model extends CI_Model {
    public function getAllUser () {
        
        return $this->db->select('id, display_name')->from('users')->get()->result_array();
        
    }
}

?>